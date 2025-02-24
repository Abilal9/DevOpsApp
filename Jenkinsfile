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

        stage('Detect Changes') {
            steps {
                script {
                    def changedFiles = sh(script: 'git diff --name-only $(git merge-base HEAD origin/main) HEAD', returnStdout: true).trim().split('\n')
                    echo "Changed files: ${changedFiles}"
                    env.FRONTEND_CHANGED = changedFiles.any { it.startsWith('frontend/') } ? 'true' : 'false'
                    env.BACKEND_CHANGED = changedFiles.any { it.startsWith('backend/') } ? 'true' : 'false'
                    echo "Frontend changed: ${env.FRONTEND_CHANGED}, Backend changed: ${env.BACKEND_CHANGED}"
                }
            }
        }

        stage('Docker Login') {
            steps {
                script {
                    echo 'Logging into Docker Hub...'
                    sh "echo ${DOCKER_CREDENTIALS_PSW} | docker login -u ${DOCKER_CREDENTIALS_USR} --password-stdin"
                }
            }
        }

        stage('Build and Push Backend Image') {
            when {
                expression { env.BACKEND_CHANGED.toBoolean() }
            }
            steps {
                script {
                    echo 'Building backend image...'
                    sh 'docker build --no-cache -t ahmadb9/my-backend-image:latest ./backend'
                    echo 'Pushing backend image...'
                    sh 'docker push ahmadb9/my-backend-image:latest'
                }
            }
        }

        stage('Build and Push Frontend Image') {
            when {
                expression { env.FRONTEND_CHANGED.toBoolean() }
            }
            steps {
                script {
                    echo 'Building frontend image...'
                    sh 'docker build --no-cache -t ahmadb9/my-frontend-image:latest ./frontend'
                    echo 'Pushing frontend image...'
                    sh 'docker push ahmadb9/my-frontend-image:latest'
                }
            }
        }

        stage('Deploy Backend to Kubernetes') {
            when {
                expression { env.BACKEND_CHANGED.toBoolean() }
            }
            steps {
                script {
                    echo 'Deploying backend to Kubernetes...'
                    sh 'kubectl apply -f k8s/backend-deployment.yaml'
                    echo 'Restarting backend deployment...'
                    sh 'kubectl rollout restart deployment backend'
                }
            }
        }

        stage('Deploy Frontend to Kubernetes') {
            when {
                expression { env.FRONTEND_CHANGED.toBoolean() }
            }
            steps {
                script {
                    echo 'Deploying frontend to Kubernetes...'
                    sh 'kubectl apply -f k8s/frontend-deployment.yaml'
                    echo 'Restarting frontend deployment...'
                    sh 'kubectl rollout restart deployment frontend'
                }
            }
        }
    }

    post {
        success {
            echo 'Application successfully deployed with selective service updates!'
        }
        failure {
            echo 'Deployment failed. Check logs.'
        }
    }
}
