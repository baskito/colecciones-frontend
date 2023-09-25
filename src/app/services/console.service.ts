import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { LoadConsoles } from '../interfaces/load.interface';
import { Console } from '../models/console.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ConsoleService {

  constructor( private http: HttpClient, private router: Router ) { }

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

  loadConsoles( desde: number = 0  ) {
    const url = `${ base_url }/consoles?from=${ desde }`;
    return this.http.get<LoadConsoles>(url, this.headers);
  }

  loadConsoleById(id: string) {
    const url = `${ base_url }/consoles/${ id }`;
    return this.http.get<{ok:boolean, console: Console}>(url, this.headers);
  }

  updateConsole(console: Console) {
    const url = `${ base_url }/consoles/${ console._id }`;
    return this.http.put(url, console, this.headers);
  }

  createConsole(console: Console) {
    const url = `${ base_url }/consoles`;
    return this.http.post<{ok: boolean, console: Console}>(url, console, this.headers);
  }

  deleteConsole(console: Console) {
    const url = `${ base_url }/consoles/${ console._id }`;
    return this.http.delete(url, this.headers);
  }
}
