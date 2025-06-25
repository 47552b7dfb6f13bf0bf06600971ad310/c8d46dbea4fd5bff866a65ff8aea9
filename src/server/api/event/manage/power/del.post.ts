import type { IAuth, IDBGameRankPowerProcess } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'event.del')

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const processEvent = await DB.GameRankPowerProcess.findOne({ _id: _id }).select('server') as IDBGameRankPowerProcess
    if(!processEvent) throw 'Tiến trình không tồn tại'

    await DB.GameRankPowerProcess.deleteOne({ _id: processEvent._id })
    await DB.GameRankPowerProcessLog.deleteMany({ process: processEvent._id })
    await DB.GameRankPower.deleteMany({ process: processEvent._id })

    logAdmin(event, `Xóa tiến trình sự kiện tăng lực chiến của máy chủ <b>${processEvent.server}</b>`)
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})