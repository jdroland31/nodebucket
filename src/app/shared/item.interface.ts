/*
 * Title: Sprint 3 - Nodebucket;
 * Author: Professor Krasso
 * Date: 3/29/2021
 * Modified By: Jonathan Roland
 * Description: This application provides a TODO list to users to track work or study items;
*/

// This file provides an exportable interface for the Item model.

export interface Item{
  _id: string;
  name: string;
  color: string;
  points: string;
  dueDate: string;
}
