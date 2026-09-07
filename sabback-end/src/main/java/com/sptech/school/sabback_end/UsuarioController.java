package com.sptech.school.sabback_end;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/sabbath")
public class UsuarioController {
    private final JdbcTemplate jdbcTemplate;
    public UsuarioController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/albuns")
    public ResponseEntity<List<Album>> getAlbum() {
        return ResponseEntity.status(HttpStatus.OK).body(
                jdbcTemplate.query(
                        "select * from album",
                        new BeanPropertyRowMapper<>(Album.class)));
    }
    @PostMapping("/usuarios")
    public ResponseEntity<Usuario> createUsuario(@RequestBody Usuario usuario) {
        try {
            jdbcTemplate.update(
                    "insert into usuario (" +
                            "nome, " +
                            "dataNascimento, " +
                            "cpf, " +
                            "email, " +
                            "albumFavoritoId, " +
                            "quantidadeAlbuns, " +
                            "bandaPreferidaBlackSabbath) " +
                            "values (?, ?, ?, ?, ?, ?, ?)",
                    usuario.getNome(),
                    usuario.getDataNascimento(),
                    usuario.getCpf(),
                    usuario.getEmail(),
                    usuario.getAlbumFavoritoId(),
                    usuario.getQuantidadeAlbuns(),
                    usuario.getBandaPreferidaBlackSabbath()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
        } catch (DuplicateKeyException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(usuario);
        }
    }
}