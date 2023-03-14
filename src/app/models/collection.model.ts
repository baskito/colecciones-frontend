import { environment } from '../../environments/environment.prod';

export interface _ColecUser {
  _id: string,
  nombre: string,
  email: string,
  img?: string
}

const base_url = environment.base_url;

export class Collection {

  constructor(
    public name: string,
    public year: string,
    public editorial: string,
    public _id?: string,
    public user?: _ColecUser,
    public tipology?: string,
    public description?: string,
    public fullCollection?: number,
    public extras?: string,
    public missing?: string,
    public repeated?: string,
    public notes?: string,
    public img1?: string,
    public img2?: string,
    public img3?: string

  ) {}


  // get imageUrl(): string {

  //   if ( !this.img ) {
  //     return `${ base_url }/upload/usuarios/no-image`;
  //   }

  //   if ( this.img?.includes('https') ) {
  //     return this.img;
  //   }

  //   return `${ base_url }/upload/usuarios/${ this.img }`;

  // }
}

