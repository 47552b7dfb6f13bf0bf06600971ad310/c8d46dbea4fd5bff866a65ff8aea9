import type { Types } from 'mongoose'
import type { IDBLevel } from './level'

export interface IDBUser {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  username: string
  password: string
  email: string
  phone: string
  avatar: string
  level: Types.ObjectId | IDBLevel
  reg: {
    landing: Types.ObjectId
    from: Types.ObjectId
    platform: string
  }
  social: {
    facebook: string
    zalo: string
    google: string
    tiktok: string
  }
  referral: {
    code: string
    person: Types.ObjectId
    count: number
  }
  currency: {
    coin: number
    wheel: number
    diamond: number
  }
  paymusty: Array<number>
  paydays: {
    day: number
    receive: number
  }
  pay: {
    total: {
      money: number
      count: number
    },
    day: {
      money: number
      count: number
    },
    month: {
      money: number
      count: number
    }
  }
  spend: {
    total: {
      coin: number
      count: number
    },
    day: {
      coin: number
      count: number
    },
    month: {
      coin: number
      count: number
    }
  }
  wheel: {
    total: number
    day: number
    month: number
  }
  dice: {
    total: {
      coin: number
      count: number
    },
    day: {
      coin: number
      count: number
    },
    month: {
      coin: number
      count: number
    }
  }
  login: {
    month: number
    total: number
    update: Date
    last_ip: string
  }
  action: {
    giftcode: boolean
    event: boolean
  }
  type: number
  block: number
  token: string
  // Function
  save: {
    () : void
  }
}

export interface IDBUserLogin {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  user: Types.ObjectId
}

export interface IDBUserStore {
  _id? : Types.ObjectId
  username? : IDBUser['username']
  level? : IDBLevel
  type?: IDBUser['type']
  referral_code?: IDBUser['referral']['code']
  currency?: IDBUser['currency']
}