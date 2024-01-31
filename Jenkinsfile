/*
Environment variables, such as NEXUS_CREDS, BU, GH_HOST, etc., should be adjusted according to the specific requirements of your project and development environment.
The application name (appIdentifier) and the paths of the CloudFormation configuration files (CF_SCRIPT and CF_TEMPLATE) should be customized for your project.
The logic in the Choose Release Type and Post Release stages may require changes based on your versioning needs and release processes.
The actions in the Deploy stage should be adapted to your specific deployment process. The current code deploys a zip file to an S3 bucket, but it may require modifications.
*/

tmpDir = '.tmp'

pipeline {
    agent {
        dockerfile {
            filename 'Dockerfile.jenkinsAgent'
            dir 'jenkins'
            additionalBuildArgs  '--build-arg JENKINSUID=`id -u jenkins` --build-arg JENKINSGID=`id -g jenkins` --build-arg DOCKERGID=`stat -c %g /var/run/docker.sock`'
            args '-v $HOME/.ssh:/home/jenkins/.ssh -v $HOME/.aws:/root/.aws -v /var/run/docker.sock:/var/run/docker.sock -u jenkins:docker'
            reuseNode true
        }
    }

    options {
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: "5"))
    }

    environment {
        HOME = "."
        NEXUS_CREDS = credentials("jenkins-nexus")
        commitID = gitCommitID()
        shortID = gitShortID()

        BU = "hbrg"
        environmentName = "${isQABuild() ? 'QA' : 'prod'}"
        version = ""
        appIdentifier = "mfe-articles"
        fullArtifactName = ""
        GH_HOST = 'git.harvardbusiness.org'
        CLOUDFORMATION_REPO = "https://${GH_HOST}/itops/aws.git"
        CF_SCRIPT = "cloud_formation/scripts/add_beanstalk_version.py"
        GITHUB_TOKEN = credentials("git-hbrjenkins-itops")
        MAIN_BRANCH = "main"
        CHROMATIC_TOKEN = credentials('Chromatic-CLI-mfe-articles')
    }

    stages {
        stage("Prepare") {
            steps {
                script {
                    if (shouldAbortBuild()) {
                        currentBuild.result = 'ABORTED'
                        error("This build was initiated by Jenkins. Aborting...")
                    }
                }

                echo "Preparing build..."
                sh "git clean -fdx && git reset --hard"
            }
        }

        stage("Choose Release Type") {
            when {
                expression {
                    return isProdBuild()
                }
            }
            steps {
                script {
                  timeout(2) {
                      env.releaseType = input message: "Please select a release type",
                          parameters: [choice(choices: ["patch", "minor", "major", "none"],
                              description: "Examples:\n\npatch: v1.0.0 to v1.0.1\nminor: v1.0.0 to v1.1.0\nmajor: v1.0.0 to v2.0.0\nnone: Just deploy. Will not increment the version.",
                              name: "releaseType")]
                  }
                 echo "Release type: ${env.releaseType}"
                }
            }
        }

        stage('NPMRC: Config') {
            steps {
                script {
                    sh "echo '\n//nexus.hbsp.harvard.edu:8081/content/groups/npm-all/:_auth=\${NPM_TOKEN}' >> .npmrc"
                }
            }
        }

        stage("Install Dependencies") {
            steps {
                script {
                    withEnv(["NPM_TOKEN=${generateNPMToken()}"]) {
                        sh "node -v"
                        sh "npm ci"
                    }
                }
            }
        }

        stage("Code Scans") {
            parallel {
                stage("Code Style Scan") {
                    steps {
                        dir('apps/mfe-articles-app') {
                            sh "npm run lint"    
                        }
                    }
                }

                stage("Nexus IQ Dependency Scan") {
                    steps {
                        sh "node -e \"var x=`cat package.json | tr '\n' ' '`; Object.keys(x.devDependencies).concat(Object.keys(x.dependencies)).forEach(function (d) { console.log(d)} );\" | xargs -I {} sh -c \"cd node_modules/{}; echo {}; npm shrinkwrap 2> /dev/null\" ;"
                        nexusEvalStep()
                    }
                }

                stage("Checkmarx Static Analysis") {
                    steps {
                        runCX(appIdentifier, "FAILURE")
                    }
                }

            }
        }

        stage("Build") {
            steps {
                dir('apps/mfe-articles-app') {
                    sh "npm run build"
                }
            }
        }

        stage("Tests") {
            parallel {
                stage("Unit Tests") {
                    steps {
                        dir('apps/mfe-articles-app') {
                            sh "npm test"
                        }
                    }
                }

                stage('Chromatic') {
                     when {
                         changeRequest target: env.MAIN_BRANCH
                     }
                     steps {
                         script {
                             def logFile = "${tmpDir}/chromatic.log"
                             def errFile = "${tmpDir}/chromatic_err.log"
                             catchError(stageResult: 'FAILURE') {
                                 sh "mkdir -p ${tmpDir}"
                                 sh "npm run sb:chromatic > ${logFile} 2> ${errFile}"
                             }
                             try {
                                 def stdout = readFile logFile
                                 echo "${stdout}"
                                 def chromaticUrl = stdout.find(/https:\/\/www\.chromatic\.com\/build.*number=\d+/)
                                 if (chromaticUrl) {
                                     def stderr = readFile errFile
                                     echo "${stderr}"
                                     def changes = '0'
                                     if (stderr) {
                                         stderr.find(/Found (\d+)/) { match -> changes = match[1] }
                                     }
                                     prComment("""\
                                         **Published to Chromatic**
                                         Visual Changes: ${changes}
                                         Chromatic: [Build #${chromaticUrl.split('number=')[1]}](${chromaticUrl})
                                         Jenkins: [Build #${env.BUILD_NUMBER}](${env.BUILD_URL})
                                     """.stripIndent())
                                 } else {
                                     echo "Couldn't find a Chromatic build URL."
                                 }
                             } catch (err) {
                                 echo "Something went wrong getting the Chromatic build URL."
                                 echo "${err}"
                             }
                         }
                     }
                 }
            }
        }

        stage("Docker Build") {
            when {
                expression {
                    return (isQABuild() || isProdBuild() || isMainPullRequest())
                }
            }
            steps {
                script {
                    version = calculateVersion()
                }
                echo "Building Docker image"
                buildDocker("${BU}", "${appIdentifier}")
            }
        }

        stage("Deploy") {
            when {
                expression {
                    return (isQABuild() || isProdBuild())
                }
            }
            parallel {
                stage("Publish Chromatic") {
                    steps {
                        sh "npm run sb:chromatic -- --auto-accept-changes"
                    }
                }

                stage("Tag and Push Docker Image And Trigger Deploy") {
                    steps {
                        script {
                            version = calculateVersion()
                            fullArtifactName = "${appIdentifier}_${env.BRANCH_NAME}-${env.BUILD_NUMBER}-${version}.${shortID}.zip"
                        }
                        tagPushDocker("${BU}", "${appIdentifier}", "${version}")

                        script{
                            stackNameQA = "hbrg-qa-ecs"
                            imageNameQA = "hbrgQAECSMfeArticlesFargateImage"
                            imageTag = "${version}-${shortID}"
                        }
                        triggerDeploy("${stackNameQA}", "${imageNameQA}", "${imageTag}" )
                    }
                }
            }
            
        }

        stage("Clean Docker image"){
            when {
                expression {
                    return (isQABuild() || isProdBuild() || isMainPullRequest())
                }
            }
            steps{
                echo "Cleaning up Docker image"
                cleanupDockerImage("${BU}", "${appIdentifier}")
            }
        }

        // stage("Post Release"){
        //     when {
        //         expression {
        //             return isProdBuild()
        //         }
        //     }
        //     parallel {
        //         stage("Bump Version") {
        //             when {
        //                 expression {
        //                     return env.releaseType != "none"
        //                 }
        //             }
        //             steps {
        //                 echo "Bumping the version"
        //                 sshagent(["jenkins-git"]) {
        //                     script {
        //                         sh "git fetch"
        //                         sh "git checkout production"
        //                         sh "git reset --hard HEAD"
        //                         newVersion = sh(script: "npm version ${env.releaseType} --commit-hooks=false -m 'bump version to %s'", returnStdout: true)
        //                         sh "git push --no-verify && git push --tags --no-verify"
        //                         sh "npm run release:notes"
        //                     }
        //                 }
        //                 withCredentials([string(credentialsId: "git-hbrjenkins-itops", variable: "GH_ENTERPRISE_TOKEN")]) {
        //                     sh "gh pr create --title 'Back merge release ${newVersion}' --base main --head production --body 'This pull request was automatically generated, by Jenkins, for release ${newVersion}'"
        //                 }
        //             }
        //         }
        //     }
        // }
    }

    post {
        always {
            notifySlack(currentBuild.result)
            cleanWs(notFailBuild: true)
        }
    }
}

