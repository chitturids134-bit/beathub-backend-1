# Stage 1: Build dependencies and application
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

# Stage 2: Create the final, lightweight runtime image
FROM node:18-alpine AS runner

RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
WORKDIR /home/appuser/app
ENV NODE_ENV=production

COPY --from=builder --chown=appuser:appgroup /app/package*.json ./
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/server.js ./server.js
COPY --from=builder --chown=appuser:appgroup /app/src ./src
COPY --from=builder --chown=appuser:appgroup /app/scripts ./scripts
RUN chown -R appuser:appgroup /home/appuser/app
USER appuser

EXPOSE 3000

CMD ["node", "server.js"]
