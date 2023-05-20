import { Component, OnInit } from '@angular/core';
import { Character } from 'src/app/models/character.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'characters-list',
  templateUrl: './characters-list.component.html',
  styleUrls: ['./characters-list.component.scss'],
})
export class CharactersListComponent implements OnInit {
  allCharacters: Character[] = [];
  totalPages: number = 1; // Número total de páginas de personajes
  currentApiPage: number = 1; // Página actual
  displayedCharacters: Character[] = [];
  charactersPerPage = 15;
  startIndex = 0;
  endIndex = 0;
  currentLocalPage = 1;

  selectedCharacter: any = null;

  constructor(private http: HttpClient) {}

  /*  ngOnInit() {
    this.fetchAllCharacters();
  }

  fetchAllCharacters() {
    this.http
      .get<any>('https://rickandmortyapi.com/api/character')
      .subscribe((data) => {
        const totalPages = data.info.pages;

        // Realizar múltiples llamadas para obtener todos los personajes
        const requests = [];
        for (let page = 1; page <= totalPages; page++) {
          requests.push(
            this.http.get<any>(
              `https://rickandmortyapi.com/api/character?page=${page}`
            )
          );
        }

        // Combinar los resultados de todas las llamadas
        forkJoin(requests).subscribe((responses: any[]) => {
          responses.forEach((response) => {
            this.allCharacters = this.allCharacters.concat(
              response.results.map((character: any) => ({
                id: character.id,
                name: character.name,
                image: character.image,
              }))
            );
          });

          this.updateDisplayedCharacters();
        });
      });
  }

  updateDisplayedCharacters() {
    const startIndex = (this.currentPage - 1) * this.charactersPerPage;
    const endIndex = startIndex + this.charactersPerPage;
    this.displayedCharacters = this.allCharacters.slice(startIndex, endIndex);
  }

  previousPage() {
    console.log('Current page:', this.currentPage);
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedCharacters();
    }
  }

  nextPage() {
    const totalPages = Math.ceil(
      this.allCharacters.length / this.charactersPerPage
    );
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.updateDisplayedCharacters();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.allCharacters.length / this.charactersPerPage);
  } */

  ngOnInit() {
    this.fetchInitialCharacters();
  }

  fetchInitialCharacters() {
    if (this.currentApiPage <= this.totalPages) {
      //condicion para que nose haga llamadas si se ha llegado al limite de paginas
      this.http
        .get<any>(
          `https://rickandmortyapi.com/api/character/?page=${this.currentApiPage}`
        )
        .subscribe((data) => {
          this.totalPages = data.info.pages;

          // Guardar los resultados de la primera página en allCharacters
          const newCharacters = data.results.map((character: any) => ({
            id: character.id,
            name: character.name,
            image: character.image,
          }));

          // Si allCharacters ya tiene datos, añadir los nuevos personajes
          if (this.allCharacters.length > 0) {
            this.allCharacters = this.allCharacters.concat(newCharacters);
          } else {
            this.allCharacters = newCharacters;
          }

          this.updateDisplayedCharacters();
        });
    }
  }

  updateDisplayedCharacters() {
    this.endIndex = this.currentLocalPage * this.charactersPerPage; //se multiplica por currentLocalPage para saber el endIndex
    this.displayedCharacters = this.allCharacters.slice(
      this.startIndex,
      this.endIndex
    );

    if (this.endIndex + this.charactersPerPage >= this.allCharacters.length) {
      this.currentApiPage++;
      this.fetchInitialCharacters();
    }
  }

  nextPage() {
    this.startIndex = this.startIndex + this.charactersPerPage;
    this.currentLocalPage++;
    this.updateDisplayedCharacters();
  }

  previousPage() {
    this.startIndex = this.startIndex - this.charactersPerPage;
    this.currentLocalPage--;
    this.updateDisplayedCharacters();
  }

  showInfo(character: any) {
    this.http
      .get<any>(`https://rickandmortyapi.com/api/character/${character.id}`)
      .subscribe((data) => {
        this.selectedCharacter = data;
      });
  }

  hideInfo() {
    this.selectedCharacter = false;
  }
}
