pipeline {
    agent any

    stages {
        stage('Clone Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/LaghuviRawat/react-budget-tracker.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t myapp .'
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
                sh '''
                    docker rm -f myapp || true
                    docker run -d --name myapp -p 8080:80 myapp
                '''
            }
        }

    }
}
