import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private _http:HttpClient) { }

  addStudent(data:any){
    return this._http.post("http://localhost:3000/posts",data)
  }

  getStudent(){
    return this._http.get("http://localhost:3000/posts");
  }

  deleteStudent(id:number){
    return this._http.delete("http://localhost:3000/posts/"+id);
  }

  updateStudent(data:any,id:number){
    return this._http.put("http://localhost:3000/posts/"+id,data);
  }



}
