import { Component, Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-atualizar-valores-servicos',
  templateUrl: './atualizar-valores-servicos.component.html',
  styleUrls: ['./atualizar-valores-servicos.component.scss'],
})
export class AtualizarValoresServicosComponent {
  constructor(
    public dialogRef: MatDialogRef<AtualizarValoresServicosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  atualizarValoresForm = new FormGroup({
    servicos: new FormArray([]),
    percentual: new FormControl(null, [Validators.required]),
    tipoAtualizacao: new FormControl('A', [Validators.required]),
  });

  icon: string = '';
  title: string = '';
  buttonTitle: string = '';

  ngOnInit() {
    const servicosFormArray = this.atualizarValoresForm.get(
      'servicos'
    ) as FormArray;
    this.data.selections.forEach((valor) => {
      servicosFormArray.push(new FormControl(valor.id));
    });
    this.icon = 'currency_exchange';
    this.title = 'Atualizar Valores de Serviços';
  }

  atualizarValores(): void {
    this.dialogRef.close(this.atualizarValoresForm.value);
  }

  fecharModal(): void {
    this.dialogRef.close();
  }
}
