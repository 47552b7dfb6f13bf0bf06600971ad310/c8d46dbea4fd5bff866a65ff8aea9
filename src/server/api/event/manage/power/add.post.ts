import type { IAuth, IDBGameRankPowerProcess } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'event.add')

    const body = await readBody(event)
    const { server, name, start, end } = body
    if(!server || !name || !start || !end) throw 'Dữ liệu đầu vào không hợp lệ'

    const startDate = formatDate(start)
    const endDate = formatDate(end)
    if(startDate.timestamp > endDate.timestamp) throw 'Thời gian bắt đầu không thể lớn hơn thời gian kết thúc'

    const getByServer = await DB.GameRankPowerProcess.findOne({ server: server }).select('_id') as IDBGameRankPowerProcess
    if(!!getByServer) throw 'Tiến trình cho máy chủ này đã tồn tại'

    await DB.GameRankPowerProcess.create({
      ...body,
      start: startDate.dayjs.startOf('date')['$d'],
      end: endDate.dayjs.endOf('date')['$d'],
    })
    logAdmin(event, `Tạo tiến trình sự kiện tăng lực chiến cho máy chủ <b>${server}</b>`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})