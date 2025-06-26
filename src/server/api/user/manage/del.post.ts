import type { IAuth, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'user.del')

    const { day } = await readBody(event)
    if(!!isNaN(parseInt(day)) || parseInt(day) < 30) throw 'Dữ liệu đầu vào không hợp lệ'

    const now = formatDate()
    const startNow = now.dayjs.startOf('date')
    const dateDel = startNow.subtract(day, 'day')

    const list = await DB.User
    .aggregate([
      { $match: { 
        'login.update': { $lte: dateDel['$d'] },
        'type': { $lt: 1 }
      }},
      {
        $lookup: {
          from: "Payment",
          localField: "_id",
          foreignField: "user",
          pipeline: [{
            $project: {
              money: { $cond: [{$eq: ['$status', 1]} , '$money', 0] },
            }
          }],
          as: "payments"
        }
      },
      { $addFields: { totalMoney: { $sum: '$payments.money' }}},
      { $match: { totalMoney: { $lt: 1 } }},
      { $project: { username: 1, totalMoney: 1 }}
    ])
    if(list.length == 0) throw 'Không có tài khoản nào thỏa mãn để xóa'

    const users = list.map((user) => user._id)
    const bot = await DB.User.findOne({'username': 'bot'}).select('_id') as IDBUser

    await DB.WheelHistory.deleteMany({ user: { $in: users }})
    await DB.WheelLuckyUser.deleteMany({ user: { $in: users }})
    await DB.DiceHistory.deleteMany({ user: { $in: users }})
    await DB.DiceLuckyUser.deleteMany({ user: { $in: users }})
    await DB.EggUser.deleteMany({ user: { $in: users }})
    await DB.EggHistory.deleteMany({ user: { $in: users }})

    await DB.ShopHistory.deleteMany({ user: { $in: users }})
    await DB.ShopPackHistory.deleteMany({ user: { $in: users }})

    await DB.EventHistory.deleteMany({ user: { $in: users }})

    await DB.GiftcodeHistory.deleteMany({ user: { $in: users }})

    await DB.LogUser.deleteMany({ user: { $in: users }})
    await DB.LogUserIP.deleteMany({ user: { $in: users }})
    
    await DB.SocketChat.deleteMany({ user: { $in: users }})
    await DB.SocketOnline.deleteMany({ user: { $in: users }})

    await DB.UserLogin.deleteMany({ user: { $in: users }})

    await DB.Payment.deleteMany({ user: { $in: users }})

    users.forEach(async (_id) => {
      await DB.Giftcode.updateMany({}, { $pull: { 'users': _id } })
      await DB.Payment.updateMany({ 'verify.person': _id }, { 'verify.person': bot._id })
      await DB.News.updateMany({ 'creator': _id }, { 'creator': bot._id })
      await DB.News.updateMany({ 'updater': _id }, { 'updater': bot._id })
      await DB.Spend.updateMany({ 'user': _id }, { 'user': bot._id })
      await DB.User.updateMany({ 'referral.person': _id }, { 'referral.person': null })
      await DB.LogAdmin.updateMany({ 'user': _id }, { 'user': bot._id })
      await DB.LogAdminSendItem.updateMany({ 'from': _id }, { 'from': bot._id })
      await DB.LogAdminSendItem.updateMany({ 'to': _id }, { 'to': bot._id })
    })
    
    await DB.User.deleteMany({ _id: { $in: users }})

    logAdmin(event, `Xóa các tài khoản chưa <b>đăng nhập</b> trong ${day} ngày`)
    return resp(event, { message: 'Sửa dữ liệu đăng nhập thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})