import { useState } from "react";
import axios from "axios";

function CadastroVeiculo({ apiUrl, usuario, aoCadastrar }) {
  const [veiculo, setVeiculo] = useState({
    marca: "",
    modelo: "",
    ano: "",
    cor: "",
  });
  const [peca, setPeca] = useState({ nome: "", modelo: "" });
  const [mensagem, setMensagem] = useState("");

  function alterarVeiculo(evento) {
    setVeiculo({
      ...veiculo,
      [evento.target.name]: evento.target.value,
    });
  }

  function alterarPeca(evento) {
    setPeca({
      ...peca,
      [evento.target.name]: evento.target.value,
    });
  }

  function cadastrar(evento) {
    evento.preventDefault();
    setMensagem("");

    if ((peca.nome && !peca.modelo) || (!peca.nome && peca.modelo)) {
      setMensagem("Preencha o nome e o modelo da peça, ou deixe os dois vazios.");
      return;
    }

    const novoVeiculo = {
      ...veiculo,
      ano: Number(veiculo.ano),
      usuarioId: usuario.id,
    };

    axios
      .post(`${apiUrl}/veiculos`, novoVeiculo)
      .then((resposta) => {
        if (peca.nome && peca.modelo) {
          axios
            .post(`${apiUrl}/veiculos/${resposta.data.id}/pecas`, peca)
            .then(aoCadastrar)
            .catch(() => {
              setMensagem("O veículo foi criado, mas não foi possível salvar a peça.");
            });
        } else {
          aoCadastrar();
        }
      })
      .catch(() => setMensagem("Não foi possível cadastrar o veículo."));
  }

  return (
    <section>
      <div className="titulo-pagina">
        <div>
          <h1>Cadastrar veículo</h1>
          <p>Informe os dados do carro e, se quiser, sua primeira peça.</p>
        </div>
      </div>

      <form className="cartao formulario-veiculo" onSubmit={cadastrar}>
        <h2>Dados do veículo</h2>
        <div className="grade-formulario">
          <div>
            <label htmlFor="marca">Marca</label>
            <input id="marca" name="marca" value={veiculo.marca} onChange={alterarVeiculo} required />
          </div>
          <div>
            <label htmlFor="modelo">Modelo</label>
            <input id="modelo" name="modelo" value={veiculo.modelo} onChange={alterarVeiculo} required />
          </div>
          <div>
            <label htmlFor="ano">Ano</label>
            <input id="ano" name="ano" type="number" min="1900" max="2100" value={veiculo.ano} onChange={alterarVeiculo} required />
          </div>
          <div>
            <label htmlFor="cor">Cor</label>
            <input id="cor" name="cor" value={veiculo.cor} onChange={alterarVeiculo} required />
          </div>
        </div>

        <hr />
        <h2>Primeira peça (opcional)</h2>
        <div className="grade-formulario">
          <div>
            <label htmlFor="nomePeca">Nome da peça</label>
            <input id="nomePeca" name="nome" value={peca.nome} onChange={alterarPeca} placeholder="Ex.: Motor" />
          </div>
          <div>
            <label htmlFor="modeloPeca">Modelo da peça</label>
            <input id="modeloPeca" name="modelo" value={peca.modelo} onChange={alterarPeca} placeholder="Ex.: 2.0 TSI" />
          </div>
        </div>

        {mensagem && <p className="mensagem erro">{mensagem}</p>}
        <button className="botao-principal" type="submit">Cadastrar veículo</button>
      </form>
    </section>
  );
}

export default CadastroVeiculo;
