import type { IGlobalDB } from '~~/types'
import type { Mongoose } from 'mongoose'
import { DBConfig } from './config'
import { DBNews, DBNewsCategory } from './news'
import { DBUser, DBUserLogin } from './user'
import { DBLevel } from './level'
import { DBGate } from './gate'
import { DBPaymentConfig, DBPayment } from './payment'
import { DBSpend } from './spend'
import { DBItem, DBItemBox } from './item'
import { DBShopConfig, DBShop, DBShopHistory, DBShopPack, DBShopPackHistory } from './shop'
import { DBEvent, DBEventConfig, DBEventHistory } from './event'
import { DBGiftcode, DBGiftcodeHistory } from './giftcode'
import { DBDice, DBDiceHistory, DBDiceLuckyUser } from './dice'
import { DBWheel, DBWheelHistory, DBWheelLuckyUser } from './wheel'
import { DBEgg, DBEggHistory, DBEggUser } from './egg'
import { 
  DBGameRankProcess, DBGameRankProcessLog,
  DBGameRankPowerUpProcess, DBGameRankPowerUpProcessLog, DBGameRankPowerUp, 
  DBGameMission, DBGameMissionHistory
} from './game'
import { DBLogAdmin, DBLogAdminSendItem, DBLogUser, DBLogUserIP, DBLogBlockIP } from './log'
import { DBAdsFrom, DBAdsLanding } from './ads'
import { DBAdminIP } from './ip'

import { DBSocketChat, DBSocketOnline } from './socket'

export default (mongoose : Mongoose) : IGlobalDB => {
  return {
    Config: DBConfig(mongoose),
    
    NewsCategory: DBNewsCategory(mongoose),
    News: DBNews(mongoose),

    User: DBUser(mongoose),
    UserLogin: DBUserLogin(mongoose),
    Level: DBLevel(mongoose),

    Gate: DBGate(mongoose),

    PaymentConfig: DBPaymentConfig(mongoose),
    Payment: DBPayment(mongoose),

    Spend: DBSpend(mongoose),
    
    Item: DBItem(mongoose),
    ItemBox: DBItemBox(mongoose),
    
    ShopConfig: DBShopConfig(mongoose),
    Shop: DBShop(mongoose),
    ShopHistory: DBShopHistory(mongoose),
    ShopPack: DBShopPack(mongoose),
    ShopPackHistory: DBShopPackHistory(mongoose),

    EventConfig: DBEventConfig(mongoose),
    Event: DBEvent(mongoose),
    EventHistory: DBEventHistory(mongoose),

    Giftcode: DBGiftcode(mongoose),
    GiftcodeHistory: DBGiftcodeHistory(mongoose),

    Dice: DBDice(mongoose),
    DiceHistory: DBDiceHistory(mongoose),
    DiceLuckyUser: DBDiceLuckyUser(mongoose),

    Wheel: DBWheel(mongoose),
    WheelHistory: DBWheelHistory(mongoose),
    WheelLuckyUser: DBWheelLuckyUser(mongoose),

    Egg: DBEgg(mongoose),
    EggUser: DBEggUser(mongoose),
    EggHistory: DBEggHistory(mongoose),

    GameRankProcess: DBGameRankProcess(mongoose),
    GameRankProcessLog: DBGameRankProcessLog(mongoose),
    GameRankPowerUpProcess: DBGameRankPowerUpProcess(mongoose),
    GameRankPowerUpProcessLog: DBGameRankPowerUpProcessLog(mongoose),
    GameRankPowerUp: DBGameRankPowerUp(mongoose),
    GameMission: DBGameMission(mongoose),
    GameMissionHistory: DBGameMissionHistory(mongoose),

    LogAdmin: DBLogAdmin(mongoose),
    LogAdminSendItem: DBLogAdminSendItem(mongoose),

    LogBlockIP: DBLogBlockIP(mongoose),
    LogUser: DBLogUser(mongoose),
    LogUserIP: DBLogUserIP(mongoose),

    AdsLanding: DBAdsLanding(mongoose),
    AdsFrom: DBAdsFrom(mongoose),

    SocketOnline: DBSocketOnline(mongoose),
    SocketChat: DBSocketChat(mongoose),

    AdminIP: DBAdminIP(mongoose)
  }
}