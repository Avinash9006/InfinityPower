# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy backend source code
COPY . .

# Expose the backend port (adjust if you use another port)
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
