import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { InterfacePrincipaleComponent } from './interface-principale/interface-principale.component';

const routes: Routes = [
  {path: 'interface-principale', component: InterfacePrincipaleComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' },  
  { path: 'login', component: LoginComponent }, 
  { path: 'register', component: RegisterComponent }, 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
