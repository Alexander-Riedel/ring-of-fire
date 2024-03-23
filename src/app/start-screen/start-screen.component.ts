import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-startscreen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})

export class StartScreenComponent {

  constructor(private router: Router) {

  }

  newGame() {
    // Start game
    this.router.navigateByUrl('/game');
  }

}

