# Minha Garagem

Projeto individual criado para cadastrar veículos e suas peças, visualizar os carros de todos os usuários e comparar dois veículos.

## Tecnologias

- Backend: Java 21, Spring Boot, Spring Web e `JdbcTemplate`
- Banco: H2 em memória
- Frontend: React com Vite e Axios

## Como executar

Abra dois terminais.

No primeiro, inicie o backend:

```bash
cd backend
mvn spring-boot:run
```

No segundo, inicie o frontend:

```bash
cd frontend
npm install
npm run dev
```

Depois acesse `http://localhost:5173`.

Contas prontas para a apresentação:

- Usuário `ana`, senha `1234`
- Usuário `bruno`, senha `1234`

Também é possível criar uma conta pela tela inicial.

## Banco H2

O banco existe somente na memória. Ao encerrar o backend, todos os novos dados são apagados e os dados de demonstração voltam na próxima execução.

O console fica em `http://localhost:8080/h2-console` com:

- JDBC URL: `jdbc:h2:mem:veiculos`
- User Name: `sa`
- Password: deixe vazio

## Rotas principais

- `POST /usuarios` — cria um usuário
- `POST /usuarios/login` — realiza o login
- `GET /veiculos` — lista os veículos de todos os usuários
- `POST /veiculos` — cadastra um veículo
- `GET /veiculos/{id}` — busca um veículo
- `PUT /veiculos/{id}` — atualiza um veículo
- `DELETE /veiculos/{id}` — remove um veículo
- `GET /veiculos/{id}/pecas` — lista as peças do veículo
- `POST /veiculos/{id}/pecas` — adiciona uma peça
- `DELETE /veiculos/{id}/pecas/{pecaId}` — remove uma peça