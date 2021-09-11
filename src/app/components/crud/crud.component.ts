import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Student } from 'src/app/models/student';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';
  


@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit {

  studentMod: Student = new Student();
  closeResult: string | undefined;
  addStudentForm!: FormGroup;
  studVal!: any;

  constructor(private modalService: NgbModal, private _formBuilder: FormBuilder, private _api: ApiService,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.addStudentForm = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      contact: [, Validators.required],
    })
    this.getDetails();
  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  edit(editcontent: any, val:any) {
    this.studentMod.id= val.id;
    this.addStudentForm.get('firstName')?.setValue(val.firstName);
    this.addStudentForm.get('lastName')?.setValue(val.lastName);
    this.addStudentForm.get('contact')?.setValue(val.contact);
    this.modalService.open(editcontent, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  updateDetails(){
    this.studentMod.firstName = this.addStudentForm.get('firstName')?.value;
    this.studentMod.lastName = this.addStudentForm.get('lastName')?.value;
    this.studentMod.contact = this.addStudentForm.get('contact')?.value;
    this._api.updateStudent(this.studentMod,this.studentMod.id).subscribe(
      data =>{
        this.getDetails();
        this.toastr.success('Details updated successfully!', 'Note:');
      }
    )
    this.modalService.dismissAll();
    this.addStudentForm.reset()
    
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  submitDetails() {
    this.studentMod.firstName = this.addStudentForm.get('firstName')?.value;
    this.studentMod.lastName = this.addStudentForm.get('lastName')?.value;
    this.studentMod.contact = this.addStudentForm.get('contact')?.value;
    this._api.addStudent(this.studentMod).subscribe(
      data => {
        this.getDetails();
        this.toastr.success('Student added successfully!', 'Note:');
        console.log(data);
      }
    )
    this.modalService.dismissAll()
    this.addStudentForm.reset();
    
  }

  getDetails() {
    this._api.getStudent().subscribe(
      (data) => {
        this.studVal = data;
      }
    )
  }

  deleteStudent(id: any) {
    this._api.deleteStudent(id).subscribe(
      (data) => {
        this.getDetails();
        this.toastr.error('Student removed', 'Note:');
      }
    )
  }



}
