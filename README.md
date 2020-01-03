# Authentiq
<img width="200px" src="https://github.com/SayidHosseini/AuthenticationService/blob/master/logo.png" align="right" />

[![license_badge](https://img.shields.io/github/license/SayidHosseini/authentiq.svg)](https://github.com/SayidHosseini/authentiq/blob/master/LICENSE)
[![version](https://images.microbadger.com/badges/version/sayid/authentiq:1.0.svg)](https://hub.docker.com/r/sayid/authentiq/)
[![docker_build_badge](https://img.shields.io/docker/cloud/automated/sayid/authentiq.svg)](https://hub.docker.com/r/sayid/authentiq/)
[![docker_image_badge](https://images.microbadger.com/badges/image/sayid/authentiq.svg)](https://hub.docker.com/r/sayid/authentiq/)
[![docker_pulls_badge](https://img.shields.io/docker/pulls/sayid/authentiq.svg)](https://hub.docker.com/r/sayid/authentiq/)

This is a RESTful Authentication Service written in Node.js on express.js framework powered by MongoDB. It is intended that the developer use this as a module (microservice) in a project; rather than a standalone service since it is only a mean of authentication. That being said, if you plan to develop a service that includes authentication, it might be a good idea to have a head start and build on top of this project instead of starting one from scratch.

API Reference is provided in the [wiki](https://github.com/SayidHosseini/authentiq/wiki) pages.

<table>
      <tr><td valign="baseline"> :warning: </td><td> <strong>Authentiq</strong> provides <code>JWT</code> for <em>authentication</em> and <em>session management</em>. Currently, we do <strong>not</strong> generate unique key pairs for each new environment (this feature will be available soon). If you'd like to deploy this project in a production environment, it is very important to generate your own <em>public</em> / <em>private</em> key pair. The generated key pair should be placed in <code>src/jwt/</code> with the names <code>public.key</code> and <code>private.key</code>. </td></tr>
</table>


## Setting up As a Service
In order to run this as a service and probably develop on top of it, you'll need a to do the followings:

* Install https://nodejs.org/en/[node.js] and https://www.mongodb.com/[mongoDB]
* Clone the repository and `cd` to the cloned repository
* Set environment variable `DB` to the full URI of your mongo database or modify the `dbURL` parameter in `config/config.json` (first one overrides the second)
* To install dependency packages, run `npm install`
* To run the application for development purposes, run `npm run dev` or `nodemon`
* To run it for production you may run `npm start`

<table>
    <td valign="baseline">:triangular_flag_on_post:</td>
    <td>Running <code>npm start</code> will only run your application; it will not relaunch it in the case that it crashes. To do that, you may use <a href="https://www.npmjs.com/package/pm2">PM2</a> or <a href="https://www.npmjs.com/package/forever">Forever</a> or any other package that provides this feature, in order to sustain availability.</td>
</table>

## Setting up As a Microservice
If you want to run the module as a containerize microservice, you'll need to install [Docker](https://www.docker.com).

* In order to use this as a microservice in your project, you'll need a MongoDB container with the name `db`. This is the name that should be resolved to the IP address of the mongoDB container. If you'd like to change that, you'll need to modify the `dbURL` parameter in `config/config.json`, accordingly. 
* We provide a `docker-compose.yml` file that includes everything needed to launch the system. You may use either of `docker-compose` or `docker swarm` to setup the system for production easily! 
* Although the Dockerfile has been provided, **you do not need to make your own copy of the image**, if you do not need to modify the source. The latest version for *Linux/amd64* is always built [automatically](https://docs.docker.com/docker-hub/builds/) and pushed to the [DockerHub repository](https://hub.docker.com/r/sayid/authentiq). It is addressable with the `latest` tag `sayid/authentiq`. Since there might be other versions in the future and latest would point to those new versions, we recommend that you use version explicit tags (for example `alpine-1` tag, which is currently the same as `latest`) to keep consistency.
* If you want to make your own copy of the image, clone it on the target platform and `cd` to the cloned repository. Then run `docker build -t $DOCKER_ACC/$DOCKER_REPO:$IMG_TAG .` to build the image locally. Then, you may push it to [DockerHub](https://docs.docker.com/docker-hub/repos/) after building is complete.
* If you are planning to use this microservice in a production environment, generate your own key pair, as noted above. Probably, you'll need to create your own image, as well.
* If you need to store extra information e.g. name or any other user related info, it is advised to store those information in another module (microservice) of your system and keep this container intact and solely for the purpose of authentication and session management.

<table>
    <td valign="baseline">:information_source:</td>
    <td>The default admin user of the system is created on the first run with the following credentials (<code>admin@authentiq.com:admin1234</code>). <strong><em>Don't forget to change its password, if you are going to use authentiq in production environment!</em></strong></td>
</table>

## License
Developed by **_S. Saeed Hosseini_** and **_Mohammad Moradi_**, released under **MIT** License.