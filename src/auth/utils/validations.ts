export const username = {
  regexp: /^(?=.*[a-zA-Z])\w+$/,
  length: { min: 3, max: 64 },
};

export const password = {
  regexp: /^[\w\^[!"#$%&'()*+,\-./:;<=>?@]*$/,
  length: { min: 8, max: 256 },
};

export const name = {
  length: { min: 0, max: 256 },
};
