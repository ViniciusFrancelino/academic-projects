import { useState } from "react";
import axios from "axios";

function ComparacaoVeiculos({ apiUrl, veiculos }) {
  const [primeiroId, setPrimeiroId] = useState("");
  const [segundoId, setSegundoId] = useState("");
  const [resultado, setResultado] = useState(null);
  const [mensagem, setMensagem] = useState("");

  function comparar() {
    if (!primeiroId || !segundoId || primeiroId === segundoId) {
      setMensagem("Selecione dois veículos diferentes.");
      setResultado(null);
      return;
    }

    const primeiro = veiculos.find((veiculo) => veiculo.id === Number(primeiroId));
    const segundo = veiculos.find((veiculo) => veiculo.id === Number(segundoId));

    axios
      .get(`${apiUrl}/veiculos/${primeiroId}/pecas`)
      .then((respostaPrimeiro) => {
        axios
          .get(`${apiUrl}/veiculos/${segundoId}/pecas`)
          .then((respostaSegundo) => {
            setResultado({
              primeiro,
              segundo,
              pecasPrimeiro: respostaPrimeiro.data,
              pecasSegundo: respostaSegundo.data,
            });
            setMensagem("");
          })
          .catch(() => setMensagem("Não foi possível carregar a comparação."));
      })
      .catch(() => setMensagem("Não foi possível carregar a comparação."));
  }

  function montarLinhas() {
    const nomes = [];

    resultado.pecasPrimeiro.forEach((peca) => {
      if (!nomes.includes(peca.nome)) {
        nomes.push(peca.nome);
      }
    });
    resultado.pecasSegundo.forEach((peca) => {
      if (!nomes.includes(peca.nome)) {
        nomes.push(peca.nome);
      }
    });

    return nomes.map((nome) => ({
      nome,
      primeira: resultado.pecasPrimeiro.find((peca) => peca.nome === nome),
      segunda: resultado.pecasSegundo.find((peca) => peca.nome === nome),
    }));
  }

  return (
    <section>
      <div className="titulo-pagina">
        <div>
          <h1>Comparar veículos</h1>
          <p>Escolha dois carros para ver suas peças lado a lado.</p>
        </div>
      </div>

      <div className="cartao selecao-comparacao">
        <div>
          <label htmlFor="primeiro">Primeiro veículo</label>
          <select id="primeiro" value={primeiroId} onChange={(evento) => setPrimeiroId(evento.target.value)}>
            <option value="">Selecione</option>
            {veiculos.map((veiculo) => (
              <option key={veiculo.id} value={veiculo.id}>
                {veiculo.marca} {veiculo.modelo} - @{veiculo.usuarioUsername}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="segundo">Segundo veículo</label>
          <select id="segundo" value={segundoId} onChange={(evento) => setSegundoId(evento.target.value)}>
            <option value="">Selecione</option>
            {veiculos.map((veiculo) => (
              <option key={veiculo.id} value={veiculo.id}>
                {veiculo.marca} {veiculo.modelo} - @{veiculo.usuarioUsername}
              </option>
            ))}
          </select>
        </div>

        <button className="botao-principal" onClick={comparar}>Comparar</button>
      </div>

      {mensagem && <p className="mensagem erro">{mensagem}</p>}

      {resultado && (
        <div className="cartao tabela-container">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>{resultado.primeiro.marca} {resultado.primeiro.modelo}</th>
                <th>{resultado.segundo.marca} {resultado.segundo.modelo}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ano</td>
                <td>{resultado.primeiro.ano}</td>
                <td>{resultado.segundo.ano}</td>
              </tr>
              <tr>
                <td>Cor</td>
                <td>{resultado.primeiro.cor}</td>
                <td>{resultado.segundo.cor}</td>
              </tr>
              {montarLinhas().map((linha) => (
                <tr key={linha.nome}>
                  <td>{linha.nome}</td>
                  <td>{linha.primeira ? linha.primeira.modelo : "—"}</td>
                  <td>{linha.segunda ? linha.segunda.modelo : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default ComparacaoVeiculos;
