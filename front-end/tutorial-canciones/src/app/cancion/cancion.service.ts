import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cancion } from './cancion';
import { Album } from '../album/album';
import { Usuario } from '../usuario/usuario';

@Injectable({
  providedIn: 'root'
})
export class CancionService {
  private backUrl: string = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getCancionesAlbum(idAlbum: number, token: string): Observable<Cancion[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<Cancion[]>(
      `${this.backUrl}/album/${idAlbum}/canciones`,
      { headers }
    );
  }

  getCanciones(idUsuario: number): Observable<Cancion[]> {
    return this.http.get<Cancion[]>(
      `${this.backUrl}/usuario/${idUsuario}/canciones`
    );
  }

  getAlbumesCancion(cancionId: number): Observable<Album[]> {
    return this.http.get<Album[]>(
      `${this.backUrl}/cancion/${cancionId}/albumes`
    );
  }

  crearCancion(cancion: Cancion, idUsuario: number): Observable<Cancion> {
    return this.http.post<Cancion>(
      `${this.backUrl}/usuario/${idUsuario}/canciones`,
      cancion
    );
  }

  getCancion(cancionId: number): Observable<Cancion> {
    return this.http.get<Cancion>(`${this.backUrl}/cancion/${cancionId}`);
  }

  editarCancion(cancion: Cancion, cancionId: number): Observable<Cancion> {
    return this.http.put<Cancion>(
      `${this.backUrl}/cancion/${cancionId}`,
      cancion
    );
  }

  eliminarCancion(cancionId: number): Observable<Cancion> {
    return this.http.delete<Cancion>(`${this.backUrl}/cancion/${cancionId}`);
  }

  compartirCancion(
    idUsuario: number,
    token: string,
    cancinId: number,
    usuarioIdDestino: number
  ): Observable<Cancion> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post<Cancion>(
      `${this.backUrl}/cancionUsuario/${idUsuario}/${cancinId}/${usuarioIdDestino}`,
      {},
      { headers }
    );
  }

  getUsuariosDisponibles(cancionId: number): Observable<any> {
    return this.http.get<Usuario[]>(
      `${this.backUrl}/cancion/${cancionId}/usuariosDisponibles`
    );
  }
}
