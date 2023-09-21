import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { LoadGames } from '../interfaces/load.interface';
import { Game } from '../models/game.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor( private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  loadGames( desde: number = 0 ) {
    const url = `${ base_url }/games?from=${ desde }`;
    return this.http.get<LoadGames>(url, this.headers);
  }

  loadGameById(id: string) {
    const url = `${ base_url }/games/${ id }`;
    return this.http.get<{ok:boolean, game: Game}>(url, this.headers);
  }

  updateGame( game: Game) {
    const url = `${ base_url }/games/${ game._id }`;
    return this.http.put(url, game, this.headers);
  }

  createGame(game: Game) {
    const url = `${ base_url }/games`;
    return this.http.post<{ok: boolean, game: Game}>(url, game, this.headers);
  }

  deleteGame(game: Game) {
    const url = `${ base_url }/games/${ game._id }`;
    return this.http.delete(url, this.headers);
  }


}
