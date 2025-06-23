import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule, RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  isLogged = true;
  title = "sistema_livros";
  menuOpen = true;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
