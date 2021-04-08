/*============================================;
Title: Sprint 1 - Nodebucket;
Author: Professor Krasso;
Date: 3/20/2021;
Modified By: Jonathan Roland;
Description: This application provides a TODO list to users to track work or study items.
===========================================*/

//This file provides the home component for the application.

import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Employee } from 'src/app/shared/employee.interface';
import { Item } from 'src/app/shared/item.interface';
import { TaskService } from 'src/app/shared/task.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateTaskDialogComponent } from 'src/app/shared/create-task-dialog/create-task-dialog.component';
import { CdkDragDrop,moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  todo: Item[];
  done: Item[];
  employee: Employee;
  empId: string;
  //When the home component is loaded we get the user's ID from the session and request their task data from the back end. This is used to set the displayed data when the view loads.
  constructor(private taskService: TaskService, private cookieService: CookieService, private dialog: MatDialog) {
    this.empId = this.cookieService.get('session_user');
    this.taskService.findAllTasks(this.empId).subscribe(res => {
      console.log('--Server response from findAllTasks--');
      console.log(res);
      this.employee = res.data;
      console.log('--Employee object--');
      console.log(this.employee);

    }, err => {
      console.log(err);
    }, () => {
      // on complete
      this.todo = this.employee.todo;
      this.done = this.employee.done;
      console.log('This is in the complete section');
      console.log(this.todo);
      console.log(this.done);
    }
    )

   }

  ngOnInit(): void {
  }
//This function fills the dialog with the create task component and sets an option to disable close. It can only be closed by clicking the Cancel button.
  openCreateTaskDialog(){
    const dialogRef = this.dialog.open(CreateTaskDialogComponent, {
      disableClose: true
    })
    //When the dialog closes, if data has been set the subscriber will pick it up.
    dialogRef.afterClosed().subscribe(data => {
      console.log(data);
      //if the subscriber picks up data it will call the createTask() function and pass the data to it to create a task.
      if(data){
        console.log(data);
        this.taskService.createTask(this.empId, data).subscribe(res => {
          this.employee = res.data;
        }, err => {
          console.log(err);
        }, () => {
          this.todo = this.employee.todo;
          this.done = this.employee.done;
          console.log('A new task was created.');
        })
      }
    })
  }
//This function utilizes a drag/drop event to move task data between the doing and done columns for the user.
  drop(event: CdkDragDrop<any[]>){
    //If the container being dropped to is the same as the container picked up from, the item is reordered in that task column.
    if(event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);//This is a CDKDragDrop function to reorder items in a drag/drop list.
      console.log("Reordered item in existing column/array");
      this.updateTaskList(this.empId, this.todo, this.done);//The updateTaskList() function is called to synchronize user's data with the backend.
    }
    //If the column being dropped to is a different column, the user's task lists (to do and done) are updated according to the new arrangement.
    else{
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);//This is a CDKDragDrop function to move items between drag/drop lists.
      console.log("Moved task item to a different column/array");
      this.updateTaskList(this.empId, this.todo, this.done);//The updateTaskList() function is called to synchronize user's data with the backend.
    }
  }
//This function is used to delete old tasks that no longer need to be tracked.
  deleteTask(taskId: string): void {
    if(taskId){
      this.taskService.deleteTask(this.empId, taskId).subscribe(res => {
        this.employee = res.data;
      }, err => {
        console.log(err);
      }, () => {
        this.todo = this.employee.todo;
        this.done = this.employee.done;
        console.log(`Task item ${taskId} was deleted`);
      })
    }
  }


// Private functions

//This function takes in an employee id and their todo and done item arrays and calls the task service to update them.
  private updateTaskList(empId: string, todo: Item[], done: Item[]): void {
    this.taskService.updateTask(empId,todo,done).subscribe(res => {
      this.employee = res.data;
    }, err => {
      console.log(err);
    }, () => {
      this.todo = this.employee.todo;
      this.done = this.employee.done;
      console.log(`User ${empId}'s task lists were updated`);
    })
  }

}
