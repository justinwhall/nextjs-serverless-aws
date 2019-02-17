const path = require('path')
// const sls = require('serverless-http')
const express = require("express");
const pathMatch = require("path-match");
const { parse } = require("url");
const app = express()
const route = pathMatch()
const awsServerlessExpress = require('aws-serverless-express')
const binaryMimeTypes = require('./binaryMimeTypes')
const matches = [
  { route: route("/posts/:id"), page: "/posts" },
];

// static files
app.use('/_next', express.static(path.join(__dirname, '.next')))

// matching index is easy
app.get('/', require('./.next/serverless/pages/index.js').render)

// check for other URL matches
app.get('*', (req, res) => {

  const parsedUrl = parse(req.url, true);
  const { pathname, query } = parsedUrl;
  let hasMatch = false;

  for (const match of matches) {
    const params = match.route(pathname);

    if (params) {

      try {
        require(`./.next/serverless/pages${match.page}`).render(req, res)
      } catch (err) {
        require('./.next/serverless/pages/_error.js').render(req, res)
      }
      hasMatch = true;
      break;
    }
  }

  if (!hasMatch) {
    try {
      require(`./.next/serverless/pages${pathname}`).render(req, res, parsedUrl)
    } catch (err) {
      require('./.next/serverless/pages/_error.js').render(req, res, parsedUrl)
    }
  }
})

// 404 handler
app.get("*", require('./.next/serverless/pages/_error.js').render);

const server = awsServerlessExpress.createServer(app, null, binaryMimeTypes)
module.exports.server = (event, context) => { awsServerlessExpress.proxy(server, event, context) }