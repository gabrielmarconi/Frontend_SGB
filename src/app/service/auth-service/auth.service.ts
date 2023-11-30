import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  login(email, senha): Observable<any> {
    const payload = { email: email, senha: senha };

    return this.http.post(environment.apiUrl + 'auth', payload);
  }

  getTipoUsuario(id) {
    return this.http.get(`${environment.apiUrl}auth/tipo-usuario/${id}`);
  }

  logoff(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('tipoUsuario');
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('senhaProvisoria');
    localStorage.removeItem('idCliente');
    this.router.navigate(['/login']);
  }
}
