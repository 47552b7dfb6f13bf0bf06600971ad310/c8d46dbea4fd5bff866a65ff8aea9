import axios from 'axios'

interface ISendData {
  url: string
  secret?: string
  message: string
}

export default async (data : ISendData) : Promise<boolean> => {
  try {
    if(!data.url || !data.message) throw 'Thiếu URL hoặc tin nhắn'

    await axios.post(data.url, data)
    return true
  }
  catch (e:any) {
    throw e.toString()
  }
}