# Welcome to kursinfo-api 👋

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg?cacheSeconds=2592000)
![Prerequisite](https://img.shields.io/badge/node-18-blue.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

## Introduction

The course information project (KIP) is an initiative at KTH that was launched in 2018 to improve the quality and availability of information about KTH:s courses. The background to the project is, among other things, that it was difficult for the student to find information about the courses and even more difficult to compare information about several courses. The reason for the problems is scattered course information in several places and that there is no uniformity or assigned places for the course information. The project takes measures to consolidate course information into two locations and to present the information in a manner that is uniform for KTH. The student should find the right information about the course, depending on their needs. The result of the project is a public course site where the correct course information is collected and presented uniformly. Also, a tool is developed for teachers to enter and publish course information. Eventually, this will lead to the student making better decisions based on their needs, and it will also reduce the burden on teachers and administration regarding questions and support for the student.

Kursinfo-api is a microservice to save information on course level, such as short description and image to a database. It accepts data from the kursinfo admin pages "Administrate About course information" ([kursinfo-admin-web](https://github.com/KTH/kursinfo-admin-web)) and serves this data to the public view of:

- "Before choosing course" ([kursinfo-web](https://github.com/KTH/kursinfo-web))
- To show course memo information ([kurs-pm-web](https://github.com/KTH/kurs-pm-web))
- To show in preview mode in course memo data admin web ([kurs-pm-data-admin-web](https://github.com/KTH/kurs-pm-data-admin-web))

It uses [Node.js](https://nodejs.org/), [Mongoose](https://mongoosejs.com/), `kth-node-mongo`, and is based on [node-api](https://github.com/KTH/node-api).

### 🏠 [Homepage](https://github.com/KTH/kursinfo-api)

## Overview

Kursinfo-api is used to save data in a Azure Cosmos database by using `kth-node-mongo` to establish a connection to Azure (`server/database.js`). Before using it, the database and collection must be prepared in Azure because it will establish a connection to an existing database, and not try to create it from a code. `Mongoose` is used for creating models and saving data. To present a documentation [Swagger](https://swagger.io/) is used.

Admin and public pages uses different rights and keys to separate their behaviour (write/read).

Only admin pages may change API data while public pages can only read. Therefore while using `Swagger`, a developer should choose the correct api key, because some functions will not be shown in details.

### Connected Projects

- [kursinfo-web](https://github.com/KTH/kursinfo-web)
- [kursinfo-admin-web](https://github.com/KTH/kursinfo-admin-web)
- [kurs-pm-web](https://github.com/KTH/kurs-pm-web)
- [kurs-pm-data-admin-web](https://github.com/KTH/kurs-pm-data-admin-web)

### Related Projects

- [node-api](https://github.com/KTH/node-api)

## Prerequisites

- Node.js 18

### Secrets for Development

Secrets during local development are ALWAYS stored in a `.env`-file in the root of your project. This file should be in .gitignore. This file should be in .gitignore. MONGODB_URI is usually uses db in azure, but it also goes to use localhost mongo, it have a default value in `config/serverSettings.js`

These settings are also available in an `env.in` file.

## Prepare Database in Azure

1. Create database `admin` and advisible manually set Throughput: 400 (Shared)(Today it is 1000).
   Name of database will be used in a connection string.
2. In this database create a collection `courses-data`.
3. Change a connection string by adding name of database (`admin`) after port slash `[port]/` and as a search query after `?` as `authSource=admin`:

`mongodb://kursinfo-api-stage-mongodb-kthse:[password]==@kursinfo-api-stage-mongodb-kthse.documents.azure.com:[port]/admin?ssl=true&replicaSet=globaldb&authSource=admin`

More information can be found in Confluence: [Om kursen: Databas och API, connection string](https://confluence.sys.kth.se/confluence/x/a4_KC)

## For Development

### Install

```sh
npm install
```

### Usage

Start the service on [localhost:3001/api/kursinfo/swagger](http://localhost:3001/api/kursinfo/swagger).

```sh
npm run start-dev
```

## In Production

Secrets and docker-compose are located in Azure.

## Run tests

```sh
npm run test
```

## Monitor and Dashboards

### Application Status

[localhost:3001/api/kursinfo/\_monitor](http://localhost:3001/api/kursinfo/_monitor)

### Branch Information

[localhost:3001/api/kursinfo/\_about](http://localhost:3001/api/kursinfo/_about)

### Application Insights

To see more detailed behaviour in project, use `Application Insights`, e.g., `kursinfo-web-stage-application-insights-kthse`.

## Use 🐳

Copy `docker-compose.yml.in` to `docker-compose.yml` and make necessary changes, if any.

```sh
docker-compose up
```

## Deploy to REF

The deploy to REF is handled automatically after code is merged into master. The application secrets are picked from the azure keyvault for kursinfo-api-ref.

The deployment process is described in [Release to production](https://confluence.sys.kth.se/confluence/x/xIjCCg).

## Author

👤 **KTH**

- Website: https://kth.github.io/
- Github: [@KTH](https://github.com/KTH)
