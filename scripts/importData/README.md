# Kursinfo-api scripts

## Script to import data directly into MongoDB

This script can be used to import a CSV containing courseInfo.

### Secrets

The script connects to a MongoDB and the connection string and whether SSL should be used have to be specified in an `.env`-file located in the ./script folder. An example file can be found [here](./.env.in)

### Data

You can put the file you want to import into the `./data` folder, it is ignored by git. The script expects a CSV file

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

The script is dependent on the package `csv-parser`, which is not installed as part of kursinfo-api, because this script will only be used in one-off situations.

The script can only be run in node version 20 or higher, because of the `--env` parameter used to specify the environmental file.

Call `importData.sh` and pass the path to the file you want to import.

IMPORTANT: Call it from the project root!

```sh
./scripts/importData.sh ./data/2024-03-07-test.csv
```

### Running locally

It is recommended to run the script first against a local MongoDB, then REF, then Prod (if that is the requirement).

To spin up a local MongoDB, one can use the docker-compose file [docker-compose-local-mongo.yml](../../docker-compose-local-mongo.yml)

From the project root:

```sh
docker compose -f docker-compose-local-mongo.yml up -d
```

### Unit tests

To run the unit tests for the `importData`-script, you can run the following command from the project root:

```sh
npx jest --config ./scripts/scripts-jest.config.js
```
