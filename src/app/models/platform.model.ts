import { _ConsoleAcces } from './accesorio.model';
import { _ColecUser } from './collection.model';

export class Platform {

  constructor(
    public name: string,
    public model: string,
    public brand: string,
    public _id?: string,
    public user?: _ColecUser,
    public console?: _ConsoleAcces,
    public tipology?: string,
    public color?: string,
    public description?: string,
    public year?: string,
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

export { _ConsoleAcces };

