package br.com.faculdade.veiculos.controller;

import br.com.faculdade.veiculos.model.Usuario;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.PreparedStatement;
import java.sql.Statement;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class UsuarioController {

    private final JdbcTemplate template;

    public UsuarioController(JdbcTemplate template) {
        this.template = template;
    }

    @PostMapping
    public ResponseEntity<Usuario> cadastrar(@RequestBody Usuario usuario) {
        if (dadosInvalidos(usuario)) {
            return ResponseEntity.badRequest().build();
        }

        String sqlQuantidade = "SELECT COUNT(*) FROM usuario WHERE username = ?";
        Integer quantidade = template.queryForObject(
                sqlQuantidade,
                Integer.class,
                usuario.getUsername()
        );

        if (quantidade != null && quantidade > 0) {
            return ResponseEntity.status(409).build();
        }

        String sql = "INSERT INTO usuario (username, senha) VALUES (?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        template.update(conexao -> {
            PreparedStatement statement = conexao.prepareStatement(
                    sql,
                    Statement.RETURN_GENERATED_KEYS
            );
            statement.setString(1, usuario.getUsername());
            statement.setString(2, usuario.getSenha());
            return statement;
        }, keyHolder);

        usuario.setId(keyHolder.getKey().longValue());
        usuario.setSenha(null);
        return ResponseEntity.status(201).body(usuario);
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> entrar(@RequestBody Usuario credenciais) {
        if (dadosInvalidos(credenciais)) {
            return ResponseEntity.badRequest().build();
        }

        try {
            String sql = """
                    SELECT id, username
                    FROM usuario
                    WHERE username = ? AND senha = ?
                    """;

            Usuario usuario = template.queryForObject(
                    sql,
                    new BeanPropertyRowMapper<>(Usuario.class),
                    credenciais.getUsername(),
                    credenciais.getSenha()
            );

            return ResponseEntity.ok(usuario);
        } catch (EmptyResultDataAccessException exception) {
            return ResponseEntity.status(401).build();
        }
    }

    private boolean dadosInvalidos(Usuario usuario) {
        return usuario.getUsername() == null
                || usuario.getUsername().isBlank()
                || usuario.getSenha() == null
                || usuario.getSenha().isBlank();
    }
}
