import { Component, OnInit , Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';
@Component({
  selector: 'app-movie-details',
  imports: [MatCard, MatCardHeader,MatCardTitle, MatCardContent, MatCardActions],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss'
})
export class MovieDetailsComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string, content: string },
    public dialogRef: MatDialogRef<MovieDetailsComponent>
  ) {}

  ngOnInit(): void {}

  closeMovieDetails(): void {
    this.dialogRef.close();
  }
}
