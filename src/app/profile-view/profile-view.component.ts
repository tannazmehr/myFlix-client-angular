import { Component, importProvidersFrom, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { MovieCardComponent } from '../movie-card/movie-card.component';
/**
 * ProfileViewComponent
 * 
 * Displays and manages the user's profile, including updating profile data and deleting the account.
 * Also lists the user's favorite movies.
 */
@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MovieCardComponent
  ],
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.scss',
})
export class ProfileViewComponent implements OnInit {
  /**
   * Stores the logged-in user's username (from localStorage).
   */
  username: string | null = '';

  
  /**
   * Object bound to the profile form, containing editable user fields.
   */
  userData = { Username: '', Password: '', Email: '', Birthday: '' };

  /**
   * List of all movies fetched from the API.
   */
  allMovies: any[] = [];

  /**
   * Filtered list of the user's favorite movies.
   */
  favoriteMovies: any[] = [];
  
  /**
   * @constructor Injects required services for data handling, navigation, and UI feedback.
   * @param fetchApiData - Service to handle API requests
   * @param snackBar - Snackbar service for user feedback
   * @param router - Angular router for navigation
   */
  constructor(
    private fetchApiData: FetchApiDataService,
    private snackBar: MatSnackBar,
    private router: Router) {}

  /**
   * Angular lifecycle method that runs on component initialization.
   * Fetches user and favorite movie data from localStorage and API.
   */
  ngOnInit(): void {
    this.username = localStorage.getItem('username'); // Retrieve username
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const favoriteIds: string[] = storedUser.FavoriteMovies || [];
  
    /**
     * Get all movies and filter by favorites
     */
    this.fetchApiData.getAllMovies().subscribe((movies: any[]) => {
      this.allMovies = movies;
      this.favoriteMovies = movies.filter(movie => favoriteIds.includes(movie._id));
    });
  }

  /**
   * Submits the profile update form and saves the new user data.
   */
  updateUserProfile(): void {
    this.fetchApiData.editUser(this.userData).subscribe({
      next: (response) => {
        this.snackBar.open('Profile updated successfully!', 'OK', { duration: 2000 });
        localStorage.setItem('username', response.Username); // Update stored username if changed
      },
      error: (error) => {
        this.snackBar.open('Update failed: ' + error.message, 'OK', { duration: 3000 });
      }
    });
  }

  /**
   * Deletes the current user's account after confirmation.
   * Clears local storage and redirects to the welcome screen.
   */
  onDeleteUser(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Make sure the deleteUser method in your service accepts the username as a parameter.
      this.fetchApiData.deleteUser(this.username as string).subscribe({
        next: (response) => {
          this.snackBar.open('Your account has been deleted successfully!', 'OK', { duration: 3000 });
          localStorage.clear();
          // Optionally navigate to a welcome or login page
          this.router.navigate(['/welcome']);
        },
        error: (error) => {
          this.snackBar.open('Error deleting your account: ' + error.message, 'OK', { duration: 3000 });
        }
      });
    }
  }
}
