import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';

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
    private _usersService: UsersService) {

    this.formGroupLogin = this.formBuilder.group({
      email: ['', Validators.email],
      password: ['', Validators.required]
    });
  }


  public isRegisterFieldValid(field: string) {
    return !this.formGroupLogin.get(field).valid && (this.formGroupLogin.get(field).dirty || this.formGroupLogin.get(field).touched);
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
        this.isLoading = false;
      });
  }
}
