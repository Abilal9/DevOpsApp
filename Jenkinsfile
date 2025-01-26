pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Deploy') {
            steps {
                script {
                    sh '''
                        docker --version || { echo "Docker is not installed."; exit 1; }
                        docker-compose --version || { echo "Docker Compose is not installed."; exit 1; }
                    '''

                    sh '''
                        docker-compose down --volumes --remove-orphans
                    '''

                    sh '''
                        docker-compose up --build -d --force-recreate
                    '''
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution completed.'
        }
        success {
            echo 'Build and deployment successful.'
        }
        failure {
            echo 'Pipeline failed. Check the logs for details.'
        }
    }
}
