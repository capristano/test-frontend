import { Injectable } from '@angular/core';
import { MainService } from './main.service';
import { Observable } from 'rxjs';

@Injectable()
export class TaskService {
  private prefix_path = '/task';

  constructor(private _mainService: MainService) {}
    
  findOne(id: number): Observable<any> {
    const path = this.prefix_path + '/findOne/' + id;
    return this._mainService.get(path);
  }

  findAll(): Observable<any> {
    const path = this.prefix_path + '/findAll';
    return this._mainService.get(path);
  }

  delete(id: number): Observable<any> {
    const path = this.prefix_path + '/delete/' + id;
    return this._mainService.delete(path);
  }
  
  save(params: any): Observable<any> {
    const path = this.prefix_path + '/save';
    return this._mainService.put(path, params);
  }

}

