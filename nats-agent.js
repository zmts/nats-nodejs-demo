const nats = require('nats')

class NatsAgent {
  constructor({ servers = ['0.0.0.0:4222']} = {}) {
    this.agent = nats.connect({
      servers: servers.map(host => `nats://${host}`),
      timeout: 10 * 1000, // 10s
      maxReconnectAttempts: 10,
      json: true
    })

    this.agent.on('connect', (c) => {
      console.log(`${this.constructor.name} connected...`, c.currentServer.url.href)
    })

    this.agent.on('reconnect', (c) => {
      console.log(`${this.constructor.name} reconnected...`, c.currentServer.url.href)
    })

    this.agent.on('error', e => {
      console.log(`${this.constructor.name} ${e.message}`, e)
      this.agent.close()
    })
  }

  request (subject, payload) {
    return new Promise((resolve, reject) => {
      this.agent.request(subject, payload, response => {
        if (response.success) return resolve(response)
        return reject(response)
      });
    })
  }

  subscribe (subject, cb) {
    return new Promise((resolve, reject) => {
      this.agent.subscribe(subject, (payload, replyId, subject, sid) => {
        cb({ payload, replyId, subject, sid })
      })
    })
  }

  publish (replyId, payload) {
    return new Promise((resolve, reject) => {
      this.agent.publish(replyId, payload)
      return resolve()
    })
  }
}

module.exports = { NatsAgent }
