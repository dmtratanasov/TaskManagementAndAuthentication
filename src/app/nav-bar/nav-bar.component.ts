import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  public currentUser;

  constructor(private _usersService: UsersService,private router:Router) { }

  logout(){
    this._usersService.logout();
    this.router.navigate(['/login']);
  }
  

  ngOnInit(): void {
   this._usersService.currentUser$.subscribe((user)=>{
    this.currentUser = user;
   });
  }

}
