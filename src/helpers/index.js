import moment from 'moment';

export const isToday = (timestamps) => {
  return timestamps.isSame(moment(), 'day')
}
