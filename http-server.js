const { NatsAgent } = require('./nats-agent')

class HttpServer {
  constructor() {
    this.natsAgent = new NatsAgent({ servers: ['0.0.0.0:4222'] })
    console.log(`${this.constructor.name} initialized...`)
  }

  createUser (payload) {
    return this.natsAgent.request('USERS.create', payload)
  }
}

(async () => {
  const server = new HttpServer({ gatewayName: 'http-gateway' })

  try {
    const payload1 = {
      __params: {},
      body: { name: 'Alex' }
    }
    const user1 = await server.createUser(payload1)
    console.log('Gateway take response with new user1', user1)


    const payload2 = {
      __params: {},
      body: { name: 'Mary' }
    }
    const user2 = await server.createUser(payload2)
    console.log('Gateway take response with new user2', user2)
  } catch (e) {
    console.log('error', e)
  }
})()
