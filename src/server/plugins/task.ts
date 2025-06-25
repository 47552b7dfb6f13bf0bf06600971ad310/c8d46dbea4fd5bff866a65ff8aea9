import cron from 'node-cron'

export default defineNitroPlugin(() => {
  cron.schedule('58 23 * * *', async () => {
    await rankPowerProcessWrite()
  }, {
    timezone: 'Asia/Ho_Chi_Minh'
  })

  cron.schedule('59 23 * * *', async () => {
    await rankPowerProcessAward()
  }, {
    timezone: 'Asia/Ho_Chi_Minh'
  })
})