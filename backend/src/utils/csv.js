const { stringify } = require('csv-stringify/sync');

const toCsv = (records) =>
  stringify(records, {
    header: true
  });

module.exports = {
  toCsv
};
