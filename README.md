# Node.js Scaling Lab

Experimenting with Node.js performance, profiling, clustering, Docker, NGINX reverse proxying, load balancing, and backend infrastructure tooling.

---

# Overview

This repository focuses on understanding how Node.js applications behave under traffic and how backend infrastructure tools work together in real-world systems.

The goal of this project was not to build a CRUD application, but to explore:

* performance bottlenecks
* profiling and diagnostics
* process management
* clustering
* reverse proxying
* load balancing
* containerization
* developer tooling workflows

The project was built step-by-step while experimenting with:

* PM2
* Autocannon
* Clinic.js
* Pino
* Docker
* NGINX
* Husky
* ESLint

---

# Docker and NGINX Scaling Architecture

![NGINX](https://github.com/100NikhilBro/nodejs-scaling-lab/blob/main/Diagram/NGINX.png)

## Explanation

This repository starts with understanding how backend systems scale when traffic increases.

Initially, a single Node.js server handles incoming traffic. As traffic grows, a single process becomes insufficient because Node.js runs on a single-threaded event loop.

To improve concurrency and scalability:

* Docker is used to containerize backend servers
* multiple Node.js containers are created
* NGINX acts as a reverse proxy and load balancer
* incoming traffic gets distributed across backend containers

The architecture explored in this repository includes:

* Dockerized backend servers
* NGINX upstream balancing
* reverse proxying
* horizontal scaling
* traffic distribution between multiple Node.js instances

Docker Compose was used to:

* create multiple backend containers
* connect services through Docker networking
* run NGINX alongside backend servers

Example commands:

```bash
docker compose up --build
```

```bash
docker compose down
```

Example NGINX configuration:

```nginx
events {}

http {

    upstream backend {
        server app1:3000;
        server app2:3000;
        server app3:3000;
    }

    server {

        listen 80;

        location / {
            proxy_pass http://backend;
        }
    }
}
```

This setup distributes requests across multiple backend containers.


# PM2 Process Management and Clustering

![PM2](https://github.com/100NikhilBro/nodejs-scaling-lab/blob/main/Diagram/PM2.png)

## Explanation

PM2 is a production process manager for Node.js applications.

Normally, when a Node.js server is started using:

```bash
node server.js
```

closing the terminal stops the application.

PM2 solves this problem by managing the Node.js process independently.

Example:

```bash
pm2 start server.js
```

Features explored in this repository:

* process management
* automatic restart
* logs monitoring
* process listing
* server monitoring
* cluster mode

Cluster mode was tested using:

```bash
pm2 start server.js -i max
```

This creates multiple Node.js instances using available CPU cores.

Useful commands:

```bash
pm2 list
pm2 logs
pm2 monit
pm2 restart server
pm2 stop server
pm2 delete server
```

---

# Autocannon Benchmarking

![Autocannon](https://github.com/100NikhilBro/nodejs-scaling-lab/blob/main/Diagram/autocannon.png)

## Explanation

Autocannon is a benchmarking and load-testing tool for Node.js applications.

It was used to:

* generate concurrent traffic
* measure throughput
* measure response latency
* detect bottlenecks
* observe server behaviour under load

Installation:

```bash
npm i autocannon
```

Basic usage:

```bash
npx autocannon http://localhost:3000
```

Examples used during testing:

```bash
npx autocannon -c 200 http://localhost:3000
```

```bash
npx autocannon -c 100 -d 10 http://localhost:3000
```

```bash
npx autocannon -c 100 -p 10 http://localhost:3000
```

Important flags:

* `-c` → concurrent connections
* `-d` → duration of test
* `-p` → pipelining requests

The project also demonstrated how CPU blocking operations drastically reduce throughput and increase latency.

---

# Clinic.js Profiling and Diagnostics

![Clinic](https://github.com/100NikhilBro/nodejs-scaling-lab/blob/main/Diagram/Clinic.png)

## Explanation

Clinic.js is a diagnostic toolkit for Node.js applications.

It helps detect:

* event loop blocking
* CPU-intensive operations
* memory-related issues
* slow APIs
* application lag

Two major tools explored:

## Clinic Doctor

Used for overall health analysis.

Command:

```bash
npx clinic doctor -- node server.js
```

Traffic was generated using Autocannon while Clinic Doctor recorded metrics.

Clinic Doctor helps identify:

* slow endpoints
* event loop delay
* high CPU usage
* server lag

---

## Clinic Flame

Used for CPU-level profiling.

Command:

```bash
npx clinic flame -- node server.js
```

Flame graphs visually show which functions consume the most CPU time.

In this repository, intentionally blocking loops were used to observe:

* CPU spikes
* event loop blocking
* request delays
* throughput degradation

---

# Pino Logging

![Pino](https://github.com/100NikhilBro/nodejs-scaling-lab/blob/main/Diagram/Pino.png)

## Explanation

Pino is a fast production-grade logger for Node.js.

Instead of relying on `console.log`, structured logging was explored using:

```bash
npm i pino
```

Basic setup:

```js
const pino = require('pino');
const logger = pino();

logger.info('Server started');
logger.error('Database failed');
```

Additional tools explored:

## pino-pretty

Improves readability of logs during development.

Installation:

```bash
npm i pino-pretty
```

Usage:

```bash
node server.js | pino-pretty
```

---

## pino-http

Adds request-level logging.

Installation:

```bash
npm i pino-http
```

This was used to monitor:

* request timing
* status codes
* request metadata
* response duration

---

# Git Hooks, Husky, and ESLint Workflow

![Git Hooks](https://github.com/100NikhilBro/nodejs-scaling-lab/blob/main/Diagram/GitHooks_Husky_Eslint.png)

## Explanation

This repository also explored developer tooling workflows.

ESLint was used to enforce code quality and detect common JavaScript issues.

Husky was configured to run ESLint automatically before commits.

Workflow:

1. developer writes code
2. git commit is triggered
3. Husky executes the pre-commit hook
4. ESLint checks the codebase
5. if linting fails, commit is blocked
6. after fixing errors, commit succeeds

This helps maintain consistent code quality inside the repository.

Example pre-commit command:

```bash
npx eslint .
```

---

# Key Learnings

* Node.js event loop blocking drastically affects throughput
* CPU-intensive operations increase latency
* profiling tools help detect bottlenecks
* PM2 improves process management and clustering
* NGINX enables reverse proxying and load balancing
* Docker simplifies environment setup and scaling
* structured logging improves observability
* developer tooling improves workflow reliability

---

# Project Setup

## Clone Repository

```bash
git clone https://github.com/100NikhilBro/nodejs-scaling-lab.git
```

---

## Install Dependencies

```bash
npm install
```

---

## Run Node.js Server

```bash
node server.js
```

---

## Run with PM2

```bash
npx pm2 start server.js
```

Cluster mode:

```bash
npx pm2 start server.js -i max
```

---

## Run Docker Environment

```bash
docker compose up --build
```

Stop containers:

```bash
docker compose down
```

---

## Run Benchmark Tests

```bash
npx autocannon -c 200 -d 10 http://localhost:8080
```

---

## Run Clinic Doctor

```bash
npx clinic doctor -- node server.js
```

---

## Run Clinic Flame

```bash
npx clinic flame -- node server.js
```

---

## Run ESLint

```bash
npx eslint .
```

---

# Conclusion

This repository was created to explore how backend systems behave under load and how common Node.js infrastructure tools work together.

The focus was on experimentation, profiling, scaling, observability, and backend engineering workflows rather than building a feature-heavy application.

Maintained by Nikhil Gupta .
