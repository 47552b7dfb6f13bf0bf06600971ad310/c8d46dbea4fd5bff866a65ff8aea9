import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'config.update')

    const data = await readBody(event)
    const { change, logo_image, game, enable } = data
    if(!change) throw 'Dữ liệu đầu vào không hợp lệ'
    
    if(change == 'enable') logAdmin(event, 'Cập nhật cài đặt <b>chức năng trang</b>')
    if(change == 'basic') logAdmin(event, 'Cập nhật thông tin <b>cơ bản</b> trang web')
    if(change == 'contact') logAdmin(event, 'Cập nhật thông tin <b>liên hệ</b> trang web')
    if(change == 'social') logAdmin(event, 'Cập nhật thông tin <b>mạng xã hội</b> trang web')
    if(change == 'game') logAdmin(event, 'Cập nhật cấu hình <b>trò chơi</b>')
    if(change == 'facebook') logAdmin(event, 'Cập nhật cấu hình <b>API Facebook</b>')
    if(change == 'google') logAdmin(event, 'Cập nhật cấu hình <b>API Google</b>')
    if(change == 'zalo') logAdmin(event, 'Cập nhật cấu hình <b>API Zalo</b>')
    if(change == 'tiktok') logAdmin(event, 'Cập nhật cấu hình <b>API Tiktok</b>')
    if(change == 'menu') logAdmin(event, 'Cập nhật cấu hình <b>Menu</b>')
    if(change == 'thankyou') logAdmin(event, 'Cập nhật cấu hình <b>Thank You</b>')
    if(change == 'promo') logAdmin(event, 'Cập nhật cấu hình <b>Khuyến Mãi</b>')

    // Game API
    if(change == 'game'){
      if(!!game.ip){
        data.game.api = {
          start: `http://${game.ip}/api/action/start.php`,
          server: `http://${game.ip}/api/action/server.php`,
          role: `http://${game.ip}/api/action/role.php`,
          roles: `http://${game.ip}/api/action/roles.php`,
          rank_level: `http://${game.ip}/api/action/rank_level.php`,
          rank_power: `http://${game.ip}/api/action/rank_power.php`,
          mail: `http://${game.ip}/api/action/mail.php`,
          recharge: `http://${game.ip}/api/action/recharge.php`,
          os: `http://${game.ip}/api/action/os.php`,
          reg: game.api ? game.api.reg : ''
        }
      }
    }

    // Referral
    if(change == 'enable'){
      if(!enable.referral) data.menu.event.referral = false
      if(!enable.play) !!IO && IO.emit('notice-reload', 'Trò chơi sắp bảo trì, vui lòng quay lại sau !')
      data.homepage.landing = !!data.homepage.landing || null
    }

    // Update
    delete data['_id']
    delete data['change']
    await DB.Config.updateMany({}, data)

    if(!!logo_image){
      await DB.User.updateMany({
        avatar: '/images/user/default.png'
      }, {
        avatar: logo_image
      })
    }

    !!IO && IO.emit('config-update')
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})