def nexusEvalStep () {
    def policyEvaluation = nexusPolicyEvaluation iqApplication: appIdentifier, iqScanPatterns: [[scanPattern: "**/package-lock.json"], [scanPattern: "**/npm-shrinkwrap.json"]], iqStage: "build"
    echo "Nexus Policy Evaluation Results: ${policyEvaluation}"
    echo "affected packages: ${policyEvaluation.affectedComponentCount}, packages with critical issues: ${policyEvaluation.criticalComponentCount}, packages with severe issues: ${policyEvaluation.severeComponentCount}, packages with moderate issues: ${policyEvaluation.moderateComponentCount}"
}


def shouldAbortBuild() {
    // check to see if we have a Jenkins initiated build
    result = sh(script: "git log -1 | grep '.*Jenkins CI.*'", returnStatus: true)

    if (result == 0 && isProdBuild()) {
        return true
    }

    return false
}

def notifySlack(String buildStatus = "STARTING") {
    buildStatus = buildStatus ?: "SUCCESS"

    def color
    groovy.lang.GString msg = "${env.JOB_NAME} - #${env.BUILD_NUMBER}, Build Status: ${buildStatus} "
    def seconds = currentBuild.duration / 1000

    if (buildStatus == "STARTING" || buildStatus == "NOT_BUILT") {
        color = "#D4DADF"
    } else if (buildStatus == "SUCCESS") {
        color = "#BDFFC3"
    } else if (buildStatus == "UNSTABLE") {
        color = "#FFFE89"
    } else {
        color = "#FF9FA1"
    }

    if (buildStatus != "STARTING") {
        msg += " after ${seconds} seconds (<${env.BUILD_URL}|Open>)\n" +
            "(<${env.BUILD_URL}/Build_Reports/|Build Reports>)"
    }

    slackSend(color: color, message: msg)
}

