const { randomUUID } = require("crypto");

const runtimeStore = {
  users: [],
  subjects: [],
  plans: [],
};

const createId = () => randomUUID();

module.exports = { runtimeStore, createId };
