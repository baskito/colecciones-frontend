import { _ColecUser } from './collection.model';
import { _ConsoleAcces } from './platform.model';

export class Game {

  constructor(
    public name: string,
    public genre: string,
    public editorial: string,
    public platform: string,
    public _id?: string,
    public user?: _ColecUser,
    public console?: _ConsoleAcces,
    public year?: string,
    public description?: string,
    public releasePrice?: number,
    public support?: string,
    public compatibility?: string,
    public serialNumber?: string,
    public estimatedValue?: number,
    public purchaseDate?: Date,
    public purchasePrice?: number,
    public purchasePlace?: string,
    public sold?: boolean,
    public saleDate?: Date,
    public salePrice?: number,
    public salePlace?: string,
    public notes?: string,
    public img1?: string,
    public img2?: string,
    public img3?: string

  ) {}

}

