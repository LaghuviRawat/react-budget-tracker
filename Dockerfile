# Use an official Node.js image to build the React app
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package manifest files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy all source code into the container
COPY . .

# Build the React app for production
RUN npm run build

# Use a minimal server image for serving the built app
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the build output to nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx when container launches
CMD ["nginx", "-g", "daemon off;"]
