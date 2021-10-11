# docker run --rm -it --name go-restful golang:1.16-buster
FROM golang:1.16-buster AS builder
    #get and build oauth2-proxy binary

    ## https://www.arp242.net/static-go.html
    # RUN go get -ldflags="-extldflags -static" github.com/oauth2-proxy/oauth2-proxy/v7

    ## https://gist.github.com/PurpleBooth/ec81bad0a7b56ac767e0da09840f835a
    RUN go get -ldflags "-linkmode external -extldflags -static" -a github.com/oauth2-proxy/oauth2-proxy/v7

# Copy binary to alpine
FROM alpine:3.14

    # COPY nsswitch.conf /etc/nsswitch.conf
    RUN echo "hosts: files dns" >> /etc/nsswitch.conf

    COPY --from=builder /go/bin/oauth2-proxy /bin/oauth2-proxy

    RUN touch /etc/ssl/private/jwt_signing_key.pem

    #cat local cert into the trusted CA store
    COPY ./config/lednicky.localhost.crt /etc/ssl/certs
    RUN cat /etc/ssl/certs/lednicky.localhost.crt >> /etc/ssl/certs/ca-certificates.crt

    USER 2000:2000

    ENTRYPOINT ["/bin/oauth2-proxy"]
