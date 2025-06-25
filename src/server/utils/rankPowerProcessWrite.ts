import type { IDBConfig, IDBGameRankPowerProcess } from '~~/types'
import axios from 'axios'

export default async (server? : string) => {
  try {
    // Get Config
    const config = await DB.Config.findOne().select('game') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trò chơi'
    if(!config.game.api.roles) throw 'Tính năng xem bảng xếp hạng lực chiến đang bảo trì'

    const endOfToday = formatDate(new Date()).dayjs.endOf('date')
    const match : any = {
      active: true,                     // Đã kích hoạt
      end: { $gte : endOfToday['$d'] }  // Thời gian vẫn còn khả dụng (Kết thúc >= Cuối ngày hiện tại)
    }
    if(!!server) match['server'] = server

    const listProcess = await DB.GameRankPowerProcess.find(match).select('server') as Array<IDBGameRankPowerProcess>
    listProcess.forEach(async (processEvent) => {
      const post = {
        secret: config.game.secret,
        server_id: processEvent.server,
        size: 1000, current: 1,
        sort: { column: 'power', direction: 'desc' },
        search: {  key: null, by: 'USER' },
      }

      const send = await axios.post(config.game.api.roles, post)
      const res = send.data
      if(!res.error){
        const { list } = res.data
        await DB.GameRankPower.insertMany(list.map((item : any) => ({
          process: processEvent._id,
          server: processEvent.server,
          account: item.account,
          role_name: item.role_name,
          role_id: item.role_id,
          power: item.power
        })))

        await DB.GameRankPowerProcessLog.create({
          process: processEvent._id,
          content: `Ghi dữ liệu lực chiến nhân vật`
        })
      }
      else {
        throw res.error
      }
    })
  }
  catch (e:any) {
  }
}