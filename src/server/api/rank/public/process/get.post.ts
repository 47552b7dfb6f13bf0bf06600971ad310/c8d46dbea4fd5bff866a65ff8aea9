export default defineEventHandler(async (event) => {
  try {
    const { type, server } = await readBody(event)
    if(!type || !server) throw 'Dữ liệu đầu vào không đủ'

    const processEvent = await DB.GameRankProcess
    .findOne({ type: type, server: server })
    .populate({ path: 'award.gift.item', select: 'item_id item_name item_image type'})

    if(!processEvent) throw 'Sự kiện không tồn tại'

    let format = JSON.parse(JSON.stringify(processEvent))
    format.award = format.award.map((award : any) => ({
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

    return resp(event, { result: format })
  } 
  catch (e:any) {
    return resp(event, { result: null })
  }
})