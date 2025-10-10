declare namespace Express {
  interface User {
    sub: string; // L'ID utilisateur
  }

  interface Request {
    user?: User; // La propriété 'user' est ajoutée par Passport/NestJS
  }
}
