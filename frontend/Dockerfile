ARG VITE_API_BASE_URL=http://localhost:8000

FROM node:22-alpine AS builder
ARG VITE_API_BASE_URL
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

FROM node:22-alpine AS runner
ARG VITE_API_BASE_URL
WORKDIR /app
ENV NODE_ENV=production \
    VITE_API_BASE_URL=$VITE_API_BASE_URL
COPY --from=builder /app /app
EXPOSE 4173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]
