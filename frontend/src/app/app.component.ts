import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'health-tracker-frontend';
  constructor(private router: Router) {}
  navigateToLogin() { 
    this.router.navigate(['login']);
  }
  navigateToRegister() { 
    this.router.navigate(['register']);
  }
}
