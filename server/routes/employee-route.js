/*
 * Title: Sprint 2 - Nodebucket;
 * Author: Professor Krasso
 * Date: 3/28/2021
 * Modified By: Jonathan Roland
 * Description: This application provides a TODO list to users to track work or study items;
*/

//This file provides the logic for interacting with the findEmployeeById API.

const express = require('express');
// const employee = require('../db-models/employee');
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
    //Attempt to query for a single employee by id using findOne().
    Employee.findOne({'empId':req.params.empId}, function(err, employee){
      if (err)
      {
        //If the database encounters an error, log the error to console and output as an object.
        console.log(err);
        const mongoDBErrorResponse = new BaseResponse('500',`MongoDB Native Error ${err.message}`,null);
        res.json(mongoDBErrorResponse.toObject());
      }
      else
      {
        //If successful, return the employee object the was found.
        console.log(employee);
        const employeeResponse = new BaseResponse('200','Successful Query', employee);
        res.json(employeeResponse.toObject());
      }
    })
  }
  catch(e)
  {
    //If the server encounters an error event, catch it, log it and return the error as an object.
    console.log(e);
    const findEmployeeCatchError = new BaseResponse('500',`Internal Server Error ${err.message}`,null);
    res.json(findEmployeeCatchError.toObject());
  }
})

/**
 * API: createTask
 * @param empId
 * @returns Employee document or null
 * This route creates a task and nests the task under the employee's 'todo' array.
 * The request body should contain the name, color, points and due date for the item.
*/
router.post('/:empId/tasks',async(req,res) => {
  try{
    //To start we find an employee by ID.
    Employee.findOne({'empId': req.params.empId}, function(err,employee){
      if(err)
      {
        //If the database encounters an error, log the error to console and output as an object.
        console.log(err);
        const createTaskMongoDBError = new BaseResponse('500', `MongoDB Exception ${err.message}`,null);
        res.status(500).send(createTaskMongoDBError.toObject());
      }
      else{
        //If an employee object is found, we create a task object (aka item).
        console.log(employee);
        if(employee)
        {
          //Use a regular expression check to ensure the color parameter of the request body uses a color hex value (ex. '#32a852').
          // let color = req.body.color;
          // //Credit for hex color code regex to StackOverflow user 'Joey', found at: https://stackoverflow.com/questions/1636350/how-to-identify-a-given-string-is-hex-color-format .
          // if(!'^#(?:[0-9a-fA-F]{3}){1,2}$'.test(color)){
          //   color = null;
          // }
          //We define the item by looking for it's parameters in the HTTP request body (with the exception of color, since we want to enforce hex color codes).
          const item = {
            name: req.body.name,
            // color: color,
            color: req.body.color,
            points: req.body.points,
            dueDate: req.body.dueDate
          }
          //The created task item is pushed into the todo array of the employee.
          employee.todo.push(item);
          //Now we attempt to save the updated employee document.
          employee.save(function(err, updatedEmployee){
            if (err)
            {
              //If the database encounters an error while attempting to save, log the error to console and output as an object.
              console.log(err);
              const createTaskOnSaveMongoDbError = new BaseResponse('500', `Mongo onSave() exception ${err.message}`,null);
              res.status(500).send(createTaskOnSaveMongoDbError.toObject());
            }
            else
            {
              //On success we log and return the updated employee document.
              console.log(updatedEmployee);
              const createTaskOnSaveSuccessResponse = new BaseResponse('200', 'Successful Query', updatedEmployee);
              res.status(200).send(createTaskOnSaveSuccessResponse.toObject());
            }
          })
        }
        else
        {
          //if the empId is invalid, log and return null along with error message. 200 code is returned since the request technically succeeded, but lacked a valid employee.
          console.log(`Invalid employeeId! The passed-in value was ${req.params.empId}`);
          const invalidCreateTaskEmployeeIdResponse = new BaseResponse('200','Invalid employee ID', employee);
          res.status(200).send(invalidCreateTaskEmployeeIdResponse.toObject());
        }
      }
    })
  }
  catch (e){
    //If the server encounters an error event, catch it, log it and return the error as an object.
    console.log(e);
    const createTaskCatchException = new BaseResponse('500', `Internal Server Error ${err.message}`,null);
    res.json(createTaskCatchException.toObject());

  }
})

