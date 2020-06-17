import * as moment from 'moment';

export const groupBy = (xs: any[], key: string) => {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export const dateTruncate = (
  interval: moment.unitOfTime.StartOf,
  date: Date,
) => {
  return moment(date)
    .startOf(interval)
    .toDate();
};
