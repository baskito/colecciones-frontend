import { User } from "../models/user.model";
import { Collection } from '../models/collection.model';
import { Game } from '../models/game.model';
import { Accesorio } from '../models/accesorio.model';
import { Console } from "../models/console.model";
import { Platform } from "@angular/cdk/platform";
import { Brand } from '../models/brand.model';

export interface LoadUsers {
    total: number,
    usuarios: User[];
}

export interface LoadCollections {
  total: number,
  collections: Collection[];
}
export interface LoadAccesorios {
  total: number,
  accesorios: Accesorio[];
}
export interface LoadConsoles {
  total: number,
  consoles: Console[];
}
export interface LoadBrands {
  total: number,
  brands: Brand[];
}
export interface LoadPlatforms {
  total: number,
  platforms: Platform[];
}
export interface LoadGames {
  total: number,
  games: Game[];
}
