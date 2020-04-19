const { v4: uuidv4 } = require('uuid')
const { NatsAgent } = require('./nats-agent')

class UnitServer {
  constructor() {
    this.natsAgent = new NatsAgent({ servers: ['0.0.0.0:4222'] })
    console.log(`${this.constructor.name} initialized...`)
  }

  async createUserAction () {
    await this.natsAgent.subscribe('USERS.create', async ({ payload, replyId, subject, sid }) => {
      console.log('createUserAction payload', payload)

      if (replyId) {
        const data = {
          success: true,
          data: {
            userId: uuidv4(),
            createdAt: new Date().getTime(),
            ...payload.body
          }
        }
        await this.natsAgent.publish(replyId, data)
      }
    })
  }
}



(async () => {
  const unit = new UnitServer()

  try {
    await unit.createUserAction()
  } catch (e) {
    console.log('error', e)
  }
})()
