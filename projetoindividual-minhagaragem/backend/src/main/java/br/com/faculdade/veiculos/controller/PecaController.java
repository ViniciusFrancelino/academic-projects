package br.com.faculdade.veiculos.controller;

import br.com.faculdade.veiculos.model.Peca;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@RestController
@RequestMapping("/veiculos")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class PecaController {

    private final JdbcTemplate template;

    public PecaController(JdbcTemplate template) {
        this.template = template;
    }

    @GetMapping("/{veiculoId}/pecas")
    public ResponseEntity<List<Peca>> listar(@PathVariable Long veiculoId) {
        if (!veiculoExiste(veiculoId)) {
            return ResponseEntity.notFound().build();
        }

        String sql = """
                SELECT id, veiculo_id, nome, modelo
                FROM peca
                WHERE veiculo_id = ?
                ORDER BY nome
                """;

        List<Peca> pecas = template.query(
                sql,
                new BeanPropertyRowMapper<>(Peca.class),
                veiculoId
        );
        return ResponseEntity.ok(pecas);
    }

    @PostMapping("/{veiculoId}/pecas")
    public ResponseEntity<Peca> cadastrar(
            @PathVariable Long veiculoId,
            @RequestBody Peca peca
    ) {
        if (!veiculoExiste(veiculoId) || dadosInvalidos(peca)) {
            return ResponseEntity.badRequest().build();
        }

        String sql = "INSERT INTO peca (veiculo_id, nome, modelo) VALUES (?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        template.update(conexao -> {
            PreparedStatement statement = conexao.prepareStatement(
                    sql,
                    Statement.RETURN_GENERATED_KEYS
            );
            statement.setLong(1, veiculoId);
            statement.setString(2, peca.getNome());
            statement.setString(3, peca.getModelo());
            return statement;
        }, keyHolder);

        peca.setId(keyHolder.getKey().longValue());
        peca.setVeiculoId(veiculoId);
        return ResponseEntity.status(201).body(peca);
    }

    @DeleteMapping("/{veiculoId}/pecas/{pecaId}")
    public ResponseEntity<Void> remover(
            @PathVariable Long veiculoId,
            @PathVariable Long pecaId
    ) {
        int quantidade = template.update(
                "DELETE FROM peca WHERE id = ? AND veiculo_id = ?",
                pecaId,
                veiculoId
        );

        if (quantidade == 0) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    private boolean veiculoExiste(Long id) {
        Integer quantidade = template.queryForObject(
                "SELECT COUNT(*) FROM veiculo WHERE id = ?",
                Integer.class,
                id
        );
        return quantidade != null && quantidade > 0;
    }

    private boolean dadosInvalidos(Peca peca) {
        return peca.getNome() == null
                || peca.getNome().isBlank()
                || peca.getModelo() == null
                || peca.getModelo().isBlank();
    }
}
