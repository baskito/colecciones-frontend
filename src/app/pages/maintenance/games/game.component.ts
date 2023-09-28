import { Component, OnInit } from '@angular/core';
import { delay, Subscription } from 'rxjs';
import { SearchService } from 'src/app/services/search.service';
import Swal from 'sweetalert2';
import { NewImageService } from '../../../services/new-image.service';
import { environment } from '../../../../environments/environment.prod';
import { ConsoleService } from 'src/app/services/console.service';
import { Console } from 'src/app/models/console.model';
import { Game } from 'src/app/models/game.model';
import { GameService } from 'src/app/services/game.service';
const base_url = environment.base_url;

@Component({
  selector: 'app-accesorios',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  public loading: boolean = true;
  public totalGames: number = 0;
  public games: Game[] = [];
  public consoles: Console[] = [];
  public gamesTemp: Game[] = [];
  public totalSearch: number = 0;
  public paginacion: number = 0;
  public paginas: number = 0;
  public selectedUid: string = '';
  public selectedImg: string = '';
  public gameSelected: Game = {
    name: '',
    genre: '',
    editorial: '',
    platform: ''
  };
  public imgSubs!: Subscription;
  public consSel: any;
  public consModal: any = {
    name: '',
    model: '',
    brand: '',
    img1: ''
  };

  constructor(
    private newImageService: NewImageService,
    private searchService: SearchService,
    private consoleService: ConsoleService,
    private gameService: GameService
    ) { }

  ngOnInit(): void {
    this.loadGames(0);
    this.loadConsolesByUser();
    this.imgSubs = this.newImageService.newImage.pipe(delay(300)).subscribe( newImage => {
      this.games[this.games.findIndex(obj => obj._id === newImage.uid)].img1 = newImage.img;
      this.gamesTemp = this.games;
    });
    // this.imgSubs = this.newImageService.newImage.pipe(delay(300)).subscribe( img => {
    //   this.loadGames(0);
    // });
  }

  managePagination( valor: number ) {

    this.paginacion += valor;

    if (this.paginacion < 0 ) {
      this.paginacion = 0;
    } else if (this.paginacion >= this.totalGames) {
      this.paginacion -= valor;
    }

    this.loadGames(this.paginacion);
  }

  loadGames(paginacion:number) {
    this.loading = true;
    this.gameService.loadGames(this.paginacion).subscribe({
      complete: () => { // completeHandler
        this.loading = false;
      },
      error: (err) => {  // errorHandler
        console.log(err);
        Swal.fire({
          title: 'Error',
          text: err.error.msg,
          icon: 'error'
        });
      },    // nextHandler
      next: (resp) => {
        this.totalGames = resp.total;
        this.games = resp.games;
        this.gamesTemp = this.games;
        this.paginas = Math.floor(this.totalGames/10.1) + 1;
      }
    });
  }

  loadConsolesByUser() {
    this.consoleService.loadConsoles().subscribe({
      complete: () => {

      }, // completeHandler
      error: (err) => {
        console.log(err);
        Swal.fire({
          title: 'Error',
          text: err.error.msg,
          icon: 'error'
        });
      },    // errorHandler
      next: ({consoles}) => {
        this.consoles = consoles;

      }
    });
  }

  getConsole(consola: Console) {

    if (consola) {
      this.consSel = this.consoles.find(c => c._id === consola._id);
      if (this.consSel) {

        return this.consSel.name;
      } else {
        return '';
      }
    } else {
      return '';
    }

  }

  borrarInput() {
    this.games = this.gamesTemp;
  }

  search(term: string) {

    if (term.length === 0) {
      this.games = this.gamesTemp;
      return;
    }


    this.searchService.search('games', term).subscribe({
      complete: () => {

      }, // completeHandler
      error: (err) => {
        console.log(err);
        Swal.fire({
          title: 'Error',
          text: err.error.msg,
          icon: 'error'
        });
      },    // errorHandler
      next: ({total, totalSearch, arrayResp}) => {
        this.games = arrayResp;

        this.totalGames = total;
        this.totalSearch = totalSearch;
      }
    });
  }


  counter(i: number) {
    return new Array(i);
  }

  pages(valor: number) {
    this.paginacion = valor;

    this.loadGames(this.paginacion);
  }

  deleteGame(game: Game) {
    Swal.fire({
      title: '¿Eliminar juego?',
      text: `Estás apunto de eliminar definitivamente el juego ${ game.name }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.gameService.deleteGame(game).subscribe({
          complete: () => {
            Swal.fire(
              'Eliminada!',
              `El accesorio ${ game.name } ha sido eliminado`,
              'success'
            );
            // this.collections = this.collections.filter(item => item._id !== collection._id);
            this.loadGames(this.paginacion);
          }, // completeHandler
          error: (err) => {
            console.log(err);
            Swal.fire({
              title: 'Error',
              text: err.error.msg,
              icon: 'error'
            });
          }
        });

      }
    });
  }

  modalGame(game: Game) {
    this.gameSelected = game;
    if ( !game.img1 ) {
      this.selectedImg = `${ base_url }/upload/usuarios/1/no-img.jpg`;
    } else {
      this.selectedImg = `${ base_url }/upload/games/1/${ game.img1 }`;
    }
    this.selectedUid = game._id || '';
  }

  modalConsole(consola: Console) {
    this.consModal = this.consoles.find(c => c._id === consola._id) || undefined;
    console.log(this.consModal);

  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }
}
