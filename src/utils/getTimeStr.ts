
import dayjs from 'dayjs'

const getTimeStr = (num: number, template = 'YYYY-MM-DD HH:mm:ss') => dayjs(num).format(template)


export default getTimeStr
