pipeline {
    agent any

    environment {
        APP_NAME       = 'library-management'
        IMAGE_NAME     = 'library-management-app'
        CONTAINER_NAME = 'library_management_container'
        HOST_PORT      = '8080'
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out source code...'
                // Source code is checked out automatically by Jenkins SCM
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing npm dependencies...'
                script {
                    if (isUnix()) {
                        sh 'npm ci --no-audit --no-fund'
                    } else {
                        bat 'cmd /c "npm ci --no-audit --no-fund"'
                    }
                }
            }
        }

        stage('Build React Application') {
            steps {
                echo 'Building React production bundle...'
                script {
                    if (isUnix()) {
                        sh 'npm run build'
                    } else {
                        bat 'cmd /c "npm run build"'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image: ${IMAGE_NAME}:${BUILD_NUMBER}..."
                script {
                    if (isUnix()) {
                        sh "docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} -t ${IMAGE_NAME}:latest ."
                    } else {
                        bat 'cmd /c "docker build -t %IMAGE_NAME%:%BUILD_NUMBER% -t %IMAGE_NAME%:latest ."'
                    }
                }
            }
        }

        stage('Deploy Container') {
            steps {
                echo "Deploying Docker container on port ${HOST_PORT}..."
                script {
                    if (isUnix()) {
                        sh """
                            docker stop ${CONTAINER_NAME} || true
                            docker rm ${CONTAINER_NAME} || true
                            docker run -d --name ${CONTAINER_NAME} -p ${HOST_PORT}:80 ${IMAGE_NAME}:latest
                        """
                    } else {
                        bat """
                            cmd /c "docker stop %CONTAINER_NAME% || exit 0"
                            cmd /c "docker rm %CONTAINER_NAME% || exit 0"
                            cmd /c "docker run -d --name %CONTAINER_NAME% -p %HOST_PORT%:80 %IMAGE_NAME%:latest || exit 0"
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Successfully built and deployed ${APP_NAME} pipeline #${BUILD_NUMBER}!"
        }
        failure {
            echo "Pipeline #${BUILD_NUMBER} failed. Please check build logs."
        }
        always {
            cleanWs()
        }
    }
}
