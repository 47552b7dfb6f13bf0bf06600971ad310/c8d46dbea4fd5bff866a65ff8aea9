import { IDBConfig, IAuth, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  try {
    const { password } = await readBody(event)
    if(!password) throw 'Vui lòng nhập đầy đủ thông tin'

    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const user = await DB.User.findOne({ _id: auth._id }).select('manage') as IDBUser
    if(!user) throw 'Tài khoản không khả dụng'

    const config = await DB.Config.findOne().select('gm_password telegram') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trang'

    // Nếu đã có cấu hình telegram
    if(!!config.telegram && !!config.telegram.manage){
      if(!!user.manage && !!user.manage.expired && !!user.manage.code){
        if (new Date(user.manage.expired) > new Date()){
          if(password != user.manage.code) throw 'Mã OTP không chính xác'
        }
        else throw 'Vui lòng tạo mã OTP mới'
      }
      else throw 'Vui lòng tạo mã OTP trước'
    }

    // Chưa có cấu hình telegram
    else {
      if(password != config.gm_password) throw 'Mã ủy quyền không hợp lệ'
    }

    setCookie(event, 'verify-manage', 'true', runtimeConfig.public.cookieManageConfig)
    return resp(event, { message: 'Xác thực quản trị viên thành công', result: '/manage' })
  } 
  catch (e:any) {
    deleteCookie(event, 'verify-manage', runtimeConfig.public.cookieManageConfig)
    return resp(event, { code: 400, message: e.toString() })
  }
})