# danielvdspoel.com

Personal portfolio site. Vue 3 + TypeScript + Vite, served by nginx in a container, deployed to Kubernetes.

## Tech stack

- Vue 3 (Composition API, `<script setup>`)
- TypeScript (`vue-tsc`)
- Vite
- Tailwind CSS v4
- Vue Router, Vue I18n
- Heroicons

## Local development

```sh
npm install
npm run dev          # http://localhost:5173
```

Other scripts:

```sh
npm run type-check
npm run lint
npm run format
npm run build
npm run preview
```

Requires Node `^20.19.0 || >=22.12.0`.

## Container image

The `Dockerfile` builds a multi-stage image: `npm run build` in a Node stage, output served by nginx (config in `nginx.conf`) on port 8080.

To build locally:

```sh
docker build -t portfolio:local .
docker run --rm -p 8080:8080 portfolio:local
```

`docker-compose.yml` is also available for local use.

## Deployment

Pushes to `main` are built by GitHub Actions (`.github/workflows/deploy.yml`), pushed to GitHub Container Registry as `ghcr.io/danielvdspoel/portfolio`, and rolled out via `kubectl set image` to the `portfolio` namespace.

Kubernetes manifests live in `k8s/`:

| File | Purpose |
| --- | --- |
| `deployment.yaml` | App Deployment (2 replicas, rolling, zero-downtime) |
| `service.yaml` | ClusterIP Service |
| `ingress.yaml` | Ingress (Traefik, four hostnames) |
| `deployer-rbac.yaml` | ServiceAccount + Role + RoleBinding for the CI deployer |

The nginx config is baked into the container image (see `Dockerfile` + `nginx.conf`), so there's no ConfigMap to manage.

## Cluster bootstrap

One-time setup on a fresh cluster:

```sh
kubectl create namespace portfolio
kubectl apply -f k8s/
```

Then create the two secrets that can't live in git (see below).

### Secret 1: `ghcr-secret` (image pull)

The deployment references a private image at `ghcr.io/danielvdspoel/portfolio`. The cluster needs a pull credential.

1. Create a GitHub PAT (classic) at https://github.com/settings/tokens with **`read:packages`** scope only. Long expiry recommended.
2. Create the pull secret:

```sh
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=DanielvdSpoel \
  --docker-password=<PAT> \
  --namespace=portfolio
```

### Secret 2: `KUBECONFIG` (GitHub Actions)

The deploy job needs a kubeconfig to reach the cluster. Don't upload your admin config — mint a scoped one for the `github-deployer` ServiceAccount defined in `k8s/deployer-rbac.yaml`.

Run this from a machine that already has admin `kubectl` access:

```sh
# Mint a long-lived token (1 year)
TOKEN=$(kubectl create token github-deployer -n portfolio --duration=8760h)

# Pull cluster info from current kubeconfig
CLUSTER_NAME=$(kubectl config view --minify -o jsonpath='{.clusters[0].name}')
CLUSTER_SERVER=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')
CLUSTER_CA=$(kubectl config view --minify --raw -o jsonpath='{.clusters[0].cluster.certificate-authority-data}')

# Build the kubeconfig
cat > /tmp/gh-kubeconfig.yaml <<EOF
apiVersion: v1
kind: Config
clusters:
  - name: ${CLUSTER_NAME}
    cluster:
      server: ${CLUSTER_SERVER}
      certificate-authority-data: ${CLUSTER_CA}
contexts:
  - name: github-deployer
    context:
      cluster: ${CLUSTER_NAME}
      namespace: portfolio
      user: github-deployer
current-context: github-deployer
users:
  - name: github-deployer
    user:
      token: ${TOKEN}
EOF

# Base64-encode for the GitHub secret
base64 -w0 /tmp/gh-kubeconfig.yaml
rm /tmp/gh-kubeconfig.yaml
```

Copy the base64 output into a new repository secret named `KUBECONFIG` at https://github.com/DanielvdSpoel/portfolio/settings/secrets/actions.

The token has a 1-year lifetime — set a calendar reminder to rotate by re-running the snippet above.

## Project layout

```
src/
  main.ts             # entry point
  App.vue             # root component
  router/             # Vue Router config
  assets/main.css     # Tailwind + global styles
k8s/                  # Kubernetes manifests
.github/workflows/    # CI/CD
Dockerfile            # multi-stage build → nginx
nginx.conf            # nginx server config
```

`@/` resolves to `/src/` in both Vite and TypeScript.
