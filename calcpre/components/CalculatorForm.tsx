import { useState } from "react";
import { calcularDias, calcularJurosSimples, calcularJurosCompostos } from "../utils/calc";

const CalculatorForm = () => {
  const [valor, setValor] = useState<number>(0);
  const [vencimento, setVencimento] = useState<string>("");
  const [pagamento, setPagamento] = useState<string>("");
  const [taxaJuros, setTaxaJuros] = useState<number>(0);
  const [tipoCalculo, setTipoCalculo] = useState<"simples" | "composto">("simples");
  const [resultado, setResultado] = useState<number | null>(null);

  const calcular = () => {
    const dias = calcularDias(vencimento, pagamento);
    const calculo =
      tipoCalculo === "simples"
        ? calcularJurosSimples(valor, dias, taxaJuros)
        : calcularJurosCompostos(valor, dias, taxaJuros);

    setResultado(calculo);
  };

  return (
    <div className="max-w-lg mx-auto bg-gray-100 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-700 mb-4">Calculadora de Juros Pré-Datados</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          calcular();
        }}
      >
        <div className="mb-4">
          <label className="block text-gray-600">Valor:</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={valor}
            onChange={(e) => setValor(parseFloat(e.target.value))}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600">Data de Vencimento:</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={vencimento}
            onChange={(e) => setVencimento(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600">Data de Pagamento:</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={pagamento}
            onChange={(e) => setPagamento(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600">Taxa de Juros (%):</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={taxaJuros}
            onChange={(e) => setTaxaJuros(parseFloat(e.target.value))}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600">Tipo de Cálculo:</label>
          <select
            className="w-full p-2 border rounded"
            value={tipoCalculo}
            onChange={(e) => setTipoCalculo(e.target.value as "simples" | "composto")}
          >
            <option value="simples">Juros Simples</option>
            <option value="composto">Juros Compostos</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Calcular
        </button>
      </form>
      {resultado !== null && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <h3 className="text-lg font-bold">Resultado:</h3>
          <p className="text-gray-700">R$ {resultado.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default CalculatorForm;
