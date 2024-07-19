import { PrismaClient } from "@prisma/client";

// ---- To run tests:
//const { PrismaClient } = require('@prisma/client');


const prismaClient = new PrismaClient({
    log: ['query', 'error', 'info', 'warn'],
});

export default prismaClient;

// ---- To run tests:
//module.exports = prismaClient;