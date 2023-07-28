pipeline {
  agent { 
    image 'node:18.16.0-alpine'
  }
  stages {
    stage('Test') {
      steps {
        sh '''
          node --version
        '''
      }
    }
  }
}