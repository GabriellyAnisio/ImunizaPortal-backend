import server from '../server.mjs';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/routes.mjs';
import cors from 'cors';

const PORT = process.env.PORT || 5000;

server.use(cors({
    origin: 'http://localhost:5173', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
  }));
server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
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