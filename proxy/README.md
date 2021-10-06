Authenticating Proxy
====================

This folder contains the resources needed to stand up an authenticating proxy based on an OAuth2/OIDC provider.

Dex
---

The OAuth2/OIDC provider is a Dex Docker image run with a configuration file. It is backed by a MySQL database. 

Dex documentation is at https://dexidp.io/

oauth2-proxy
------------

The authenticating proxy is an oauth2-proxy Docker image built from source run with a configuration file. It uses encrypted session cookies to store state. The image is built from source solely to include a self-signed certificate in ca-certificates.crt. If you don't need to use a self-signed certificate for communicated between oauth2-proxy and dex, you may use the standard image: quay.io/oauth2-proxy/oauth2-proxy .

oauth2-proxy documentation is at https://oauth2-proxy.github.io/oauth2-proxy/

Diagram
-------

The proxy/docker-compose.yml will stand up a stack including the pink hosts (labeled "Linux Container") in the diagram below.

<img src="../assets/2021-10-05_authenticating-proxy.png" alt="diagram" width="500"/>



How To
======

### Create an oauth2-proxy image that trusts the self-signed cert in config:

`docker build -t lednicky/oauth2-proxy -f ./oauth2-proxy/oauth2-proxy-Dockerfile .`

### Stand up a proxy environment for testing:

`docker-compose up -d`

### After running docker-compose stack, view logs:

`docker-compose logs`

`docker-compose logs oauth2-proxy`

`docker-compose logs dex`

### Tail the logs:

`docker-compose logs -f`

`docker-compose logs oauth2-proxy -f`

`docker-compose logs dex -f`


To get a shell on the mysql container, for example, run this command:

`docker exec -it dex-sql sh`



 