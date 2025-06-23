import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Router, RouterModule } from "@angular/router";
import { HighlightComponent } from "../../highlight/highlight/highlight.component";
import { environment } from "../../../environments/environment";
import Swal from "sweetalert2";
// Importe HighlightComponent se ele for realmente usado. Se não for, pode remover.
// import { HighlightComponent } from "../../highlight/highlight/highlight.component";

@Component({
  selector: "app-basic-table",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    HighlightComponent,
  ],
  templateUrl: "./basic-table.component.html",
  styleUrls: ["./basic-table.component.scss"],
})
export class BasicTableComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() elements: Array<any> = [];
  @Input() baseRoute = "";
  @Input() columns: string[] = [];

  @Output() actionEvent = new EventEmitter<any>();

  dataSource: MatTableDataSource<any>;
  // Adicione a propriedade "static: false" para @ViewChild quando o elemento é carregado dinamicamente
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(
    private router: Router,
    public dialog: MatDialog,
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    // A inicialização do dataSource pode ser feita aqui, mas a atribuição de paginator e sort
    // deve ser feita no ngAfterViewInit.
    this.dataSource.data = this.elements;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Quando os 'elements' de entrada mudam, atualize os dados da tabela.
    // Garanta que o paginator e sort sejam reatribuídos caso haja mudança nos dados após a inicialização.
    if (changes["elements"] && this.dataSource) {
      this.dataSource.data = this.elements;
      // Reatribua paginator e sort caso a data seja alterada e o view já esteja inicializado
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    }
  }

  ngAfterViewInit() {
    // O paginator e o sort só estarão disponíveis neste ponto do ciclo de vida.
    // Atribua-os ao dataSource aqui.
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
    // Redefine a página para a primeira após a filtragem
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async del(el: any) {
    const options: any = {
      ...environment.confirm_swal_options,
      text: `Deseja realmente excluir ${el.nome ?? el.titulo}`,
    };
    const { value } = await Swal.fire(options);
    if (value) {
      this.actionEvent.emit({ item: el, action: "delete" });
    }
  }

  openDialogItemDetails(element: any) {
    this.actionEvent.emit({ item: element, action: "details" });
  }
}
