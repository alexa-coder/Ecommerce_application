# Stage 1: Build React app
FROM node:18 as build

WORKDIR /app

# Copy only package files first for caching
COPY ecommerce/package*.json ./
RUN npm install

# Copy all React project files
COPY ecommerce/ ./

# Build production files
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
