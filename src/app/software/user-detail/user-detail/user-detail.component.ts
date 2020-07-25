import { Component, OnInit } from '@angular/core';
import { UserModel } from '../user.model'
@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  constructor() { }

  public userModel: UserModel = {
    Id: 0,
    UserName: "",
    Password: "",
    ConfirmPassword: "",
    FullName: "",
  }

  ngOnInit(): void {
  }


}
