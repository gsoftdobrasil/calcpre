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
  // Estados relacionados aos valores iniciais e mensais
  const [valorInicial, setValorInicial] = useState<number | null>(null);
  const [valorMensal, setValorMensal] = useState<number | null>(null);

  // Estados relacionados à taxa de juros
  const [taxaJuros, setTaxaJuros] = useState<number>(2); // Valor da Taxa de Juros (%)
  const [periodoTaxa, setPeriodoTaxa] = useState<
    "anual" | "mensal" | "semestral" | "semanal" | "diario"
  >("anual"); // Período da Taxa de Juros

  // Estados relacionados ao período de investimento
  const [periodo, setPeriodo] = useState<number>(2); // Valor do Período
  const [tipoPeriodo, setTipoPeriodo] = useState<
    "ano" | "mes" | "semestre" | "semana" | "dia"
  >("ano"); // Tipo do Período (Ano, Mês, etc.)

  // Estados relacionados aos resultados da simulação
  const [tabelaResultados, setTabelaResultados] = useState<
    {
      mes: number;
      juros: number;
      totalInvestido: number;
      totalJuros: number;
      totalAcumulado: number;
    }[]
  >([]);
  const [valorTotalFinal, setValorTotalFinal] = useState<number | null>(null);
  const [valorTotalInvestido, setValorTotalInvestido] = useState<number | null>(
    null
  );
  const [totalJuros, setTotalJuros] = useState<number | null>(null);

  // Estado para exibição de mensagens de erro
  const [erro, setErro] = useState<string | null>(null);

  const formatPeriodPlaceholder = (value: number, period: string) => {
    if (value === 1) {
      // Singular
      switch (period) {
        case "ano":
          return "ano";
        case "mes":
          return "mês";
        case "semestre":
          return "semestre";
        case "semana":
          return "semana";
        case "dia":
          return "dia";
        default:
          return "";
      }
    } else {
      // Plural
      switch (period) {
        case "ano":
          return "anos";
        case "mes":
          return "meses";
        case "semestre":
          return "semestres";
        case "semana":
          return "semanas";
        case "dia":
          return "dias";
        default:
          return "";
      }
    }
  };

  const meses = (() => {
    switch (tipoPeriodo) {
      case "ano":
        return periodo * 12;
      case "semestre":
        return periodo * 6;
      case "mes":
        return periodo;
      case "semana":
        return Math.ceil((periodo * 7) / 30); // Aproximação de semanas para meses
      case "dia":
        return Math.ceil(periodo / 30); // Aproximação de dias para meses
      default:
        return periodo;
    }
  })();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, ""); // Remove tudo que não for número
    const numericValue = parseFloat(value) / 100; // Divide para ajustar para centavos
    setValorInicial(isNaN(numericValue) ? null : numericValue); // Define o valor como null se inválido
  };

  const handleChangeMensal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, ""); // Remove tudo que não for número
    const numericValue = parseFloat(value) / 100; // Divide para ajustar para centavos
    setValorMensal(isNaN(numericValue) ? null : numericValue); // Define o valor como null se inválido
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return "";
    return `R$ ${value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const calcular = () => {
    setErro(null);

    if (!valorInicial && !valorMensal) {
      setErro("Adicione um valor inicial ou mensal!");
      return;
    }

    const taxaMensal =
      periodoTaxa === "anual"
        ? taxaJuros / 12 / 100
        : periodoTaxa === "semestral"
        ? taxaJuros / 6 / 100
        : periodoTaxa === "mensal"
        ? taxaJuros / 100
        : periodoTaxa === "semanal"
        ? (taxaJuros * 4) / 100 // Aproximação de semanas para meses
        : periodoTaxa === "diario"
        ? (taxaJuros * 30) / 100 // Aproximação de dias para meses
        : taxaJuros / 100;

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
    doc.text(
      `Valor Total Investido: R$ ${valorTotalInvestido?.toFixed(2)}`,
      10,
      40
    );
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
        head: [
          ["Mês", "Juros", "Total Investido", "Total Juros", "Total Acumulado"],
        ],
        body: tabela,
        startY: 70,
      });
    }

    doc.save("resultados-simulador.pdf");
  };

  const data =
    tabelaResultados.length > 0
      ? {
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
        }
      : null;

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
    <section className="flex w-full flex-row overflow-visible">
      <div className="w-full bg-[#FEFAF3] pt-8 p-6 shadow-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            calcular();
          }}
        >
          <section>
            <div className="grid grid-cols-2 gap-4">
              {/* Campo Valor Inicial */}
              <div>
                <div className="mb-4 flex flex-col gap-2">
                  <h2 className="gap-1 flex flex-row text-[20px] text-[#16140c] leading-[1.4em] font-bold">
                    Valor inicial <span className="text-[#FF0000]">*</span>
                  </h2>
                  <p className="text-[#0000005a] max-w-[382px] font-medium text-base">
                    Quantidade de dinheiro que você tem disponível para investir
                    inicialmente.
                  </p>
                </div>
                <input
                  type="text"
                  className={`inputgsoft !placeholder-black !text-black !placeholder-opacity-50 ${
                    erro && !valorInicial ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formatCurrency(valorInicial)} // Exibe o valor formatado
                  onChange={handleChange} // Aplica a formatação ao digitar
                  placeholder="R$ 0,00"
                />
                {erro && !valorInicial && (
                  <p className="text-red-500 text-sm mt-1">
                    Adicione um valor inicial.
                  </p>
                )}
              </div>

              {/* Campo Valor Mensal */}
              <div>
                <div className="mb-4 flex flex-col gap-2">
                  <h2 className="gap-1 flex flex-row text-[20px] text-[#16140c] leading-[1.4em] font-bold">
                    Depósito por mês
                  </h2>
                  <p className="text-[#0000005a] max-w-[382px] font-medium text-base">
                    Valor que você planeja adicionar todo mês ou um número
                    negativo para sacar todo mês.
                  </p>
                </div>
                <input
                  type="text"
                  className={`inputgsoft !placeholder-black !placeholder-opacity-50 !text-black ${
                    erro && !valorMensal ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formatCurrency(valorMensal)} // Exibe o valor formatado
                  onChange={handleChangeMensal} // Aplica a formatação ao digitar
                  placeholder="R$ 0,00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              {/* Campo Taxa de Juros */}
              <div>
                <div className="mb-4 flex flex-col gap-2">
                  <h2 className="gap-1 flex flex-row text-[20px] text-[#16140c] leading-[1.4em] font-bold">
                    Taxa de juros <span className="text-[#FF0000]">*</span>
                  </h2>
                  <p className="text-[#0000005a] font-medium text-base">
                    Sua taxa de juros anual estimada.
                  </p>
                </div>
                <div className="flex">
                  <select
                    className=" rounded-r-none w-[105px] hover:bg-[#f1ede6] text-[#16140c] focus:outline-none focus:ring-sky-500 bg-[#f7f2eb] p-3 border border-r-0 transition duration-500 border-[#8f8879] rounded-[12px] text-[16px] font-medium placeholder-[#16140c] placeholder-opacity-60 leading-5 focus:ring-8 focus:ring-[#16140c24] outline-offset-2 focus:outline-2 outline-[#16140c] tracking-normal text-start text-ellipsis whitespace-nowrap "
                    value={periodoTaxa}
                    onChange={(e) =>
                      setPeriodoTaxa(
                        e.target.value as
                          | "anual"
                          | "mensal"
                          | "semestral"
                          | "semanal"
                          | "diario"
                      )
                    }
                  >
                    <option value="anual">Anual</option>
                    <option value="mensal">Mensal</option>
                    <option value="semestral">Semestral</option>
                    <option value="semanal">Semanal</option>
                    <option value="diario">Diário</option>
                  </select>
                  <input
                    type="text"
                    className={` !placeholder-[#16140c] rounded-l-none w-full !text-[#16140c] !placeholder-opacity-50 bg-[#f7f2eb] p-3 border transition duration-500 border-[#16140c70] rounded-[12px] text-[16px] font-medium leading-5 focus:ring-8 focus:ring-[#16140c24] outline-offset-2 focus:outline-2 outline-[#16140c] tracking-normal text-start text-ellipsis whitespace-nowrap ${
                      erro && !taxaJuros ? "border-red-500" : "border-gray-300"
                    }`}
                    value={`${taxaJuros}%`} // Exibe o valor formatado como porcentagem
                    onChange={(e) => {
                      const value = parseFloat(
                        e.target.value.replace(/[^\d.]/g, "")
                      );
                      setTaxaJuros(isNaN(value) ? 0 : value);
                    }}
                    placeholder="Ex.: 5%"
                  />
                </div>
              </div>

              {/* Campo Período */}
              <div>
                <div className="mb-4 flex flex-col gap-2">
                  <h2 className="gap-1 flex flex-row text-[20px] text-[#16140c] leading-[1.4em] font-bold">
                    Frequência do juros{" "}
                    <span className="text-[#FF0000]">*</span>
                  </h2>
                  <p className="text-[#0000005a] font-medium text-base">
                    Período que esses juros serão compostos.
                  </p>
                </div>
                <div className="flex">
                  <select
                    className="rounded-r-none w-[105px] hover:bg-[#f1ede6] text-[#16140c] focus:outline-none focus:ring-sky-500 bg-[#f7f2eb] p-3 border border-r-0 transition duration-500 border-[#8f8879] rounded-[12px] text-[16px] font-medium placeholder-[#16140c] placeholder-opacity-60 leading-5 focus:ring-8 focus:ring-[#16140c24] outline-offset-2 focus:outline-2 outline-[#16140c] tracking-normal text-start text-ellipsis whitespace-nowrap"
                    value={tipoPeriodo}
                    onChange={(e) =>
                      setTipoPeriodo(
                        e.target.value as
                          | "ano"
                          | "mes"
                          | "semestre"
                          | "semana"
                          | "dia"
                      )
                    }
                  >
                    <option value="ano">Ano(s)</option>
                    <option value="mes">Mês(es)</option>
                    <option value="semestre">Semestre(s)</option>
                    <option value="semana">Semana(s)</option>
                    <option value="dia">Dia(s)</option>
                  </select>
                  <input
                    type="text"
                    className={` !placeholder-[#16140c] rounded-l-none w-full !text-[#16140c] !placeholder-opacity-50 bg-[#f7f2eb] p-3 border transition duration-500 border-[#16140c70] rounded-[12px] text-[16px] font-medium leading-5 focus:ring-8 focus:ring-[#16140c24] outline-offset-2 focus:outline-2 outline-[#16140c] tracking-normal text-start text-ellipsis whitespace-nowrap ${
                      erro && !periodo ? "border-red-500" : "border-gray-300"
                    }`}
                    value={
                      periodo
                        ? `${periodo} ${formatPeriodPlaceholder(
                            periodo,
                            tipoPeriodo
                          )}`
                        : ""
                    }
                    onChange={(e) => {
                      const value = parseInt(
                        e.target.value.replace(/[^\d]/g, "")
                      );
                      setPeriodo(isNaN(value) ? 0 : value);
                    }}
                    placeholder="Ex.: 2 anos"
                  />
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="mt-8 flex justify-between">
              <button
                type="submit"
                className="whitespace-nowrap transition-all active:scale-[0.955] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 bg-[#2667FF] text-white py-3.5 px-6 rounded-full font-bold text-[20px] hover:bg-blue-800 flex items-center space-x-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="white"
                >
                  <path d="M 0.667 6.428 L 0.667 5.409 L 1.213 5.362 C 3.349 5.161 4.788 3.598 5.013 1.188 L 5.063 0.667 L 6.181 0.667 L 6.231 1.188 C 6.454 3.598 7.894 5.161 10.056 5.36 L 10.577 5.411 L 10.577 6.43 L 10.056 6.453 C 7.97 6.552 6.479 8.167 6.23 10.651 L 6.181 11.172 L 5.063 11.172 L 5.013 10.651 C 4.765 8.167 3.3 6.552 1.213 6.453 Z M 7.671 14.575 L 7.671 13.358 L 11.795 12.414 C 13.434 12.042 13.732 11.595 14.007 9.905 L 14.874 4.517 L 16.464 4.517 L 17.333 9.907 C 17.607 11.595 17.905 12.042 19.519 12.416 L 23.667 13.358 L 23.667 14.575 L 19.519 15.544 C 17.904 15.917 17.656 16.364 17.333 18.053 L 16.464 23.667 L 14.874 23.667 L 14.005 18.053 C 13.732 16.364 13.434 15.917 11.794 15.544 Z M 1.412 18.028 L 1.412 17.605 C 2.828 17.059 3.672 16.19 4.293 14.575 L 4.616 14.575 C 5.262 16.19 6.131 17.084 7.522 17.606 L 7.522 18.028 C 6.131 18.574 5.237 19.32 4.616 21.108 L 4.293 21.108 C 3.672 19.32 2.828 18.574 1.412 18.028 Z" />
                </svg>
                <span>Calcular</span>
              </button>
            </div>
          </section>
        </form>

        <section className="bg-[#f6f0e6] mt-8 p-4 flex flex-col items-start rounded-[6px]">
          {/* Resultados Gerais */}
          {valorTotalFinal !== null && (
            <div className=" grid grid-cols-3 gap-4 w-full">
              <button className="text-start p-4 h-46 gap-4 bg-[#fffbf5] border-[#ded7ca66] border-2 flex flex-col cursor-default active:scale-[0.985] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 relative bg-white-2 shadow-md overflow-hidden rounded-lg border-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  aria-hidden="true"
                  role="img"
                  className="absolute text-black top-6 right-6 opacity-20 iconify iconify--heroicons-outline"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2"
                  />
                </svg>
                <h3 className="cursor-default justify-between py-1 px-2 text-base !text-[#16140c] opacity-70 font-medium">
                  Valor acumulado
                </h3>
                <p className="relative rounded-[6px] !text-[#16140c] opacity-70 py-1 px-2 cursor-default inline-block text-4xl font-bold leading-none">
                  R$ {valorTotalFinal.toFixed(2)}
                </p>
              </button>
              <button className="text-start justify-between p-4 h-46 gap-4 bg-[#fffbf5] border-[#ded7ca66] border-2 flex flex-col cursor-default active:scale-[0.985] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 relative bg-white-2 shadow-md overflow-hidden rounded-lg border-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  aria-hidden="true"
                  role="img"
                  className="absolute text-black top-6 right-6 opacity-20 iconify iconify--heroicons-outline"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2"
                  />
                </svg>
                <h3 className="cursor-default py-1 px-2 text-base !text-[#16140c] opacity-70 font-medium">
                  Valor total investido
                </h3>
                <p className="relative rounded-[6px] !text-[#16140c] opacity-70 py-1 px-2 cursor-default inline-block text-4xl font-bold leading-none">
                  R$ {valorTotalInvestido?.toFixed(2)}
                </p>
              </button>
              <button className="text-start justify-between p-4 h-46 gap-4 bg-[#fffbf5] border-[#ded7ca66] border-2 flex flex-col cursor-default active:scale-[0.985] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 relative bg-white-2 shadow-md overflow-hidden rounded-lg border-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  aria-hidden="true"
                  role="img"
                  className="absolute text-black top-6 right-6 opacity-20 iconify iconify--heroicons-outline"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2"
                  />
                </svg>
                <h3 className="cursor-default  py-1 px-2 text-base !text-[#16140c] opacity-70 font-medium">
                  Total em juros
                </h3>
                <p className="relative rounded-[6px] !text-[#16140c] opacity-70 py-1 px-2 cursor-default inline-block text-4xl font-bold leading-none">
                  R$ {totalJuros?.toFixed(2)}
                </p>
              </button>
            </div>
          )}
          {/* Gráfico */}
          {data && tabelaResultados.length > 0 && (
            <button className="mt-4 text-start p-4 gap-4 bg-[#fffbf5] border-[#ded7ca66] border-2 flex flex-col cursor-default active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 relative bg-white-2 shadow-md overflow-hidden rounded-lg border-md w-full h-[74vh]">
              <Line data={data} options={options} />
            </button>
          )}

          {/* Tabela de Resultados */}
          {tabelaResultados.length > 0 && (
            <div className="mt-4 w-full">
              <button className="w-full text-start px-4 pb-4 max-h-[74vh] overflow-y-visible gap-4 bg-[#fffbf5] border-[#ded7ca66] border-2 flex flex-col cursor-default active:scale-[0.995] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 relative bg-white-2 shadow-md overflow-hidden rounded-lg border-md">
                <table className="!text-[#16140c] overflow-visible table-auto w-full border-collapse border rounded-[6px]">
                  <thead className="overflow-visible">
                    <tr className="bg-[#fffbf5] sticky top-[-1px] shadow-[#fffbf5] shadow-xl">
                      <th className="border-none border-[#ded7ca66] p-2 pt-4 text-left">
                        Mês
                      </th>
                      <th className="border border-[#ded7ca66] p-2 pt-4 text-left">
                        Juros
                      </th>
                      <th className="border border-[#ded7ca66] p-2 pt-4 text-left">
                        Total investido
                      </th>
                      <th className="border border-[#ded7ca66] p-2 pt-4 text-left">
                        Total juros
                      </th>
                      <th className="border border-[#ded7ca66] p-2 pt-4 text-left">
                        Total acumulado
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabelaResultados.map((linha) => (
                      <tr key={linha.mes}>
                        <td className="border border-[#ded7ca66] p-2">
                          {linha.mes}
                        </td>
                        <td className="border border-[#ded7ca66] p-2">
                          R$ {linha.juros.toFixed(2)}
                        </td>
                        <td className="border border-[#ded7ca66] p-2">
                          R$ {linha.totalInvestido.toFixed(2)}
                        </td>
                        <td className="border border-[#ded7ca66] p-2">
                          R$ {linha.totalJuros.toFixed(2)}
                        </td>
                        <td className="border border-[#ded7ca66] p-2">
                          R$ {linha.totalAcumulado.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </button>
            </div>
          )}
        </section>
      </div>
      <div className="w-fit overflow-visible max-h-full flex bg-[#F9F5EB] flex-col pt-8 gap-2.5 p-6 items-start">
        <div className="sticky top-5 flex gap-2 flex-col ">
          <button
            type="button"
            className="bg-[#FEFAF3]  hover:bg-[#f1ede6] border-2 border-[#CBC8C2] w-[220px] h-[42px] py-2 px-4 font-bold text-[20px] leading-3 text-[#16140c]"
            onClick={exportarParaPDF}
          >
            Exportar PDF
          </button>
          <span className="text-base flex flex-col text-center w-full !text-[#000] opacity-30 font-medium leading-6">
            Salve tudo como um .PDF
          </span>
        </div>
      </div>
    </section>
  );
};

export default CalculatorForm;
