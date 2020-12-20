# backend-v1

✨ Add a little magic ✨

> Build in TSED bringing mongoose plugin for interaction with mongoDB
> Using stripes with custom payments flow validate in server side
> Using JWT token for authentication and bcrypt for password security
> Using nodemailer and express-handlebars

See [Ts.ED](https://tsed.io) project for more information.

See [Strips](https://stripe.com/docs/api) for more information.

See [Mongoose](https://mongoosejs.com/docs/middleware.html) for more information.

See [NodeMailer](https://nodemailer.com/) for more information.

See [express-handlebars](https://www.npmjs.com/package/express-handlebars) for more information.


## Install

First of all, assuming you have all the environment ready on your physical server, let's get started

```bash
npm install
```

## Getting started

You will need to add an .env file at the root of the project

```bash
#Main
PORT= port you wanna use (3000 as default if not set)
NODE_ENV= development
CORS_ORIGIN= your localhost

#db
CLUSTER_URL= your mongodb url (own server or cluster in the cloud)

#log
LOGGER_FILE= file path

#Jwt
JWT_KEY= secret key token for JWT
JWT_EXPIRES_MS= delay expiration token
NODE_ENV= development

#Nodemailer
SERVICE= your service
HOST_SMTP= your host
AUTH_USER= your host user
AUTH_PASSWORD= your host password

#Stripe
SECRET_KEY_DEVELOPMENT= your SK
SECRET_KEY_PRODUCTION= your SK
PROTOCOL_HTTP= http | https

```

```bash
npm run watch
npm run docs
npm run start
```
## Usages

Don't change this code file

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=src/Server.ts) -->
This content will be dynamically replaced with code from the file
<!-- AUTO-GENERATED-CONTENT:END -->

