
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

/**
 * Component for the user login form.
 * Handles user authentication and redirects to the movie view on success.
 */
@Component({
  selector: 'app-user-login-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent implements OnInit {

    /**
   * Object to hold user login credentials.
   * Contains username and password fields bound to the form.
   */
  @Input() userData = { Username: '', Password: '' };

    /**
   * Creates an instance of UserLoginFormComponent.
   * @param fetchApiData - Service for making API calls
   * @param dialogRef - Reference to the currently open dialog
   * @param snackBar - Material snackbar for notifications
   * @param router - Angular router for navigation
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    public router: Router
  ) { }

  
  /**
   * Angular lifecycle hook that runs after component initialization.
   */
  ngOnInit(): void {
  }

    /**
   * Submits the login form.
   * Sends user credentials to the API for authentication.
   * On success, stores user data in local storage and redirects to movies page.
   * On failure, shows an error snackbar message.
   */
  userLogin(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      (result) => {
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("token", result.token);
        localStorage.setItem("username", result.user.Username)
        
        this.snackBar.open('Login successful', 'OK', { duration: 2000 });
        this.dialogRef.close();
        setTimeout(() => {
          this.router.navigate(['/movies']);
        }, 200);
    },
    (error) => {
      this.snackBar.open('Login failed - ' + error.error, 'OK', { duration: 2000 });
      }
    );
  }

}