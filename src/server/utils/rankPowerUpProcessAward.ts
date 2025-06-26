import type { IDBGameRankPowerUpProcess, IDBItem, IDBUser } from '~~/types'
import { Types } from 'mongoose'

export default async (server? : string) => {
  try {
    const endOfToday = formatDate(new Date()).dayjs.endOf('date')
    const match : any = {
      active: true,                                 // Đã kích hoạt
      send: false,                                  // Chưa trả thưởng
      end: { $eq : endOfToday['$d'] },              // Kết thúc == Cuối ngày hiện tại
      award: { $exists: true, $not: { $size: 0 } }  // Đã cài đặt quà tặng
    }
    if(!!server) match['server'] = server

    const listProcess = await DB.GameRankPowerUpProcess
    .find(match)
    .select('server start end award') 
    .populate({ path: 'award.gift.item', select: 'item_id type'}) as Array<IDBGameRankPowerUpProcess>

    listProcess.forEach(async (processEvent) => {
      // Get Max Rank
      processEvent.award.sort((a,b) => b.rank - a.rank)
      const maxRank = processEvent.award[0].rank
      
      // Get Ranks
      const ranks = await DB.GameRankPowerUp.aggregate([
        {
          $lookup: {
            from: "GameRankPowerUpProcess",
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

        if(
          !!user                                          // Tài khoản tồn tại
          && (!!rankAward && rankAward.gift.length > 0)   // Đã setup phần thường
          && (role.power > 0)                             // Lực chiến > 0
        ){
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
            title: 'Web Power Up Event',
            content: 'Vật phẩm nhận từ sự kiện tăng tiến lực chiến',
            items: giftItem
          })
          if(Object.keys(giftCurrency).length) await DB.User.updateOne({ _id: user._id },{ $inc: giftCurrency })

          // Log Receive
          logUser(null, user._id, `Nhận quà sự kiện tăng lực chiến <b>TOP ${role.rank}</b> tại máy chủ <b>${processEvent.server}</b>`)
          IO.to(user._id.toString()).emit('auth-update')

          // Log Process
          await DB.GameRankPowerUpProcessLog.create({
            process: processEvent._id,
            content: `Trả thưởng <b>TOP ${role.rank}</b> cho tài khoản <b>${user.username}</b> với nhân vật <b>[${role.role_id}] ${role.role_name}</b>`
          })
        }
      })

      // Update Process
      await DB.GameRankPowerUpProcess.updateOne({ _id: processEvent._id }, { send: true, active: false })
      await DB.GameRankPowerUpProcessLog.create({ process: processEvent._id, content: `Trả thưởng sự kiện thành công` })
    })
  }
  catch (e:any) {
    
  }
}