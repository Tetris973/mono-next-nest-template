---
description: This guide provides detailed instructions for using Docker in your development environment.
sidebar_position: 2
---

# Setup Docker for Development

This guide provides detailed instructions for using Docker in your development environment.

## Starting Docker Compose

From the root of the project directory, run:

```bash
pnpm compose:dev
```

:::info
This command starts the following services:
- PostgreSQL database
- pgAdmin (web-based database management tool)
:::

## Accessing pgAdmin

1. Open your web browser and navigate to `http://localhost:5050`
2. Login with the following credentials:
   ```
   Email: admin@admin.com
   Password: root
   ```

## Connecting to the PostgreSQL Database in pgAdmin

<details>
<summary>Step-by-step instructions</summary>

1. In the pgAdmin interface, right-click on "Servers" in the left sidebar.
2. Select "Register" > "Server".
3. In the "General" tab, give your server a name (e.g., "Local Development").
4. Switch to the "Connection" tab and enter the following details:
   ```
   Host name/address: local_pgdb
   Port: 5432
   Maintenance database: postgres
   Username: admin
   Password: root
   ```
5. Click "Save".

</details>

:::info
We use `local_pgdb` as the host name because PostgreSQL and pgAdmin are running in separate Docker containers. The containers are on the same Docker network, so we use the container name as defined in the Docker Compose file to connect between them.
:::

## Modifying Docker Compose Configuration

The database and pgAdmin configurations are defined in the `docker/development/docker-compose.yml` file. 

:::caution
You can modify these settings as needed for your development environment. Be careful when changing configuration to ensure all services can still communicate properly.
:::