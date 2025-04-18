FROM node:alpine as builder
WORKDIR /app
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm ci
COPY . .
RUN npm run build

FROM node:alpine as runner
COPY --from=builder /app/dist /app/dist
WORKDIR /app
CMD ["node", "dist/server/server.cjs"]

EXPOSE 3000