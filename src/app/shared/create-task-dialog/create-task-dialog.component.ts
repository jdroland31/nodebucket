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
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-create-task-dialog',
  templateUrl: './create-task-dialog.component.html',
  styleUrls: ['./create-task-dialog.component.css']
})
export class CreateTaskDialogComponent implements OnInit {

  taskForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<CreateTaskDialogComponent>, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      name: [null, Validators.compose([Validators.required])],
      color: [null, Validators.pattern('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$')], //Checking for color hex code.
      points: [null, Validators.pattern("^[0-9]")] //Make sure only whole numbers are passed in.
      // name: [],
      // color: [], //Checking for color hex code.
      // points: [] //Make sure only whole numbers are passed in.
    })
  }

  createTask(){
    console.log(this.taskForm.value);
    this.dialogRef.close(this.taskForm.value);
  }

  cancel(){
    console.log(this.taskForm.value);
    this.dialogRef.close();
  }

}
