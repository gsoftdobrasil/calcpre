import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registra componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CalculatorForm = () => {
  const [valorInicial, setValorInicial] = useState<number | null>(null);
  const [valorMensal, setValorMensal] = useState<number | null>(null);
  const [taxaJuros, setTaxaJuros] = useState<number>(2);
  const [periodoTaxa, setPeriodoTaxa] = useState<"anual" | "mensal">("anual");
  const [periodo, setPeriodo] = useState<number>(2);
  const [tipoPeriodo, setTipoPeriodo] = useState<"ano" | "mes">("ano");
  const [tabelaResultados, setTabelaResultados] = useState<
    { mes: number; juros: number; totalInvestido: number; totalJuros: number; totalAcumulado: number }[]
  >([]);
  const [valorTotalFinal, setValorTotalFinal] = useState<number | null>(null);
  const [valorTotalInvestido, setValorTotalInvestido] = useState<number | null>(null);
  const [totalJuros, setTotalJuros] = useState<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const calcular = () => {
    setErro(null);

    if (!valorInicial && !valorMensal) {
      setErro("Adicione um valor inicial ou mensal!");
      return;
    }

    const taxaMensal = periodoTaxa === "anual" ? taxaJuros / 12 / 100 : taxaJuros / 100;
    const meses = tipoPeriodo === "ano" ? periodo * 12 : periodo;

    let acumulado = valorInicial || 0;
    let investido = valorInicial || 0;
    const resultados: typeof tabelaResultados = [];

    for (let i = 0; i <= meses; i++) {
      const jurosMes = acumulado * taxaMensal;
      acumulado += jurosMes + (i > 0 ? valorMensal || 0 : 0);
      investido += i > 0 ? valorMensal || 0 : 0;

      resultados.push({
        mes: i,
        juros: jurosMes,
        totalInvestido: investido,
        totalJuros: acumulado - investido,
        totalAcumulado: acumulado,
      });
    }

    setTabelaResultados(resultados);
    setValorTotalFinal(acumulado);
    setValorTotalInvestido(investido);
    setTotalJuros(acumulado - investido);
  };

  const exportarParaPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Simulador de Juros Compostos", 10, 10);

    doc.setFontSize(12);
    doc.text("Resultados Gerais:", 10, 20);
    doc.text(`Valor Total Final: R$ ${valorTotalFinal?.toFixed(2)}`, 10, 30);
    doc.text(`Valor Total Investido: R$ ${valorTotalInvestido?.toFixed(2)}`, 10, 40);
    doc.text(`Total em Juros: R$ ${totalJuros?.toFixed(2)}`, 10, 50);

    if (tabelaResultados.length > 0) {
      doc.text("Tabela de Resultados:", 10, 60);
      const tabela = tabelaResultados.map((linha) => [
        linha.mes,
        `R$ ${linha.juros.toFixed(2)}`,
        `R$ ${linha.totalInvestido.toFixed(2)}`,
        `R$ ${linha.totalJuros.toFixed(2)}`,
        `R$ ${linha.totalAcumulado.toFixed(2)}`,
      ]);

      autoTable(doc, {
        head: [["Mês", "Juros", "Total Investido", "Total Juros", "Total Acumulado"]],
        body: tabela,
        startY: 70,
      });
    }

    doc.save("resultados-simulador.pdf");
  };

  const data = tabelaResultados.length > 0 ? {
    labels: tabelaResultados.map((item) => `Mês ${item.mes}`),
    datasets: [
      {
        label: "Total em Juros",
        data: tabelaResultados.map((item) => item.totalJuros),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
      },
      {
        label: "Total Investido",
        data: tabelaResultados.map((item) => item.totalInvestido),
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.4,
      },
    ],
  } : null;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Total em Juros x Total Investido",
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-red-600 mb-6">
        Simulador de Juros Compostos
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          calcular();
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          {/* Campo Valor Inicial */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">Valor Inicial</label>
            <input
              type="number"
              className={`w-full p-2 border rounded ${
                erro && !valorInicial ? "border-red-500" : "border-gray-300"
              }`}
              value={valorInicial ?? ""}
              onChange={(e) => setValorInicial(parseFloat(e.target.value) || null)}
              placeholder="Ex.: 1000"
            />
            {erro && !valorInicial && (
              <p className="text-red-500 text-sm mt-1">Adicione um valor inicial.</p>
            )}
          </div>

          {/* Campo Valor Mensal */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">Valor Mensal</label>
            <input
              type="number"
              className={`w-full p-2 border rounded ${
                erro && !valorMensal ? "border-red-500" : "border-gray-300"
              }`}
              value={valorMensal ?? ""}
              onChange={(e) => setValorMensal(parseFloat(e.target.value) || null)}
              placeholder="Ex.: 200"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Campo Taxa de Juros */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">Taxa de Juros (%)</label>
            <div className="flex">
              <input
                type="number"
                className={`w-2/3 p-2 border rounded ${
                  erro && !taxaJuros ? "border-red-500" : "border-gray-300"
                }`}
                value={taxaJuros}
                onChange={(e) => setTaxaJuros(parseFloat(e.target.value))}
                placeholder="Ex.: 5"
              />
              <select
                className="w-1/3 p-2 border rounded"
                value={periodoTaxa}
                onChange={(e) => setPeriodoTaxa(e.target.value as "anual" | "mensal")}
              >
                <option value="anual">Anual</option>
                <option value="mensal">Mensal</option>
              </select>
            </div>
          </div>

          {/* Campo Período */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">Período</label>
            <div className="flex">
              <input
                type="number"
                className={`w-2/3 p-2 border rounded ${
                  erro && !periodo ? "border-red-500" : "border-gray-300"
                }`}
                value={periodo}
                onChange={(e) => setPeriodo(parseInt(e.target.value))}
                placeholder="Ex.: 2"
              />
              <select
                className="w-1/3 p-2 border rounded"
                value={tipoPeriodo}
                onChange={(e) => setTipoPeriodo(e.target.value as "ano" | "mes")}
              >
                <option value="ano">Ano(s)</option>
                <option value="mes">Mês(es)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="mt-6 flex justify-between">
          <button
            type="submit"
            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Calcular
          </button>
          <button
            type="button"
            className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
            onClick={exportarParaPDF}
          >
            Exportar para PDF
          </button>
        </div>
      </form>

      {/* Resultados Gerais */}
      {valorTotalFinal !== null && (
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="p-4 bg-red-600 text-white rounded text-center">
            <h3 className="font-bold">Valor Total Final</h3>
            <p className="text-2xl">R$ {valorTotalFinal.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-gray-100 rounded text-center">
            <h3 className="font-bold">Valor Total Investido</h3>
            <p className="text-2xl text-red-600">R$ {valorTotalInvestido?.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-gray-100 rounded text-center">
            <h3 className="font-bold">Total em Juros</h3>
            <p className="text-2xl text-red-600">R$ {totalJuros?.toFixed(2)}</p>
          </div>
        </div>
      )}
 {/* Gráfico */}
      {data && tabelaResultados.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold text-red-600 mb-4">Gráfico:</h3>
          <Line data={data} options={options} />
        </div>
      )}

      {/* Tabela de Resultados */}
      {tabelaResultados.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold text-red-600 mb-4">Tabela de Resultados:</h3>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Mês</th>
                  <th className="border border-gray-300 p-2 text-left">Juros</th>
                  <th className="border border-gray-300 p-2 text-left">Total Investido</th>
                  <th className="border border-gray-300 p-2 text-left">Total Juros</th>
                  <th className="border border-gray-300 p-2 text-left">Total Acumulado</th>
                </tr>
              </thead>
              <tbody>
                {tabelaResultados.map((linha) => (
                  <tr key={linha.mes}>
                    <td className="border border-gray-300 p-2">{linha.mes}</td>
                    <td className="border border-gray-300 p-2">R$ {linha.juros.toFixed(2)}</td>
                    <td className="border border-gray-300 p-2">R$ {linha.totalInvestido.toFixed(2)}</td>
                    <td className="border border-gray-300 p-2">R$ {linha.totalJuros.toFixed(2)}</td>
                    <td className="border border-gray-300 p-2">R$ {linha.totalAcumulado.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculatorForm;
