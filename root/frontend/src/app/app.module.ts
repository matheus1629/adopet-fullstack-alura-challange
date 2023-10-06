import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonComponent } from './button/button.component';
import { BackgroundComponent } from './background/background.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { FooterComponent } from './footer/footer.component';
import { RegisterAdopterComponent } from './pages/register-adopter/register-adopter.component';
import { NgxMaskModule } from 'ngx-mask';
import { RegisterDonorComponent } from './pages/register-donor/register-donor.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileAdopterComponent } from './pages/profile-adopter/profile-adopter.component';

@NgModule({
  declarations: [
    AppComponent,
    BackgroundComponent,
    WelcomeComponent,
    FooterComponent,
    RegisterAdopterComponent,
    RegisterDonorComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    ProfileAdopterComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonComponent,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    HttpClientModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatRadioModule,
    MatMenuModule,
    MatButtonModule,
  ],
})
export class AppModule {}
