import * as moment from 'moment';
import 'moment-round';
console.log(moment().floor(1, 'hour'))

export const groupBy = (xs: any[], key: string) => {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export const roundDate = (
  precision: number,
  key: string,
  date: Date,
) => {
  return moment(date)
    .floor(precision, key)
    .toDate();
};

export const dateToLocaleString = (date: Date) => {
  return moment(date)
    .locale('uk')
    .format('DD.MM.YYYY HH:mm:ss');
};

export const dateToLocaleDateString = (date: Date) => {
  return moment(date)
    .locale('uk')
    .format('DD.MM.YYYY');
};