def calculateVersion() {
    currentVersion = sh(script: "npm pkg get version | sed 's/\"//g'" , returnStdout: true)

    if(env.releaseType == "none" || env.releaseType == null){
        return currentVersion.trim()
    }
    newVersion = sh(script: "npx semver -i ${env.releaseType} ${currentVersion}", returnStdout:true)
    return newVersion.trim()
}

def tagPushDocker(String BU, String appName, String Tag) {
    echo "Pushing Docker image to ECR - tagging version and latest"
    sh "aws ecr get-login-password --region us-east-1 \
        | docker login --username AWS --password-stdin 964020329682.dkr.ecr.us-east-1.amazonaws.com/${BU}/${appName} && \
        docker tag ${BU}/${appName}:${Tag}-${shortID} 964020329682.dkr.ecr.us-east-1.amazonaws.com/${BU}/${appName}:${Tag}-${shortID} && \
        docker push 964020329682.dkr.ecr.us-east-1.amazonaws.com/${BU}/${appName}:${Tag}-${shortID} && \
        docker tag ${BU}/${appName}:${Tag}-${shortID} 964020329682.dkr.ecr.us-east-1.amazonaws.com/${BU}/${appName}:latest && \
        docker push 964020329682.dkr.ecr.us-east-1.amazonaws.com/${BU}/${appName}:latest"
}

