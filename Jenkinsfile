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
                script {
                    echo "Checking Docker availability and building image..."
                    def dockerAvailable = false
                    if (isUnix()) {
                        dockerAvailable = (sh(script: 'command -v docker', returnStatus: true) == 0)
                        if (dockerAvailable) {
                            sh "docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} -t ${IMAGE_NAME}:latest ."
                        } else {
                            echo "[WARNING] Docker is not installed/running on Unix agent. Skipping Docker build stage."
                        }
                    } else {
                        dockerAvailable = (bat(script: 'where docker', returnStatus: true) == 0)
                        if (dockerAvailable) {
                            bat 'cmd /c "docker build -t %IMAGE_NAME%:%BUILD_NUMBER% -t %IMAGE_NAME%:latest ."'
                        } else {
                            echo "[WARNING] Docker is not installed/running on Windows agent. Skipping Docker build stage."
                        }
                    }
                    env.DOCKER_AVAILABLE = dockerAvailable ? "true" : "false"
                }
            }
        }

        stage('Deploy Container') {
            steps {
                script {
                    if (env.DOCKER_AVAILABLE == "true") {
                        echo "Deploying Docker container on port ${HOST_PORT}..."
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
                    } else {
                        echo "[INFO] Skipping container deployment stage because Docker is not installed on this machine."
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Successfully built ${APP_NAME} pipeline #${BUILD_NUMBER}!"
        }
        failure {
            echo "Pipeline #${BUILD_NUMBER} failed. Please check build logs."
        }
        always {
            cleanWs()
        }
    }
}
