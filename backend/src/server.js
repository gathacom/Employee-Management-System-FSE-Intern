import 'dotenv/config';
import app from './app.js';
import prisma from './config/prisma.js';

const PORT = process.env.PORT || 3000;

let server;

const startServer = () => {
    server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Access the API at http://localhost:${PORT}/api/health`);
    });
};

const gracefulShutdown = async () => {
    console.log('\n Initiating graceful shutdown...');

    server.close((err) => {
        if (err) {
            console.error('Error shutting down server:', err);
            process.exit(1);
        }
        console.log('Express server closed.');
    });

    // 2. Tutup koneksi database Prisma
    await prisma.$disconnect();
    console.log('Prisma client disconnected.');

    process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown); 

startServer();