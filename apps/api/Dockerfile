FROM node:20-alpine AS base
WORKDIR /app
COPY package.json pnpm-lock.yaml* package-lock.json* yarn.lock* ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile || pnpm install
COPY . .
RUN pnpm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=base /app .
CMD ["node", "dist/main.js"]
