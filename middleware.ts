import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Rutas que requieren autenticación
  const protectedRoutes = ['/dashboard', '/profile'];
  
  // Rutas que requieren rol de admin
  const adminRoutes = ['/dashboard'];
  
  // Rutas que solo pueden acceder usuarios no autenticados
  const authRoutes = ['/login', '/register'];
  
  // Obtener el token del usuario desde las cookies
  const userCookie = request.cookies.get('user');
  let user = null;
  
  if (userCookie) {
    try {
      user = JSON.parse(userCookie.value);
    } catch (error) {
      console.error('Error parsing user cookie:', error);
      // Si hay error parseando, eliminar cookie corrupta
      const response = NextResponse.next();
      response.cookies.delete('user');
      return response;
    }
  }
  
  // Función para verificar si el usuario es admin
  const isAdmin = (user: any) => {
    if (!user || !user.roles) return false;
    return user.roles.includes('ROLE_ADMIN') || user.roles.includes('ADMIN');
  };
  
  // Redirigir usuarios autenticados que intentan acceder a rutas de auth
  if (user && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Verificar rutas protegidas
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!user) {
      // Usuario no autenticado, redirigir a login
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Verificar rutas de admin
    if (adminRoutes.some(route => pathname.startsWith(route))) {
      if (!isAdmin(user)) {
        // Usuario no es admin, redirigir a home
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  }
  
  return NextResponse.next();
}

// Configurar en qué rutas se ejecuta el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
