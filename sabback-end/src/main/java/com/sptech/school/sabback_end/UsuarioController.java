package com.sptech.school.sabback_end;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.*;

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
        List<Album> albuns = jdbcTemplate.query(
                "SELECT id, nome FROM album",
                new BeanPropertyRowMapper<>(Album.class)
        );
        return ResponseEntity.status(200).body(albuns);
    }

    @PostMapping("/usuarios")
    public ResponseEntity<Usuario> createUsuario(@RequestBody Usuario usuario) {
        Integer erros = validarUsuario(usuario);
        if (erros > 0) {
            return ResponseEntity.status(400).body(usuario);
        }

        try {
            jdbcTemplate.update(
                    "INSERT INTO usuario (" +
                            "nome, dataNascimento, cpf, email, albumFavoritoId, " +
                            "quantidadeAlbuns, bandaPreferidaBlackSabbath) " +
                            "VALUES (?, ?, ?, ?, ?, ?, ?)",
                    usuario.getNome(),
                    new java.sql.Date(usuario.getDataNascimento().getTime()),
                    usuario.getCpf(),
                    usuario.getEmail(),
                    usuario.getAlbumFavoritoId(),
                    usuario.getQuantidadeAlbuns(),
                    usuario.getBandaPreferidaBlackSabbath()
            );
            return ResponseEntity.status(201).body(usuario);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(usuario);
        }
    }

    private Integer validarUsuario(Usuario usuario) {
        Integer erros = 0;

        if (usuario.getNome() == null || usuario.getNome().trim().length() < 3) {
            erros++;
        }
        if (usuario.getDataNascimento() == null) {
            erros++;
        } else if (usuario.getDataNascimento().after(new Date())) {
            erros++;
        }
        if (usuario.getCpf() == null || usuario.getCpf().length() != 11) {
            erros++;
        }
        if (usuario.getEmail() == null || !usuario.getEmail().contains("@")) {
            erros++;
        }
        if (usuario.getAlbumFavoritoId() == null) {
            erros++;
        }
        return erros;
    }
}