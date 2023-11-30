import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-adicionar-forma-pagamento',
  templateUrl: './adicionar-forma-pagamento.component.html',
  styleUrls: ['./adicionar-forma-pagamento.component.scss'],
})
export class AdicionarFormaPagamentoComponent {
  constructor(
    public dialogRef: MatDialogRef<AdicionarFormaPagamentoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  formasPagamentoForm = new FormGroup({
    descricao: new FormControl(null, [Validators.required]),
  });

  isEdit = new FormControl(false);

  icon: string = '';
  title: string = '';
  buttonTitle: string = '';

  ngOnInit() {
    if (this.data.element) {
      this.icon = 'edit';
      this.title = 'Editar Forma de Pagamento';
      this.formasPagamentoForm.patchValue(this.data.element);
      this.isEdit.setValue(true);
    } else {
      this.icon = 'add';
      this.title = 'Adicionar Forma de Pagamento';
    }
  }

  adicionarFormaPagamento(): void {
    this.dialogRef.close({
      form: this.formasPagamentoForm.value,
      edit: this.isEdit.value,
    });
  }

  fecharModal(): void {
    this.dialogRef.close();
  }
}
