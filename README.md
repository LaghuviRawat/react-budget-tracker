# 💰 React Budget Tracker

A **modern and interactive budget tracking application** built using **React.js**.  
This project helps users manage income and expenses efficiently — with an added twist —  
🗣️ **Voice-controlled expense input** using **Speechly** (Speech-to-Text API integration).

---

## 🚀 Features

### 🎯 Core Features
- ✅ Add, edit, and delete transactions
- ✅ Track your income and expenses in real-time
- ✅ Beautiful, responsive UI built with React
- ✅ Data persistence via local storage
- ✅ Dynamic chart visualization for spending insights

### 🗣️ Speech-to-Text Feature (Speechly Integration)
- Add transactions just by **speaking naturally**:
  > “Add expense of 500 for groceries”
- Real-time transcription powered by **@speechly/react-client**
- Smooth and accessible experience for all users

---

## 🧱 Tech Stack

| Category | Technologies |
|-----------|---------------|
| Frontend | React.js, Material-UI |
| Voice Input | Speechly API |
| Containerization | Docker |
| Infrastructure | Terraform |
| CI/CD | Jenkins |
| Cloud Provider | AWS (EC2) |

---




## 🐳 Docker Setup

The app is containerized for consistent deployment across environments.

### 🧩 Build and Run the Docker Image

```bash
# Build the Docker image
docker build -t react-budget-tracker .

# Run the container
docker run -p 80:80 react-budget-tracker

This allows the application to run anywhere — locally, on AWS EC2, or in Jenkins pipelines — without environment issues.
```


------


☁️ Infrastructure as Code (IaC) with Terraform

We used Terraform to automate infrastructure setup on AWS.

🌍 Automatically provisions an EC2 instance

📦 Installs Docker

🚀 Deploys the Dockerized React app on startup

Example snippet:
```bash
  resource "aws_instance" "budget_app" {
  ami           = "ami-0a34b530c620f51a2"
  instance_type = "t2.micro"

  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    yum install -y docker
    systemctl start docker
    systemctl enable docker
    docker run -d -p 80:80 laghuvirawat/react-budget-tracker:latest
  EOF

  tags = {
    Name = "ReactBudgetTracker"
  }
}
```


------

🔁 Continuous Integration & Deployment with Jenkins 

We will integrate Jenkins to automate the full CI/CD pipeline.

Planned Jenkins Pipeline:

🧩 Trigger on every push to main branch

🧱 Build Docker image

🐳 Push to Docker Hub or GitHub Container Registry

☁️ Run Terraform to provision and deploy to AWS EC2

✅ Notify on successful deployment

This ensures:

No manual server setup

Automated and consistent deployments

Real-world DevOps workflow integration


------


📦 Folder Structure
```bash
react-budget-tracker/
├── src/                    # React components & logic
├── public/                 # Static assets
├── Dockerfile              # Containerization setup
├── terraform-deploy/       # Terraform scripts for AWS deployment
├── package.json
├── README.md
```


----------

🧠 Learning Outcomes

Frontend app with React + Speechly

Docker containerization

Infrastructure automation using Terraform

End-to-end CI/CD with Jenkins

Real-world DevOps + Cloud deployment workflow


----------


🧑‍💻 Author

👩‍💻 Laghuvi Rawat
📍 Passionate about full-stack development, cloud, and DevOps automation.
🚀 GitHub: LaghuviRawat

⭐ If you like this project, don’t forget to star the repository!