/*
 * API: findAllTasks
 * @param empId
 * @returns Employee document or null
 * This routes returns an employee document (which contains all tasks under the employee's todo, doing and done arrays).
*/

router.get('/:empId/tasks', async(req,res) => {

  try
  {
    Employee.findOne({'empId': req.params.empId}, 'empId todo doing done', function(err, employee){
      if(err)
      {
        //If the database encounters an error, log the error to console and output as an object.
        console.log(err);
        const mongoDBFindAllTasksException = new BaseResponse('500',`Internal Server Error ${err.message}`,null);
        res.status(500).send(mongoDBFindAllTasksException.toObject());
      }
      else
      {
        if(employee)
        {
          console.log(employee);
          const employeeTaskResponse = new BaseResponse('200', 'Query Successful', employee);
          res.status(200).send(employeeTaskResponse.toObject());
        }
        else
        {
          //if the empId is invalid, log and return null along with error message. 200 code is returned since the request technically succeeded, but lacked a valid employee.
          console.log(`Invalid employeeId! The passed-in value was ${req.params.empId}`);
          const invalidFindAllTasksEmployeeIdResponse = new BaseResponse('200','Invalid employee ID', employee);
          res.status(200).send(invalidFindAllTasksEmployeeIdResponse.toObject());
        }
      }
    })
  }
  catch (e)
  {
    //If the server encounters an error event, catch it, log it and return the error as an object.
    console.log(e);
    const errorCatchResponse = new BaseResponse('500', `Internal Server Error ${err.message}`,null);
    res.status(500).send(errorCatchResponse.toObject());
  }
})

/*
 * API: updateTask
 * @param empId
 * @returns Employee document or null
 * This routes updates the todo and done array content for an employee with the current items per the request body.
*/

router.put('/:empId/tasks', async(req,res) => {
  try
  {
    Employee.findOne({'empId': req.params.empId}, function (err, employee)
    {
      if(err)
      {
        //If the database encounters an error, log the error to console and output as an object.
        console.log(err);
        const updateTaskMongoDBException = new BaseResponse('500',`Internal Server Error ${err.message}`,null);
        res.status(500).send(updateTaskMongoDBException.toObject());
      }
      else
      {
        //If no error and the employee is valid, proceed with updating tasks.
        console.log(employee);
        if(employee)
        {
          //Set the employee's todo and done arrays to match those in the request body.
          employee.set({
            todo: req.body.todo,
            doing: req.body.doing,
            done: req.body.done
          });
          //Save the new task data.
          employee.save(function(err, updatedEmployee){
            if(err)
            {
              //If the database encounters an error while attempting to update, log the error to console and output as an object.
              console.log(err);
              const updateTaskMongoDBError = new BaseResponse('500',`Internal Server Error ${err.message}`,null);
              res.status(500).send(updateTaskMongoDBError.toObject());
            }
            else
            {
              //If successful, log and return the updated employee document.
              console.log(updatedEmployee);
              const updatedTaskSuccessResponse = new BaseResponse('200', 'Query Successful', updatedEmployee);
              res.status(200).send(updatedTaskSuccessResponse.toObject());
            }
          })
        }
        else
        {
          //if the empId is invalid, log and return null along with error message. 200 code is returned since the request technically succeeded, but lacked a valid employee.
          console.log(`Invalid employeeId! The passed-in value was ${req.params.empId}`);
          const invalidEmployeeIdResponse = new BaseResponse('200','Invalid employee ID', employee);
          res.status(200).send(invalidEmployeeIdResponse.toObject());
        }
      }
    })
  }
  catch (e)
  {
    //If the server encounters an error event, catch it, log it and return the error as an object.
    console.log(e);
    const updateTaskCatchResponse = new BaseResponse('500',`Internal Server Error ${err.message}`,null);
    res.status(500).send(updateTaskCatchResponse.toObject());
  }
})

/*
 * API: deleteTask
 * @param empId
 * @param taskId
 * @returns Employee document or null
 * This routes deletes a specified task from either the todo or done array of a user.
*/

