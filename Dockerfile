# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Copy vite config
COPY vite.config.js ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5173

# Expose port
EXPOSE 5173

# Start the application using vite preview
CMD ["npm", "run", "preview", "--", "--host", "--port", "5173"]