def triggerDeploy(String stackName, String imageName, String imageTag){
    echo "Triggering automatic deploy"
    sh "aws sns publish --topic-arn \"arn:aws:sns:us-east-1:964020329682:ops-fargate-deployer-topic\" --message '{ \
           \"stack_name\": \"${stackName}\", \
           \"stack_param_key\": \"${imageName}\", \
           \"stack_param_value\": \"${imageTag}\" \
        }'"
}

def buildDocker(String BU, String appName) {
    sh "docker build -t ${BU}/${appName}:${version}-${shortID} \
     --build-arg COMMIT_HASH=${shortID} \
     --build-arg NPM_TOKEN=${generateNPMToken()} ."
}

def cleanupDockerImage(String BU, String appName) {
    sh "docker rmi ${BU}/${appName}:${version}-${shortID}"
}

def gitCommitID() {
    sh "git rev-parse HEAD > .git/commitID"
    def commitID = readFile(".git/commitID").trim()
    sh "rm .git/commitID"
    commitID
}

def gitShortID() {
    sh "git rev-parse --short HEAD > .git/shortID"
    def shortID = readFile(".git/shortID").trim()
    sh "rm .git/shortID"
    shortID
}

def isQABuild() {
    return env.BRANCH_NAME == "main" || isHotFixBuild()
}

def isMainPullRequest() {
    return env.CHANGE_TARGET == "main"
}

def isProdBuild() {
    return env.BRANCH_NAME == "production"
}

def isHotFixBuild() {
    return env.BRANCH_NAME.startsWith("hotfix-")
}

// TODO: once the project structure is completed you need to update this method to reflect the all of the folders from the tools that need to be excluded from this process
def runCX(projectName,failureMode){
    step([$class: "CxScanBuilder",
        addGlobalCommenToBuildCommet: true,
        comment: "",
        configAsCode: true,
        credentialsId: "",
        enableProjectPolicyEnforcement: false,
        excludeFolders: "node_modules, .coverage, .sjsdoc, .next, .husky, pa11y, lighthouse, test-helpers, __mocks__, docs, docker, jenkins, .npm, storybook, .tmp",
        exclusionsSetting: "job",
        failBuildOnNewResults: false,
        failBuildOnNewSeverity: "HIGH",
        filterPattern: "!**/.dockerignore, !**/.editorconfig, !**/.env*, !**/.eslint*, !**/Docker*, !**/.gitignore, !**/.jsdoc.json, !**/.*rc, !**/.stylelint*, !**/server.js, !**/Jenkinsfile, !**/package*.json, !**/*.config.js, !**/*.md, !**/*.pem, !**/*.test.js, !**/*.test.jsx, !**/.git/**/*, !**/*.jpg, !**/*.png, !Checkmarx/Reports/*.*, !aws/**",
        fullScanCycle: 10,
        generatePdfReport: true,
        groupId: "7",
        hideDebugLogs: true,
        highThreshold: 0,
        jobStatusOnError: "FAILURE",
        password: "{AQAAABAAAAAQcwIec4ARTMcJsRFUeMUxEHShTRieMekz7B69SLwDR3w=}",
        preset: "36",
        projectName: "${projectName}",
        sastEnabled: true,
        serverUrl: "https://checkmarx.hbsp.harvard.edu",
        sourceEncoding: "1",
        username: "",
        vulnerabilityThresholdEnabled: true,
        vulnerabilityThresholdResult: "${failureMode}",
        waitForResultsEnabled: true]
    )
}

def generateNPMToken() {
    withCredentials([usernamePassword(credentialsId: "jenkins-nexus", passwordVariable: 'password', usernameVariable: 'user')]) {
        def token = sh(returnStdout: true, script: "echo -n $user:$password | openssl base64")
        return token.trim()
    }
}

def prComment(message) {
    withCredentials([string(credentialsId: "git-hbrjenkins-itops", variable: "GH_ENTERPRISE_TOKEN")]) {
        def now = new Date()
        sh "mkdir -p ${tmpDir}"
        def prCommentFile = "${tmpDir}/pr-comment-${now.getTime()}"
        sh "echo '${message}' > ${prCommentFile}"
        sh "gh pr comment ${env.CHANGE_ID} --body-file '${prCommentFile}'"
    }
}
