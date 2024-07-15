import server from '../server.mjs';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/routes.mjs';

const PORT = process.env.PORT || 5000;

server.use(helmet());
server.use(morgan('dev'));
server.use(express.json());
server.use(routes);

server.use('*', (request, response) => {
    response.status(404).send({message: 'Route not found'});
});

server.listen(PORT, () => {
    console.log(`Estou rodando na porta ${PORT}`);
});