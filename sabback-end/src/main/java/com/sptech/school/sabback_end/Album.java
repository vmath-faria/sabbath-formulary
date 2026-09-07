package com.sptech.school.sabback_end;

public class Album {
    public String id;
    public String nome;
    public Integer anoLancamento;

    public Album() {
    }

    public Album(String id, String nome, Integer anoLancamento) {
        this.id = id;
        this.nome = nome;
        this.anoLancamento = anoLancamento;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Integer getAnoLancamento() {
        return anoLancamento;
    }

    public void setAnoLancamento(Integer anoLancamento) {
        this.anoLancamento = anoLancamento;
    }
}
