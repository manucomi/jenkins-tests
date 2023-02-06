pipeline {
    agent any

    tools { nodejs "node-v16.13.1" }

    options {
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: "5"))
    }

    environment {
        NEXUS_CREDS = credentials("jenkins-nexus")
        GH_HOST = "git.harvardbusiness.org"
        MAIN_BRANCH = "main"
        shortHash = getShortHash()
    }

    stages {
        stage("Install Dependencies") {
            steps {
                sh "node -v"
                sh "npm ci"
            }
        }

        stage("Code Scans") {
            parallel {
                stage("Code Style Scan") {
                    steps {
                        sh "npm run lint"
                    }
                }

                stage("Checkmarx Static Analysis") {
                    steps {
                        runCX("hbr-mfe-core", "FAILURE")
                    }
                }

                stage("Nexus IQ Dependency Scan") {
                    steps {
                        sh "node -e \"var x=`cat package.json | tr '\n' ' '`; Object.keys(x.devDependencies).concat(Object.keys(x.dependencies)).forEach(function (d) { console.log(d)} );\" | xargs -I {} sh -c \"cd node_modules/{}; echo {}; npm shrinkwrap 2> /dev/null\" ;"
                        nexusEvalStep()
                    }
                }
            }
        }

        stage("Build") {
            steps {
                sh "npm run build"
            }
        }

        stage("Tests") {
            parallel {
                stage("Unit Tests") {
                    steps {
                        sh "npm run unit:test"
                    }
                }
            }
        }

        stage("Deploy") {
            environment {
                NEXUS_REPO = "//nexus.hbsp.harvard.edu/content/repositories/npm-internal/"
            }
            stages {
                stage("Deploy 'pr' Tag") {
                    when {
                        expression {
                            return isPRBuild()
                        }
                    }
                    steps {
                        script {
                            def buildType = "pr"
                            newVersion = generateReleaseVersion(buildType)
                            sh "npm pkg set version=${newVersion}"
                            if(!isPRVersionDuplicated(newVersion)) {
                                sh "git checkout -- .npmrc"
                                try {
                                    sh "echo '${NEXUS_REPO}:_auth=\${NPM_TOKEN}' >> .npmrc"
                                    npmTag = "${buildType}-${env.CHANGE_ID}"
                                    withEnv(["NPM_TOKEN=${generateNPMToken()}"]) {
                                        sh "npm run release -- --tag ${npmTag}"
                                    }
                                    prComment("**New Version Published**\nVersion: `${newVersion}`\nTag: `${npmTag}`")
                                } catch(error) {
                                    prComment("Publishing failed with the following error:\n```${error}```")
                                }
                            } else {
                                prComment("**Publishing skipped**\nReason: Version `${newVersion}` already exists")
                            }
                        }
                    }
                }

                stage("Deploy 'next' Tag") {
                    when {
                        expression {
                            isPreviewBuild()
                        }
                    }
                    steps {
                        script {
                            def buildType = "next"
                            newVersion = generateReleaseVersion(buildType)
                            sh "npm pkg set version=${newVersion}"
                            sh "echo '${NEXUS_REPO}:_auth=\${NPM_TOKEN}' >> .npmrc"
                            npmTag = buildType
                            withEnv(["NPM_TOKEN=${generateNPMToken()}"]) {
                                sh "npm run release -- --tag ${npmTag}"
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            notifySlack(currentBuild.result)
            cleanWs(notFailBuild: true)
        }
    }
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

def runCX(projectName,failureMode){
    step([$class: "CxScanBuilder",
        addGlobalCommenToBuildCommet: true,
        comment: "",
        configAsCode: true,
        credentialsId: "",
        enableProjectPolicyEnforcement: false,
        excludeFolders: "node_modules, .tmp, .jsdoc, .husky, test-helpers, __mocks__, docs",
        exclusionsSetting: "job",
        failBuildOnNewResults: false,
        failBuildOnNewSeverity: "HIGH",
        filterPattern: "!**/.editorconfig, !**/.eslint*, !**/.gitignore, !**/.jsdoc.json, !**/.*rc, !**/.stylelint*, !**/Jenkinsfile, !**/package*.json, !**/*.config.js, !**/*.md, !**/*.test.js, !**/*.test.jsx, !**/.git/**/*, !**/*.jpg, !**/*.png, !Checkmarx/Reports/*.*",
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

def nexusEvalStep() {
    def policyEvaluation = nexusPolicyEvaluation iqApplication: "mfe-react-lib", iqScanPatterns: [[scanPattern: "**/package-lock.json"], [scanPattern: "**/npm-shrinkwrap.json"]], iqStage: "build"
    echo "Nexus Policy Evaluation Results: ${policyEvaluation}"
    echo "affected packages: ${policyEvaluation.affectedComponentCount}, packages with critical issues: ${policyEvaluation.criticalComponentCount}, packages with severe issues: ${policyEvaluation.severeComponentCount}, packages with moderate issues: ${policyEvaluation.moderateComponentCount}"
}

def generateReleaseVersion(type) {
    def currentVersion = sh(script: "npm pkg get version | sed 's/\"//g'" , returnStdout: true)
    def newVersion = "${currentVersion.trim()}-${type}.${env.shortHash}"
    return newVersion
}

def generateNPMToken() {
    withCredentials([usernamePassword(credentialsId: "jenkins-nexus", passwordVariable: 'password', usernameVariable: 'user')]) {
        def token = sh(returnStdout: true, script: "echo -n $user:$password | openssl base64")
        return token
    }
}

def getShortHash() {
    sh "git rev-parse --short HEAD > .git/shortID"
    def shortID = readFile(".git/shortID").trim()
    sh "rm .git/shortID"
    shortID
}

def prComment(message) {
    withCredentials([string(credentialsId: "git-hbrjenkins-itops", variable: "GH_ENTERPRISE_TOKEN")]) {
        def now = new Date()
        def prCommentFile = ".tmp/pr-comment-${now.getTime()}"
        sh "echo '${message}' > ${prCommentFile}"
        sh "gh pr comment ${env.CHANGE_ID} --body-file '${prCommentFile}'"
    }
}

def isPreviewBuild() {
    return env.BRANCH_NAME == env.MAIN_BRANCH
}

def isPRBuild() {
    return env.CHANGE_TARGET == env.MAIN_BRANCH && !env.CHANGE_BRANCH.startsWith("release-")
}

def isPRVersionDuplicated(version){
    sh "echo '//ae-qa-nexus-app01:8081/content/groups/npm-all/:_auth=\${NPM_TOKEN}' >> .npmrc"
    withEnv(["NPM_TOKEN=${generateNPMToken()}"]) {
        def remoteVersion = sh(script: "npm view mfe-core@${version} --registry http://ae-qa-nexus-app01:8081/content/groups/npm-all/", returnStdout: true).trim()
        return (remoteVersion.length() == 0) ? false : true
    }
}