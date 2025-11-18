provider "aws" {
      region = "ap-south-1"
}
#key pair login
resource "aws_key_pair" "my_key" {
      key_name   = "terra-key-ec2"
      public_key = file("terra-key-ec2.pub")
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

      ingress {
            from_port   = 8080
            to_port     = 8080
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
      key_name      = aws_key_pair.my_key.key_name 
      ami           = "ami-02b8269d5e85954ef"   #ubuntu 
      instance_type = "t3.small"
      vpc_security_group_ids = [aws_security_group.budget_sg.id]

      root_block_device {
            volume_type = "gp3"
            volume_size = 15
            encrypted   = true
      }

      user_data = file("script.sh")

      tags = {
            Name = "ReactBudgetTracker"
      }
}
