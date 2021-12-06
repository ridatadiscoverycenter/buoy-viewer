export const formatVariable = ({ name, units }) => {
  if (units) {
    return `${name} (${units})`;
  } else {
    return name;
  }
};
