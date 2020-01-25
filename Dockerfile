# Multistage build 
FROM alpine:3 AS builder
WORKDIR /app
COPY . .
RUN apk add --update --no-cache npm \
    && npm ci --only=production


# see hooks/build and hooks/.config
ARG BASE_IMAGE_PREFIX
FROM ${BASE_IMAGE_PREFIX}alpine:3

# see hooks/post_checkout
ARG ARCH
COPY qemu-${ARCH}-static /usr/bin

LABEL maintainer="S. Saeid Hosseini <sayidhosseini@hotmail.com>"

RUN apk add --update --no-cache nodejs curl

WORKDIR /usr/src/authentiq
COPY --from=builder /app/ ./

EXPOSE 2000
CMD ["node", "./bin/www"]