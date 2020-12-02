const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ContractSchema = new Schema({
  title: String,
  clause: String,
});

const Contract = mongoose.model("contract", ContractSchema);

module.exports = Contract;
