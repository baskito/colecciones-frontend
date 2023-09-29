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
import { Accesorio } from 'src/app/models/accesorio.model';
import { AccesoriosService } from 'src/app/services/accesorios.service';
const base_url = environment.base_url;

@Component({
  selector: 'app-consoles',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss'],
})
export class ConsolesComponent implements OnInit {

  public loading: boolean = true;
  public totalConsoles: number = 0;
  public totalGames: number = 0;
  public games: Game[] = [];
  public accesorios: Accesorio[] = [];
  public consoles: Console[] = [];
  public gamesTemp: Game[] = [];
  public consolesTemp: Console[] = [];
  public accesoriosTemp: Accesorio[] = [];
  public totalSearch: number = 0;
  public paginacion: number = 0;
  public paginas: number = 0;
  public selectedUid: string = '';
  public selectedImg: string = '';
  public consoleSelected: Console = {
    name: '',
    model: '',
    brand: ''
  };
  public imgSubs!: Subscription;
  public consSel: any;
  public consModal: any = {
    name: '',
    model: '',
    brand: '',
    img1: ''
  };
  numConsolesStock: number = 0;
  numConsolesSold: number = 0;
  totalEstimatedStock: number = 0;
  totalCostSold: number = 0;
  totalPriceSold: number = 0;
  totalCostConsoles: number = 0;
  public data = {
    labels: [
      'Consolas',
      'Vendidas'
    ],
    datasets: [{
      // label: 'My First Dataset',
      data: [15, 195],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)'
      ],
      hoverOffset: 4
    }]
  };

  constructor(
    private newImageService: NewImageService,
    private searchService: SearchService,
    private consoleService: ConsoleService,
    private gameService: GameService,
    private accService: AccesoriosService
    ) { }

  ngOnInit(): void {
    this.loadConsoles(0);
    // this.loadConsolesByUser();
    this.imgSubs = this.newImageService.newImage.pipe(delay(300)).subscribe( newImage => {
      this.consoles[this.consoles.findIndex(obj => obj._id === newImage.uid)].img1 = newImage.img;
      this.consolesTemp = this.consoles;
      // this.loadConsoles(0);
    });
  }

  managePagination( valor: number ) {

    this.paginacion += valor;

    if (this.paginacion < 0 ) {
      this.paginacion = 0;
    } else if (this.paginacion >= this.totalGames) {
      this.paginacion -= valor;
    }

    this.loadConsoles(this.paginacion);
  }

  // loadGames(paginacion:number) {
  //   this.loading = true;
  //   this.gameService.loadGames(this.paginacion).subscribe({
  //     complete: () => { // completeHandler
  //       this.loading = false;
  //     },
  //     error: (err) => {  // errorHandler
  //       console.log(err);
  //       Swal.fire({
  //         title: 'Error',
  //         text: err.error.msg,
  //         icon: 'error'
  //       });
  //     },    // nextHandler
  //     next: (resp) => {
  //       this.totalGames = resp.total;
  //       this.games = resp.games;
  //       this.gamesTemp = this.games;
  //       this.paginas = Math.floor(this.totalGames/10.1) + 1;
  //     }
  //   });
  // }

  loadConsoles(paginacion:number) {
    this.loading = true;
    this.consoleService.loadConsoles(this.paginacion).subscribe({
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
        this.totalConsoles = resp.total;
        this.consoles = resp.consoles;
        this.consolesTemp = this.consoles;
        this.paginas = Math.floor(this.totalConsoles/10.1) + 1;
        for (let cons of resp.consoles) {
          if (cons.sold) {
            this.numConsolesSold++;
            this.totalCostSold += cons.salePrice! | 0;
            this.totalPriceSold += cons.purchasePrice! | 0;

          } else {
            this.numConsolesStock++;
            this.totalEstimatedStock += cons.estimatedValue! | 0;
          }
        }
        this.data.datasets[0].data[0] = this.totalConsoles;
        this.data.datasets[0].data[1] = this.numConsolesSold;
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

        this.totalConsoles = total;
        this.totalSearch = totalSearch;
      }
    });
  }


  counter(i: number) {
    return new Array(i);
  }

  pages(valor: number) {
    this.paginacion = valor;

    this.loadConsoles(this.paginacion);
  }

  deleteConsole(consoleDel: Console) {
    Swal.fire({
      title: '¿Eliminar consola?',
      text: `Estás apunto de eliminar definitivamente la consola ${ consoleDel.name }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.consoleService.deleteConsole(consoleDel).subscribe({
          complete: () => {
            Swal.fire(
              'Eliminada!',
              `La consola ${ consoleDel.name } ha sido eliminada`,
              'success'
            );
            // this.collections = this.collections.filter(item => item._id !== collection._id);
            this.loadConsoles(this.paginacion);
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

  modalConsole(console: Console) {
    this.consoleSelected = console;
    if ( !console.img1 ) {
      this.selectedImg = `${ base_url }/upload/usuarios/1/no-img.jpg`;
    } else {
      this.selectedImg = `${ base_url }/upload/consoles/1/${ console.img1 }`;
    }
    this.selectedUid = console._id || '';
  }

  // modalConsole(consola: Console) {
  //   this.consModal = this.consoles.find(c => c._id === consola._id) || undefined;
  //   console.log(this.consModal);

  // }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }
}
