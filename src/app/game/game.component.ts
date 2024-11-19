import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from "../player/player.component";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from "../game-info/game-info.component";
import { Firestore, doc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    GameInfoComponent
  ],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  game: Game = new Game();
  gameId: string = '';
  firestore: Firestore = inject(Firestore);
  unsubscribeFromSnapshot: (() => void) | null = null;

  constructor(private route: ActivatedRoute, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const gameId = params['id'];
      console.log('Game ID:', gameId);

      this.gameId = gameId;

      if (gameId) {
        const gameDocRef = doc(this.firestore, 'games', gameId);

        // Echtzeit-Listener mit onSnapshot
        this.unsubscribeFromSnapshot = onSnapshot(
          gameDocRef,
          (docSnapshot) => {
            if (docSnapshot.exists()) {
              const gameData = docSnapshot.data() as any;
              console.log('Echtzeit-Update erhalten:', gameData);

              // Aktualisiere die Spiel-Daten
              this.game.currentPlayer = gameData['currentPlayer'] || 0;
              this.game.playedCards = gameData['playedCards'] || [];
              this.game.players = gameData['players'] || [];
              this.game.stack = gameData['stack'] || [];
              this.game.pickCardAnimation = gameData['pickCardAnimation'];
              this.game.currentCard = gameData['currentCard'] || '';
            } else {
              console.error('Dokument existiert nicht!');
            }
          },
          (error) => {
            console.error('Fehler bei Echtzeit-Updates:', error);
          }
        );
      }
    });
  }

  ngOnDestroy(): void {
    // Entferne den Listener, wenn die Komponente zerstört wird
    if (this.unsubscribeFromSnapshot) {
      this.unsubscribeFromSnapshot();
    }
  }

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop() ?? '';
      this.game.pickCardAnimation = true;

      console.log('New card: ' + this.game.currentCard);
      console.log('Game is ', this.game);

      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;

      this.saveGame();

      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1250);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }

  async saveGame() {
    try {
      if (this.gameId) {
        const gameDocRef = doc(this.firestore, 'games', this.gameId);
        updateDoc(gameDocRef, this.game.toJson())
          .then(() => {
            console.log('Spiel erfolgreich aktualisiert!');
          })
          .catch((error) => {
            console.error('Fehler beim Aktualisieren des Spiels:', error);
          });
      } else {
        console.error('Keine gültige Game-ID vorhanden!');
      }
    } catch (err) {
      console.log(err);
    }
}
}
