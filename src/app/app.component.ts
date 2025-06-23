import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Router, RouterModule, RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  constructor(private router: Router) {}
  isLogged = true;
  title = "sistema_livros";
  menuOpen = true;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  isActive(routes: string[]): boolean {
    return routes.some((route) => this.router.url.startsWith(route));
  }
}
