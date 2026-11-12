import { useState } from "react";
import axios from "axios";

function CartaoVeiculo({ apiUrl, veiculo, usuario, aoAlterar }) {
  const [pecas, setPecas] = useState([]);
  const [exibirPecas, setExibirPecas] = useState(false);
  const [novaPeca, setNovaPeca] = useState({ nome: "", modelo: "" });
  const [mensagem, setMensagem] = useState("");
  const pertenceAoUsuario = veiculo.usuarioId === usuario.id;

  function carregarPecas() {
    axios
      .get(`${apiUrl}/veiculos/${veiculo.id}/pecas`)
      .then((resposta) => {
        setPecas(resposta.data);
        setExibirPecas(true);
      })
      .catch(() => setMensagem("Não foi possível carregar as peças."));
  }

  function alternarPecas() {
    if (exibirPecas) {
      setExibirPecas(false);
    } else {
      carregarPecas();
    }
  }

  function alterarPeca(evento) {
    setNovaPeca({
      ...novaPeca,
      [evento.target.name]: evento.target.value,
    });
  }

  function adicionarPeca(evento) {
    evento.preventDefault();

    axios
      .post(`${apiUrl}/veiculos/${veiculo.id}/pecas`, novaPeca)
      .then(() => {
        setNovaPeca({ nome: "", modelo: "" });
        setMensagem("");
        carregarPecas();
      })
      .catch(() => setMensagem("Preencha o nome e o modelo da peça."));
  }

  function removerPeca(pecaId) {
    axios
      .delete(`${apiUrl}/veiculos/${veiculo.id}/pecas/${pecaId}`)
      .then(carregarPecas)
      .catch(() => setMensagem("Não foi possível remover a peça."));
  }

  function removerVeiculo() {
    if (window.confirm("Deseja realmente remover este veículo?")) {
      axios
        .delete(`${apiUrl}/veiculos/${veiculo.id}`)
        .then(aoAlterar)
        .catch(() => setMensagem("Não foi possível remover o veículo."));
    }
  }

  return (
    <article className="cartao cartao-veiculo">
      <div className="faixa-carro"></div>
      <div className="cabecalho-carro">
        <div>
          <span className="marca-carro">{veiculo.marca}</span>
          <h2>{veiculo.modelo}</h2>
        </div>
        <span className="ano">{veiculo.ano}</span>
      </div>

      <p className="dados-carro">Cor: {veiculo.cor}</p>
      <p className="dono">Cadastrado por @{veiculo.usuarioUsername}</p>

      <div className="acoes-carro">
        <button className="botao-secundario" onClick={alternarPecas}>
          {exibirPecas ? "Ocultar peças" : "Ver peças"}
        </button>
        {pertenceAoUsuario && (
          <button className="botao-perigo" onClick={removerVeiculo}>Remover</button>
        )}
      </div>

      {mensagem && <p className="mensagem erro">{mensagem}</p>}

      {exibirPecas && (
        <div className="area-pecas">
          <h3>Peças</h3>
          {pecas.length === 0 && <p className="texto-vazio">Nenhuma peça cadastrada.</p>}
          <ul className="lista-pecas">
            {pecas.map((peca) => (
              <li key={peca.id}>
                <div>
                  <strong>{peca.nome}</strong>
                  <span>{peca.modelo}</span>
                </div>
                {pertenceAoUsuario && (
                  <button onClick={() => removerPeca(peca.id)}>x</button>
                )}
              </li>
            ))}
          </ul>

          {pertenceAoUsuario && (
            <form className="formulario-peca" onSubmit={adicionarPeca}>
              <input name="nome" value={novaPeca.nome} onChange={alterarPeca} placeholder="Nome da peça" required />
              <input name="modelo" value={novaPeca.modelo} onChange={alterarPeca} placeholder="Modelo da peça" required />
              <button className="botao-principal" type="submit">Adicionar</button>
            </form>
          )}
        </div>
      )}
    </article>
  );
}

function ListaVeiculos({ apiUrl, veiculos, usuario, aoAlterar }) {
  return (
    <section>
      <div className="titulo-pagina">
        <div>
          <h1>Veículos cadastrados</h1>
          <p>Todos os carros da comunidade aparecem aqui.</p>
        </div>
        <span>{veiculos.length} veículo(s)</span>
      </div>

      {veiculos.length === 0 ? (
        <div className="cartao vazio">Nenhum veículo cadastrado.</div>
      ) : (
        <div className="grade-carros">
          {veiculos.map((veiculo) => (
            <CartaoVeiculo
              key={veiculo.id}
              apiUrl={apiUrl}
              veiculo={veiculo}
              usuario={usuario}
              aoAlterar={aoAlterar}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ListaVeiculos;
