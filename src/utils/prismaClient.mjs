import { PrismaClient } from "@prisma/client";
//const { PrismaClient } = require('@prisma/client');


const prismaClient = new PrismaClient({
    log: ['query', 'error', 'info', 'warn'],
});

export default prismaClient;
//module.exports = prismaClient;