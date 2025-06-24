import { Component } from "@angular/core";
import { ReportService } from "../../services/report.service";

@Component({
  selector: "app-relatorio",
  imports: [],
  templateUrl: "./relatorio.component.html",
  styleUrl: "./relatorio.component.scss",
})
export class RelatorioComponent {
  constructor(private reportService: ReportService) {}

  async downloadReport() {
    this.reportService.getReportPdf().subscribe({
      next: (data) => {
        const file = new Blob([data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, "_blank");
      },
      error: (error) => {
        console.error("Erro ao gerar o PDF", error);
      },
    });
  }
}
