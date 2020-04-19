const { v4: uuidv4 } = require('uuid')
const { NatsAgent } = require('./nats-agent')

class UnitServer {
  constructor() {
    this.natsAgent = new NatsAgent({ servers: ['0.0.0.0:4222'] })
    console.log(`${this.constructor.name} initialized...`)

    this.createUserAction()
    this.listUserAction()
  }

  async createUserAction () {
    await this.natsAgent.subscribe('USERS.create', async ({ payload, replyId, subject, sid }) => {
      console.log(subject, payload)

      const data = {
        success: true,
        data: {
          userId: uuidv4(),
          createdAt: new Date(),
          ...payload.body
        }
      }

      // error case
      const error = {
        success: false,
        message: 'Some error occurred',
        status: 400,
        code: 'VALIDATION_ERROR'
      }

      await this.natsAgent.publish(replyId, data)
    })
  }

  async listUserAction () {
    await this.natsAgent.subscribe('USERS.list', async ({ payload, replyId, subject, sid }) => {
      console.log(subject, payload)

      const data = {
        success: true,
        data: [
          {
            userId: uuidv4(),
            createdAt: new Date()
          },
          {
            userId: uuidv4(),
            createdAt: new Date()
          },
        ]
      }

      await this.natsAgent.publish(replyId, data)
    })
  }
}

new UnitServer()
