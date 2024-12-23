FROM node:20-alpine3.20

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install ALL dependencies (dev + prod)
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build TypeScript code and Prisma client
# RUN npx prisma generate
RUN npm run build

# Install PM2 globally
RUN npm install -g pm2

# Expose application port
EXPOSE 8000

# Start the application using PM2
CMD ["pm2-runtime", "start", "dist/server.js", "-i", "max", "--name", "express-api"]
