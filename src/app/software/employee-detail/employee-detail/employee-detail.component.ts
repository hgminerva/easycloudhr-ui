import { Component, OnInit } from '@angular/core';
import { EmployeeModel } from './../employee.model';
@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public employeeModel: EmployeeModel = {
    Id: 0,
    EmployeeCode: '',
    IdNumber: 0,
    BiometricIdNumber: '',
    LastName: '',
    FirstName: '',
    MiddleName: '',
    ExtensionName: '',
    FullName: '',
    Address: '',
    ZipCode: '',
    ContactNumber: '',
    ContactMobileNumber: '',
    EmailAddress: '',
    DateOfBirth: new Date(),
    PlaceOfBirth: '',
    Sex: '',
    CivilStatus: '',
    Citizenship: '',
    Height: '',
    Weight: '',
    BloodType: '',
    Remarks: '',
    PictureURL: '',
    CompanyId: 0,
    UserId: 0,
    User: '',
    CreatedByUserId: 0,
    CreatedByUser: '',
    CreatedDateTime: new Date(),
    UpdatedByUserId: 0,
    UpdatedByUser: '',
    UpdatedDateTime: new Date(),
    IsLocked: false
  }
  public isLocked: boolean = false;
  public isProgressBarHidden: boolean = false;


}
