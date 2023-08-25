import { Component } from '@angular/core';
import { Auth, getAuth } from "firebase/auth";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  public auth: Auth = getAuth();
}
