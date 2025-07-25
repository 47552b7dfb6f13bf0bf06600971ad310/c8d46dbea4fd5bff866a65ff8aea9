import { Types } from "mongoose"
import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { size, current, sort, user, range } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = {  }
    if(!!user){
      const users = await DB.User.find({
        username : { $regex : user.toLowerCase(), $options : 'i' }
      }).select('_id')
      
      match['user'] = {
        $in: users.map(i => new Types.ObjectId(i._id))
      }
    }
    if(!!range && !!range['start'] && !!range['end']){
      match['createdAt'] = { $gte: new Date(range['start']), $lte: new Date(range['end']) }
    }

    const list = await DB.DiceHistory
    .find(match)
    .populate({ path: 'user', select: 'username' })
    .sort(sorting)
    .skip((current - 1) * size)
    .limit(size)

    const total = await DB.DiceHistory.count(match)

    return resp(event, { result: { list, total }})
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})