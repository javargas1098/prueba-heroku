import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(private routerPath: Router, private router: ActivatedRoute) {}

  ngOnInit(): void {}

  public goTo(menu: string): void {
    const userId = parseInt(this.router.snapshot.params.userId, 10);
    const token = this.router.snapshot.params.userToken;
    if (menu === 'logIn') {
      this.routerPath.navigate([`/`]);
    } else if (menu === 'album') {
      this.routerPath.navigate([`/albumes/${userId}/${token}`]);
    } else {
      this.routerPath.navigate([`/canciones/${userId}/${token}`]);
    }
  }
}