router.delete('/:empId/tasks/:taskId', async(req,res) => {
  try
  {
    //Pull the document record for an employee by their empId.
    Employee.findOne({'empId': req.params.empId}, function(err, employee){
      if(err)
      {
        //If the database encounters an error, log the error to console and output as an object.
        console.log(err);
        const deleteTaskMongoDbError = new BaseResponse('500',`Internal Server Error ${err.message}`,null);
        res.status(500).send(deleteTaskMongoDbError.toObject());
      }
      else
      {
        if(employee)
        {
          //If the empId is valid, log the employee document and copy the todo and done arrays to constants.
          console.log(employee);
          const todoItem = employee.todo.find(item => item._id.toString() === req.params.taskId);
          const doingItem = employee.doing.find(item => item._id.toString() === req.params.taskId);
          const doneItem = employee.done.find(item => item._id.toString() === req.params.taskId);
          //If the item to remove (identified by the _id property) is in the todo array, attempt to delete it.
          if(todoItem)
          {
            console.log(todoItem);

            employee.todo.id(todoItem._id).remove();
            //Attempt to save the updated employee.
            employee.save(function(err, updatedTodoItemEmployee) {
              if(err)
              {
                //If an error is encountered, log the error and return it as an object to the user.
                console.log(err);
                const deleteTodoItemMongoDbError = new BaseResponse('500', `Internal Server Error ${err.message}`,null);
                res.status(500).send(deleteTodoItemMongoDbError.toObject());
              }
              else{
                //Otherwise log the updated employee and return it in the success response.
                console.log(updatedTodoItemEmployee);
                const deleteTodoItemSuccess = new BaseResponse('200', 'Query successful', updatedTodoItemEmployee);
                res.status(200).send(deleteTodoItemSuccess.toObject());
              }
            })
          }
          //If the item to remove (identified by the _id property) is in the doing array, attempt to delete it.
          else if (doingItem)
          {
            console.log(doingItem);
            employee.doing.id(doingItem._id).remove();
            //Attempt to save the updated employee.
            employee.save(function(err, updatedDoingItemEmployee) {
              if(err)
              {
                //If an error is encountered, log the error and return it as an object to the user.
                console.log(err);
                const deleteDoingItemMongoDbError = new BaseResponse('500',`Internal Server Error ${err.message}`,null);
                res.status(500).send(deleteDoingItemMongoDbError.toObject());
              }
              else{
                //Otherwise log the updated employee and return it in the success response.
                console.log(updatedDoingItemEmployee);
                const deleteDoingItemSuccess = new BaseResponse('200','Query successful', updatedDoingItemEmployee);
                res.status(200).send(deleteDoingItemSuccess.toObject());
              }
            })
          }
          //If the item to remove (identified by the _id property) is in the done array, attempt to delete it.
          else if (doneItem)
          {
            console.log(doneItem);
            employee.done.id(doneItem._id).remove();
            //Attempt to save the updated employee.
            employee.save(function(err, updatedDoneItemEmployee) {
              if(err)
              {
                //If an error is encountered, log the error and return it as an object to the user.
                console.log(err);
                const deleteDOneItemMongoDbError = new BaseResponse('500',`Internal Server Error ${err.message}`,null);
                res.status(500).send(deleteDOneItemMongoDbError.toObject());
              }
              else{
                //Otherwise log the updated employee and return it in the success response.
                console.log(updatedDoneItemEmployee);
                const deleteDoneItemSuccess = new BaseResponse('200','Query successful', updatedDoneItemEmployee);
                res.status(200).send(deleteDoneItemSuccess.toObject());
              }
            })
          }
          else
          {
            //if the empId is invalid, log and return null along with error message. 200 code is returned since the request technically succeeded, but lacked a valid employee.
            console.log(`Invalid taskId! The passed-in value was ${req.params.taskId}`);
            const invalidTaskIdResponse = new BaseResponse('200', 'Invalid taskId', null);
            res.status(200).send(invalidTaskIdResponse.toObject());
          }
        }
        else
        {
          //if the empId is invalid, log and return null along with error message. 200 code is returned since the request technically succeeded, but lacked a valid employee.
          console.log(`Invalid employeeId! The passed-in value was ${req.params.empId}`);
          const invalidDeleteTaskEmployeeIdResponse = new BaseResponse('200','Invalid employee ID', employee);
          res.status(200).send(invalidDeleteTaskEmployeeIdResponse.toObject());
        }

      }
    })
  }
  catch (e)
  {
    //If the server encounters an error event, catch it, log it and return the error as an object.
    console.log(e);
    const deleteTaskCatchError = new BaseResponse('500', `Internal Server Error ${err.message}`,null);
    res.status(500).send(deleteTaskCatchError.toObject());
  }
})
//Export the API routes to the router.
module.exports = router;
