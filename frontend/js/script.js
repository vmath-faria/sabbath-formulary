(function() {
    'use strict';

    var API_BASE_URL = 'http://localhost:8080/sabbath';
    var ENDPOINT_OPCOES = `${API_BASE_URL}/albuns`;
    var ENDPOINT_USUARIO = `${API_BASE_URL}/usuarios`;

    var form = document.getElementById('cadastroForm');
    var selectAlbum = document.getElementById('albumFavorito');
    var erroCarregamento = document.getElementById('erro-carregamento');
    var statusMessage = document.getElementById('statusMessage');
    var erroRadio = document.getElementById('erro-radio');

    var campos = {
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
                var data = new Date(valor);
                return data <= new Date();
            }
        },
        cpf: {
            input: document.getElementById('cpf'),
            erro: document.getElementById('erro-cpf'),
            validar: (valor) => valor.trim().length === 11
        },
        email: {
            input: document.getElementById('email'),
            erro: document.getElementById('erro-email'),
            validar: (valor) => valor.trim().includes('@')
        },
        albumFavorito: {
            input: selectAlbum,
            erro: document.getElementById('erro-album'),
            validar: (valor) => valor !== '' && valor !== 'Carregando opções...' && valor !== 'Erro ao carregar opções'
        }
    };

    async function carregarOpcoesSelect() {
        try {
            selectAlbum.disabled = true;
            erroCarregamento.classList.remove('visible');

            var resposta = await fetch(ENDPOINT_OPCOES, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });

            if (!resposta.ok) {
                throw new Error(`Erro ${resposta.status} ao carregar opções`);
            }

            var dados = await resposta.json();

            if (!Array.isArray(dados) || dados.length === 0) {
                throw new Error('Resposta da API inválida ou vazia');
            }

            selectAlbum.innerHTML = '<option value="">Selecione um álbum...</option>';

            dados.forEach(item => {
                var option = document.createElement('option');
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

        campos.cpf.input.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
        });

        var radios = document.querySelectorAll('input[name="qtdAlbuns"]');
        radios.forEach(radio => {
            radio.addEventListener('change', () => {
                erroRadio.classList.remove('visible');
            });
        });
    }

    function validarFormulario() {
        var formValido = true;

        Object.values(campos).forEach(({ input, erro, validar }) => {
            var valor = input.value;
            if (!validar(valor)) {
                input.classList.add('error');
                erro.classList.add('visible');
                formValido = false;
            } else {
                input.classList.remove('error');
                erro.classList.remove('visible');
            }
        });

        var radioSelecionado = document.querySelector('input[name="qtdAlbuns"]:checked');
        if (!radioSelecionado) {
            erroRadio.classList.add('visible');
            formValido = false;
        } else {
            erroRadio.classList.remove('visible');
        }

        return formValido;
    }

    async function enviarCadastro(dadosFormulario) {
        try {
            var resposta = await fetch(ENDPOINT_USUARIO, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(dadosFormulario)
            });

            if (!resposta.ok) {
                throw new Error(`Erro ${resposta.status} ao enviar cadastro`);
            }

            var resultado = await resposta.json();
            return { sucesso: true, dados: resultado };
        } catch (erro) {
            console.error('Erro no envio:', erro);
            return { sucesso: false, mensagem: erro.message };
        }
    }

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

        var radioSelecionado = document.querySelector('input[name="qtdAlbuns"]:checked');
        var checkboxBanda = document.getElementById('bandaPreferida');

        var dadosFormulario = {
            nome: campos.nome.input.value.trim(),
            dataNascimento: campos.dataNascimento.input.value,
            cpf: campos.cpf.input.value.trim(),
            email: campos.email.input.value.trim(),
            albumFavoritoId: selectAlbum.value,
            quantidadeAlbuns: radioSelecionado ? radioSelecionado.value : null,
            bandaPreferidaBlackSabbath: checkboxBanda.checked
        };

        var botao = form.querySelector('.submit-btn');
        botao.disabled = true;
        botao.textContent = 'Enviando...';

        var resultado = await enviarCadastro(dadosFormulario);

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