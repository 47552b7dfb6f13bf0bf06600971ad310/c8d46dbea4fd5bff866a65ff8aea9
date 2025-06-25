import type { Mongoose } from 'mongoose'
import type { IDBGameRankPowerProcess, IDBGameRankPowerProcessLog, IDBGameRankPower } from '~~/types'

export const DBGameRankPowerProcess = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGameRankPowerProcess>({ 
    server: { type: String, index: true },
    name: { type: String },
    start: { type: Date, index: true },
    end: { type: Date, index: true },
    active: { type: Boolean, default: false, index: true },
    send: { type: Boolean, default: false, index: true },
    award: [{
      rank: { type: Number, index: true },
      gift: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
        amount: { type: Number, index: true },
      }]
    }],
  }, {
    timestamps: true
  })

  const model = mongoose.model('GameRankPowerProcess', schema, 'GameRankPowerProcess')
  return model 
}

export const DBGameRankPowerProcessLog = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGameRankPowerProcessLog>({ 
    process: { type: mongoose.Schema.Types.ObjectId, ref: 'GameRankPowerProcess' },
    content: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GameRankPowerProcessLog', schema, 'GameRankPowerProcessLog')
  return model 
}

export const DBGameRankPower = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGameRankPower>({ 
    process: { type: mongoose.Schema.Types.ObjectId, ref: 'GameRankPowerProcess' },
    server: { type: String, index: true },
    account: { type: String },
    role_name: { type: String },
    role_id: { type: String },
    power: { type: Number, index: true }
  }, {
    timestamps: true
  })

  const model = mongoose.model('GameRankPower', schema, 'GameRankPower')
  return model 
}