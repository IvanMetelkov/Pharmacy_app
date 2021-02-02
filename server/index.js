const express = require('express');
const app = express();
const { readData, writeData } = require('./utils');

const port = 9999;
const hostname = 'localhost';

let dates = [];

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());

app.options('/*', (request, response) => {
    response.statusCode = 200;
    response.send('OK');
});

app.get('/orderarr', async (request, response) => {
    dates = await readData();
    response.setHeader('Content-Type', 'application/json');
    response.status(200).json(dates);
});

app.post('/orderarr', async (request, response) => {
    const orderArr = request.body;
    dates.push(orderArr);
    await writeData(dates);
    response.status(200).json({info: 'Order succefully created!'});
});

app.post('/orderarr/:orderArrId/order', async (request, response) => {
    const order = request.body;
    const orderArrId = Number(request.params.orderArrId);
    dates[orderArrId].orders.push(order);
    await writeData(dates);
    response.status(200).json({info: 'Order succefully created!'});
});

app.patch('/orderarr/:orderArrId/order/:orderId', async (request, response) => {
    const { newName, newAuthor } = request.body;
    const orderArrId = Number(request.params.orderArrId);
    const orderId = Number(request.params.orderId);

    dates[orderArrId].orders[orderId].name = newName;
    dates[orderArrId].orders[orderId].author = newAuthor;

    await writeData(dates);
    response.status(200).json({info: 'Order succefully changed!'});
});

app.delete('/orderarr/:orderArrId/order/:orderId', async (request, response) => {
    const orderArrId = Number(request.params.orderArrId);
    const orderId = Number(request.params.orderId);

    dates[orderArrId].orders.splice(orderId, 1);

    await writeData(dates);
    response.status(200).json({info: 'Order succefully deleted!'});
});

app.listen(port, hostname, (error) => {
    if (error) {
        console.error(error);
    }
});
