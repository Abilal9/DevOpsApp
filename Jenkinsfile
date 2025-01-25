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

                    // Stop and remove old containers, remove volumes, and orphan containers
                    sh '''
                        docker-compose down --volumes --remove-orphans
                    '''

                    // Rebuild and deploy containers with no cache and force recreate
                    sh '''
                        docker-compose down --rmi all --remove-orphans && docker-compose up --force-recreate
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
