import type { IAuth, IDBGiftcode, IDBItem } from '~~/types'

const currencyTypeList = [
  'coin', 'wheel'
]

export default defineEventHandler(async (event) => {
  const auth = await getAuth(event) as IAuth

  try {
    if(!!auth.action.giftcode) return resp(event, { code: 400, message: 'Vui lòng đợi tiến trình cũ kết thúc' })
    await DB.User.updateOne({ _id: auth._id }, { 'action.giftcode': true })

    const { server, role, giftcode } = await readBody(event)
    if(!giftcode) throw 'Không tìm thấy ID sụ kiện'
    if(!server) throw 'Không tìm thấy ID máy chủ'
    if(!role) throw 'Không tìm thấy ID nhân vật'

    // Giftcode
    const giftcodeData = await DB.Giftcode
    .findOne({ _id: giftcode, display: 1 })
    .populate({
      path: 'gift.item',
      select: 'item_id type'
    })
    .select('-createdAt -updateAt -display') as IDBGiftcode

    // Check Giftcode
    if(!giftcodeData) throw 'Mã không tồn tại'
    if(giftcodeData.gift.length == 0) throw 'Mã chưa có phần thưởng để nhận'

    // Check Servers
    const servers = giftcodeData.servers
    if(servers.length > 0){
      const hasServer = servers.findLastIndex(i => i == server)
      if(hasServer == -1) throw 'Mã không áp dụng cho máy chủ này'
    }

    // Check Users
    const users = giftcodeData.users
    if(users.length > 0){
      const hasUser = users.findLastIndex(i => i.toString() == auth._id.toString())
      if(hasUser == -1) throw 'Mã không áp dụng cho tài khoản của bạn'
    }

    // Check Time
    if(giftcodeData.expired){
      const now = DayJS().unix()
      const expired = DayJS(giftcodeData.expired).unix()
      if(now > expired) throw 'Mã đã hết hạn sử dụng'
    }
    
    // Check Active
    if(giftcodeData.limit > 0){
      const countReceive = await DB.GiftcodeHistory.count({ giftcode: giftcodeData._id })
      if(countReceive >= giftcodeData.limit) throw 'Mã này đã hết lượt sử dụng'
    }

    // Check Use
    if(!giftcodeData.justone){
      const countReceiveAuth = await DB.GiftcodeHistory.count({ user: auth._id, giftcode: giftcodeData._id, server: server, role: role })
      if(countReceiveAuth > 0) throw 'Bạn đã nhận mã này cho nhân vật ở máy chủ này rồi'
    }
    else {
      const countReceiveAuth = await DB.GiftcodeHistory.count({ user: auth._id, giftcode: giftcodeData._id })
      if(countReceiveAuth > 0) throw 'Mã này chỉ được dùng 1 lần duy nhất'
    }
    

    // Format Gift
    const giftItem : Array<any> = []
    const giftCurrency : any = {}

    giftcodeData.gift.forEach(gift => {
      const item = gift.item as IDBItem

      if(item.type == 'game_item'){
        giftItem.push({ id: item.item_id, amount: gift.amount })
      }
      if(!!currencyTypeList.includes(item.type)){
        giftCurrency[`currency.${item.type}`] = gift.amount
      }
    })

    // Send Gift
    if(giftItem.length > 0){
      await gameSendMail(event, {
        account: auth.username,
        server_id: server,
        role_id: role,
        title: 'Web Giftcode',
        content: 'Vật phẩm nhận từ Giftcode trên Web',
        items: giftItem
      })
    }
      
    if(Object.keys(giftCurrency).length){
      await DB.User.updateOne({ _id: auth._id },{
        $inc: giftCurrency
      })
    }

    // History
    await DB.GiftcodeHistory.create({
      user: auth._id,
      giftcode: giftcodeData._id,
      server: server,
      role: role
    })
    await DB.User.updateOne({ _id: auth._id }, { 'action.giftcode': false })

    // Log User
    logUser(event, auth._id, `Sử dụng giftcode <b>${giftcodeData.code}</b> tại máy chủ <b>${server}</b> nhân vật <b>${role}</b>`)
    !!IO && IO.to(auth._id.toString()).emit('auth-update')
    
    return resp(event, { message: 'Nhận thưởng thành công' })
  } 
  catch (e:any) {
    await DB.User.updateOne({ _id: auth._id }, { 'action.giftcode': false })
    return resp(event, { code: 400, message: e.toString() })
  }
})