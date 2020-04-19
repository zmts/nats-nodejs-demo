const express = require('express')
const { NatsAgent } = require('./nats-agent')
natsAgent = new NatsAgent({ servers: ['0.0.0.0:4222'] })

const port = 9000
const host = 'localhost'

const app = express()
app.use(express.json())
app.get('/', rootAction)
app.get('/users', listUsersAction)
app.post('/users', createUsersAction)
app.listen(port, host)
console.log(`HttpServer listened at ${host}:${port}`)


function rootAction  (req, res) {
  res.json({ message: 'Hello World' })
}

async function listUsersAction (req, res) {
  const payload = {
    __params: {}
  }

  try {
    const result = await natsAgent.request('USERS.list', payload)
    res.json(result)
  } catch (e) {
    res.status(e.status || 500).json(e)
  }
}

async function createUsersAction (req, res) {
  const { body } = req

  const payload = {
    __params: {},
    body
  }

  try {
    const result = await natsAgent.request('USERS.create', payload)
    res.json(result)
  } catch (e) {
    res.status(e.status || 500).json(e)
  }
}


