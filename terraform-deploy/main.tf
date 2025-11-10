provider "aws" {
      region = "ap-south-1"
}

# Create a security group that allows HTTP (port 80) and SSH (port 22)
resource "aws_security_group" "budget_sg" {
      name        = "budget-tracker-sg"
      description = "Allow HTTP and SSH inbound traffic"

      ingress {
            from_port   = 80
            to_port     = 80
            protocol    = "tcp"
            cidr_blocks = ["0.0.0.0/0"]  # allow web traffic from anywhere
      }

      ingress {
            from_port   = 22
            to_port     = 22
            protocol    = "tcp"
            cidr_blocks = ["0.0.0.0/0"]  # allow SSH (optional)
      }

      egress {
            from_port   = 0
            to_port     = 0
            protocol    = "-1"
            cidr_blocks = ["0.0.0.0/0"]  # allow all outbound
      }

      tags = {
            Name = "budget-tracker-sg"
      }
}

# Create the EC2 instance
resource "aws_instance" "budget_app" {
      ami           = "ami-0a34b530c620f51a2"   # Amazon Linux 2 (Mumbai region)
      instance_type = "t3.micro"
      vpc_security_group_ids = [aws_security_group.budget_sg.id]

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
