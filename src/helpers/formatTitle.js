export default name => name.replace(/((?![a-zA-Z-]).)/g, '')
  .replace(/([a-z])([A-Z])/g, '$1 $2');
