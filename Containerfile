# syntax=docker/dockerfile:1
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3005

# Copy prebuilt artifacts & dependencies
COPY package.json package-lock.json ./
COPY node_modules ./node_modules
COPY dist ./dist
COPY public ./public
COPY server.mjs ./server.mjs

EXPOSE 3005

CMD ["node", "server.mjs"]
