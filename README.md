<div style="display: flex; align-items: center; justify-content: center">
<p align="center">
<img src="assets/readme_logo.png" width="500" alt="Nest Logo" />

</div>

<h1>MegaK Head Hunter - backend v1
 </h1>

---

Project Head Hunter is a final bonus stage of 1 year Full Stack JS Bootcamp.
The application brings together all knowledge and technologies which we were learning throughout this time.
Application is created to connect software developer students with recruiters through admin supervision. Main functionalities of the app:

-  mass load number of students from csv file
-  mass load number of recruiter from csv file
-  displaying all user, student, recruiters and managing them from admin account
-  email account activation (security)
-  reset password functionality through email token (security)
-  CRON for managing overdue interviews
-  student access to complete and maintain up-to-date detailed Portfolio/CV
-  protected role guards on backend (security)
-  protected routes by roles on front-end (security)
-  recruiter can see all active and available students
-  recruiter can add student to own interview list
-  recruiter can manage status on interview list
-  recruiter can filter students by names and all fields from special filter component

### Project DEMO week 4:

[![IMAGE ALT TEXT HERE](https://raw.githubusercontent.com/Fremen1990/head-hunter-frontend/develop/public/assets/demo_2.png)](https://youtu.be/TStajdI8jhw)

## Tech Stack:

### - NestJS <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="25" alt="Nest Logo" /></a>

### - TypeScript <img src="https://www.devthomas.pl/static/media/typescript.3de182d2.svg" width="25" />

### MySQL <img src="https://thepiguy.altervista.org/wp-content/uploads/2017/06/mysql-logo.jpg" width="50" />

### TypeORM <img src="https://avatars.githubusercontent.com/u/20165699?s=200&v=4" width="25" />

### Swagger <img src="https://www.scottbrady91.com/img/logos/swagger-banner.png" width="50" />

### Docker <img src="https://uncommonsolutions.com/wp-content/uploads/2018/12/Microsoft-Docker-logo.png" width="50" />

<br/>

---

### Additional packages:

Dep:

-  class-transformer
-  class-validator
-  handlebars
-  multer
-  nanoid
-  mysql2
-  nodemailer
-  papaparse
-  passport
-  passport-jwt
-  reflect-metadata
-  typeorm

Dev:

-  compodoc
-  faker-js
-  husky
-  prettier
-  lint-staged
-  swagger-ui-express

<br/>

---

## Docker container:

` docker run -p 3000:8080 head-hunter-backend-docerized`

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
