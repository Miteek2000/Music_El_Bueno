import { HttpEventType, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { CookieStorageService } from '../services/cookie-storage-service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const _cookieStorageService: CookieStorageService = inject(CookieStorageService);
  // Adjunta Authorization a peticiones de Spotify si hay token en cookie
  const token = _cookieStorageService.getCookieValue('access_token');
  let authReq = req;
  if (token && req.url.includes('api.spotify.com')) {
    authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(authReq).pipe(
    tap(event =>{
    if(!(event.type === HttpEventType.Response))
      return;

    const body = event.body as any;

      if(!body || !body.access_token)
        return;

      const expirationTime = 60*60*1000;
      const expirationDate = new Date(Date.now() + expirationTime);

      _cookieStorageService.createCookie('access_token', body.access_token, expirationDate);
    
  })
);
};
