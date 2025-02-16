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

        stage('Build Images') {
            steps {
                script {
                    echo '🔨 Building backend image...'
                    sh 'docker build --no-cache -t ahmadb9/my-backend-image:latest ./backend'

                    echo '🔨 Building frontend image...'
                    sh 'docker build -t ahmadb9/my-frontend-image:latest ./frontend'
                }
            }
        }

        stage('Docker Login') {
            steps {
                script {
                    echo '🔑 Logging into Docker Hub...'
                    sh 'echo $DOCKER_CREDENTIALS_PSW | docker login -u $DOCKER_CREDENTIALS_USR --password-stdin'
                }
            }
        }

        stage('Push Images') {
            steps {
                script {
                    echo '🚀 Pushing backend image...'
                    sh 'docker push ahmadb9/my-backend-image:latest'

                    echo '🚀 Pushing frontend image...'
                    sh 'docker push ahmadb9/my-frontend-image:latest'
                }
            }
        }

        stage('Delete Existing Pods and Services') {
            steps {
                script {
                    echo '🧹 Deleting existing Kubernetes pods and services...'
                    sh '''
                        kubectl delete pods --all
                        kubectl delete svc --all
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo '🚢 Deploying to Kubernetes...'
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
                    echo "⏳ Waiting for MySQL to be ready..."
                    sh 'kubectl wait --for=condition=ready pod -l app=mysql --timeout=120s'

                    echo "⏳ Waiting for Backend to be ready..."
                    sh 'kubectl wait --for=condition=ready pod -l app=backend --timeout=120s'

                    echo "✅ MySQL and Backend are ready!"
                }
            }
        }

        stage('Expose Backend Locally') {
            steps {
                script {
                    echo "🔄 Port-forwarding backend service..."
                    sh 'nohup kubectl port-forward service/backend-service 8000:8000 &'
                }
            }
        }

        stage('Expose Frontend Locally') {
            steps {
                script {
                    echo '🔄 Port-forwarding frontend service...'
                    sh 'nohup kubectl port-forward service/frontend-service 80:80 &'
                }
            }
        }

        stage('Expose DB Locally') {
            steps {
                script {
                    echo '🔄 Port-forwarding MySQL service...'
                    sh 'nohup kubectl port-forward service/db-service 3306:3306 &'
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
