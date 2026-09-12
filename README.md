🎸 Sabbath Fan Club — API Backend
<div align="center">
https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=openjdk&logoColor=white
https://img.shields.io/badge/Spring_Boot-4.1.1-6DB33F?style=for-the-badge&logo=springboot&logoColor=white
https://img.shields.io/badge/MySQL-8+-4479A1?style=for-the-badge&logo=mysql&logoColor=white
https://img.shields.io/badge/Maven-3.8+-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white

API REST para cadastro de fãs do Black Sabbath

Visão Geral •
Pré-requisitos •
Banco de Dados •
Configuração •
Modelos •
Endpoints •
Validações

</div>
📌 Visão Geral
Item	Valor
Base URL	http://localhost:8080
Prefixo da API	/sabbath
Formato de dados	JSON (application/json)
CORS	Habilitado para todas as origens (*)
Java	21
Spring Boot	4.1.1
✅ Pré-requisitos
☕ Java 21+

📦 Maven 3.8+ (ou use o wrapper mvnw)

🐬 MySQL 8+ (ou MariaDB equivalente)

🔧 Cliente HTTP (Postman, Insomnia, etc.)

🗄️ Configuração do Banco de Dados
O projeto inclui a pasta /database com os scripts SQL necessários para criar o banco, as tabelas e popular a tabela de álbuns.

Passo único: execute o(s) script(s) contidos na pasta /database no seu cliente MySQL.

Isso irá:

🏗️ Criar o banco black_sabbath_db

📋 Criar as tabelas album e usuario

🎵 Inserir todos os álbuns de estúdio do Black Sabbath

Após executar, o banco estará pronto para uso.

⚙️ Configuração da Aplicação
No arquivo src/main/resources/application.properties:

properties
# ===== DataSource =====
spring.datasource.url=jdbc:mysql://localhost:3306/black_sabbath_db?useTimezone=true&serverTimezone=America/Sao_Paulo
spring.datasource.username=root
spring.datasource.password=sua_senha_aqui
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# ===== Servidor =====
server.port=8080

# ===== Pool de Conexões (opcional) =====
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=2
spring.datasource.hikari.connection-timeout=30000
📦 Modelos de Dados
🎵 Album
json
{
  "id": 1,
  "nome": "Black Sabbath (1970)"
}
Campo	Tipo	Descrição
id	Integer	Identificador único do álbum
nome	String	Nome do álbum (inclui o ano)
👤 Usuario
json
{
  "nome": "Ozzy Osbourne",
  "dataNascimento": "1948-12-03",
  "cpf": "12345678901",
  "email": "ozzy@blacksabbath.com",
  "albumFavoritoId": 2,
  "quantidadeAlbuns": "10+",
  "bandaPreferidaBlackSabbath": true
}
Campo	Tipo	Obrigatório	Descrição
nome	String	✅	Nome completo (mínimo 3 caracteres)
dataNascimento	Date (YYYY-MM-DD)	✅	Não pode ser uma data futura
cpf	String	✅	Exatamente 11 dígitos numéricos, único
email	String	✅	Deve conter @
albumFavoritoId	Integer	✅	Deve referenciar um id existente em album
quantidadeAlbuns	String	✅	Um dos valores: nenhum, 1-6, 7-9, 10+
bandaPreferidaBlackSabbath	Boolean	❌	true ou false
🌐 Endpoints da API
📀 GET /sabbath/albuns
Retorna a lista de todos os álbuns cadastrados.

<details> <summary><b>Requisição</b></summary>
http
GET /sabbath/albuns HTTP/1.1
Host: localhost:8080
Accept: application/json
</details>
✅ Resposta — 200 OK

json
[
  { "id": 1, "nome": "Black Sabbath (1970)" },
  { "id": 2, "nome": "Paranoid (1970)" },
  { "id": 3, "nome": "Master of Reality (1971)" },
  { "id": 4, "nome": "Vol. 4 (1972)" }
]
📝 POST /sabbath/usuarios
Cadastra um novo usuário após validar os dados no backend.

<details> <summary><b>Requisição</b></summary>
http
POST /sabbath/usuarios HTTP/1.1
Host: localhost:8080
Content-Type: application/json
Accept: application/json
json
{
  "nome": "Ozzy Osbourne",
  "dataNascimento": "1948-12-03",
  "cpf": "12345678901",
  "email": "ozzy@blacksabbath.com",
  "albumFavoritoId": 2,
  "quantidadeAlbuns": "10+",
  "bandaPreferidaBlackSabbath": true
}
</details>
✅ Resposta — 201 Created (sucesso)

json
{
  "nome": "Ozzy Osbourne",
  "dataNascimento": "1948-12-03",
  "cpf": "12345678901",
  "email": "ozzy@blacksabbath.com",
  "albumFavoritoId": 2,
  "quantidadeAlbuns": "10+",
  "bandaPreferidaBlackSabbath": true
}
❌ Resposta — 400 Bad Request (validação falhou, CPF duplicado ou erro de integridade)

json
{
  "nome": "Ozzy Osbourne",
  "dataNascimento": "1948-12-03",
  "cpf": "12345678901",
  "email": "ozzy@blacksabbath.com",
  "albumFavoritoId": 2,
  "quantidadeAlbuns": "10+",
  "bandaPreferidaBlackSabbath": true
}
💡 O backend devolve o mesmo objeto enviado, sem mensagens adicionais, para que o frontend trate os erros de forma genérica.

<details> <summary><b>Exemplo de requisição inválida (CPF com 10 dígitos)</b></summary>
json
{
  "nome": "Ozzy Osbourne",
  "dataNascimento": "1948-12-03",
  "cpf": "1234567890",
  "email": "ozzy@blacksabbath.com",
  "albumFavoritoId": 2,
  "quantidadeAlbuns": "10+",
  "bandaPreferidaBlackSabbath": true
}
→ Resposta: 400 Bad Request

</details>
📊 Códigos de Status HTTP
Código	Significado	Quando ocorre
200	✅ OK	GET /sabbath/albuns
201	🆕 Created	POST /sabbath/usuarios com dados válidos
400	⚠️ Bad Request	Validação falhou, CPF duplicado, erro de integridade ou erro interno
🔒 Validações
As regras abaixo são aplicadas tanto no frontend quanto no backend, garantindo consistência.

Campo	Regra
nome	Não nulo, mínimo 3 caracteres após remover espaços
dataNascimento	Não nulo e não pode ser uma data futura
cpf	Não nulo, exatamente 11 caracteres
email	Não nulo e deve conter @
albumFavoritoId	Não nulo (deve existir em album)
quantidadeAlbuns	Um dos valores: nenhum, 1-6, 7-9, 10+
<div align="center">
🤘 Black Sabbath Fan Club

</div>
