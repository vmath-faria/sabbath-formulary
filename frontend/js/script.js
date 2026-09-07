(function() {
    'use strict';

    // ===== CONFIGURAÇÃO DOS ENDPOINTS =====
    // Altere estas URLs para apontar para o seu backend.
    const API_BASE_URL = 'http://localhost:8080/sabbath';
    const ENDPOINT_OPCOES = `${API_BASE_URL}/albuns`;
    const ENDPOINT_USUARIO = `${API_BASE_URL}/usuarios`;  // POST -> envia dados do formulário

    // ===== ELEMENTOS DO DOM =====
    const form = document.getElementById('cadastroForm');
    const selectAlbum = document.getElementById('albumFavorito');
    const erroCarregamento = document.getElementById('erro-carregamento');
    const statusMessage = document.getElementById('statusMessage');

    // Campos e mensagens de erro associadas
    const campos = {
        nome: {
            input: document.getElementById('nome'),
            erro: document.getElementById('erro-nome'),
            validar: (valor) => valor.trim().length >= 3
        },
        dataNascimento: {
            input: document.getElementById('dataNascimento'),
            erro: document.getElementById('erro-data'),
            validar: (valor) => {
                if (!valor) return false;
                const data = new Date(valor);
                const hoje = new Date();
                hoje.setHours(23, 59, 59, 999);
                return data <= hoje;
            }
        },
        cpf: {
            input: document.getElementById('cpf'),
            erro: document.getElementById('erro-cpf'),
            validar: (valor) => /^\d{11}$/.test(valor.trim())
        },
        email: {
            input: document.getElementById('email'),
            erro: document.getElementById('erro-email'),
            validar: (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim())
        },
        albumFavorito: {
            input: selectAlbum,
            erro: document.getElementById('erro-album'),
            validar: (valor) => valor !== '' && valor !== 'Carregando opções...'
        }
    };

    // Radio buttons
    const radioGroup = document.getElementById('radioAlbuns');
    const erroRadio = document.getElementById('erro-radio');

    // ===== FUNÇÃO PARA CARREGAR OPÇÕES DO SELECT VIA API =====
    async function carregarOpcoesSelect() {
        try {
            selectAlbum.disabled = true;
            erroCarregamento.classList.remove('visible');

            const resposta = await fetch(ENDPOINT_OPCOES, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!resposta.ok) {
                throw new Error(`Erro ${resposta.status} ao carregar opções`);
            }

            const dados = await resposta.json();

            if (!Array.isArray(dados) || dados.length === 0) {
                throw new Error('Resposta da API inválida ou vazia');
            }

            selectAlbum.innerHTML = '<option value="">Selecione um álbum...</option>';

            dados.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id ?? item.nome ?? item;
                option.textContent = item.nome ?? item.titulo ?? item;
                selectAlbum.appendChild(option);
            });

            selectAlbum.disabled = false;
        } catch (erro) {
            console.error('Falha ao carregar opções do select:', erro);
            selectAlbum.innerHTML = '<option value="">Erro ao carregar opções</option>';
            selectAlbum.disabled = true;
            erroCarregamento.classList.add('visible');
        }
    }

    // ===== VALIDAÇÃO EM TEMPO REAL =====
    function configurarValidacaoEmTempoReal() {
        Object.values(campos).forEach(({ input, erro, validar }) => {
            input.addEventListener('blur', () => {
                if (input.value.trim() !== '' || input === selectAlbum) {
                    if (!validar(input.value)) {
                        input.classList.add('error');
                        erro.classList.add('visible');
                    } else {
                        input.classList.remove('error');
                        erro.classList.remove('visible');
                    }
                }
            });

            input.addEventListener('input', () => {
                if (validar(input.value)) {
                    input.classList.remove('error');
                    erro.classList.remove('visible');
                }
            });
        });

        // CPF: restringe a caracteres numéricos
        campos.cpf.input.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
        });

        // Validação dos radio buttons
        const radios = document.querySelectorAll('input[name="qtdAlbuns"]');
        radios.forEach(radio => {
            radio.addEventListener('change', () => {
                erroRadio.classList.remove('visible');
            });
        });
    }

    // ===== VALIDAÇÃO COMPLETA DO FORMULÁRIO =====
    function validarFormulario() {
        let formValido = true;

        Object.values(campos).forEach(({ input, erro, validar }) => {
            const valor = input.value;
            if (!validar(valor)) {
                input.classList.add('error');
                erro.classList.add('visible');
                formValido = false;
            } else {
                input.classList.remove('error');
                erro.classList.remove('visible');
            }
        });

        const radioSelecionado = document.querySelector('input[name="qtdAlbuns"]:checked');
        if (!radioSelecionado) {
            erroRadio.classList.add('visible');
            formValido = false;
        } else {
            erroRadio.classList.remove('visible');
        }

        return formValido;
    }

    // ===== ENVIO DO FORMULÁRIO VIA POST =====
    async function enviarCadastro(dadosFormulario) {
        try {
            const resposta = await fetch(ENDPOINT_USUARIO, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(dadosFormulario)
            });

            if (!resposta.ok) {
                const erro = await resposta.json().catch(() => ({}));
                throw new Error(erro.mensagem || `Erro ${resposta.status} ao enviar cadastro`);
            }

            const resultado = await resposta.json();
            return { sucesso: true, dados: resultado };
        } catch (erro) {
            console.error('Erro no envio:', erro);
            return { sucesso: false, mensagem: erro.message };
        }
    }

    // ===== MANIPULAÇÃO DO SUBMIT =====
    form.addEventListener('submit', async function(evento) {
        evento.preventDefault();

        statusMessage.classList.remove('success', 'error');
        statusMessage.style.display = 'none';

        if (!validarFormulario()) {
            statusMessage.textContent = 'Por favor, corrija os campos destacados antes de enviar.';
            statusMessage.classList.add('error');
            statusMessage.style.display = 'block';
            return;
        }

        const radioSelecionado = document.querySelector('input[name="qtdAlbuns"]:checked');
        const checkboxBanda = document.getElementById('bandaPreferida');

        const dadosFormulario = {
            nome: campos.nome.input.value.trim(),
            dataNascimento: campos.dataNascimento.input.value,
            cpf: campos.cpf.input.value.trim(),
            email: campos.email.input.value.trim(),
            albumFavoritoId: selectAlbum.value,
            quantidadeAlbuns: radioSelecionado ? radioSelecionado.value : null,
            bandaPreferidaBlackSabbath: checkboxBanda.checked
        };

        const botao = form.querySelector('.submit-btn');
        botao.disabled = true;
        botao.textContent = 'Enviando...';

        const resultado = await enviarCadastro(dadosFormulario);

        botao.disabled = false;
        botao.textContent = 'Cadastrar no Fã Clube';

        if (resultado.sucesso) {
            statusMessage.textContent = 'Cadastro realizado com sucesso! Bem-vindo ao Sabbath Fan Club.';
            statusMessage.classList.add('success');
            statusMessage.style.display = 'block';
            form.reset();
        } else {
            statusMessage.textContent = `Erro ao cadastrar: ${resultado.mensagem || 'Tente novamente mais tarde.'}`;
            statusMessage.classList.add('error');
            statusMessage.style.display = 'block';
        }
    });

    // ===== INICIALIZAÇÃO =====
    function inicializar() {
        configurarValidacaoEmTempoReal();
        carregarOpcoesSelect();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializar);
    } else {
        inicializar();
    }
})();