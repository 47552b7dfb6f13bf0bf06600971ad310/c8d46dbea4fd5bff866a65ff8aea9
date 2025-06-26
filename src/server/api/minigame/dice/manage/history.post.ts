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

    const histories = await DB.DiceHistory
    .aggregate([
      { $match: match },
      {
        $lookup: {
          from: "User",
          localField: "user",
          foreignField: "_id",
          pipeline: [{
            $project: {
              username: 1
            },
          }],
          as: "user"
        }
      },
      { $unwind: { path: '$user' }},
      {
        $project: {
          user: 1,
          dices: 1,
          my: 1,
          play: '$coin.play',
          receive: '$coin.receive',
          jar: '$coin.jar',
          createdAt: 1
        }
      },
      {
        $facet: {
          list: [
            { $sort: sorting },
            { $skip: (current - 1) * size },
            { $limit: size },
          ],
          pagination: [
            { $count: "total" }
          ]
        }
      }
    ])

    return resp(event, { result: { 
      list: histories[0].list ? histories[0].list : [],
      total: histories[0].pagination ? (histories[0].pagination[0] ? histories[0].pagination[0].total : 0) : 0
    }})
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})