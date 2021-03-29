/*
 * Title: Sprint 2 - Nodebucket;
 * Author: Professor Krasso
 * Date: 3/28/2021
 * Modified By: Jonathan Roland
 * Description: This application provides a TODO list to users to track work or study items;
*/

//This file exports the item model via mongoose.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let itemSchema = new Schema({
  name: { type: String },
  color: { type: String },
  points: { type: String },
  dueDate: { type: String }
});

module.exports = itemSchema;
