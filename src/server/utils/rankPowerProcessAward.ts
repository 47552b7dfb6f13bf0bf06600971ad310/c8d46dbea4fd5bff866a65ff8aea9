import type { IDBConfig, IDBGameRankPowerProcess, IDBItem, IDBUser } from '~~/types'
import axios from 'axios'
import { Types } from 'mongoose'

export default async (server? : string) => {
  try {
    // Get Config
    const config = await DB.Config.findOne().select('game') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trò chơi'
    if(!config.game.api.roles) throw 'Tính năng xem bảng xếp hạng lực chiến đang bảo trì'

    const endOfToday = formatDate(new Date()).dayjs.endOf('date')
    const match : any = {
      active: true,                                 // Đã kích hoạt
      send: false,                                  // Chưa trả thưởng
      end: { $eq : endOfToday['$d'] },              // Kết thúc == Cuối ngày hiện tại
      award: { $exists: true, $not: { $size: 0 } }  // Đã cài đặt quà tặng
    }
    if(!!server) match['server'] = server

    const listProcess = await DB.GameRankPowerProcess
    .find(match)
    .select('server start end award') 
    .populate({ path: 'award.gift.item', select: 'item_id type'}) as Array<IDBGameRankPowerProcess>

    listProcess.forEach(async (processEvent) => {
      processEvent.award.sort((a,b) => b.rank - a.rank)
      const maxRank = processEvent.award[0].rank
      
      const ranks = await DB.GameRankPower.aggregate([
        {
          $lookup: {
            from: "GameRankPowerProcess",
            localField: "process",
            foreignField: "_id",
            as: "processData"
          }
        },
        { $unwind: "$processData" },
        { $match: { 
          process: new Types.ObjectId(processEvent._id),
          $expr: {
            $and: [
              { $gte: ["$createdAt", "$processData.start"] },
              { $lte: ["$createdAt", "$processData.end"] }
            ]
          }
        }},
        {
          $group: {
            _id: {
              account: "$account",
              role_id: "$role_id"
            },
            maxPower: { $max: "$power" },
            minPower: { $min: "$power" },
            role_name: { $first: "$role_name" }
          }
        },
        {
          $addFields: {
            account: "$_id.account",
            role_id: "$_id.role_id",
            power: { $subtract: ["$maxPower", "$minPower"] }
          }
        },
        {
          $setWindowFields: {
            sortBy: { power: -1 },
            output: {
              rank: { $rank: {} }
            }
          }
        },
        { $project: { _id: 0, maxPower: 0, minPower: 0 }},
        { $match: { rank: { $lte: maxRank }} }
      ])

      ranks.forEach(async (role : any) => {
        const user = await DB.User.findOne({ username: role.account }).select('username') as IDBUser
        const rankAward : any = processEvent.award.filter(award => award.rank == role.rank)[0]

        if(!!user && (!!rankAward && rankAward.gift.length > 0) && role.power > 0){
          // Format Gift
          const giftItem : Array<any> = []
          const giftCurrency : any = {}
          rankAward.gift.forEach((gift : any) => {
            const item = gift.item as IDBItem
            if(item.type == 'game_item') giftItem.push({ id: item.item_id, amount: gift.amount })
            if(!!['coin', 'wheel'].includes(item.type)) giftCurrency[`currency.${item.type}`] = gift.amount
          })

          // Send Gift
          if(giftItem.length > 0) await gameSendMail(null, {
            account: user.username,
            server_id: processEvent.server,
            role_id: role.role_id,
            title: 'Power Up Event',
            content: 'Vật phẩm nhận từ sự kiện tăng tiến lực chiến',
            items: giftItem
          })
          if(Object.keys(giftCurrency).length) await DB.User.updateOne({ _id: user._id },{ $inc: giftCurrency })

          // Log
          const change : any = []
          if(!!giftCurrency[`currency.coin`] && giftCurrency[`currency.coin`] > 0) change.push(`${giftCurrency[`currency.coin`].toLocaleString('vi-VN')} xu`)
          if(change.length > 0) logUser(null, user._id, `Nhận <b>${change.join(', ')}</b> từ quà sự kiện tăng lực chiến tại máy chủ <b>${processEvent.server}</b>`)
          logUser(null, user._id, `Nhận quà sự kiện tăng lực chiến <b>TOP ${role.rank}</b> tại máy chủ <b>${processEvent.server}</b>`)
          
          await DB.GameRankPowerProcessLog.create({
            process: processEvent._id,
            content: `Trả thưởng <b>TOP ${role.rank}</b> cho tài khoản <b>${user.username}</b> với nhân vật <b>[${role.role_id}] ${role.role_name}</b>`
          })
        }
      })

      await DB.GameRankPowerProcess.updateOne({ _id: processEvent._id }, { send: true, active: false })
      await DB.GameRankPowerProcessLog.create({
        process: processEvent._id,
        content: `Trả thưởng sự kiện thành công`
      })
    })
  }
  catch (e:any) {
    
  }
}