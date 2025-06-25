import type { Types } from 'mongoose'

export interface IDBGameRankPowerProcess {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  server: string
  name: string
  start: date
  end: date
  active: boolean
  send: boolean
  award: Array<{
    rank: number
    gift: Array<{
      item: Types.ObjectId | IDBItem,
      amount: number
    }>
  }>
}

export interface IDBGameRankPowerProcessLog {
  process: Types.ObjectId
  content: string
}

export interface IDBGameRankPower {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  process: Types.ObjectId
  server: string
  account: string
  role_name: string
  role_id: string
  power: number
}