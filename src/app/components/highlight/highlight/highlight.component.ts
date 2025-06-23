import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { TruncatePipe } from "../../../pipes/truncate.pipe";
import { HighlightPipe } from "../../../pipes/highlight.pipe";

@Component({
  selector: "highlight-item",
  standalone: true,
  templateUrl: "./highlight.component.html",
  styleUrls: ["./highlight.component.scss"],
  imports: [CommonModule, HighlightPipe, TruncatePipe],
})
export class HighlightComponent implements OnInit {
  @Input() filter: string = "";
  @Input() text: string = "";
  @Input() truncateLenght: number = 100;
  constructor() {}

  ngOnInit(): void {}
}
