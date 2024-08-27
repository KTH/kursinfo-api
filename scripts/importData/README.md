# Kursinfo-api scripts

## Secrets

The scripts connects to a MongoDB and the connection string and whether SSL should be used have to be specified in an `.env`-file located in the ./script folder. An example file can be found [here](./.env.in)

## Data location

You can put the file you want to import into the `./data` folder, it is ignored by git.

## Requirements

The scripts are dependent on the package `csv-parser`, which is not installed as part of kursinfo-api, because this script will only be used in one-off situations.

The scripts can only be run in node version 20 or higher, because of the `--env` parameter used to specify the environmental file.

## Running locally

It is recommended to run the scripts first against a local MongoDB, then REF, then Prod (if that is the requirement).

To spin up a local MongoDB, one can use the docker-compose file [docker-compose-local-mongo.yml](../../docker-compose-local-mongo.yml).

You have to specify a user/password before starting it up.

From the project root:

```sh
docker compose -f docker-compose-local-mongo.yml up -d
```

## Unit tests

To run the unit tests for the scripts, you can run the following command from the project root:

```sh
npx jest --config ./scripts/scripts-jest.config.js
```

## Script to import courseDisposition and supplementaryInfo directly into MongoDB

This script can be used to import a CSV containing courseInfo. It does not clean `NULL` values.

### Data

The script expects a CSV file

- with a semicolon `;` as separator.
- without headers
- with 5 columns specified in the function [readCSV](./index.js)

```js
headers: [
            'courseCode',
            'courseDisposition_sv',
            'courseDisposition_en',
            'supplementaryInfo_sv',
            'supplementaryInfo_en',
          ],
```

### Usage

Call `importCourseInfoAndSupplementaryInfo.sh` and pass the path to the file you want to import.

IMPORTANT: Call it from the project root!

```sh
./scripts/importCourseInfoAndSupplementaryInfo.sh ./data/2024-03-07-test.csv
```

## Script to import supplementaryInfo directly into MongoB

This script can be used to import a CSV containing supplementaryInfo. It does clean `NULL` values.

### Data

The script expects a CSV file

- with a comma `,` as separator.
- without headers
- with the columns specified in the function [readCSV](./index2.js)

```js
headers: [
            'courseCode',
            'state',
            'title_sv',
            'valid_from_term',
            'validToTerm',
            'courseDisposition_sv',
            'courseDisposition_en',
            'supplementaryInfo_sv',
            'supplementaryInfo_en',
          ],
```

### Usage

Call `importSupplementaryInfo.sh` and pass the path to the file you want to import.

IMPORTANT: Call it from the project root!

```sh
./scripts/importSupplementaryInfo.sh ./data/2024-03-07-test.csv
```

## Script to import recommendedPrerequisites directly into MongoB

This script can be used to import a CSV containing supplementaryInfo. It does clean `NULL` values.

### Data

The script expects a CSV file

- with a comma `,` as separator.
- without headers
- with the columns specified in the function [readCSV](./index3.js)

```js
headers: [
            'courseCode',
            'recommendedPrerequisites_sv',
            'recommendedPrerequisites_en',
          ],
```

### Usage

Call `importRecommendedPrerequisites.sh` and pass the path to the file you want to import.

IMPORTANT: Call it from the project root!

```sh
./scripts/importRecommendedPrerequisites.sh ./data/2024-03-07-test.csv
```
