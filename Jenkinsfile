pipeline {
  agent { 
    dockerfile true
  }
  environment {
    commitID = gitCommitID()
    shortID = gitShortID()
    BU = "hbrg"
    environmentName = "${isQABuild() ? 'QA' : 'prod'}"
    version = ""
    appIdentifier = "mfe-home"
    fullArtifactName = ""
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

        stage("Install Dependencies") {
            steps {
                  sh "node -v"
                  sh "npm ci"
                }
            }
        }

        stage("Code Scans") {
            parallel {
                stage("Code Style Scan") {
                    steps {
                        sh "npm run lint"
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
                        sh "npm test"
                    }
                }
                
            }
        }

        // Commenting out the Pact stages until the integration can be fixed.
        /* stage('Trigger provider job') {
            when {
                expression {
                    return (isMainBuild() || env.BRANCH_NAME.startsWith('PR-'))
                }
            }
            steps {
                script {
                    if (isMainBuild()) {
                        build job: "mfe-home-pact-verification", wait: true,
                        parameters: [
                            string(name: 'tags', value: 'main')
                        ]
                    }

                    else {
                        build job: "mfe-home-pact-verification", wait: true,
                        parameters: [
                            string(name: 'tags', value: "${env.BRANCH_NAME}-${shortID}")
                        ]
                    }
                }
           }
        }

        stage("Can I Deploy") {
            when {
                expression {
                    return (isMainBuild() || env.BRANCH_NAME.startsWith("PR-"))
                }
            }
            steps {
                script {
                    if (isMainBuild()) {
                        sh "npm --vno=${shortID}_${env.BUILD_NUMBER} --tagValue=main run can-i-deploy:pact"
                    }
                    else {
                        sh "npm --vno=${shortID}_${env.BUILD_NUMBER} --tagValue=${env.BRANCH_NAME}-${shortID} run can-i-deploy:pact"
                    }
                }
            }
        } */

        stage("Deploy") {
            when {
                expression {
                    return (isQABuild() || isProdBuild())
                }
            }
            steps {
                script {
                    version = calculateVersion()
                    fullArtifactName = "${appIdentifier}_${env.BRANCH_NAME}-${env.BUILD_NUMBER}-${version}.${shortID}.zip"
                    echo "fullArtifactName: ${fullArtifactName}"
                }
            }
        }
    }
}

def shouldAbortBuild() {
    // check to see if we have a Jenkins initiated build
    result = sh(script: "git log -1 | grep '.*Jenkins CI.*'", returnStatus: true)

    if (result == 0 && isProdBuild()) {
        return true
    }

    return false
}

def calculateVersion() {
    currentVersion = sh(script: "npm pkg get version | sed 's/\"//g'" , returnStdout: true)

    if(env.releaseType == "none" || env.releaseType == null){
        return currentVersion.trim()
    }
    newVersion = sh(script: "npx semver -i ${env.releaseType} ${currentVersion}", returnStdout:true)
    return newVersion.trim()
}

def buildDocker(String BU, String appName) {
    def nodeEnv = "production"
    if (env.environmentName == "QA") {
        nodeEnv = "test"
    }
    sh "sudo docker build -t ${BU}/${appName}:${version} \
     --build-arg COMMIT_HASH=${shortID} \
     --build-arg NODE_ENV=${nodeEnv} \
     --build-arg NPM_TOKEN=${generateNPMToken()} -f AppDockerfile"
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

def isMainBuild() {
     return env.BRANCH_NAME == "main"
}

def isProdBuild() {
    return env.BRANCH_NAME == "production"
}