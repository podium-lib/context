'use strict';

const { HttpIncoming } = require('@podium/utils');
const http = require('http');
const Context = require('..');

// Set up a context with the name 'myLayout'
const context = new Context({ name: 'myLayout' });

const server = http.createServer(async (req, res) => {
    // Create a HttpIncoming object
    const incoming = new HttpIncoming(req, res);

    // Run context parsers on the request
    const incom = await context.process(incoming);

    // Serialize the context into a object that can be passed on
    // to be passed on as http headers on a http request
    const headers = Context.serialize({}, incom.context);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(headers));
});

server.listen(8080, 'localhost', () => {
    console.log('Server running at: http://localhost:8080');
});
