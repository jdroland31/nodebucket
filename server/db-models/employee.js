/*
 * Title: Sprint 1 - Nodebucket;
 * Author: Professor Krasso
 * Date: 3/20/2021
 * Modified By: Jonathan Roland
 * Description: This application provides a TODO list to users to track work or study items;
*/

//This file exports the employee model via mongoose.

const mongoose = require('mongoose');

let employeeSchema = mongoose.Schema({
  empId: { type: String, unique: true }
}, {collection: "employees"})

module.exports = mongoose.model("Employee", employeeSchema);