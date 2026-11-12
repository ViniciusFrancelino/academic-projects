package br.com.faculdade.veiculos.controller;

import br.com.faculdade.veiculos.model.Veiculo;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@RestController
@RequestMapping("/veiculos")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class VeiculoController {

    private final JdbcTemplate template;

    public VeiculoController(JdbcTemplate template) {
        this.template = template;
    }

    @GetMapping
    public ResponseEntity<List<Veiculo>> listar() {
        String sql = """
                SELECT v.id, v.usuario_id, u.username AS usuario_username,
                       v.marca, v.modelo, v.ano, v.cor
                FROM veiculo v
                JOIN usuario u ON u.id = v.usuario_id
                ORDER BY v.id DESC
                """;

        List<Veiculo> veiculos = template.query(
                sql,
                new BeanPropertyRowMapper<>(Veiculo.class)
        );

        return ResponseEntity.ok(veiculos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Veiculo> buscarPorId(@PathVariable Long id) {
        try {
            String sql = """
                    SELECT v.id, v.usuario_id, u.username AS usuario_username,
                           v.marca, v.modelo, v.ano, v.cor
                    FROM veiculo v
                    JOIN usuario u ON u.id = v.usuario_id
                    WHERE v.id = ?
                    """;

            Veiculo veiculo = template.queryForObject(
                    sql,
                    new BeanPropertyRowMapper<>(Veiculo.class),
                    id
            );
            return ResponseEntity.ok(veiculo);
        } catch (EmptyResultDataAccessException exception) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Veiculo> cadastrar(@RequestBody Veiculo veiculo) {
        if (dadosInvalidos(veiculo) || !usuarioExiste(veiculo.getUsuarioId())) {
            return ResponseEntity.badRequest().build();
        }

        String sql = """
                INSERT INTO veiculo (usuario_id, marca, modelo, ano, cor)
                VALUES (?, ?, ?, ?, ?)
                """;
        KeyHolder keyHolder = new GeneratedKeyHolder();

        template.update(conexao -> {
            PreparedStatement statement = conexao.prepareStatement(
                    sql,
                    Statement.RETURN_GENERATED_KEYS
            );
            statement.setLong(1, veiculo.getUsuarioId());
            statement.setString(2, veiculo.getMarca());
            statement.setString(3, veiculo.getModelo());
            statement.setInt(4, veiculo.getAno());
            statement.setString(5, veiculo.getCor());
            return statement;
        }, keyHolder);

        veiculo.setId(keyHolder.getKey().longValue());
        return ResponseEntity.status(201).body(veiculo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Veiculo> atualizar(
            @RequestBody Veiculo veiculo,
            @PathVariable Long id
    ) {
        if (!veiculoExiste(id) || dadosInvalidos(veiculo)) {
            return ResponseEntity.notFound().build();
        }

        String sql = """
                UPDATE veiculo
                SET marca = ?, modelo = ?, ano = ?, cor = ?
                WHERE id = ?
                """;

        template.update(
                sql,
                veiculo.getMarca(),
                veiculo.getModelo(),
                veiculo.getAno(),
                veiculo.getCor(),
                id
        );

        veiculo.setId(id);
        return ResponseEntity.ok(veiculo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        if (!veiculoExiste(id)) {
            return ResponseEntity.notFound().build();
        }

        template.update("DELETE FROM veiculo WHERE id = ?", id);
        return ResponseEntity.noContent().build();
    }

    private boolean usuarioExiste(Long id) {
        if (id == null) {
            return false;
        }

        Integer quantidade = template.queryForObject(
                "SELECT COUNT(*) FROM usuario WHERE id = ?",
                Integer.class,
                id
        );
        return quantidade != null && quantidade > 0;
    }

    private boolean veiculoExiste(Long id) {
        Integer quantidade = template.queryForObject(
                "SELECT COUNT(*) FROM veiculo WHERE id = ?",
                Integer.class,
                id
        );
        return quantidade != null && quantidade > 0;
    }

    private boolean dadosInvalidos(Veiculo veiculo) {
        return veiculo.getMarca() == null
                || veiculo.getMarca().isBlank()
                || veiculo.getModelo() == null
                || veiculo.getModelo().isBlank()
                || veiculo.getAno() == null
                || veiculo.getCor() == null
                || veiculo.getCor().isBlank();
    }
}
