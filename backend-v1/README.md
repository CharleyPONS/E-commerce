# backend-v1

✨ Add a little magic ✨

> Build in TSED bringing typeorm plugin for interaction with PostgreSQL

> Using stripes with custom payments flow validate in server side

> Using stripes CLI and webhook 

> Using JWT token for authentication and bcrypt for password security

> Using nodemailer and express-handlebars

> Using Oauth 2 connection for SSO with facebook

See [Ts.ED](https://tsed.io) project for more information.

See [Strips](https://stripe.com/docs/api) for more information.

See [StripsCLI](https://github.com/stripe/stripe-cli.git) for more information

See [TypeORM](https://typeorm.io/) for more information.

See [NodeMailer](https://nodemailer.com/) for more information.

See [express-handlebars](https://www.npmjs.com/package/express-handlebars) for more information.

See [facebook](https://developers.facebook.com/apps/) for more information.


## Install

First of all, assuming you have all the environment ready on your physical server, let's get started
(node, nvm, etc)

```bash
npm install
```

## Getting started

Add this config to your .env
 
```bash
#Main
PORT= port you wanna use (3000 as default if not set)
NODE_ENV= development
CORS_ORIGIN= your localhost + webhook
CONNECTION_NAME=connection name
CONFIGURATION_TYPE= type config

# Postgres
POSTGRES_URL=::1
POSTGRES_DB=db name
POSTGRES_USER= super user
POSTGRES_PASSWORD= password

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
SECRET_KEY_WEBHOOK= secret key for webhook
PROTOCOL_HTTP= http | https
EMAIL= your email for receipt payment
STATEMENT_DESCRIPTOR= Statement for bank transfer

#Oauth
FACEBOOK_APP_ID=your app id
FACEBOOK_APP_SECRET=your secret app

```

```bash
npm run docs
npm run watch
```
## Certificate

Then You will need to generate cert file and then import to certificates/

$ which openssl 

If it return nothing install openssl on your os

$ openssl req -x509 -sha256 -nodes -newkey rsa:2048 -days 365 -keyout localhost.key -out localhost.crt

Put the two file in the folder

##Tunnel

If you wanna test webhook in localhost you need to expose your localserver on the internet

Go to [ngrok](https://dashboard.ngrok.com/get-started/setup)
Follow the insctruction and then expose the url forworarding your localhost on stripe config webhook 
## Usages

Don't change this code file

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=src/Server.ts) -->
This content will be dynamically replaced with code from the file
<!-- AUTO-GENERATED-CONTENT:END -->

