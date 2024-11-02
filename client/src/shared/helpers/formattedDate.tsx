import dayjs from 'dayjs'

export const formatToHumanizeLastMessage = (date: string) => {
  const time = dayjs(date)
  const diffDays = dayjs(new Date()).diff(time, 'day', true)

  if (diffDays <= 1) {
    return `${time.format('LT')}`
  } else if (diffDays <= 7) {
    return `${time.format('dd')}`
  } else if (diffDays <= 28) {
    return `${time.format('DD MMM')}`
  } else {
    return `${time.format('ll')}`
  }
}

export const formatToHumanizeListMessage = (date: string) => {
  const time = dayjs(date)
  const diffDays = dayjs(new Date()).diff(time, 'day', true)

  if (diffDays <= 1) {
    return 'Today'
  } else if (diffDays <= 28) {
    return `${time.format('DD MMM')}`
  } else {
    return `${time.format('ll')}`
  }
}
