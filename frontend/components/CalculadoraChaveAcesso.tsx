import React, { useState } from "react";

function calcularDV(
  uf: string,
  aaMM: string,
  cnpj: string,
  mod: string,
  serie: string,
  nNF: string,
  tpEmis: string,
  cNF: string
) {
  aaMM = aaMM.replaceAll("/","");
  cnpj = cnpj.replace("/","");
  cnpj = cnpj.replaceAll(".", "")
  cnpj = cnpj.replaceAll("-","")
  console.log("cnpj", cnpj)
  
  const chave = uf + aaMM + cnpj + mod + serie + nNF + tpEmis + cNF;
  console.log("params", uf, aaMM, cnpj, mod, serie, nNF, tpEmis, cNF)
  const digitos = chave.split("").map(Number);
  const pesos = Array.from({ length: digitos.length }, (_, i) => 2 + (i % 8));
  const soma = digitos
    .reverse()
    .reduce((acc, digito, i) => acc + digito * pesos[i], 0);
  const resto = soma % 11;
  const dv = resto < 2 ? 0 : 11 - resto;
  console.log("dv",dv)
  console.log("chave",chave)
  return chave + dv;
}

const estados = [
  { uf: "11", nome: "Rondônia" },
  { uf: "12", nome: "Acre" },
  { uf: "13", nome: "Amazonas" },
  { uf: "14", nome: "Roraima" },
  { uf: "15", nome: "Pará" },
  { uf: "16", nome: "Amapá" },
  { uf: "17", nome: "Tocantins" },
  { uf: "21", nome: "Maranhão" },
  { uf: "22", nome: "Piauí" },
  { uf: "23", nome: "Ceará" },
  { uf: "24", nome: "Rio Grande do Norte" },
  { uf: "25", nome: "Paraíba" },
  { uf: "26", nome: "Pernambuco" },
  { uf: "27", nome: "Alagoas" },
  { uf: "28", nome: "Sergipe" },
  { uf: "29", nome: "Bahia" },
  { uf: "31", nome: "Minas Gerais" },
  { uf: "32", nome: "Espírito Santo" },
  { uf: "33", nome: "Rio de Janeiro" },
  { uf: "35", nome: "São Paulo" },
  { uf: "41", nome: "Paraná" },
  { uf: "42", nome: "Santa Catarina" },
  { uf: "43", nome: "Rio Grande do Sul" },
  { uf: "50", nome: "Mato Grosso do Sul" },
  { uf: "51", nome: "Mato Grosso" },
  { uf: "52", nome: "Goiás" },
  { uf: "53", nome: "Distrito Federal" },
];

const tiposEmissao = [
  { valor: "1", descricao: "Emissão normal (não em contingência)" },
  { valor: "2", descricao: "Contingência FS-IA" },
  { valor: "3", descricao: "Contingência SCAN" },
  { valor: "4", descricao: "Contingência DPEC" },
  { valor: "5", descricao: "Contingência FS-DA" },
  { valor: "6", descricao: "Contingência SVC-AN" },
  { valor: "7", descricao: "Contingência SVC-RS" },
];

