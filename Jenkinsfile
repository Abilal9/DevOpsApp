//Test #14
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
                    echo 'Checking Docker and Docker Compose versions...'
                    sh '''
                        docker --version || { echo "Docker is not installed. Please install Docker."; exit 1; }
                        docker-compose --version || { echo "Docker Compose is not installed. Please install Docker Compose."; exit 1; }
                    '''

                    echo 'Stopping and cleaning up existing containers and volumes...'
                    sh '''
                        COMPOSE_PROJECT_NAME=devopsapp_stack docker-compose down --rmi all --remove-orphans || { echo "Failed to clean up Docker environment."; exit 1; }
                    '''

                    echo 'Rebuilding and starting containers...'
                    sh '''
                        COMPOSE_PROJECT_NAME=devopsapp_stack docker-compose up --build -d || { echo "Failed to build and start Docker containers."; exit 1; }
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
