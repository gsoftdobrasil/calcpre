export const calcularDias = (vencimento: string, pagamento: string): number => {
    const dataVenc = new Date(vencimento);
    const dataPag = new Date(pagamento);
    return Math.max(0, Math.ceil((dataPag.getTime() - dataVenc.getTime()) / (1000 * 60 * 60 * 24)));
  };
  
  export const calcularJurosSimples = (valor: number, dias: number, taxaJuros: number): number => {
    return valor * (taxaJuros / 100) * (dias / 30);
  };
  
  export const calcularJurosCompostos = (valor: number, dias: number, taxaJuros: number): number => {
    const taxaMensal = taxaJuros / 100;
    const periodos = dias / 30;
    return valor * Math.pow(1 + taxaMensal, periodos) - valor;
  };
  