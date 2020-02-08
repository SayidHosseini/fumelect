# Authentiq

[![license_badge](https://img.shields.io/github/license/SayidHosseini/authentiq.svg)](https://github.com/SayidHosseini/authentiq/blob/master/LICENSE)
[![build_status_badge](https://img.shields.io/docker/cloud/build/sayid/authentiq.svg)](https://hub.docker.com/r/sayid/authentiq/)
[![docker_build_badge](https://img.shields.io/docker/cloud/automated/sayid/authentiq.svg)](https://hub.docker.com/r/sayid/authentiq/)
[![docker_image_badge](https://images.microbadger.com/badges/image/sayid/authentiq.svg)](https://hub.docker.com/r/sayid/authentiq/)
[![docker_pulls_badge](https://img.shields.io/docker/pulls/sayid/authentiq.svg)](https://hub.docker.com/r/sayid/authentiq/)

<img width="200px" src="https://github.com/SayidHosseini/AuthenticationService/blob/master/logo.png" align="right" />

This is a RESTful Authentication Service written in Node.js on express.js framework powered by MongoDB. It is intended that the developer use this as a module (microservice) in a project; rather than a standalone service since it is only a mean of authentication. That being said, if you plan to develop a service that includes authentication, it might be a good idea to have a head start and build on top of this project instead of starting one from scratch.

API Reference is provided in the [wiki](https://github.com/SayidHosseini/authentiq/wiki) pages.

</br>
<table>
    <tr>
        <td valign="baseline">:information_source:</td>
        <td>A set of <em>environment variables</em> have been introduced to control some configuration and parameters in the application. Feel free to explore them in the <code>.env</code> and <code>docker-compose.yml</code> files. Note that <em>environment variables</em> <strong>take precedence</strong> over config parameters in <code>config/config.js</code> file. Also, note that you only need to modify the <code>.env</code> file for the cases of <code>docker-compose</code> and <code>docker stack deploy</code> (no need to change the <code>docker-compose.yml</code> file)</td>
    </tr>
</table>
<table>
    <tr>
        <td valign="baseline"> :warning: </td><td> <strong>Authentiq</strong> provides <code>JWT</code> for <em>authentication</em> and <em>session management</em>. Currently, we do <strong>not</strong> generate unique key pairs for each new environment (this feature will be available soon). If you'd like to deploy this project in a production environment, it is very important to generate your own <em>public</em> / <em>private</em> key pair. The generated key pair should be placed in <code>keys</code> directory with the names <code>public.key</code> and <code>private.key</code>. </td>
    </tr>
</table>

## Setting up As a Service

In order to run this as a service and probably develop on top of it, you'll need to do the followings:

- Install https://nodejs.org/en/[node.js] and https://www.mongodb.com/[mongoDB].
- Clone the repository and `cd` to the cloned repository.
- Set proper environment variables for your Mongo database (alternatively, you may modify relevant parameters in `config/config.json`).
- Optionally, to enable *Verify User* and *Forgot Password* capabilities, set proper environment variables.
- To install dependency packages, run `npm install`.
- To run the application for development purposes, run `npm run dev` or `nodemon`.
- To run for production set `NODE_ENV` to `production` and run `npm start` (alternatively, you may use `docker-compose`; explained later on)

<table>
    <tr>
        <td valign="baseline">:triangular_flag_on_post:</td>
        <td>Running <code>npm start</code> will only run your application; it will not relaunch it in the case that it crashes. To do that, you may use <a href="https://www.npmjs.com/package/pm2">PM2</a> or <a href="https://www.npmjs.com/package/forever">Forever</a> or any other package that provides this feature, in order to sustain availability.</td>
    </tr>
</table>

## Setting up As a Microservice

If you want to run the module as a containerize microservice, you'll need to do the followings:

- Install [Docker](https://www.docker.com).
- The application is built [automatically](https://docs.docker.com/docker-hub/builds/) by _DockerHub_ for the following architectures: `x86_64`, `arm32v6`, `arm32v7`, `arm64v8` (aka `aarch64`) on **alpine**. Images are available on [_DockerHub repository_](https://hub.docker.com/r/sayid/authentiq) and can be pulled with `sayid/authentiq`. They are tested on normal `x86_64` machines as well as `RaspberryPi zero w`, `RaspberryPi 2B`, `RaspberryPi 3B`, `RaspberryPi 4B` and the `ASUS Tinkerboard`.
- If you want to make your own copy of the image, clone it and `cd` to the cloned repository. Then run `docker build -t $DOCKER_ACC/$DOCKER_REPO:$IMG_TAG .` to build the image locally. Another option is to fork the repo and enable [autobuild](https://docs.docker.com/docker-hub/builds/) on DockerHub.
- Since there might be other versions in the future and latest would point to those new versions, we recommend that you use version explicit tags (for example `alpine-1` tag, which is currently the same as `latest`) to keep consistency.
- In order to use this as a microservice in your project, you'll need a MongoDB container with the name `authentiq-db`. This is the name that should be resolved to the IP address of the MongoDB container. If you'd like to change that, you'll need to modify the proper environment variables.
- We provide a `docker-compose.yml` file that includes everything needed to launch the system. You may use either of `docker-compose` or `docker stack deploy` to setup the system for production easily! Override the default parameters by setting *environment variables* in the `.env` file.
- If you are planning to use this microservice in a production environment, generate your own key pair, as noted above. Probably, you'll need to create your own image, as well.
- If you need to store extra information e.g. name or any other user related info, it is advised to store those information in another module (microservice) of your system and keep this container intact and solely for the purpose of authentication and session management.

<table>
    <tr>
        <td valign="baseline">:information_source:</td>
        <td>The <em>Super Admin</em> user of the system is created after the application is started with the following credentials (<code>admin@authentiq.com:admin1234</code>). Override it by setting proper <em>environment variables</em>. Note that the <em>Super Admin</em> user is verified by default!</td>
    </tr>
</table>

## License

Developed by **_S. Saeed Hosseini_** and **_Mohammad Moradi_**, released under **MIT** License.
