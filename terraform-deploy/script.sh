#!/bin/bash
#install java
sudo apt update -y
sudo apt install -y fontconfig openjdk-21-jre
java -version

#install jenkins
sudo wget -O /etc/apt/keyrings/jenkins-keyring.asc \
      https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc]" \
      https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
      /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt-get update -y
sudo apt-get install -y jenkins

systemctl status jenkins
sudo systemctl enable jenkins
sudo systemctl restart jenkins

#install docker
sudo apt-get update -y
sudo apt-get install -y docker.io 
sudo apt-get install docker-compose-v2
sudo usermod -aG docker $USER && newgrp docker
sudo systemctl enable docker
sudo systemctl start docker