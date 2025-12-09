FROM node:20

# Set direktori kerja
WORKDIR /usr/src/app

# (Baris apk sudah dihapus disini)

# Salin package.json dan package-lock.json
COPY package*.json ./

# Instal dependensi
RUN npm install

# Salin sisa kode aplikasi
COPY . .

# Buat folder src/ jika belum ada
RUN mkdir -p src

# Generate Prisma Client
RUN npx prisma generate

# Expose port aplikasi
EXPOSE 3000

# Perintah default
CMD ["npm", "start"]