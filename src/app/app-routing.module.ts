import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './guards/auth.guard'

export const routes: Routes = [
  {
    path: '',
    children:
      [
        {
          path: 'mytasks', component: MyTasksComponent, pathMatch: 'full', data: { breadcrumb: 'My Tasks' }, canActivate:[AuthGuard]
        },
        {
          path: 'login', component: LoginComponent, pathMatch: 'full', data: { breadcrumb: 'Login' },
        },
        {
          path: 'register', component: RegisterComponent, pathMatch: 'full', data: { breadcrumb: 'Register' },
        },
      ]
  },

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
