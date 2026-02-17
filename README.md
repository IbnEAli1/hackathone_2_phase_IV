# K8s Web App

A full-stack web application with Kubernetes deployment manifests, Dockerfiles, and docker-compose for local development.

## Project Structure

```
├── backend/                  # Node.js Express API
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       └── server.js
├── frontend/                 # Nginx-served static frontend
│   ├── Dockerfile
│   ├── index.html
│   └── nginx.conf
├── k8s/                      # Kubernetes manifests
│   ├── namespace.yaml
│   ├── ingress.yaml
│   ├── kustomization.yaml
│   ├── frontend/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   ├── configmap.yaml
│   │   └── hpa.yaml
│   └── backend/
│       ├── deployment.yaml
│       ├── service.yaml
│       ├── configmap.yaml
│       ├── secret.yaml
│       └── hpa.yaml
└── docker-compose.yaml       # Local development
```

## API Endpoints

| Method | Route         | Description                        |
|--------|---------------|------------------------------------|
| GET    | `/healthz`    | Health check (used by K8s probes)  |
| GET    | `/api/info`   | App info and serving pod hostname  |
| GET    | `/api/items`  | List sample items                  |
| POST   | `/api/items`  | Create item (`{ name, description }`) |

## Quick Start (Docker Compose)

```bash
docker-compose up --build
```

- Frontend: http://localhost:8080
- Backend: http://localhost:3000

## Kubernetes Deployment

### Prerequisites

- Docker Desktop with Kubernetes enabled, or any running K8s cluster
- `kubectl` CLI

### Build and Deploy

```bash
# Build images
docker build -t webapp-backend ./backend
docker build -t webapp-frontend ./frontend

# Deploy to Kubernetes
kubectl apply -k k8s/

# Check status
kubectl get all -n webapp
```

### Access the App

```bash
kubectl port-forward -n webapp svc/frontend 8080:80
```

Then open http://localhost:8080

### Useful Commands

```bash
# View logs
kubectl logs -n webapp -l app.kubernetes.io/name=backend
kubectl logs -n webapp -l app.kubernetes.io/name=frontend

# Check autoscaler status
kubectl get hpa -n webapp

# Tear down
kubectl delete -k k8s/
```

## K8s Resources Included

- **Namespace** — `webapp` for resource isolation
- **Deployments** — 2 replicas each for frontend and backend
- **Services** — ClusterIP for internal communication
- **Ingress** — HTTP routing (`/` to frontend, `/api` to backend)
- **ConfigMaps** — Nginx config and backend environment variables
- **Secrets** — Database URL, JWT secret, API key (replace before deploying)
- **HPA** — Autoscaling based on CPU and memory utilization

## Configuration

Before deploying to a real cluster, update the placeholder values in `k8s/backend/secret.yaml`:

```yaml
stringData:
  DATABASE_URL: "your-real-database-url"
  JWT_SECRET: "your-real-jwt-secret"
  API_KEY: "your-real-api-key"
```
