import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

const apiUrl = 'https://mymoviecircle-50f243eb6efe.herokuapp.com/';

/**
 * Service for interacting with the Movie API.
 * Handles user authentication, user management, movie data, and favorites.
 */
@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {

  /**
   * @param http - Angular HttpClient used to make API calls
   */
  constructor(private http: HttpClient) {}

  /**
   * Registers a new user.
   * @param userDetails - Object containing user registration info
   * @returns An observable of the HTTP response
   */
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'users', userDetails, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      map((response) => {
        return response;
      }),
    catchError(this.handleError)
    );
  }

  /**
   * Logs in a user and stores the JWT token.
   * @param userDetails - Object with username and password
   * @returns An observable with the login result
   */
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      map((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        return response;
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Generates auth headers with the stored JWT token.
   * @returns HTTP headers including the Authorization token
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Fetches all movies from the API.
   * @returns An observable containing a list of movies
   */
  public getAllMovies(): Observable<any> {
    return this.http
      .get(apiUrl + 'movies', { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Fetches details for a single movie by ID.
   * @param movieId - The ID of the movie
   * @returns An observable with movie details
   */
  public getMovie(movieId: string): Observable<any> {
    return this.http
      .get(apiUrl + `movies/${movieId}`, { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Fetches information about a director.
   * @param directorName - Name of the director
   * @returns An observable with director data
   */
  public getDirector(directorName: string): Observable<any> {
    return this.http
      .get(apiUrl + `directors/${directorName}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Fetches information about a genre.
   * @param genreName - Name of the genre
   * @returns An observable with genre data
   */
  public getGenre(genreName: string): Observable<any> {
    return this.http
      .get(apiUrl + `genres/${genreName}`, { headers: this.getAuthHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Updates the current user's data.
   * @param updatedDetails - Object containing updated user information
   * @returns An observable of the update response
   */
  public editUser(updatedDetails: any): Observable<any> {
    return this.http
      .put(apiUrl + 'users/'+ updatedDetails.Username, updatedDetails, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Deletes the specified user account.
   * @param username - The username of the account to delete
   * @returns An observable of the deletion result
   */
  public deleteUser(username: string): Observable<any> {
    return this.http
      .delete(apiUrl + 'users/' + username, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

    /**
     * Adds a movie to the user's favorites list.
     * @param username - Username of the user
     * @param movieId - ID of the movie to add
     * @returns An observable of the updated user data
     */
    public addFavoriteMovie(username: string, movieId: string): Observable<any> {
      return this.http
        .post(
          `${apiUrl}users/${username}/movies/${movieId}`,
          {},
          { headers: this.getAuthHeaders() },
        )
        .pipe(catchError(this.handleError));
    }

  /**
   * Removes a movie from the user's favorites list.
   * @param username - Username of the user
   * @param movieId - ID of the movie to remove
   * @returns An observable of the updated user data
   */
  public removeFavoriteMovie(username: string, movieId: string): Observable<any> {
    return this.http
      .delete(
        `${apiUrl}users/${username}/movies/${movieId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Extracts and returns the response body.
   * @param res - The response object
   * @returns The response body or empty object
   */
  private extractResponseData(res: any): any {
    return res || {};
  }

  /**
   * Handles errors from HTTP requests.
   * @param error - The HTTP error response
   * @returns A user-facing error message
   */
private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
    console.error('Some error occurred:', error.error.message);
    } else {
    console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(
      () => ('Something bad happened; please try again later.'));
  }
}
