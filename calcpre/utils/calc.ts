export const calcularJurosSimplesComMensalidade = (
  valor: number,
  dias: number,
  taxaJuros: number,
  mensalidade: number
): number => {
  const meses = dias / 30;
  const juros = valor * (taxaJuros / 100) * meses;
  const totalMensalidade = mensalidade * meses;
  return valor + juros + totalMensalidade;
};

export const calcularJurosCompostosComMensalidade = (
  valorInicial: number,
  dias: number,
  taxaJuros: number,
  aporteMensal: number
): number => {
  const meses = dias / 30; // Converte dias para meses
  const taxaMensal = taxaJuros / 100; // Taxa de juros em decimal

  // Montante para o valor inicial
  const montanteInicial = valorInicial * Math.pow(1 + taxaMensal, meses);

  // Montante para os aportes mensais
  const montanteAportes =
    aporteMensal > 0
      ? (aporteMensal * (Math.pow(1 + taxaMensal, meses) - 1)) / taxaMensal
      : 0;

  return montanteInicial + montanteAportes; // Total final
};