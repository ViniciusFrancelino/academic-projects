import { useEffect, useState } from "react";
import axios from "axios";
import Login from "./components/Login.jsx";
import CadastroVeiculo from "./components/CadastroVeiculo.jsx";
import ListaVeiculos from "./components/ListaVeiculos.jsx";
import ComparacaoVeiculos from "./components/ComparacaoVeiculos.jsx";

const API_URL = "http://localhost:8080";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [veiculos, setVeiculos] = useState([]);
  const [secao, setSecao] = useState("veiculos");
  const [erro, setErro] = useState("");

  function carregarVeiculos() {
    axios
      .get(`${API_URL}/veiculos`)
      .then((resposta) => {
        setVeiculos(resposta.data);
        setErro("");
      })
      .catch(() => setErro("Não foi possível carregar os veículos."));
  }

  useEffect(() => {
    if (usuario) {
      carregarVeiculos();
    }
  }, [usuario]);

  if (!usuario) {
    return <Login apiUrl={API_URL} aoEntrar={setUsuario} />;
  }

  return (
    <>
      <header className="cabecalho">
        <div>
          <span className="marca-site">Minha Garagem</span>
          <small>Olá, {usuario.username}</small>
        </div>

        <nav>
          <button
            className={secao === "veiculos" ? "ativo" : ""}
            onClick={() => setSecao("veiculos")}
          >
            Veículos
          </button>
          <button
            className={secao === "cadastrar" ? "ativo" : ""}
            onClick={() => setSecao("cadastrar")}
          >
            Cadastrar
          </button>
          <button
            className={secao === "comparar" ? "ativo" : ""}
            onClick={() => setSecao("comparar")}
          >
            Comparar
          </button>
          <button className="botao-sair" onClick={() => setUsuario(null)}>
            Sair
          </button>
        </nav>
      </header>

      <main className="conteudo">
        {erro && <p className="mensagem erro">{erro}</p>}

        {secao === "veiculos" && (
          <ListaVeiculos
            apiUrl={API_URL}
            veiculos={veiculos}
            usuario={usuario}
            aoAlterar={carregarVeiculos}
          />
        )}

        {secao === "cadastrar" && (
          <CadastroVeiculo
            apiUrl={API_URL}
            usuario={usuario}
            aoCadastrar={() => {
              carregarVeiculos();
              setSecao("veiculos");
            }}
          />
        )}

        {secao === "comparar" && (
          <ComparacaoVeiculos apiUrl={API_URL} veiculos={veiculos} />
        )}
      </main>
    </>
  );
}

export default App;
