export interface IToken {
    id: number,
    firstname: string,
    lastname: string,
    role: {
        role: string,
        id: number,
    },
    iat: number,
    exp: number
}