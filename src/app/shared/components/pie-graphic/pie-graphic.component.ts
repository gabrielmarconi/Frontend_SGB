import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pie-graphic',
  templateUrl: './pie-graphic.component.html',
  styleUrls: ['./pie-graphic.component.scss'],
})
export class GraphicComponent {
  @Input() dadosDoGrafico;
  @Input() coresCustomizadas;
  @Input() legendaGraficos;
}
