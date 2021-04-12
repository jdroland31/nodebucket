/*
 * Title: Sprint 3 - Nodebucket;
 * Author: Professor Krasso
 * Date: 3/29/2021
 * Modified By: Jonathan Roland
 * Description: This application provides a TODO list to users to track work or study items;
*/

// This file provides an exportable interface for the Employee model.

import { Item } from './item.interface';

export interface Employee {
  empId: string;
  todo: Item[];
  doing: Item[];
  done: Item[];
}
