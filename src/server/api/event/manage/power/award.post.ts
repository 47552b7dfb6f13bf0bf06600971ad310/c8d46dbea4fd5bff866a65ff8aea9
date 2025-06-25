import type { IAuth, IDBGameRankPowerProcess } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'event.edit')

    const body = await readBody(event)
    const { _id, award } = body
    if(!_id || !award) throw 'Dữ liệu đầu vào không hợp lệ'

    const processEvent = await DB.GameRankPowerProcess.findOne({ _id: _id }).select('server') as IDBGameRankPowerProcess
    if(!processEvent) throw 'Tiến trình không tồn tại'

    const formatAward = award.map((i : any) => ({
      rank: i.rank,
      gift: i.gift.map((item : any) => ({
        item: item._id,
        amount: item.amount
      }))
    }))

    await DB.GameRankPowerProcess.updateOne({ _id: processEvent._id }, { award: formatAward })

    logAdmin(event, `Sửa phần thưởng sự kiện tăng lực chiến của máy chủ <b>${processEvent.server}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  }
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})