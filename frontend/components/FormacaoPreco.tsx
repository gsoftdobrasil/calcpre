import React, { useState, useEffect } from "react";

const FormacaoPreco: React.FC = () => {
  const [custoCx, setCustoCx] = useState<string>("");
  const [qtdeCx, setQtdeCx] = useState<string>("");
  const [ipi, setIpi] = useState<string>("");
  const [frete, setFrete] = useState<string>("");
  const [st, setSt] = useState<string>("");
  const [icms, setIcms] = useState<string>("");
  const [outros, setOutros] = useState<string>("");
  const [markup, setMarkup] = useState<string>("");

  const [custoUnit, setCustoUnit] = useState<number>(0);
  const [compraCx, setCompraCx] = useState<number>(0);
  const [compraUn, setCompraUn] = useState<number>(0);
  const [precoVenda, setPrecoVenda] = useState<number>(0);
  const [lucro, setLucro] = useState<number>(0);
  const [margemLucro, setMargemLucro] = useState<number>(0);
  const [custoVenda, setCustoVenda] = useState<number>(0);
  const [custoTotal, setCustoTotal] = useState<number>(0);

  const parseNumber = (value: string): number => {
    const parsed = parseFloat(
      value
        .replace(/[R$\s]/g, "")
        .replace(".", "")
        .replace(",", ".")
    );
    return isNaN(parsed) ? 0 : parsed;
  };

  const formatCurrency = (value: string): string => {
    const number = parseFloat(value.replace(/[R$\s]/g, "").replace(",", "."));
    return isNaN(number)
      ? ""
      : number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  useEffect(() => {
    const custoCxValue = parseNumber(custoCx);
    const qtdeCxValue = parseNumber(qtdeCx);
    const ipiValue = parseNumber(ipi);
    const freteValue = parseNumber(frete);
    const stValue = parseNumber(st);
    const icmsValue = parseNumber(icms);
    const outrosValue = parseNumber(outros);
    const markupValue = parseNumber(markup);

    const calculatedCustoUnit =
      qtdeCxValue > 0 ? custoCxValue / qtdeCxValue : 0;
    const calculatedCompraCx =
      custoCxValue + (custoCxValue * (ipiValue + freteValue + stValue)) / 100;
    const calculatedCompraUn =
      qtdeCxValue > 0 ? calculatedCompraCx / qtdeCxValue : 0;
    const calculatedPrecoVenda =
      qtdeCxValue > 0
        ? ((markupValue + 100) * calculatedCompraUn) /
          (100 - (icmsValue + outrosValue))
        : 0;
    const calculatedCustoVenda =
      (calculatedPrecoVenda * (icmsValue + outrosValue)) / 100;
    const calculatedCustoTotal = calculatedCompraUn + calculatedCustoVenda;
    const calculatedLucro = calculatedPrecoVenda - calculatedCustoTotal;
    const calculatedMargemLucro =
      calculatedLucro > 0 ? (calculatedLucro / calculatedPrecoVenda) * 100 : 0;

      console.log(compraCx);

    setCustoUnit(calculatedCustoUnit);
    setCompraCx(calculatedCompraCx);
    setCompraUn(calculatedCompraUn);
    setPrecoVenda(calculatedPrecoVenda);
    setCustoVenda(calculatedCustoVenda);
    setCustoTotal(calculatedCustoTotal);
    setLucro(calculatedLucro);
    setMargemLucro(calculatedMargemLucro);
  }, [custoCx, qtdeCx, ipi, frete, st, icms, outros, markup]);

  return (
    <div className="w-full bg-[#FEFAF3] pt-8 p-6 shadow-lg">
     <section className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-1 lg:gap-6">
      {/* Custo Cx (NF) */}
      <div className="mb-4">
        <div className="mb-4 flex flex-col gap-2">
          <h2 className="gap-1 flex flex-row text-[20px] text-[#16140c] leading-[1.4em] font-bold">
            Custo total de caixa (NF) <span className="text-[#FF0000]">*</span>
          </h2>
          <p className="text-[#0000005a] max-w-[382px] font-medium text-base">
            Quantidade de dinheiro declarado na nota fiscal.
          </p>
        </div>
        <input
          type="text"
          className="inputgsoft w-full !text-[#16140c] !placeholder-[[#16140c]"
          value={custoCx}
          onChange={(e) => setCustoCx(e.target.value)}
          onBlur={(e) => setCustoCx(formatCurrency(e.target.value))}
          placeholder="Exemplo: R$ 100,00"
        />
      </div>

      {/* Qtde/Cx */}
      <div className="mb-4">
        <div className="mb-4 flex flex-col gap-2">
          <h2 className="gap-1 flex flex-row text-[20px] text-[#16140c] leading-[1.4em] font-bold">
            Quantidade do produto <span className="text-[#FF0000]">*</span>
          </h2>
          <p className="text-[#0000005a] max-w-[382px] font-medium text-base">
            Quantidade de produtos na nota.
          </p>
        </div>
        <input
          type="number"
          className="inputgsoft w-full !text-[#16140c] !placeholder-[[#16140c]"
          value={qtdeCx}
          onChange={(e) => setQtdeCx(e.target.value)}
          placeholder="Exemplo: 50"
        />
      </div>

      {/* IPI % */}
      <div className="mb-4">
        <div className="mb-4 flex flex-col gap-2">
          <h2 className="gap-1 flex flex-row text-[20px] text-[#16140c] leading-[1.4em] font-bold">
            IPI (%) 
          </h2>
          <p className="text-[#0000005a] max-w-[382px] font-medium text-base">
            Imposto federal sobre produtos industrializados.
          </p>
        </div>
        <input
          type="number"
          className="inputgsoft w-full !text-[#16140c] !placeholder-[[#16140c]"
          value={ipi}
          onChange={(e) => setIpi(e.target.value)}
          placeholder="Exemplo: 5"
        />
      </div>

      {/* Frete % */}
      <div className="mb-4">
        <div className="mb-4 flex flex-col gap-2">
          <h2 className="gap-1 flex flex-row text-[20px] text-[#16140c] leading-[1.4em] font-bold">
            Frete (%)
          </h2>
          <p className="text-[#0000005a] max-w-[382px] font-medium text-base">
            Taxa do transporte das mercadorias.
          </p>
        </div>
        <input
          type="number"
          className="inputgsoft w-full !text-[#16140c] !placeholder-[[#16140c]"
          value={frete}
          onChange={(e) => setFrete(e.target.value)}
          placeholder="Exemplo: 2"
        />
      </div>

      {/* S.T. % */}
      <div className="mb-4">
        <div className="mb-4 flex flex-col gap-2">
          <h2 className="gap-1 flex flex-row text-[20px] text-[#16140c] leading-[1.4em] font-bold">
            ST (%) 
          </h2>
          <p className="text-[#0000005a] max-w-[382px] font-medium text-base">
            Valor do tributo de substituição tributária para apurar o montante.
          </p>
        </div>
        <input
          type="number"
          className="inputgsoft w-full !text-[#16140c] !placeholder-[[#16140c]"
          value={st}
          onChange={(e) => setSt(e.target.value)}
          placeholder="Exemplo: 0"
        />
      </div>

      {/* ICMS % */}
      <div className="mb-4">
        <div className="mb-4 flex flex-col gap-2">
          <h2 className="gap-1 flex flex-row text-[20px] text-[#16140c] leading-[1.4em] font-bold">
            ICMS (%) 
          </h2>
          <p className="text-[#0000005a] max-w-[382px] font-medium text-base">
            Imposto sobre circulação de mercadorias e serviços sob enquadramento
            do regime.
          </p>
        </div>
        <input
          type="number"
          className="inputgsoft w-full !text-[#16140c] !placeholder-[[#16140c]"
          value={icms}
          onChange={(e) => setIcms(e.target.value)}
          placeholder="Exemplo: 7"
        />
      </div>

      {/* Outros % */}
      <div className="mb-4">
        <div className="mb-4 flex flex-col gap-2">
          <h2 className="gap-1 flex flex-row text-[20px] text-[#16140c] leading-[1.4em] font-bold">
            Outros (%) 
          </h2>
          <p className="text-[#0000005a] max-w-[382px] font-medium text-base">
            Tributos alternativos.
          </p>
        </div>
        <input
          type="number"
          className="inputgsoft w-full !text-[#16140c] !placeholder-[[#16140c]"
          value={outros}
          onChange={(e) => setOutros(e.target.value)}
          placeholder="Exemplo: 2"
        />
      </div>

      {/* Markup % */}
      <div className="mb-4">
        <div className="mb-4 flex flex-col gap-2">
          <h2 className="gap-1 flex flex-row text-[20px] text-[#16140c] leading-[1.4em] font-bold">
            Markup (%)
          </h2>
          <p className="text-[#0000005a] max-w-[382px] font-medium text-base">
            Qual é o lucro bruto de uma venda desse produto?
          </p>
        </div>
        <input
          type="number"
          className="inputgsoft w-full !text-[#16140c] !placeholder-[[#16140c]"
          value={markup}
          onChange={(e) => setMarkup(e.target.value)}
          placeholder="Exemplo: 20"
        />
      </div>
      </section>

      {/* Resultados */}
      <section className="bg-[#f6f0e6] mt-8 p-4 flex flex-col items-start rounded-[6px]">
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 b gap-4 w-full">
        <button className="text-start col-span-1 md:grid-cols-2 justify-between p-4 h-46 gap-4 bg-[#fffbf5] border-[#ded7ca66] border-2 flex flex-col cursor-default active:scale-[0.985] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 relative bg-white-2 shadow-md overflow-hidden rounded-lg border-md">
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
              Custo por unidade com impostos
            </h3>
            <p className="relative rounded-[6px] !text-[#16140c] opacity-70 py-1 px-2 cursor-default inline-block text-4xl font-bold leading-none">
              R$ {custoTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </button>
          <button className="text-start col-span-1 md:grid-cols-2 justify-between p-4 h-46 gap-4 bg-[#fffbf5] border-[#ded7ca66] border-2 flex flex-col cursor-default active:scale-[0.985] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 relative bg-white-2 shadow-md overflow-hidden rounded-lg border-md">
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
              Lucro líquido por unidade
            </h3>
            <p className="relative rounded-[6px] !text-[#16140c] opacity-70 py-1 px-2 cursor-default inline-block text-4xl font-bold leading-none">
              R$ {lucro.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </button>
          <button className="text-start col-span-1 md:grid-cols-2 justify-between p-4 h-46 gap-4 bg-[#fffbf5] border-[#ded7ca66] border-2 flex flex-col cursor-default active:scale-[0.985] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 relative bg-white-2 shadow-md overflow-hidden rounded-lg border-md">
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
              Margem de lucro
            </h3>
            <p className="relative rounded-[6px] !text-[#16140c] opacity-70 py-1 px-2 cursor-default inline-block text-4xl font-bold leading-none">
              {margemLucro.toFixed(2)}%
            </p>
          </button>
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
              Custo por unidade sem impostos
            </h3>
            <p className="relative rounded-[6px] !text-[#16140c] opacity-70 py-1 px-2 cursor-default inline-block text-4xl font-bold leading-none">
              R$ {custoUnit.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
              Custo de venda com impostos
            </h3>
            <p className="relative rounded-[6px] !text-[#16140c] opacity-70 py-1 px-2 cursor-default inline-block text-4xl font-bold leading-none">
              R$ {custoVenda.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </button>
          
          <button className="text-start grid-cols-2 justify-between p-4 h-46 gap-4 bg-[#fffbf5] border-[#ded7ca66] border-2 flex flex-col cursor-default active:scale-[0.985] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 relative bg-white-2 shadow-md overflow-hidden rounded-lg border-md">
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
              Preço de venda favorável
            </h3>
            <p className="relative rounded-[6px] !text-[#16140c] opacity-70 py-1 px-2 cursor-default inline-block text-4xl font-bold leading-none">
              R$ {precoVenda.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
              Compra por unidade com imposto
            </h3>
            <p className="relative rounded-[6px] !text-[#16140c] opacity-70 py-1 px-2 cursor-default inline-block text-4xl font-bold leading-none">
              R$ {compraUn.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
              Compra do custo de caixa
            </h3>
            <p className="relative rounded-[6px] !text-[#16140c] opacity-70 py-1 px-2 cursor-default inline-block text-4xl font-bold leading-none">
              R$ {compraCx.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 3 })}
            </p>
          </button>

          
          
        </div>
      </section>
  
    </div>
  );
};

export default FormacaoPreco;
