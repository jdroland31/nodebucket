/*============================================;
Title: Sprint 3 - Nodebucket;
Author: Professor Krasso;
Date: 4/5/2021;
Modified By: Jonathan Roland;
Description: This application provides a TODO list to users to track work or study items.
===========================================*/

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from './item.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }
  /**
   *
   * @param empId the employee id string
   * @returns an Observable of type any
   */
  findAllTasks(empId: string): Observable<any> {

    return this.http.get('/api/employees/' + empId + '/tasks');

  }

  /**
   *
   * @param empId
   * @param task
   * @returns
   */
  createTask(empId: string, task: any): Observable<any> {
    console.log(task);
    return this.http.post('/api/employees/'+ empId +'/tasks', {
      name: task.name,
      color: task.color,
      points: task.points
    })
  }

  /**
   *
   * @param empId
   * @param todo
   * @param doing
   * @param done
   * @returns
   */
  updateTask(empId: string, todo: Item[], doing: Item[], done: Item[]): Observable<any> {
    return this.http.put('/api/employees/'+empId+'/tasks',{
      todo,
      doing,
      done
    })
  }

  /**
   *
   * @param empId
   * @param taskId
   * @returns
   */
  deleteTask(empId: string, taskId: string): Observable<any> {
    return this.http.delete('/api/employees/'+empId+'/tasks/'+taskId);
  }
}
