declare namespace Express {
    export interface Request {
       token?: string,
       user?: User
    }

    export interface User {
        [key: string]: string;
    }
 }