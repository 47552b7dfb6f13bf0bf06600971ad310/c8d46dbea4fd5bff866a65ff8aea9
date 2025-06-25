import type { IAuth, IDBEgg } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'
    
    const config = await DB.Egg
    .findOne()
    .populate({ path: 'one.gift.item', select: 'item_id item_name item_image type' })
    .populate({ path: 'two.gift.item', select: 'item_id item_name item_image type' })
    .populate({ path: 'three.gift.item', select: 'item_id item_name item_image type' })
    .populate({ path: 'four.gift.item', select: 'item_id item_name item_image type' })
    .populate({ path: 'five.gift.item', select: 'item_id item_name item_image type' })
    .populate({ path: 'six.gift.item', select: 'item_id item_name item_image type' }) as IDBEgg
    if(!config) throw 'Không tìm thấy cấu hình xúc xắc'

    const result = JSON.parse(JSON.stringify(config)) as IDBEgg
    const row = ['one', 'two', 'three', 'four', 'five', 'six']
    row.forEach(name => {
      // @ts-expect-error
      result[`${name}`].gift = result[`${name}`].gift.map(i => ({
        _id: i.item._id,
        item_id: i.item.item_id,
        name: i.item.item_name,
        image: i.item.item_image,
        type: i.item.type,
        amount: i.amount,
        percent: i.percent
      }))
    })

    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})