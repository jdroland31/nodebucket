/*
 * Title: Sprint 1 - Nodebucket;
 * Author: Professor Krasso
 * Date: 3/20/2021
 * Modified By: Jonathan Roland
 * Description: This application provides a TODO list to users to track work or study items;
*/

//This file provides the logic for interacting with the findEmployeeById API.

const { response } = require('express');
const express = require('express');
const Employee = require("../db-models/employee");
const BaseResponse = require('../service/base-response');

const router = express.Router();

/**
 * API: findEmployeeById
 * @param empId
 * @returns Employee document or null
 * This route gets a single employee by ID and provides data or error handling as appropriate.
 */
router.get('/:empId', async(req,res) => {
  try
  {
    Employee.findOne({'empId':req.params.empId}, function(err, employee){
      if (err)
      {
        console.log(err);
        const mongoDBErrorResponse = new BaseResponse('500','MongoDB Native Error: '+err,null);
        res.json(mongoDBErrorResponse.toObject());
      }
      else
      {
        console.log(employee);
        const employeeResponse = new BaseResponse('200','Successful Query', employee);
        res.json(employeeResponse.toObject());
      }
    })
  }
  catch(e)
  {
    console.log(e);
    const findEmployeeCatchError = new BaseResponse('500','Internal Server Error', null);
    res.json(findEmployeeCatchError.toObject());
  }
})

module.exports = router;
