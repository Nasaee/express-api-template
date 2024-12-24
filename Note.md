# Build Docker Containers

```bash
docker-compose build
```

# Start Docker Containers in Detached Mode

```bash
docker-compose up -d
```

# Verify Running Containers

```bash
docker ps
```

# Check Logs

```bash
docker-compose logs -f api
```

# Check PM2 Process Inside Container

```bash
docker exec -it express-api pm2 list
```

# Update Docker Container (after install new dependency for rebuild)

```bash
docker-compose exec api npm install
```

- Restart the API Service (Optional)

```bash
docker-compose restart api
```

# Verify Dependencies

After installation, you can check the installed dependencies:

```bash
docker-compose exec api npm list
```

**_ One-Liner for Dependency Installation in _**

## Development Mode:

```bash
npm install <package-name> && docker-compose exec api npm install
```

## For Production:

```bash
npm install <package-name> && docker-compose build api && docker-compose up -d
```

## To Build and Start Container

```bash
docker-compose build --no-cache
docker-compose up -d
```

unexpiredToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NmFkMGY0ZjRmZTcwNzZlNjUzNGVmZSIsImlhdCI6MTczNTA1MzU1N30.1NTUsWylQVOwhqhA-HlS2-f9zgDbl0rM9ezUBLujnyc"
