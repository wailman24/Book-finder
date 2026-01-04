# Use Node 22 to satisfy Vite's requirements and fix the SyntaxError
FROM node:22-slim

WORKDIR /app

# Install build dependencies if needed
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]