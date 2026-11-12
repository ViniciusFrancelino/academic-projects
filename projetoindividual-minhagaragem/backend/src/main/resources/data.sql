INSERT INTO usuario (username, senha) VALUES ('ana', '1234');
INSERT INTO usuario (username, senha) VALUES ('bruno', '1234');

INSERT INTO veiculo (usuario_id, marca, modelo, ano, cor)
VALUES (1, 'Volkswagen', 'Golf GTI', 2020, 'Vermelho');
INSERT INTO veiculo (usuario_id, marca, modelo, ano, cor)
VALUES (2, 'Honda', 'Civic Touring', 2021, 'Cinza');

INSERT INTO peca (veiculo_id, nome, modelo) VALUES (1, 'Motor', '2.0 TSI EA888');
INSERT INTO peca (veiculo_id, nome, modelo) VALUES (1, 'Câmbio', 'DSG DQ381');
INSERT INTO peca (veiculo_id, nome, modelo) VALUES (1, 'Pneu', '225/40 R18');

INSERT INTO peca (veiculo_id, nome, modelo) VALUES (2, 'Motor', '1.5 Turbo L15B7');
INSERT INTO peca (veiculo_id, nome, modelo) VALUES (2, 'Câmbio', 'CVT LL-CVT');
INSERT INTO peca (veiculo_id, nome, modelo) VALUES (2, 'Pneu', '215/50 R17');
