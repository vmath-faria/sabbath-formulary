package com.sptech.school.sabback_end;

import java.util.Date;

public class Usuario {
    public String nome;
    public Date dataNascimento;
    public String cpf;
    public String email;
    public String albumFavoritoId;
    public String quantidadeAlbuns;
    public Boolean bandaPreferidaBlackSabbath;

    public Usuario() {
    }

    public Usuario(
            String nome,
            Date dataNascimento,
            String cpf,
            String email,
            String albumFavoritoId,
            String quantidadeAlbuns,
            Boolean bandaPreferidaBlackSabbath) {
        this.nome = nome;
        this.dataNascimento = dataNascimento;
        this.cpf = cpf;
        this.email = email;
        this.albumFavoritoId = albumFavoritoId;
        this.quantidadeAlbuns = quantidadeAlbuns;
        this.bandaPreferidaBlackSabbath = bandaPreferidaBlackSabbath;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Date getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(Date dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAlbumFavoritoId() {
        return albumFavoritoId;
    }

    public void setAlbumFavoritoId(String albumFavoritoId) {
        this.albumFavoritoId = albumFavoritoId;
    }

    public String getQuantidadeAlbuns() {
        return quantidadeAlbuns;
    }

    public void setQuantidadeAlbuns(String quantidadeAlbuns) {
        this.quantidadeAlbuns = quantidadeAlbuns;
    }

    public Boolean getBandaPreferidaBlackSabbath() {
        return bandaPreferidaBlackSabbath;
    }

    public void setBandaPreferidaBlackSabbath(Boolean bandaPreferidaBlackSabbath) {
        this.bandaPreferidaBlackSabbath = bandaPreferidaBlackSabbath;
    }
}
