# backend-v1

✨ Add a little magic ✨

> Build in TSED bringing mongoose plugin for interaction with mongoDB
> Using stripes 
> Using JWT token for authentication and bcrypt for password security

See [Ts.ED](https://tsed.io) project for more information.

## Getting started

First of all, assuming you have all the environment ready on your physical server, let's get started

```bash
npm install
```
You will need to add an .env file at the root of the project

CLUSTER_URL= your mongodb url (own server or cluster in the cloud)

LOGGER_FILE= file path

PORT= port you wanna use (3000 as default if not set)

JWT_KEY= secret key token for JWT

JWT_EXPIRES_MS= delay expiration token

NODE_ENV= development

```bash
npm run watch
npm run docs
npm run start
```


