import { AuthService } from './../auth.service';
import { ApiService } from '../api.service';
import { Component } from '@angular/core';
import {
  Validators,
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
// import { FrontHeaderComponent } from '../front-header/front-header.component';
// import { FrontFooterComponent } from '../front-footer/front-footer.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    HttpClientModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  showPassword: boolean = false;
  error: any;
  loginForm: any;
  loginError: boolean = false;
  forgotLink: boolean = false;
  resend_registration_email: boolean = false;
  forgotPasswordFormShow = false;
  registration_link_sent = false;
  captchaError = false;
  forgotClass = '';

  forgotPasswordForm: any;
  loginSuccess = false;
  data: any;
  submitted = false;
  loading = false;
  loginPhoneError = false;

  brand_details: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    this.forgotPasswordForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
    });
    if (this.apiService.LoggedInUser) {
      this.router.navigate(['./dashboard']);
    }

    $('#loaderouterid').css('display', 'flex');
    this.apiService
      .get_brand_by_id({ brand_id: environment.brand_id })
      .subscribe((response: any) => {
        this.brand_details = response[0];
        $('#loaderouterid').css('display', 'none');
      });
  }

  login() {
    $('#loaderouterid').css('display', 'flex');
    let loginform: any = this.loginForm.controls;
    this.authService
      .login(
        loginform.username.value,
        loginform.password.value,
        this.brand_details.name
      )
      .subscribe(
        (data: any) => {
          localStorage.setItem('token', data['token']);

          this.apiService.LoggedInUser = data['user'];
          localStorage.setItem('currentUser', JSON.stringify(data['user']));

          let decodedData: any = localStorage.getItem('token');
          decodedData = JSON.parse(localStorage.getItem('currentUser') as any);

          if (
            decodedData.roles &&
            decodedData.roles.includes('istaff_employee')
          ) {
            localStorage.setItem('currentActiveRole', 'istaff_employee');
          } else if (
            decodedData.roles &&
            decodedData.roles.includes('istaff_customer')
          ) {
            localStorage.setItem('currentActiveRole', 'istaff_customer');
          }

          setTimeout(() => {
            $('#loaderouterid').css('display', 'none');
            let urlRed = data['user'].frontend_home_page.find(
              (x: { id: any }) => x.id == environment.brand_id
            )?.url;
            if (urlRed) {
              this.router.navigate(['./dashboard/' + urlRed]);
            } else {
              this.router.navigate(['./dashboard']);
            }
          }, 2000);
        },
        (error: any) => {
          this.loginError = true;

          console.log('Error came here from login');
          console.log(error);

          if (
            error.includes('Nach 4 Versuchen wird Ihr Konto gesperrt') ||
            error.includes('Passwort vergessen?')
          ) {
            this.forgotLink = true;
          } else if (error.includes('Registrierungs E-Mail erneut senden')) {
            this.resend_registration_email = true;
          }

          this.error = error;
          //this.message = error.message;
          console.error(error.message);
          console.log('Error', error['error']);

          setTimeout(() => {
            $('#loaderouterid').css('display', 'none');
            this.router.navigate(['./login']);
          }, 2000);
        }
      );
  }

  public next(): any {
    this.submitted = true;

    if (this.forgotPasswordForm.invalid) {
      return this.router.navigate(['./login']);
    }
    this.loading = true;

    let loginform: any = this.loginForm.controls;

    if (loginform.username.value) {
      this.authService
        .checkEmail(this.forgotPasswordForm.value.username)
        .pipe(first())
        .subscribe((data: any) => {
          $('#loaderouterid').css('display', 'flex');
          if (data['status'] == 200) {
            this.loginError = false;
            this.authService
              .send_reset_password_email(this.forgotPasswordForm.value.username)
              .pipe(first())
              .subscribe(
                (data: any) => {
                  console.log('data', data);
                  if (data['status'] == 200) {
                    this.forgotLink = false;
                    this.loginSuccess = true;
                    this.data = data;
                    setTimeout(() => {
                      this.loginError = false;
                      this.loginSuccess = false;
                      this.forgotPasswordFormShow = false;
                      $('#loaderouterid').css('display', 'none');
                      this.forgotPasswordForm.patchValue({ username: '' });
                    }, 4000);
                  } else {
                    this.data = data;
                    this.loginError = true;
                    this.forgotLink = false;
                    $('#loaderouterid').css('display', 'none');
                  }
                },
                (error: any) => {
                  this.loginPhoneError = true;
                  console.error(error.message);
                  console.log('Error', error['error']);
                  this.router.navigate(['./']);
                }
              );
          } else {
            this.loginError = true;
            this.loginSuccess = false;
          }
        });
    }
  }

  forgotPassword() {
    this.forgotPasswordFormShow = true;
    this.loginError = false;
    this.forgotClass = 'forgotCls';
  }

  backToForgotPassword() {
    this.forgotPasswordFormShow = false;
  }
}
