# see hooks/build and hooks/.config
ARG BASE_IMAGE_PREFIX
FROM ${BASE_IMAGE_PREFIX}alpine

# see hooks/post_checkout
ARG ARCH
COPY qemu-${ARCH}-static /usr/bin

RUN apk add --update npm

WORKDIR /usr/src/authentiq
COPY package*.json ./
RUN npm ci --only=production
COPY . .

EXPOSE 2000
CMD ["npm", "start"]