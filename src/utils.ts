import * as moment from 'moment';
import * as momentTz from 'moment-timezone';
import 'moment-round';

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
  return momentTz(date)
    .tz('Europe/Kiev')
    .format('DD.MM.YYYY HH:mm:ss');
};

export const dateToLocaleDateString = (date: Date) => {
  return momentTz(date)
    .tz('Europe/Kiev')
    .format('DD.MM.YYYY');
};
