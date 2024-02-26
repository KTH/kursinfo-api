FROM node:18-alpine
LABEL maintainer="KTH StudAdm studadm.developers@kth.se"

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

RUN npm i -g jest

COPY ["tests/apiTests.test.js", "integration/tests/apiTests.test.js"]
COPY ["integration-jest.config.js", "integration-jest.config.js"]

CMD ["ash", "-c", "/wait && npx jest --config ./integration-jest.config.js"]