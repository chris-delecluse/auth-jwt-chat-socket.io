export interface IToken {
    id: string,
    firstname: string,
    lastname: string,
    role: {
        role: string,
        id: number,
    },
    iat: number,
    exp: number
}
