import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { size, current, sort } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1
    const match : any = {}

    const list = await DB.GameRankPowerUpProcess
    .find(match)
    .populate({ path: 'award.gift.item', select: 'item_id item_name item_image type'})
    .sort(sorting)
    .skip((current - 1) * size)
    .limit(size)

    let formatList = JSON.parse(JSON.stringify(list))
    formatList.forEach((processEvent : any) => {
      processEvent.award = processEvent.award.map((award : any) => ({
        rank: award.rank,
        gift: award.gift.map((gift : any) => ({
          _id: gift.item._id,
          item_id: gift.item.item_id,
          name: gift.item.item_name,
          image: gift.item.item_image,
          type: gift.item.type,
          amount: gift.amount
        }))
      }))
    })

    const total = await DB.GameRankPowerUpProcess.count(match)
    return resp(event, { result: { list: formatList, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})