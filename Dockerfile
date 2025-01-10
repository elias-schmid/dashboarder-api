# Use Node.js as a base image
FROM node:16

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Build the TypeScript files
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]