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

        stage('Wait for Services to Start') {
            steps {
                script {
                    sh '''
                        echo "⏳ Waiting for MySQL to be ready..."
                        kubectl wait --for=condition=ready pod -l app=mysql --timeout=120s

                        echo "⏳ Waiting for Backend to be ready..."
                        kubectl wait --for=condition=ready pod -l app=backend --timeout=120s

                        echo "✅ MySQL and Backend are ready!"
                    '''
                }
            }
        }

        stage('Expose Services Locally') {
            steps {
                script {
                    sh '''
                        echo "Port-forwarding backend service..."
                        nohup kubectl port-forward service/backend-service 8000:8000 > backend.log 2>&1 &

                        echo "Getting frontend service URL..."
                        FRONTEND_URL=$(minikube service frontend-service --url)
                        echo "✅ Access the frontend at: $FRONTEND_URL"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Application successfully deployed and is accessible locally!'
        }
        failure {
            echo '❌ Deployment failed. Check logs.'
        }
    }
}
