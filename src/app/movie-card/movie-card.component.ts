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

@Component({
  selector: 'app-movie-card',
  imports: [MatCardModule, CommonModule, MatButtonModule, MatIconModule, NavbarComponent],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent implements OnInit {
  @Input() movies: any[] | null = null;
  favoriteMovies: string[] = [];
  username: string = localStorage.getItem('username') || '';

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog
  ) { }

ngOnInit(): void {
  if (!this.movies) {
    this.getMovies();
  }
  this.loadFavoriteMovies();
}

getMovies(): void {
  this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
    });
  }

  loadFavoriteMovies(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      this.favoriteMovies = parsedUser.FavoriteMovies || [];
    }
  }

  isFavorite(movieId: string): boolean {
    return this.favoriteMovies.includes(movieId);
  }

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
  


  showGenre(movie: any): void {
    this.dialog.open(MovieDetailsComponent, {
        data: {
            title: String(movie.Genre.Name).toUpperCase(),
            content: movie.Genre.Description
        },
        width: "400px"
    })
}
showDirector(movie: any): void {
    this.dialog.open(MovieDetailsComponent, {
        data: {
            title: movie.Director.Name,
            content: movie.Director.Biography
        },
        width: "400px"
    })
}
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
