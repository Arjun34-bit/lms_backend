# Step 1: Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Optionally install NestJS CLI globally
RUN npm install -g @nestjs/cli

# Step 5: Copy the rest of the application code to the container
COPY . .

# Step 6: Build the application (if applicable)
RUN npm run build

# Step 7: Expose the application port
EXPOSE ${PORT}

# Step 8: Define the command to run your application
CMD ["npm", "run", "start:dev"]
