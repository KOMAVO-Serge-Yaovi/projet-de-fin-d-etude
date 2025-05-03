import { HttpHandlerFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError, retry } from 'rxjs';
import { environment } from '../../environments/environment';

export function AuthInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const token = localStorage.getItem('access_token');
  
  // Don't add token for OPTIONS requests
  if (req.method === 'OPTIONS') {
    return next(req);
  }

  // Initialiser les en-têtes
  let headers = req.headers;
  
  // Ne pas ajouter Content-Type pour FormData
  const isFormData = req.body instanceof FormData;
  if (!isFormData && !headers.has('Content-Type')) {
    headers = headers
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
  }

  if (token) {
    headers = headers
      .set('Authorization', `Bearer ${token}`)
      .set('X-Auth-Token', token);
  }

  const clonedReq = req.clone({
    headers,
    withCredentials: true
  });

  return next(clonedReq).pipe(
    retry(environment.retryAttempts),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.removeItem('access_token');
        window.location.href = '/login?message=session_expired';
      } else if (error.status === 0) {
        console.error('Erreur de connexion au serveur:', error);
        return throwError(() => new Error('Impossible de se connecter au serveur. Vérifiez votre connexion internet.'));
      } else if (error.status === 400) {
        return throwError(() => new Error('Données invalides. Veuillez vérifier vos informations.'));
      }
      return throwError(() => error);
    })
  );
}