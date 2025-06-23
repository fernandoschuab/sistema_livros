import { Pipe, PipeTransform } from "@angular/core";
@Pipe({
  name: "truncate",
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, count: number, suffix: string = "..."): any {
    try {
      if (value.length > count) {
        return `${value.substring(0, count)} ${suffix}`;
      } else {
        return value;
      }
    } catch (error) {
      return value;
    }
  }
}
