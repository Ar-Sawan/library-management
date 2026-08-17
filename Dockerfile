# Stage 1: Build React application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# Copy remaining source code and build
COPY . .
RUN npm run build

# Stage 2: Serve application using NGINX
FROM nginx:alpine

# Copy custom NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static assets from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
