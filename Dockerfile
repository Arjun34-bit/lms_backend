# Use a full Debian-based Node image (not Alpine)
FROM node:20

# Set working directory
WORKDIR /app

# Install Python, pip, and build tools for mediasoup
RUN apt-get update && apt-get install -y \
  python3 \
  python3-pip \
  build-essential \
  && ln -s /usr/bin/python3 /usr/bin/python \
  && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json
COPY package*.json ./
# COPY node_modules ./node_modules
# COPY . .
# # Copy the rest of the application
# COPY . .

RUN npm install --legacy-peer-deps

COPY . .

# Copy Prisma schema
COPY prisma ./prism

# Generate Prisma client (this creates @prisma/client)
RUN npx prisma generate

# Increase memory limit to 4 GB to avoid heap errors
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build


# Expose the port the app runs on
EXPOSE 8707

# Start the NestJS app
CMD ["node", "dist/main"]
