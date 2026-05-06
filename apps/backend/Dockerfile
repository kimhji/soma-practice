FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY apps/backend/package.json apps/backend/package.json
RUN npm install --workspace apps/backend
COPY apps/backend apps/backend
RUN npm --workspace apps/backend run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY apps/backend/package.json apps/backend/package.json
RUN npm install --workspace apps/backend --omit=dev
COPY --from=build /app/apps/backend/dist apps/backend/dist
EXPOSE 8080
CMD ["node", "apps/backend/dist/server.js"]
