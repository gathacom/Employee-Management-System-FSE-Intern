# frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Salin package json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua kode (akan ditimpa oleh volume, tapi good practice)
COPY . .

# Expose port Vite
EXPOSE 5173

# Jalankan server development
CMD ["npm", "run", "dev"]