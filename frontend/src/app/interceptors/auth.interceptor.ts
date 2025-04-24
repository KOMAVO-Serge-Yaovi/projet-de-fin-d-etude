import { HttpHandlerFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export function AuthInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const token = localStorage.getItem('access_token');
  
  // Don't add token for OPTIONS requests
  if (req.method === 'OPTIONS') {
    return next(req);
  }

  let headers = req.headers
    .set('Content-Type', 'application/json')
    .set('X-Requested-With', 'XMLHttpRequest');

  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  const clonedReq = req.clone({
    headers,
    withCredentials: true
  });

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      }
      return throwError(() => error);
    })
  );
}