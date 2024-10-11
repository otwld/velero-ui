FROM node:22-slim

WORKDIR /app

COPY dist/apps/velero-ui .

RUN npm ci

RUN chown -R node:node .
USER node

ENV NODE_ENV production
ENV HOSTNAME "0.0.0.0"
ENV PORT 3000
ENV VELERO_NAMESPACE velero
ENV AUTH_SECRET_PASSPHRASE "this is not a secret passphrase"

ENV BASIC_AUTH_ENABLED=true

EXPOSE 3000

CMD ["node", "main.js"]
