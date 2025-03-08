# Quick Start Guide for creating the Nginx and Pocketbase Docker Image and run it as docker-compose

This README provides instructions on how to build Docker images from Dockerfiles and run them using Docker Compose.

## Requirements

- Docker
- Docker Compose

## Directory Structure

Ensure you have the following files in your project directory:
- `Dockerfile-nginx`: Dockerfile for NGINX
- `Dockerfile-pocketbase`: Dockerfile for Pocketbase
- `docker-compose.yml`: Docker Compose configuration file

## Step-by-Step Instructions

### Building Docker Images

1. **Build the NGINX Image:**

   Navigate to your project directory where `Dockerfile-nginx` is located and run:
   
   ```bash
   docker build -f Dockerfile-nginx -t my-nginx-image .
   ```

2. **Build the Pocketbase Image:**

   Navigate to your project directory where `Dockerfile-pocketbase` is located and run:
   
   ```bash
   docker build -f Dockerfile-pocketbase -t my-pocketbase-image .
   ```

### Running with Docker Compose

1. **Start the Services:**

   Make sure you are in the directory containing your `docker-compose.yml` file and run:
   
   ```bash
   docker-compose up -d
   ```

   This command will start all the services defined in your Docker Compose file. In this setup, Pocketbase will be available at `http://localhost:4466` and NGINX will serve at `http://localhost`.

2. **Stop the Services:**

   When you're done, you can stop the Docker Compose services by running:
   
   ```bash
   docker-compose down
   ```

## Additional Commands

- To rebuild the services automatically when changes are detected, use:
  
  ```bash
  docker-compose up --build
  ```

- To run the services in detached mode, use:
  
  ```bash
  docker-compose up -d
  ```