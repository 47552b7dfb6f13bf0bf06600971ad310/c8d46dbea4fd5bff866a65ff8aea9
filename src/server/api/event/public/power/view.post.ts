import { Types } from "mongoose"
import type { IAuth, IDBGameRankPowerUpProcess } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { fetchID, size, current, search } = body
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!fetchID) throw 'Không tìm thấy ID tiến trình'

    const processEvent = await DB.GameRankPowerUpProcess.findOne({ _id: fetchID }).select('server') as IDBGameRankPowerUpProcess
    if(!processEvent) throw 'Tiến trình không tồn tại'

    const match : any = {}
    if(!!search){
      match['$or'] = [
        { account: { $regex : search.toLowerCase(), $options : 'i' } },
        { role_id: { $regex : search.toLowerCase(), $options : 'i' } },
        { role_name: { $regex : search.toLowerCase(), $options : 'i' } },
      ]
    }
    
    const data = await DB.GameRankPowerUp.aggregate([
      {
        $lookup: {
          from: "GameRankPowerUpProcess",
          localField: "process",
          foreignField: "_id",
          as: "processData"
        }
      },
      { $unwind: "$processData" },
      { $match: { 
        process: new Types.ObjectId(processEvent._id),
        $expr: {
          $and: [
            { $gte: ["$createdAt", "$processData.start"] },
            { $lte: ["$createdAt", "$processData.end"] }
          ]
        }
      }},
      {
        $group: {
          _id: {
            account: "$account",
            role_id: "$role_id"
          },
          maxPower: { $max: "$power" },
          minPower: { $min: "$power" },
          role_name: { $first: "$role_name" }
        }
      },
      {
        $addFields: {
          account: "$_id.account",
          role_id: "$_id.role_id",
          power: { $subtract: ["$maxPower", "$minPower"] }
        }
      },
      {
        $setWindowFields: {
          sortBy: { power: -1 },
          output: {
            rank: { $rank: {} }
          }
        }
      },
      { $project: {
          _id: 0, maxPower: 0, minPower: 0
      }},
      { $match: match },
      {
        $facet: {
          list: [
            { $sort: { rank: 1 } },
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
      list: data[0].list ? data[0].list : [],
      total: data[0].pagination ? (data[0].pagination[0] ? data[0].pagination[0].total : 0) : 0
    }})
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})