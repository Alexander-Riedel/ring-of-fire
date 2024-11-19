import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Game } from '../../models/game';
import { Firestore, collection, collectionData, addDoc, updateDoc, doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})

export class StartScreenComponent {

  constructor(private firestore: Firestore, private router: Router) { }

  newGame() {
    let game: Game = new Game();

    // Zugriff auf die 'games'-Collection
    const gamesCollection = collection(this.firestore, 'games');

    // Hinzufügen eines neuen Dokuments in die Collection
    addDoc(gamesCollection, game.toJson())
      .then((gameInfo: any) => {
        console.log('Dokument erfolgreich hinzugefügt!', gameInfo);

        // START GAME
        this.router.navigateByUrl('/game/' + gameInfo.id);
      })
      .catch((error) => {
        console.error('Fehler beim Hinzufügen des Dokuments: ', error);
      });
  }

}
