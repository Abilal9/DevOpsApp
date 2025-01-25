pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Clone the repository
                checkout scm
            }
        }

        stage('Build and Deploy') {
            steps {
                script {
                    // Ensure Docker and Docker Compose are installed
                    sh '''
                        docker --version || { echo "Docker is not installed."; exit 1; }
                        docker-compose --version || { echo "Docker Compose is not installed."; exit 1; }
                    '''

                    // Stop and remove old containers, then rebuild and deploy
                    sh '''
                        docker-compose down --rmi all
                        docker-compose up --build -d
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
