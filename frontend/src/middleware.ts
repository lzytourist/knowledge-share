import {NextRequest, NextResponse} from 'next/server'
import {baseAPI, getAccessToken, getRefreshToken, removeCookie, setAccessToken} from "@/actions";
import {REFRESH_TOKEN} from "@/lib/constants";

const publicRoutes = ['/login', '/password-reset']

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route));

  let accessToken = await getAccessToken();
  if (!accessToken) {
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      const response = await baseAPI<{ access: string }>('users/token/refresh/', {
        method: 'POST',
        body: {'refresh': refreshToken}
      });

      if (response.success) {
        await setAccessToken(response.data!.access);
        accessToken = response.data!.access;
      } else {
        await removeCookie(REFRESH_TOKEN);
      }
    }
  }

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}