const express = require('express');

const server = express() 

server.get("/", (request, response) => {
    response.send('Hello World')
})

server.listen(3000, () => {
    console.log('Estou rodando na porta 3000');
})