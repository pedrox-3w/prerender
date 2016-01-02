#!/usr/bin/env node

var prerender = require('./lib');

var server = prerender({
    workers: process.env.PHANTOM_CLUSTER_NUM_WORKERS,
    iterations: process.env.PHANTOM_WORKER_ITERATIONS || 10,
    phantomBasePort: process.env.PHANTOM_CLUSTER_BASE_PORT || 12300,
    messageTimeout: process.env.PHANTOM_CLUSTER_MESSAGE_TIMEOUT,
    accessLog: {
        fileStreamRotator: {
            filename: process.env.APP_LOG_DIR + '/access-%DATE%.log',
            frequency: 'daily',
            date_format: 'YYYY-MM-DD',
            verbose: false
        },
        morgan: {
            format: 'combined'
        }
    }
});


// server.use(prerender.basicAuth());
// server.use(prerender.whitelist());
server.use(prerender.blacklist());
server.use(prerender.logger());
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());
// server.use(prerender.inMemoryHtmlCache());
// server.use(prerender.s3HtmlCache());
server.use(require('prerender-access-log'));

server.start();
