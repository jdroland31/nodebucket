/*
 * Title: Sprint 2 - Nodebucket;
 * Author: Professor Krasso
 * Date: 3/28/2021
 * Modified By: Jonathan Roland
 * Description: This application provides a TODO list to users to track work or study items;
*/

//This file exports the employee model via mongoose.

const mongoose = require('mongoose');
const Item = require('./item');

let employeeSchema = mongoose.Schema({
  empId: { type: String, unique: true },
  todo: [Item],
  doing: [Item],
  done: [Item]
}, {collection: "employees"})

module.exports = mongoose.model("Employee", employeeSchema);
