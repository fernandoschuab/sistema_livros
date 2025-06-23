import { Pipe, PipeTransform } from "@angular/core";
@Pipe({
  name: "highlight",
  standalone: true,
})
export class HighlightPipe implements PipeTransform {
  transform(text: string, search: any): string {
    if (!text) return "----";
    var pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    pattern = pattern
      .split(" ")
      .filter((t: string | any[]) => {
        return t.length > 0;
      })
      .join("|");
    var regex = new RegExp(pattern, "gi");
    return search && text
      ? text.replace(
          regex,
          (match) => `<span class="highlight">${match}</span>`,
        )
      : text;
  }
}
