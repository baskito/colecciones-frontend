import { environment } from '../../environments/environment.prod';

const base_url = environment.base_url;

export class User {

  constructor(
    public nombre: string,
    public email: string,
    public role: string,
    public google: boolean,
    public estado: string,
    public img?: string,
    public uid?: string
  ) {}

  get imageUrl(): string {

    if ( !this.img ) {
      return `${ base_url }/upload/no-image`;
    }

    if ( this.img?.includes('https') ) {
      return this.img;
    }

    return `${ base_url }/upload/usuarios/1/${ this.img }`;

  }
}
