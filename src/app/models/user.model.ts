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
}
