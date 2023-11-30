export interface Atendimentos {
  idCliente: number;
  idFuncionario: number;
  idFormaPagamento: number;
  dataHora: string;
  confirmado: string;
  valorTotal: number;
  valorDesconto: number;
  servicos?: string[] | null;
}
