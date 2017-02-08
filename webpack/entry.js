const DEV_MODE = (process.env.NODE_ENV !== 'production');

const getEntry = () => {
  if (DEV_MODE) {
    return require('./dev/entry');
  }

  return require('./prod/entry');
}

module.exports = getEntry();
