/*============================================;
Title: Sprint 3 - Nodebucket;
Author: Professor Krasso;
Date: 4/5/2021;
Modified By: Jonathan Roland;
Description: This application provides a TODO list to users to track work or study items.
===========================================*/

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-task-dialog',
  templateUrl: './create-task-dialog.component.html',
  styleUrls: ['./create-task-dialog.component.css']
})
export class CreateTaskDialogComponent implements OnInit {

  taskForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<CreateTaskDialogComponent>, private fb: FormBuilder) { }

  ngOnInit(): void {
    //Here we set the values that will be gathered from the form and their validation types.
    this.taskForm = this.fb.group({
      name: [null, Validators.compose([Validators.required])],//the name of the task is a required field.
      color: [null, Validators.pattern('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')], //Checking for color hex code.
      points: [null, Validators.pattern("^[0-9]")] //Make sure only whole numbers are passed in.
    })
  }
  //When this function is invoked it validates a task based on the taskForm fields as they are set when the dialog closes.
  createTask(){
    // console.log(this.taskForm.value);
    this.dialogRef.close(this.taskForm.value);
  }
  //This function closes the dialog without setting the form fields.
  cancel(){
    // console.log(this.taskForm.value);
    this.dialogRef.close();
  }

}
