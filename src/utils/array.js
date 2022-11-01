const getTotal = (arr, propName) => arr.reduce((acum, curr) => acum + curr[propName], 0);

module.exports = {
  getTotal
};
