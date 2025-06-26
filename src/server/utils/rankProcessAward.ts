import type { IDBGameRankProcess, IDBItem, IDBUser } from '~~/types'

export default async (server? : string) => {
  try {
    const time23hToday = formatDate(new Date()).dayjs.hour(23).minute(0).second(0).millisecond(0)

    const match : any = {
      active: true,                                 // Đã kích hoạt
      send: false,                                  // Chưa trả thưởng
      end: { $eq : time23hToday['$d'] },            // Kết thúc == 23h hiện tại
      award: { $exists: true, $not: { $size: 0 } }  // Đã cài đặt quà tặng
    }
    if(!!server) match['server'] = server

    const listProcess = await DB.GameRankProcess
    .find(match)
    .select('server type award end') 
    .populate({ path: 'award.gift.item', select: 'item_id type'}) as Array<IDBGameRankProcess>

    listProcess.forEach(async (processEvent) => {
      // Get Rank
      let ranks : Array<any>
      if(processEvent.type == 'power') ranks = await gameGetRankPower(null, { server_id: processEvent.server }, false) 
      else ranks = await gameGetRankLevel(null, { server_id: processEvent.server }, false)

      ranks.forEach(async (role : any) => {
        const user = await DB.User.findOne({ username: role.account }).select('username') as IDBUser
        const rankAward : any = processEvent.award.filter(award => award.rank == role.rank)[0]

        if(
          !!user                                          // Tài khoản tồn tại
          && (!!rankAward && rankAward.gift.length > 0)   // Đã setup phần thường
          && (role.rank <= 10)                            // Tối đa 10 người đứng đầu
          && (role[`${processEvent.type}`] > 0)           // Lực chiến hoặc cấp độ > 0
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
            title: processEvent.type == 'power' ? 'Web TOP Power' : 'Web TOP Level',
            content: `Vật phẩm nhận từ sự kiện đua TOP ${processEvent.type == 'power' ? 'lực chiến' : 'cấp độ'}`,
            items: giftItem
          })
          if(Object.keys(giftCurrency).length) await DB.User.updateOne({ _id: user._id },{ $inc: giftCurrency })

          // Log Receive
          logUser(null, user._id, `Nhận quà <b>TOP ${role.rank} ${processEvent.type == 'power' ? 'lực chiến' : 'cấp độ'}</b> tại máy chủ <b>${processEvent.server}</b>`)
          IO.to(user._id.toString()).emit('auth-update')
          
          // Log Process
          await DB.GameRankProcessLog.create({
            process: processEvent._id,
            content: `Trả thưởng <b>TOP ${role.rank}</b> cho tài khoản <b>${user.username}</b> với nhân vật <b>[${role.role_id}] ${role.role_name}</b>`
          })
        }
      })

      // Update Process
      await DB.GameRankProcess.updateOne({ _id: processEvent._id }, { send: true, active: false })
      await DB.GameRankProcessLog.create({ process: processEvent._id, content: `Trả thưởng đua TOP thành công` })
    })
  }
  catch (e:any) {
    
  }
}