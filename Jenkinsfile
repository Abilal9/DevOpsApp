pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS = credentials('docker-hub-credentials')  
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Login') {
            steps {
                script {
                    sh 'echo $DOCKER_CREDENTIALS_PSW | docker login -u $DOCKER_CREDENTIALS_USR --password-stdin'
                }
            }
        }

        stage('Build and Push Images') {
            steps {
                script {
                    sh '''
                        docker build -t ahmadb9/my-backend-image:latest ./backend
                        docker push ahmadb9/my-backend-image:latest

                        docker build -t ahmadb9/my-frontend-image:latest ./frontend
                        docker push ahmadb9/my-frontend-image:latest
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh '''
                        kubectl apply -f k8s/backend-deployment.yaml
                        kubectl apply -f k8s/backend-service.yaml
                        kubectl apply -f k8s/frontend-deployment.yaml
                        kubectl apply -f k8s/frontend-service.yaml
                        kubectl apply -f k8s/mysql-deployment.yaml
                        kubectl apply -f k8s/mysql-service.yaml
                        kubectl apply -f k8s/mysql-pvc.yaml
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Application successfully deployed on Kubernetes!'
        }
        failure {
            echo '❌ Deployment failed. Check logs.'
        }
    }
}
