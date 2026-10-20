# Jobber

A freelance marketplace built as a microservices system. Learning project following the
Udemy course *Microservices with NodeJS, React, Typescript and Kubernetes*, using current
stable versions instead of the course's 2023 ones.

**Status:** local infrastructure is ready. Application code is starting under `microservices/`;
only the shared package (`9-jobber-shared`) has real code so far.

## Layout

| Folder | Purpose |
|:---|:---|
| `infra/docker/` | Local services: `compose.yaml`, `kibana.yml`, `.env.example` |
| `infra/k8s/` | Kubernetes manifests (empty) |
| `microservices/` | One folder per service; only `9-jobber-shared` has code so far |
| `frontend/` | React frontend (empty) |
| `mock_endpoints/` | `.http` files for trying the API (VS Code REST Client) |

## Prerequisites

- Docker Desktop for Linux (`docker context ls` should show `desktop-linux`).
- Node.js 24 LTS.
- About 8 GB of RAM for Docker Desktop (Settings, Resources). The default is tight once
  you add the apps.
- Internet on the first start (about 8 GB of images, plus Kibana's APM package).

## Start

```bash
cd infra/docker
cp .env.example .env      # first time only, then replace every "change-me"
docker compose up -d
docker compose ps         # wait until every service is "healthy"
```

Elasticsearch and Kibana take a minute or two longer. `elasticsearch-setup` shows as
*exited*, which is normal: it is a one-shot job that sets Kibana's login.

## Services

Reachable only from this machine. Logins are in `infra/docker/.env` (it starts with a
quick-access cheat sheet).

| Service | Port | Connect with | Used for |
|:---|:---|:---|:---|
| Redis | 6379 | `redis://localhost:6379` | Cache, Socket.IO adapter |
| MongoDB | 27017 | `mongodb://localhost:27017/<database>` | Users, gig, chat, order data |
| MySQL | 3306 | database `jobber_auth` | Auth data |
| PostgreSQL | 5432 | database `jobber_reviews` | Review data |
| RabbitMQ | 5672 | `amqp://<user>:<password>@localhost:5672` | Messaging |
| RabbitMQ UI | 15672 | http://localhost:15672 | Queue management |
| Elasticsearch | 9200 | `http://elastic:<password>@localhost:9200` | Gig search, logs |
| Kibana | 5601 | http://localhost:5601 (user `elastic`) | Dashboards, APM |

Redis and MongoDB have no password (acceptable for local use only).

## Commands

Run from `infra/docker`, or add `-f infra/docker/compose.yaml` from the project root.

| Task | Command |
|:---|:---|
| Start / stop (keeps data) | `docker compose up -d` / `docker compose down` |
| Stop and delete all data | `docker compose down -v` |
| Status and health | `docker compose ps` |
| Logs of one service | `docker compose logs -f <service>` |
| Restart one service | `docker compose restart <service>` |
| Check the file | `docker compose config -q` |

## Troubleshooting

- **"required variable is missing":** there is no `.env`. Run `cp .env.example .env`.
- **Port already in use:** stop the other program, or change the left-hand port number in
  `compose.yaml`.
- **Elasticsearch or Kibana keeps restarting:** Docker Desktop is out of memory. Raise it.
- **A changed password has no effect:** MySQL, PostgreSQL and RabbitMQ read their settings
  only on the first start. Run `docker compose down -v` and start again (deletes data).
- **Kibana is slow on its first start:** it is downloading the APM integration.

Data lives in Docker named volumes (`jobber_<service>_data`). Image versions are pinned.
Every service has a memory limit. Never commit `.env`.
