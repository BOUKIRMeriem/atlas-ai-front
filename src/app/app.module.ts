import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { MainLayoutComponent } from './MainLayout/MainLayout.component';
import { FormsModule } from '@angular/forms';
import { AutoResizeDirective } from './directives/auto-resize.directive';
import { ReactiveFormsModule } from '@angular/forms';  
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { NavbarComponent } from './MainLayout/navbar/navbar.component';
import { SidebarComponent } from './MainLayout/sidebar/sidebar.component';
import { MainContentComponent } from './MainLayout/main-content/main-content.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { provideFirestore, getFirestore } from '@angular/fire/firestore'; 
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    MainLayoutComponent,
    AutoResizeDirective,
    NavbarComponent,
    SidebarComponent,
    MainContentComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()), 
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    
  }
 }
