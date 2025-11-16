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

        stage('Run Docker Container') {
            steps {
                sh 'docker run -d -p 8080:80 myapp'
            }
        }
    }
}
