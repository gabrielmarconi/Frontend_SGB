import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-conceder-desconto-atendimento',
  templateUrl: './conceder-desconto-atendimento.component.html',
  styleUrls: ['./conceder-desconto-atendimento.component.scss'],
})
export class ConcederDescontoComponent {
  constructor(
    public dialogRef: MatDialogRef<ConcederDescontoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  concederDescontoForm = new FormGroup({
    valorDesconto: new FormControl(null, [Validators.required]),
  });

  icon: string = '';
  title: string = '';
  buttonTitle: string = '';

  ngOnInit() {
    this.icon = 'price_change';
    this.title = 'Conceder Desconto';
  }

  concederDesconto(): void {
    this.dialogRef.close(this.concederDescontoForm.value);
  }

  fecharModal(): void {
    this.dialogRef.close();
  }
}
