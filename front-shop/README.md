# Front

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.5.


## Development server

Run npm run start for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
Run npm run start:https to run an https server, it is required for service use in this app
You will need to generate cert file and then import to certificates/
run $ which openssl if it return nothing install openssl on your os
then run $ openssl req -x509 -sha256 -nodes -newkey rsa:2048 -days 365 -keyout localhost.key -out localhost.crt

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
