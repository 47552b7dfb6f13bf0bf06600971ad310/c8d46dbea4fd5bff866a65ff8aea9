export default defineEventHandler(async (event) => {
  try {
    const list = await DB.GameRankPowerProcess
    .find({ active: true })
    .populate({ path: 'award.gift.item', select: 'item_id item_name item_image type'})

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

    return resp(event, { result: formatList })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})