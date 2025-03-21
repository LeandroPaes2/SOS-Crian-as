CREATE DATABASE IF NOT EXISTS materias_db;
USE materias_db;

CREATE TABLE IF NOT EXISTS materias (
  nome VARCHAR(100) NOT NULL PRIMARY KEY,
  descricao TEXT,
  hora TIME,
  dia DATE
);