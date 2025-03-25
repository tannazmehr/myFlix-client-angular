import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserRegistrationFormComponent } from './user-registration-form/user-registration-form.component';
import { MatDialog } from '@angular/material/dialog';
import { UserLoginFormComponent } from './user-login-form/user-login-form.component'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'myFlix-client-angular';

  constructor(public dialog: MatDialog) { }

  openUserRegistrationDialog(): void {
      this.dialog.open(UserRegistrationFormComponent, {
      width: '280px'
      });
    }

    openUserLoginDialog(): void {
      this.dialog.open(UserLoginFormComponent, {
        width: '280px',
      });
    }
}