const modelos = [
  { valor: "01", descricao: "Nota Fiscal" },
  { valor: "1B", descricao: "Nota Fiscal Avulsa" },
  { valor: "02", descricao: "Nota Fiscal de Venda a Consumidor" },
  { valor: "2D", descricao: "Cupom Fiscal emitido por ECF" },
  { valor: "2E", descricao: "Bilhete de Passagem emitido por ECF" },
  { valor: "04", descricao: "Nota Fiscal de Produtor" },
  { valor: "06", descricao: "Nota Fiscal/Conta de Energia Elétrica" },
  { valor: "07", descricao: "Nota Fiscal de Serviço de Transporte" },
  { valor: "08", descricao: "Conhecimento de Transporte Rodoviário de Cargas" },
  { valor: "8B", descricao: "Conhecimento de Transporte de Cargas Avulso" },
  { valor: "09", descricao: "Conhecimento de Transporte Aquaviário de Cargas" },
  { valor: "10", descricao: "Conhecimento Aéreo" },
  {
    valor: "11",
    descricao: "Conhecimento de Transporte Ferroviário de Cargas",
  },
  { valor: "13", descricao: "Bilhete de Passagem Rodoviário" },
  { valor: "14", descricao: "Bilhete de Passagem Aquaviário" },
  { valor: "15", descricao: "Bilhete de Passagem e Nota de Bagagem" },
  { valor: "16", descricao: "Bilhete de Passagem Ferroviário" },
  { valor: "17", descricao: "Despacho de Transporte" },
  { valor: "18", descricao: "Resumo de Movimento Diário" },
  { valor: "20", descricao: "Ordem de Coleta de Cargas" },
  { valor: "21", descricao: "Nota Fiscal de Serviço de Comunicação" },
  { valor: "22", descricao: "Nota Fiscal de Serviço de Telecomunicação" },
  { valor: "23", descricao: "GNRE" },
  { valor: "24", descricao: "Autorização de Carregamento e Transporte" },
  { valor: "25", descricao: "Manifesto de Carga" },
  { valor: "26", descricao: "Conhecimento de Transporte Multimodal de Cargas" },
  { valor: "27", descricao: "Nota Fiscal de Transporte Ferroviário de Cargas" },
  {
    valor: "28",
    descricao: "Nota Fiscal/Conta de Fornecimento de Gás Canalizado",
  },
  {
    valor: "29",
    descricao: "Nota Fiscal/Conta de Fornecimento de Água Canalizada",
  },
  { valor: "30", descricao: "Bilhete/Recibo do Passageiro" },
  { valor: "55", descricao: "Nota Fiscal Eletrônica" },
  { valor: "57", descricao: "Conhecimento de Transporte Eletrônico – CT-e" },
  { valor: "59", descricao: "Cupom Fiscal Eletrônico – CF-e" },
  { valor: "60", descricao: "Cupom Fiscal Eletrônico CF-e-ECF" },
  {
    valor: "62",
    descricao:
      "Nota Fiscal Fatura Eletrônica de Serviços de Comunicação – NFCom",
  },
  { valor: "63", descricao: "Bilhete de Passagem Eletrônico – BP-e" },
  {
    valor: "65",
    descricao: "Nota Fiscal Eletrônica ao Consumidor Final – NFC-e",
  },
  {
    valor: "66",
    descricao: "Nota Fiscal de Energia Elétrica Eletrônica – NF3e",
  },
  {
    valor: "67",
    descricao:
      "Conhecimento de Transporte Eletrônico para Outros Serviços – CT-e OS",
  },
];



