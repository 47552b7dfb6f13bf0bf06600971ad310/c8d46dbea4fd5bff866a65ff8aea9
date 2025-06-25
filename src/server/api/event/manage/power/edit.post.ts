import type { IAuth, IDBGameRankPowerProcess } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'event.edit')

    const body = await readBody(event)
    const { _id, server, name, start, end, active } = body
    if(!_id || !server || !name || !start || !end) throw 'Dữ liệu đầu vào không hợp lệ'

    const startDate = formatDate(start)
    const endDate = formatDate(end)
    if(startDate.timestamp > endDate.timestamp) throw 'Thời gian bắt đầu không thể lớn hơn thời gian kết thúc'

    const processEvent = await DB.GameRankPowerProcess.findOne({ _id: _id }).select('server active send end') as IDBGameRankPowerProcess
    if(!processEvent) throw 'Tiến trình không tồn tại'

    if(processEvent.server != server){
      const getByServer = await DB.GameRankPowerProcess.findOne({ server: server }).select('_id') as IDBGameRankPowerProcess
      if(!!getByServer) throw 'Tiến trình cho máy chủ này đã tồn tại'
    }

    if(!!active) {
      if(!!processEvent.send) throw 'Không thể kích hoạt khi hệ thống đã trả thưởng'
      const endOfToday = formatDate(new Date()).dayjs.endOf('date').unix()
      const endOfEvent = endDate.dayjs.endOf('date').unix()
      if(endOfToday > endOfEvent) throw 'Không thể kích hoạt khi thời gian kết thúc là quá khứ'
    }

    delete body['_id']
    await DB.GameRankPowerProcess.updateOne({ _id: processEvent._id }, {
      ...body,
      start: startDate.dayjs.startOf('date')['$d'],
      end: endDate.dayjs.endOf('date')['$d'],
    })

    if(!!active) await rankPowerProcessWrite(server)

    logAdmin(event, `Sửa tiến trình sự kiện tăng lực chiến của máy chủ <b>${processEvent.server}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  }
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})