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

  openCreateTaskDialog(){
    const dialogRef = this.dialog.open(CreateTaskDialogComponent, {
      disableClose: true
    })

    dialogRef.afterClosed().subscribe(data => {
      console.log('Reached the afterClosed statement');
      console.log(data);
      if(data){
        console.log('Has data');
        console.log(data);
        this.taskService.createTask(this.empId, data).subscribe(res => {
          this.employee = res.data;
        }, err => {
          console.log(err);
        }, () => {
          this.todo = this.employee.todo;
          this.done = this.employee.done;
        })
      }
    })
  }

  drop(event: CdkDragDrop<any[]>){
    if(event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      console.log("Reordered item in existing column/array");
      this.updateTaskList(this.empId, this.todo, this.done);
    }
    else{
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex)
      console.log("Moved task item to a different column/array")
      this.updateTaskList(this.empId, this.todo, this.done);
    }
  }

  deleteTask(taskId: string): void {
    if(taskId){
      console.log(`Task item ${taskId} was deleted`);
      this.taskService.deleteTask(this.empId, taskId).subscribe(res => {
        this.employee = res.data;
      }, err => {
        console.log(err);
      }, () => {
        this.todo = this.employee.todo;
        this.done = this.employee.done;
      })
    }
  }

  createTask(): void {

  }


// Private functions

  private updateTaskList(empId: string, todo: Item[], done: Item[]): void {
    this.taskService.updateTask(empId,todo,done).subscribe(res => {
      this.employee = res.data;
    }, err => {
      console.log(err);
    }, () => {
      this.todo = this.employee.todo;
      this.done = this.employee.done;
    })
  }

}
