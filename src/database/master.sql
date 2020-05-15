drop database bdmaster;
create database bdmaster;
use bdmaster;

CREATE TABLE usuario (
  id_usuario int not null primary key auto_increment,
  nombre VARCHAR (45) NOT NULL,
  contrase VARCHAR (60) NOT NULL
);

CREATE TABLE empresa (
  idinicio INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  logo VARCHAR(60),
  eslogan VARCHAR(100),
  mision VARCHAR(300),
  vision VARCHAR(300),
  direccion VARCHAR(45),
  telefono INT,
  correo VARCHAR(45),
  ubicacion VARCHAR(300)  
);

CREATE TABLE empleados (
  idempleados INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(45),
  cargo VARCHAR(45),
  imagen VARCHAR(60),
  estado ENUM('ACTIVO','DESACTIVO')
);

CREATE TABLE servicios (
  idservicios INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  logo VARCHAR
(45),
  nombreservicio VARCHAR
(60),
  descripcion VARCHAR
(500),
  imagen VARCHAR
(45),
  descripcion_img VARCHAR
(200),
  estado ENUM
('A','D')
);

CREATE TABLE productos (
  idproductos INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  tipo ENUM
('MOVIL', 'WEB', 'ESCRITORIO'),
  nombre VARCHAR
(60),
  mindescripcion VARCHAR
(200),
  descripcion VARCHAR
(500),
  estado ENUM
('A', 'D')
);

CREATE TABLE suscripcion (
  idsuscripcion int not null primary key auto_increment,
  correo VARCHAR(100)
);