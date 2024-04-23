FROM node:20-slim

WORKDIR /app

COPY dist/apps/velero-ui .

RUN yarn --pure-lockfile

RUN chown -R node:node .
USER node

ENV NODE_ENV production
ENV HOSTNAME "0.0.0.0"
ENV PORT 3000
ENV VELERO_NAMESPACE velero
ENV KUBE_CONFIG_PATH ""
ENV SECRET_PASSPHRASE "this is a secret passphrase"

ENV BASIC_AUTH_ENABLED=true

EXPOSE 3000

CMD ["node", "main.js"]
