import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { Usuario } from '@app/usuario/usuario';
import { UsuarioService } from '@app/usuario/usuario.service';

export const mockUsuario: Usuario = {
  id: 100,
  nombre: 'Pepito',
  albumes: []
};

describe('Service: Usuario', () => {
  let service: UsuarioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsuarioService]
    });
    service = TestBed.inject(UsuarioService);
    // tslint:disable-next-line: deprecation
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should provide userLogIn', () => {
    const backUrl = 'http://localhost:5000';
    const name = 'name';
    const password = 'password';
    const url = `${backUrl}/logIn`;
    // tslint:disable-next-line: deprecation
    service.userLogIn(name, password).subscribe((canciones: Usuario[]) => {
      expect(canciones).not.toBeNaN();
    });
    const req = httpMock.expectOne(url);

    req.flush(mockUsuario);
    expect(req.request.method).toBe('POST');
  });
});
