import config from '../../config';

let databaseConfig;
config.forEach(
  (con) => (databaseConfig = con().database ? con().database : databaseConfig),
);
module.exports = databaseConfig;
