import { User } from "../models/user.model";
import { Collection } from '../models/collection.model';
import { Accesorio } from '../models/accesorio.model';
import { Console } from "../models/console.model";

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
