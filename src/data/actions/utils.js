const deepCopy = obj => (
  JSON.parse(JSON.stringify(obj))
);

export default deepCopy;
