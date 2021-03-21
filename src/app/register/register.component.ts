import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public isLoading: boolean;

  formGroupRegister;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private _usersService: UsersService) {

    this.formGroupRegister = this.formBuilder.group({
      email: ['', Validators.minLength(4)],
      password: ['', Validators.minLength(4)]
    });
  }


  ngOnInit(): void {
  }

  public isRegisterFieldValid(field: string) {
    return !this.formGroupRegister.get(field).valid && (this.formGroupRegister.get(field).dirty || this.formGroupRegister.get(field).touched);
  }

  register(formData): void {
    var email = formData.value["email"];
    var password = formData.value['password'];
    this.isLoading = true;
    this._usersService.register(email, password)
      .subscribe(data => {
        this.router.navigate(['/mytasks']);
      }, loginError => {
        this.isLoading = false;
      });
  }
}
