'use strict'
const path = require('path')
const consola = require('consola')

// Check configuration
const conf_path = path.join(__dirname, './config')
console.log('Configuration:', conf_path)
process.env['NODE_CONFIG_DIR'] = conf_path

const feathers = require('@feathersjs/feathers')
const configuration = require('@feathersjs/configuration')
const express = require('@feathersjs/express')
const middleware = require('./middleware')

/* Configurando o Redis */ 
const redis = require('redis')
const bluebird = require('bluebird')
bluebird.promisifyAll(redis)

const client = redis.createClient()

// const {promisify} = require('util');
// const getAsync = promisify(client.get).bind(client);

global.redisClient = client

// console.log('Conectando neo4j...')
// var neo4j = require('neo4j-driver').v1;
// var driver = neo4j.driver(process.env.URL_NEO4J || "bolt://localhost", neo4j.auth.basic(process.env.USER_NEO4J || 'neo4j', process.env.PASSWORD_NEO4J || 'admin'));
// console.log('Neo4j connected!')
// global.neo4jDriver = driver

const app = express(feathers())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app
  .configure(configuration())
  .configure(middleware)
  .configure(express.rest())
  .configure(require('./services'))

const host = app.get('host')
const port = app.get('port')

process.on('nuxt:build:done', (err) => {
  if (err) {
    consola.error(err)
    process.exit(1)
  }
  const server = app.listen(port)
  server.on('listening', () =>
    consola.ready({
      message: `Feathers application started on ${host}:${port}`,
      badge: true
    })
  )
})

module.exports = app
