FROM --platform=linux/amd64 node:20-slim AS base

FROM base AS builder

WORKDIR /app

RUN yarn global add nx@latest

COPY package.json ./

RUN yarn --pure-lockfile

COPY . .

RUN nx build velero-ui-api && nx build velero-ui

FROM base AS runtime

WORKDIR /app

COPY --from=builder /app/dist/apps/velero-ui ./
COPY --from=builder /app/node_modules ./node_modules

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