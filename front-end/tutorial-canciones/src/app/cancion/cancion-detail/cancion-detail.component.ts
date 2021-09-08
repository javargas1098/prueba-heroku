import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cancion } from '../cancion';

@Component({
  selector: 'app-cancion-detail',
  templateUrl: './cancion-detail.component.html',
  styleUrls: ['./cancion-detail.component.css']
})
export class CancionDetailComponent implements OnInit {
  @Input() cancion: Cancion;
  @Output() deleteCancion: EventEmitter<number> = new EventEmitter<number>();

  userId: number;
  token: string;

  constructor(private router: ActivatedRoute, private routerPath: Router) {}

  public ngOnInit(): void {
    this.userId = parseInt(this.router.snapshot.params.userId, 10);
    this.token = this.router.snapshot.params.userToken;
  }

  public eliminarCancion(): void {
    this.deleteCancion.emit(this.cancion.id);
  }

  public compartirCancion(): void {
    this.routerPath.navigate([
      `/canciones/share/${this.cancion.id}/${this.userId}/${this.token}`
    ]);
  }

  public goToEdit(): void {
    this.routerPath.navigate([
      `/canciones/edit/${this.cancion.id}/${this.userId}/${this.token}`
    ]);
  }
}
