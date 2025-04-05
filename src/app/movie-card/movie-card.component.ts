import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatCardModule } from '@angular/material/card';
import { MatDialogContent } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MovieDetailsComponent } from '../movie-details/movie-details.component'
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../navbar/navbar.component';

/**
 * Component that displays a list of movies as cards,
 * allows users to add/remove favorites,
 * and opens dialogs for movie genre, director, or description.
 */
@Component({
  selector: 'app-movie-card',
  imports: [MatCardModule, CommonModule, MatButtonModule, MatIconModule, NavbarComponent],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent implements OnInit {

  /**
   * List of movies to display.
   * This can be passed in as an input from a parent component.
   */
  @Input() movies: any[] | null = null;
  @Input() showNavbar: boolean = true;

  /**
   * Array of favorite movie IDs for the logged-in user.
   */
  favoriteMovies: string[] = [];
  
  /**
   * Username of the logged-in user, retrieved from local storage.
   */
  username: string = localStorage.getItem('username') || '';

  /**
   * Constructor for MovieCardComponent.
   * @param fetchApiData - Service for API calls.
   * @param dialog - Angular Material dialog service.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog
  ) { }


  /**
   * Angular lifecycle hook that runs on component initialization.
   * Fetches movies and loads favorite movies from local storage.
   */
ngOnInit(): void {
  if (!this.movies) {
    this.getMovies();
  }
  this.loadFavoriteMovies();
}

  /**
   * Retrieves all movies from the API and stores them in the component.
   */
getMovies(): void {
  this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
    });
  }

  /**
   * Loads the user's favorite movies from local storage.
   */
  loadFavoriteMovies(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      this.favoriteMovies = parsedUser.FavoriteMovies || [];
    }
  }

  /**
   * Checks if a movie is in the user's favorites.
   * @param movieId - The ID of the movie to check.
   * @returns True if the movie is a favorite, false otherwise.
   */
  isFavorite(movieId: string): boolean {
    return this.favoriteMovies.includes(movieId);
  }

  /**
   * Toggles a movie's favorite status for the current user.
   * Adds if not present, removes if already in favorites.
   * @param movieId - The ID of the movie to toggle.
   */
  toggleFavorite(movieId: string): void {
    if (this.isFavorite(movieId)) {
      this.fetchApiData.removeFavoriteMovie(this.username, movieId).subscribe((updatedUser) => {
        this.favoriteMovies = updatedUser.FavoriteMovies; // Update local list
        localStorage.setItem("user", JSON.stringify(updatedUser));
      });
    } else {
      this.fetchApiData.addFavoriteMovie(this.username, movieId).subscribe((updatedUser) => {
        this.favoriteMovies = updatedUser.FavoriteMovies;
        localStorage.setItem("user", JSON.stringify(updatedUser));
      });
    }
  }
  
  /**
   * Opens a dialog displaying the genre information of a movie.
   * @param movie - The movie object.
   */
  showGenre(movie: any): void {
    this.dialog.open(MovieDetailsComponent, {
        data: {
            title: String(movie.Genre.Name).toUpperCase(),
            content: movie.Genre.Description
        },
        width: "400px"
    })
}

  /**
   * Opens a dialog displaying the director's information of a movie.
   * @param movie - The movie object.
   */
showDirector(movie: any): void {
    this.dialog.open(MovieDetailsComponent, {
        data: {
            title: movie.Director.Name,
            content: movie.Director.Biography
        },
        width: "400px"
    })
}

  /**
   * Opens a dialog displaying the detailed description of a movie.
   * @param movie - The movie object.
   */
showDetail(movie: any): void {
    this.dialog.open(MovieDetailsComponent, {
        data: {
            title: movie.Title,
            content: movie.Description
        },
        width: "600px",
    })
}
}
