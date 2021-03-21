import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public isLoading: boolean;

  formGroupLogin;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private _usersService: UsersService,
    private toastr: ToastrService
    ) {

    this.formGroupLogin = this.formBuilder.group({
      email: ['', Validators.email],
      password: ['', Validators.required]
    });
  }



  ngOnInit(): void {
  }

  register(formData): void {
    var email = formData.value["email"];
    var password = formData.value['password'];
    this.isLoading = true;
    this._usersService.login(email, password)
      .subscribe(data => {
        this.router.navigate(['/mytasks']);
      }, loginError => {
        this.toastr.error("Email or Password Incorrect.")
        this.isLoading = false;
      });
  }
}
