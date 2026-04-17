# Backend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy backend package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy backend source code
COPY src ./src

# Expose the port (should match PORT environment variable, default 5000)
EXPOSE 5000

# Start the backend
CMD ["node", "src/server.js"]
