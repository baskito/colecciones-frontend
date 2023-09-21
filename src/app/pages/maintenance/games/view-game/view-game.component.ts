import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../environments/environment.prod';
import { Game } from 'src/app/models/game.model';
import { GameService } from 'src/app/services/game.service';



const base_url = environment.base_url;

@Component({
  selector: 'app-view-game',
  templateUrl: './view-game.component.html',
  styleUrls: ['./view-game.component.scss']
})
export class ViewGameComponent implements OnInit, OnDestroy {

  loading: boolean = true;
  public idParamSubs!: Subscription;
  public game: Game = {
    name: '',
    genre: '',
    editorial: '',
    platform: ''
  };
  public imagen1!: string;
  public missing?: string[] = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private toast: ToastrService, private gameService: GameService) { }

  ngOnDestroy(): void {
    this.idParamSubs.unsubscribe();
  }



  ngOnInit(): void {
    this.idParamSubs = this.activatedRoute.paramMap.subscribe((resp:any) => {
      this.loadGameById(resp.params.id);
    });

  }

  loadGameById(id:string) {
    this.loading = true;
    this.gameService.loadGameById(id).subscribe({
      complete: () => {
        this.loading = false;
      }, // completeHandler
      error: (err) => {
        console.log(err);
        Swal.fire({
          title: 'Error',
          text: err.error.msg,
          icon: 'error'
        });
      },    // errorHandler
      next: ({game}) => {
        this.game = game;

        this.imagen1 = `${ base_url }/upload/games/1/${ game.img1 }`;
      }
    });


  }

  deleteGame(game: Game) {
    Swal.fire({
      title: '¿Eliminar colección',
      text: `Estás apunto de eliminar definitivamente ${ game.name }`,
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
              'Eliminado!',
              `El juego ${ game.name } ha sido eliminado`,
              'success'
            );
            // this.collections = this.collections.filter(item => item._id !== collection._id);
            this.router.navigateByUrl('/dashboard/games')
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

  verImagen(num: number) {
    const url: string  = `dashboard/games/view/image/${this.game._id}/${num}`;
    this.router.navigateByUrl(url);
  }

}
