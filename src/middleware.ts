import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from 'jose';

export default async function middleware(request: NextRequest) {
    //valor do cookie 'token'
    const token = request.cookies.get('token')?.value;

    //chave SECRET do JWT
    const SECRET = process.env.SECRET || 'OKDIFH198I2N_@DSM2kdmskIDJMCDSAMED33ED';

    //rota da pagina inicial
    const initialURL = new URL('/', request.url);

    //rota da pagina inicial
    const dashboardURL = new URL('/TaskDashboard', request.url);

    if (!token) {
        //caso nao houver token, o usuario sempre será redirecionado para as páginas abaixo.
        // Protegendo o conteúdo do sistema.
        if (['/', '/login', '/register'].includes(request.nextUrl.pathname)) {
            return NextResponse.next();
        }
        return NextResponse.redirect(initialURL);
    }

    try {
        // Verificar se o token é válido
        await jwtVerify(token, new TextEncoder().encode(SECRET));

        //Se as rotas abaixo forem pesquisadas após a validação do token,
        // o usuario será direcionado para o dashboard. Não acessando as paginas a baixo!
        if (['/', '/login', '/register'].includes(request.nextUrl.pathname)) {
            return NextResponse.redirect(dashboardURL);
        }

        return NextResponse.next(); 

    } catch (error) {
        console.error('Erro ao verificar token:', error);

        // Redirecionar para a página inicial se o token for inválido ou expirado
        return NextResponse.redirect(initialURL);
    }
}


//Rotas
export const config = {
    matcher: ['/TaskDashboard', '/CreateTask', '/', '/login', '/register']
};
