import { useState } from "react";
import axios from "axios";

function Login({ apiUrl, aoEntrar }) {
  const [credenciais, setCredenciais] = useState({
    username: "",
    senha: "",
  });
  const [mensagem, setMensagem] = useState("");

  function alterarCampo(evento) {
    setCredenciais({
      ...credenciais,
      [evento.target.name]: evento.target.value,
    });
  }

  function entrar(evento) {
    evento.preventDefault();
    setMensagem("");

    axios
      .post(`${apiUrl}/usuarios/login`, credenciais)
      .then((resposta) => aoEntrar(resposta.data))
      .catch(() => setMensagem("Usuário ou senha inválidos."));
  }

  function criarConta() {
    setMensagem("");

    axios
      .post(`${apiUrl}/usuarios`, credenciais)
      .then((resposta) => aoEntrar(resposta.data))
      .catch((erro) => {
        if (erro.response && erro.response.status === 409) {
          setMensagem("Esse nome de usuário já existe.");
        } else {
          setMensagem("Preencha usuário e senha para criar a conta.");
        }
      });
  }

  return (
    <main className="pagina-login">
      <section className="cartao login">
        <div className="simbolo-carro">AUTO</div>
        <h1>Minha Garagem</h1>
        <p>Cadastre seu carro, suas peças e compare com outros usuários.</p>

        <form onSubmit={entrar}>
          <label htmlFor="username">Usuário</label>
          <input
            id="username"
            name="username"
            value={credenciais.username}
            onChange={alterarCampo}
            placeholder="Digite seu usuário"
            required
          />

          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            name="senha"
            type="password"
            value={credenciais.senha}
            onChange={alterarCampo}
            placeholder="Digite sua senha"
            required
          />

          {mensagem && <p className="mensagem erro">{mensagem}</p>}

          <button className="botao-principal" type="submit">
            Entrar
          </button>
          <button className="botao-secundario" type="button" onClick={criarConta}>
            Criar conta
          </button>
        </form>

        <small className="acesso-teste">Teste: ana / 1234 ou bruno / 1234</small>
      </section>
    </main>
  );
}

export default Login;
