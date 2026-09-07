-- Criação do banco de dados (opcional, se ainda não existir)
CREATE DATABASE IF NOT EXISTS black_sabbath_db;
USE black_sabbath_db;

-- Tabela de álbuns
CREATE TABLE IF NOT EXISTS album (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
);

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    dataNascimento DATE NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    albumFavoritoId INT,
    quantidadeAlbuns VARCHAR(20),
    bandaPreferidaBlackSabbath BOOLEAN,
    FOREIGN KEY (albumFavoritoId) REFERENCES album(id)
);

-- Inserção de todos os álbuns de estúdio do Black Sabbath
INSERT INTO album (nome) VALUES 
('Black Sabbath (1970)'),
('Paranoid (1970)'),
('Master of Reality (1971)'),
('Vol. 4 (1972)'),
('Sabbath Bloody Sabbath (1973)'),
('Sabotage (1975)'),
('Technical Ecstasy (1976)'),
('Never Say Die! (1978)'),
('Heaven and Hell (1980)'),
('Mob Rules (1981)'),
('Born Again (1983)'),
('Seventh Star (1986)'),
('The Eternal Idol (1987)'),
('Headless Cross (1989)'),
('Tyr (1990)'),
('Dehumanizer (1992)'),
('Cross Purposes (1994)'),
('Forbidden (1995)'),
('The Devil You Know (2009)'),
('13 (2013)');

select * from usuario;