const CalculadoraChaveAcesso: React.FC = () => {
  const [uf, setUf] = useState("");
  const [aaMM, setAaMM] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [mod, setMod] = useState("");
  const [serie, setSerie] = useState("");
  const [nNF, setNf] = useState("");
  const [tpEmis, setTpEmis] = useState("");
  const [cNF, setCNF] = useState("");
  const [chaveAcesso, setChaveAcesso] = useState("");
  const [erros, setErros] = useState<{ [key: string]: string }>({});

  const aplicarMascara = (valor: string, mascara: string) => {
    let i = 0;
    const onlyNumbers = valor.replace(/\D/g, "");
    return mascara.replace(/#/g, () => onlyNumbers[i++] || "");
  };

  const handleBlur = (
    valor: string,
    setValor: React.Dispatch<React.SetStateAction<string>>,
    mascara: string
  ) => {
    const onlyNumbers = valor.replace(/\D/g, "");
    setValor(aplicarMascara(onlyNumbers, mascara));
  };

  const validarCampos = () => {
    const novosErros: { [key: string]: string } = {};
    if (!uf || uf.length !== 2) novosErros.uf = "UF inválido.";
    if (!aaMM || aaMM.length !== 5) novosErros.aaMM = "AA/MM inválido.";
    if (!cnpj || cnpj.length !== 18) novosErros.cnpj = "CNPJ inválido.";
    if (!mod || mod.length !== 2) novosErros.mod = "Modelo inválido.";
    if (!serie || serie.length !== 3) novosErros.serie = "Série inválida.";
    if (!nNF || nNF.length !== 9) novosErros.nNF = "Número NF inválido.";
    if (!tpEmis || tpEmis.length !== 1) novosErros.tpEmis = "Tipo de Emissão inválido.";
    if (!cNF || cNF.length !== 8) novosErros.cNF = "Código Numérico inválido.";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const calcularChave = () => {
    if (!validarCampos()) return;

    const chave = calcularDV(uf, aaMM, cnpj, mod, serie, nNF, tpEmis, cNF);
    setChaveAcesso(chave);
  };

  return (
    <div className="w-full bg-[#FEFAF3] pt-8 p-6 shadow-lg">
      <div className="mb-4 flex flex-col gap-2">
        <h2 className="gap-1 flex flex-row text-[20px] text-[#16140c] leading-[1.4em] font-bold">
          UF <span className="text-[#FF0000]">*</span>
        </h2>
        <p className="text-[#0000005a] max-w-[382px] font-medium text-base">
          Estado que foi emitido a nota.
        </p>
        <select
          className="inputgsoft !placeholder-black !text-black !placeholder-opacity-50"
          value={uf}
          onChange={(e) => setUf(e.target.value)}
        >
          <option value="">Selecione o estado</option>
          {estados.map((estado) => (
            <option key={estado.uf} value={estado.uf}>
              {estado.nome}
            </option>
          ))}
        </select>
        {erros.uf && <p className="text-red-500 mt-1">{erros.uf}</p>}
      </div>
  
      <div className="mb-4 flex flex-col gap-2">
        <h2 className="gap-1 flex flex-row text-[20px] text-[#16140c] leading-[1.4em] font-bold">
          Ano e mês <span className="text-[#FF0000]">*</span>
        </h2>
        <p className="text-[#0000005a] max-w-[382px] font-medium text-base">
          Dois últimos dígitos do ano e mês da emissão da nota fiscal eletrônica (NF-e).
        </p>
        <input
          type="text"
          className="inputgsoft !placeholder-black !text-black !placeholder-opacity-50"
          value={aaMM}
          onChange={(e) => setAaMM(e.target.value.replace(/\D/g, ""))}
          onBlur={() => handleBlur(aaMM, setAaMM, "##/##")}
          placeholder="AA/MM"
          maxLength={5}
        />
        {erros.aaMM && <p className="text-red-500 mt-1">{erros.aaMM}</p>}
      </div>
  
      <div className="mb-4 flex flex-col gap-2">
        <h2 className="gap-1 flex flex-row text-[20px] text-[#16140c] leading-[1.4em] font-bold">
          CNPJ <span className="text-[#FF0000]">*</span>
        </h2>
        <p className="text-[#0000005a] max-w-[382px] font-medium text-base">
          Número do CNPJ da empresa emitente.
        </p>
        <input
          type="text"
          className="inputgsoft !placeholder-black !text-black !placeholder-opacity-50"
          value={cnpj}
          onChange={(e) => setCnpj(e.target.value.replace(/\D/g, ""))}
          onBlur={() => handleBlur(cnpj, setCnpj, "##.###.###/####-##")}
          placeholder="00.000.000/0000-00"
          maxLength={18}
        />
        {erros.cnpj && <p className="text-red-500 mt-1">{erros.cnpj}</p>}
      </div>
  
      <div className="mb-4 flex flex-col gap-2">
        <h2 className="gap-1 flex flex-row text-[20px] text-[#16140c] leading-[1.4em] font-bold">
          Modelo <span className="text-[#FF0000]">*</span>
        </h2>
        <p className="text-[#0000005a] max-w-[382px] font-medium text-base">
          Modelo da nota fiscal.
        </p>
        <select
          className="inputgsoft !placeholder-black !text-black !placeholder-opacity-50"
          value={mod}
          onChange={(e) => setMod(e.target.value)}
        >
          <option value="">Selecione o modelo</option>
          {modelos.map((modelo) => (
            <option key={modelo.valor} value={modelo.valor}>
              {modelo.descricao}
            </option>
          ))}
        </select>
        {erros.mod && <p className="text-red-500 mt-1">{erros.mod}</p>}
      </div>
  
      <div className="mb-4 flex flex-col gap-2">
        <h2 className="gap-1 flex flex-row text-[20px] text-[#16140c] leading-[1.4em] font-bold">
          Série <span className="text-[#FF0000]">*</span>
        </h2>
        <p className="text-[#0000005a] max-w-[382px] font-medium text-base">
          Série da nota fiscal.
        </p>
        <input
          type="text"
          className="inputgsoft !placeholder-black !text-black !placeholder-opacity-50"
          value={serie}
          onChange={(e) => setSerie(e.target.value.replace(/\D/g, ""))}
          onBlur={() => setSerie(serie.padStart(3, "0"))}
          placeholder="000"
          maxLength={3}
        />
        {erros.serie && <p className="text-red-500 mt-1">{erros.serie}</p>}
      </div>
  
      <div className="mb-4 flex flex-col gap-2">
        <h2 className="gap-1 flex flex-row text-[20px] text-[#16140c] leading-[1.4em] font-bold">
          Número NF <span className="text-[#FF0000]">*</span>
        </h2>
        <p className="text-[#0000005a] max-w-[382px] font-medium text-base">
          Número da nota fiscal.
        </p>
        <input
          type="text"
          className="inputgsoft !placeholder-black !text-black !placeholder-opacity-50"
          value={nNF}
          onChange={(e) => setNf(e.target.value.replace(/\D/g, ""))}
          onBlur={() => setNf(nNF.padStart(9, "0"))}
          placeholder="000000000"
          maxLength={9}
        />
        {erros.nNF && <p className="text-red-500 mt-1">{erros.nNF}</p>}
      </div>
  
      <div className="mb-4 flex flex-col gap-2">
        <h2 className="gap-1 flex flex-row text-[20px] text-[#16140c] leading-[1.4em] font-bold">
          Tipo de Emissão (tpEmis)<span className="text-[#FF0000]">*</span>
        </h2>
        <p className="text-[#0000005a] max-w-[382px] font-medium text-base">
          Selecione o tipo de emissão da nota fiscal.
        </p>
        <select
          className="inputgsoft !placeholder-black !text-black !placeholder-opacity-50"
          value={tpEmis}
          onChange={(e) => setTpEmis(e.target.value)}
        >
          <option value="">Selecione</option>
          {tiposEmissao.map((tipo) => (
            <option key={tipo.valor} value={tipo.valor}>
              {tipo.descricao}
            </option>
          ))}
        </select>
        {erros.tpEmis && <p className="text-red-500 mt-1">{erros.tpEmis}</p>}
      </div>
  
      <div className="mb-4 flex flex-col gap-2">
        <h2 className="gap-1 flex flex-row text-[20px] text-[#16140c] leading-[1.4em] font-bold">
          Código numérico (cNF) <span className="text-[#FF0000]">*</span>
        </h2>
        <p className="text-[#0000005a] max-w-[382px] font-medium text-base">
          Código numérico para identificar a NF-e.
        </p>
        <input
          type="text"
          className="inputgsoft !placeholder-black !text-black !placeholder-opacity-50"
          value={cNF}
          onChange={(e) => setCNF(e.target.value.replace(/\D/g, ""))}
          onBlur={() => setCNF(cNF.padStart(8, "0"))}
          placeholder="00000000"
          maxLength={8}
        />
        {erros.cNF && <p className="text-red-500 mt-1">{erros.cNF}</p>}
      </div>

      <div className="mt-8 flex justify-between">
              <button
                onClick={calcularChave}
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
  
      {chaveAcesso && (
        <div className="mt-4 p-4 bg-[#eb760007]  border-l-4 border-[#EB750050]">
          <h3 className="text-lg font-bold !text-black">Chave de Acesso Gerada</h3>
          <p className="!text-black">{chaveAcesso}</p>
        </div>
      )}
    </div>
  );
};

export default CalculadoraChaveAcesso;