pipeline {
      agent any

      environment {
            DOCKERHUB_CREDENTIALS = 'dockerhub-creds'    // Jenkins credential ID
            DOCKERHUB_USER = 'laghuvirawat'   
            IMAGE_NAME = 'myapp'                         
            IMAGE_TAG = "latest"
      }

      stages {

            stage('Clone Code') {
                  steps {
                        git branch: 'main',
                        url: 'https://github.com/LaghuviRawat/react-budget-tracker.git'
                  }
            }

            stage('Build Docker Image') {
                  steps {
                        sh "docker build -t ${DOCKERHUB_USER}/${IMAGE_NAME}:${IMAGE_TAG} ."
                  }
            }

            stage('Push Docker Image') {
                  steps {
                        withCredentials([usernamePassword(credentialsId: "$DOCKERHUB_CREDENTIALS",
                                                usernameVariable: 'USERNAME',
                                                passwordVariable: 'PASSWORD')]) {
                              sh """
                              echo "$PASSWORD" | docker login -u "$USERNAME" --password-stdin
                              docker push ${DOCKERHUB_USER}/${IMAGE_NAME}:${IMAGE_TAG}
                              docker logout
                              """
                        }
                  }
            }

            stage('Stop Old Container') {
                  steps {
                  sh '''
                        if [ $(docker ps -q --filter "name=myapp") ]; then
                        docker stop myapp
                        docker rm myapp
                        fi
                  '''
                  }
            }

            stage('Run New Container') {
                  steps {
                  sh """
                        docker rm -f myapp || true
                        docker pull ${DOCKERHUB_USER}/${IMAGE_NAME}:${IMAGE_TAG}
                        docker run -d --name myapp -p 80:80 ${DOCKERHUB_USER}/${IMAGE_NAME}:${IMAGE_TAG}
                  """
                  }
            }

      }
}