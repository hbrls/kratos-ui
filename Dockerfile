FROM node:12.16.3-buster AS builder

ENV ADBLOCK=true
ENV DISABLE_OPENCOLLECTIVE=true

RUN mkdir -p /var/src

COPY ./packages /var/src

RUN cd /var/src/kratos-ui-rsrc && npm install --production --no-optional --no-package-lock && \
    npm run build

RUN cd /var/src/kratos-ui && npm install --no-optional --no-package-lock && \
    npm run build

FROM node:12.16.3-alpine3.11
COPY --from=builder /var/src/kratos-ui /var/app

RUN cd /var/app && npm install --production --no-optional --no-package-lock

WORKDIR /var/app
EXPOSE 7001

CMD ["npm", "run", "start"]
