if(__PRODUCTION) {
  module.exports = require('./prod').default;
}else{
  module.exports = require('./dev').default;
}