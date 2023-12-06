![GitHub last commit](https://img.shields.io/github/last-commit/BestHappy90619/nginx-rtmp-server)
![Top language](https://img.shields.io/github/languages/top/BestHappy90619/nginx-rtmp-server)

# Video Streaming Server

Self-host your own **Amazon IVS** like service for cheap.

See a demo here - https://demo.streamplanet.tv/

## Installation

Download all the files first:

```shell
git clone https://github.com/BestHappy90619/NGINX-RTMP-server.git
```

Next, you need docker.

**Windows**  
If you are testing this from your local windows computer, download Docker from here:
https://docs.docker.com/docker-for-windows/install/

**Linux**  
On your linux machine, just run this command on your fresh box

```shell
bash <(wget -O - https://raw.githubusercontent.com/BestHappy90619/NGINX-RTMP-server/master/install.sh)
```

Once installed, run this command inside the folder with the files:

```shell
docker-compose up --build -d
```

and that is it!

You could then login to any of the two "services" using:

```shell
docker exec -it rtmp /bin/bash
docker exec -it api_server /bin/sh
```

## Monitoring

```shell
docker logs rtmp --tail 100
docker logs api_server --tail 100
```

## Caddy

Useful for providing automatic HTTPS - one-click installation:

```shell
curl -sS https://webi.sh/caddy | sh
```

Modify `.env` and `etc/Caddyfile` accordingly, and then run:

```shell
caddy run --config ./etc/Caddyfile
```
