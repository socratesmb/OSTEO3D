-- MySQL dump 10.13  Distrib 8.0.12, for Win64 (x86_64)
--
-- Host: localhost    Database: osteo3d
-- ------------------------------------------------------
-- Server version	8.0.12

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `animal`
--

DROP TABLE IF EXISTS `animal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `animal` (
  `Id_Animal` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(65) NOT NULL,
  `Descripcion` varchar(250) NOT NULL,
  `Fotografia` text NOT NULL,
  `Estado` enum('ACTIVO','INACTIVO') NOT NULL,
  `Entidad_Id_Entidad` int(11) NOT NULL,
  PRIMARY KEY (`Id_Animal`),
  KEY `fk_Animal_Entidad1_idx` (`Entidad_Id_Entidad`),
  CONSTRAINT `fk_Animal_Entidad1` FOREIGN KEY (`Entidad_Id_Entidad`) REFERENCES `entidad` (`id_entidad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `animal`
--

LOCK TABLES `animal` WRITE;
/*!40000 ALTER TABLE `animal` DISABLE KEYS */;
/*!40000 ALTER TABLE `animal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asignacion_ah`
--

DROP TABLE IF EXISTS `asignacion_ah`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `asignacion_ah` (
  `Id_Asignacion_AH` int(11) NOT NULL AUTO_INCREMENT,
  `Animal_Id_Animal` int(11) NOT NULL,
  `Huesos_Id_Huesos` int(11) NOT NULL,
  PRIMARY KEY (`Id_Asignacion_AH`),
  KEY `fk_Asignacion_AH_Animal_idx` (`Animal_Id_Animal`),
  KEY `fk_Asignacion_AH_Huesos1_idx` (`Huesos_Id_Huesos`),
  CONSTRAINT `fk_Asignacion_AH_Animal` FOREIGN KEY (`Animal_Id_Animal`) REFERENCES `animal` (`id_animal`),
  CONSTRAINT `fk_Asignacion_AH_Huesos1` FOREIGN KEY (`Huesos_Id_Huesos`) REFERENCES `huesos` (`id_huesos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asignacion_ah`
--

LOCK TABLES `asignacion_ah` WRITE;
/*!40000 ALTER TABLE `asignacion_ah` DISABLE KEYS */;
/*!40000 ALTER TABLE `asignacion_ah` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `consultar_entidad`
--

DROP TABLE IF EXISTS `consultar_entidad`;
/*!50001 DROP VIEW IF EXISTS `consultar_entidad`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `consultar_entidad` AS SELECT 
 1 AS `ID_Entidad`,
 1 AS `Tipo_Entidad`,
 1 AS `No_Usuarios`,
 1 AS `Nombre_Entidad`,
 1 AS `Nit`,
 1 AS `Encargado`,
 1 AS `Telefono`,
 1 AS `Direccion`,
 1 AS `Correo`,
 1 AS `T_Pago`,
 1 AS `Estado`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `cuestionario`
--

DROP TABLE IF EXISTS `cuestionario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `cuestionario` (
  `Id_Cuestionario` int(11) NOT NULL AUTO_INCREMENT,
  `Pregunta` varchar(45) NOT NULL,
  `Tipo_Pregunta` enum('SELECCION','LIBRE') NOT NULL,
  `Ruta_Modelo` text NOT NULL,
  `Grupo_Id_Grupo` int(11) NOT NULL,
  PRIMARY KEY (`Id_Cuestionario`),
  KEY `fk_Cuestionario_Grupo1_idx` (`Grupo_Id_Grupo`),
  CONSTRAINT `fk_Cuestionario_Grupo1` FOREIGN KEY (`Grupo_Id_Grupo`) REFERENCES `grupo` (`id_grupo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cuestionario`
--

LOCK TABLES `cuestionario` WRITE;
/*!40000 ALTER TABLE `cuestionario` DISABLE KEYS */;
/*!40000 ALTER TABLE `cuestionario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entidad`
--

DROP TABLE IF EXISTS `entidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `entidad` (
  `Id_Entidad` int(11) NOT NULL AUTO_INCREMENT,
  `Tipo_Entidad_Id_Tipo_Entidad` int(11) NOT NULL,
  `Nombre` varchar(45) NOT NULL,
  `Nit` int(20) unsigned NOT NULL,
  `Encargado` varchar(45) NOT NULL,
  `Telefono` varchar(25) NOT NULL,
  `Direccion` varchar(45) NOT NULL,
  `Correo_Electronico` varchar(45) NOT NULL,
  `Tiempo_Pago` enum('1','6','12') NOT NULL,
  `No_Usuarios` int(11) NOT NULL,
  `Estado` enum('ACTIVO','INACTIVO') NOT NULL,
  `Logo_Entidad` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Id_Entidad`),
  KEY `fk_Entidad_Tipo_Entidad1_idx` (`Tipo_Entidad_Id_Tipo_Entidad`),
  CONSTRAINT `fk_Entidad_Tipo_Entidad1` FOREIGN KEY (`Tipo_Entidad_Id_Tipo_Entidad`) REFERENCES `tipo_entidad` (`id_tipo_entidad`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entidad`
--

LOCK TABLES `entidad` WRITE;
/*!40000 ALTER TABLE `entidad` DISABLE KEYS */;
INSERT INTO `entidad` VALUES (1,2,'MasterCode',900234567,'Socrates Martinez','3219876543','CALLE 1No01','generenciamastercode@gmail.com','12',150,'ACTIVO','/img/empresa.png');
/*!40000 ALTER TABLE `entidad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grupo`
--

DROP TABLE IF EXISTS `grupo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `grupo` (
  `Id_Grupo` int(11) NOT NULL AUTO_INCREMENT,
  `Codigo` varchar(45) NOT NULL,
  `Nombre` varchar(45) NOT NULL,
  `Tipo` enum('PUBLICO','PRIVADO') NOT NULL,
  `Contraseña` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`Id_Grupo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grupo`
--

LOCK TABLES `grupo` WRITE;
/*!40000 ALTER TABLE `grupo` DISABLE KEYS */;
/*!40000 ALTER TABLE `grupo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `huesos`
--

DROP TABLE IF EXISTS `huesos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `huesos` (
  `Id_Huesos` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(45) NOT NULL,
  `Descripcion` varchar(250) NOT NULL,
  `Ruta` text NOT NULL,
  PRIMARY KEY (`Id_Huesos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `huesos`
--

LOCK TABLES `huesos` WRITE;
/*!40000 ALTER TABLE `huesos` DISABLE KEYS */;
/*!40000 ALTER TABLE `huesos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `identificacion`
--

DROP TABLE IF EXISTS `identificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `identificacion` (
  `Id_Identificacion` int(11) NOT NULL,
  `Tipo` varchar(45) NOT NULL,
  `Estado` enum('ACTIVO','INACTIVO') NOT NULL,
  PRIMARY KEY (`Id_Identificacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `identificacion`
--

LOCK TABLES `identificacion` WRITE;
/*!40000 ALTER TABLE `identificacion` DISABLE KEYS */;
INSERT INTO `identificacion` VALUES (1,'CEDULA DE CIUDADANIA','ACTIVO'),(2,'TARJETA DE IDENTIFICACION','ACTIVO'),(3,'REGISTRO CIVIL','INACTIVO'),(4,'PASAPORTE','ACTIVO');
/*!40000 ALTER TABLE `identificacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inscripcion_grupo`
--

DROP TABLE IF EXISTS `inscripcion_grupo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `inscripcion_grupo` (
  `Id_Inscripcion_Grupo` int(11) NOT NULL AUTO_INCREMENT,
  `Persona_Id_Persona` int(11) NOT NULL,
  `Grupo_Id_Grupo` int(11) NOT NULL,
  `Fecha_Inscripcion` timestamp NOT NULL,
  PRIMARY KEY (`Id_Inscripcion_Grupo`),
  KEY `fk_Inscripcion_Grupo_Persona1_idx` (`Persona_Id_Persona`),
  KEY `fk_Inscripcion_Grupo_Grupo1_idx` (`Grupo_Id_Grupo`),
  CONSTRAINT `fk_Inscripcion_Grupo_Grupo1` FOREIGN KEY (`Grupo_Id_Grupo`) REFERENCES `grupo` (`id_grupo`),
  CONSTRAINT `fk_Inscripcion_Grupo_Persona1` FOREIGN KEY (`Persona_Id_Persona`) REFERENCES `persona` (`id_persona`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inscripcion_grupo`
--

LOCK TABLES `inscripcion_grupo` WRITE;
/*!40000 ALTER TABLE `inscripcion_grupo` DISABLE KEYS */;
/*!40000 ALTER TABLE `inscripcion_grupo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `menu` (
  `Id_Menu` int(11) NOT NULL AUTO_INCREMENT,
  `Icono` varchar(45) NOT NULL,
  `Nombre` varchar(45) NOT NULL,
  `Ruta` text NOT NULL,
  `Orden` int(11) NOT NULL,
  PRIMARY KEY (`Id_Menu`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` VALUES (1,'fa fa-home','Inicio','/supadmin/home',1),(2,'fa fa-cogs','Configuración','/supadmin/configuarion',2),(3,'fa fa-building','Entidades','/supadmin/entidades',3),(4,'fa fa-envelope','Correos','/supadmin/correos',4),(5,'fa fa-cube','Modelos 3D','/supadmin/modelos',5),(6,'fa fa-home','Inicio','/admin/inicio',1),(7,'fa fa-industry','Empresa','/admin/empresa',2),(8,'fa fa-users','Docentes','/admin/docentes',3),(9,'fa fa-cube','Modelos 3D','/admin/modelos',4),(10,'fa fa-cube','Modelos 3D','/models/inicio',1),(11,'fa fa-users','Grupos','/docente/grupos',2),(12,'fa fa-text','Actividades','/docente/actividades',3),(13,'fa fa-pie-chart','Informes','/docente/informes',4),(14,'fa fa-text','Actividades','/estudiante/actividades',2);
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `menu_usuarios`
--

DROP TABLE IF EXISTS `menu_usuarios`;
/*!50001 DROP VIEW IF EXISTS `menu_usuarios`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `menu_usuarios` AS SELECT 
 1 AS `Id_Entidad`,
 1 AS `Id_Persona`,
 1 AS `Rol`,
 1 AS `Icono`,
 1 AS `Nombre`,
 1 AS `Ruta`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `permisos`
--

DROP TABLE IF EXISTS `permisos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `permisos` (
  `Id_Permisos` int(11) NOT NULL AUTO_INCREMENT,
  `Rol_Id_Rol` int(11) NOT NULL,
  `Menu_Id_Menu` int(11) NOT NULL,
  PRIMARY KEY (`Id_Permisos`),
  KEY `fk_Permisos_Rol1_idx` (`Rol_Id_Rol`),
  KEY `fk_Permisos_Menu1_idx` (`Menu_Id_Menu`),
  CONSTRAINT `fk_Permisos_Menu1` FOREIGN KEY (`Menu_Id_Menu`) REFERENCES `menu` (`id_menu`),
  CONSTRAINT `fk_Permisos_Rol1` FOREIGN KEY (`Rol_Id_Rol`) REFERENCES `rol` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permisos`
--

LOCK TABLES `permisos` WRITE;
/*!40000 ALTER TABLE `permisos` DISABLE KEYS */;
INSERT INTO `permisos` VALUES (1,1,1),(2,1,2),(3,1,3),(4,1,4),(5,1,5),(6,2,6),(7,2,7),(8,2,8),(9,2,9),(10,3,10),(11,3,11),(12,3,12),(13,3,13),(14,4,10),(15,4,14);
/*!40000 ALTER TABLE `permisos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persona`
--

DROP TABLE IF EXISTS `persona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `persona` (
  `Id_Persona` int(11) NOT NULL AUTO_INCREMENT,
  `Identificacion_idIdentificacion` int(11) NOT NULL,
  `Identificacion` int(20) NOT NULL,
  `Nombre` varchar(45) NOT NULL,
  `Apellido` varchar(45) NOT NULL,
  `Correo_Electronico` varchar(65) NOT NULL,
  `Imagen` text NOT NULL,
  PRIMARY KEY (`Id_Persona`),
  UNIQUE KEY `Documento_UNIQUE` (`Identificacion`),
  KEY `fk_Persona_Identificacion1_idx` (`Identificacion_idIdentificacion`),
  CONSTRAINT `fk_Persona_Identificacion1` FOREIGN KEY (`Identificacion_idIdentificacion`) REFERENCES `identificacion` (`Id_Identificacion`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persona`
--

LOCK TABLES `persona` WRITE;
/*!40000 ALTER TABLE `persona` DISABLE KEYS */;
INSERT INTO `persona` VALUES (1,1,1117546877,'Socrates','Berrio','socrates@mastercode.com.co','/img/user.png');
/*!40000 ALTER TABLE `persona` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registro_pe`
--

DROP TABLE IF EXISTS `registro_pe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `registro_pe` (
  `Id_Registro_PE` int(11) NOT NULL AUTO_INCREMENT,
  `Fecha` timestamp NOT NULL,
  `Estado` enum('ACTIVO','INACTIVO') NOT NULL,
  `Persona_Id_Persona` int(11) NOT NULL,
  `Entidad_Id_Entidad` int(11) NOT NULL,
  `Rol_Id_Rol` int(11) NOT NULL,
  PRIMARY KEY (`Id_Registro_PE`),
  KEY `fk_Registro_PE_Persona1_idx` (`Persona_Id_Persona`),
  KEY `fk_Registro_PE_Entidad1_idx` (`Entidad_Id_Entidad`),
  KEY `fk_Registro_PE_Rol1_idx` (`Rol_Id_Rol`),
  CONSTRAINT `fk_Registro_PE_Entidad1` FOREIGN KEY (`Entidad_Id_Entidad`) REFERENCES `entidad` (`id_entidad`),
  CONSTRAINT `fk_Registro_PE_Persona1` FOREIGN KEY (`Persona_Id_Persona`) REFERENCES `persona` (`id_persona`),
  CONSTRAINT `fk_Registro_PE_Rol1` FOREIGN KEY (`Rol_Id_Rol`) REFERENCES `rol` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registro_pe`
--

LOCK TABLES `registro_pe` WRITE;
/*!40000 ALTER TABLE `registro_pe` DISABLE KEYS */;
INSERT INTO `registro_pe` VALUES (1,'2020-06-03 16:11:11','ACTIVO',1,1,1);
/*!40000 ALTER TABLE `registro_pe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `respuestas`
--

DROP TABLE IF EXISTS `respuestas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `respuestas` (
  `Id_Respuestas` int(11) NOT NULL AUTO_INCREMENT,
  `Respuesta` varchar(45) NOT NULL,
  `Cuestionario_Id_Cuestionario` int(11) NOT NULL,
  `Persona_Id_Persona` int(11) NOT NULL,
  `Grupo_Id_Grupo` int(11) NOT NULL,
  PRIMARY KEY (`Id_Respuestas`),
  KEY `fk_Respuestas_Cuestionario1_idx` (`Cuestionario_Id_Cuestionario`),
  KEY `fk_Respuestas_Persona1_idx` (`Persona_Id_Persona`),
  KEY `fk_Respuestas_Grupo1_idx` (`Grupo_Id_Grupo`),
  CONSTRAINT `fk_Respuestas_Cuestionario1` FOREIGN KEY (`Cuestionario_Id_Cuestionario`) REFERENCES `cuestionario` (`id_cuestionario`),
  CONSTRAINT `fk_Respuestas_Grupo1` FOREIGN KEY (`Grupo_Id_Grupo`) REFERENCES `grupo` (`id_grupo`),
  CONSTRAINT `fk_Respuestas_Persona1` FOREIGN KEY (`Persona_Id_Persona`) REFERENCES `persona` (`id_persona`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `respuestas`
--

LOCK TABLES `respuestas` WRITE;
/*!40000 ALTER TABLE `respuestas` DISABLE KEYS */;
/*!40000 ALTER TABLE `respuestas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `rol` (
  `Id_Rol` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(45) NOT NULL,
  `Tipo` enum('ADMIN','DOCENTE','ESTUDIANTE') NOT NULL,
  PRIMARY KEY (`Id_Rol`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'SUPER ADMINISTRADOR','ADMIN'),(2,'ADMINISTRADOR','ADMIN'),(3,'DOCENTE','DOCENTE'),(4,'ESTUDIANTE','ESTUDIANTE');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('PfllR02_c-S1-KKVYR5K8lhepl3xfWv9',1595603531,'{\"cookie\":{\"originalMaxAge\":36000000,\"expires\":\"2020-07-24T15:12:09.524Z\",\"secure\":false,\"httpOnly\":false,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":{\"Id_Usuario\":1,\"Usuario\":\"admin\",\"Password\":\"$2a$10$cyqJNqM/NRADYGo.iZDY8edH1IaUNtCo11pX8Fh9b2vAANhun4M.u\",\"Persona_Id_Persona\":1}},\"datos\":{\"Id_Entidad\":1,\"Nombre_Entidad\":\"MasterCode\",\"Nit_Entidad\":900234567,\"Tipo_Entidad\":\"UNIVERSIDAD\",\"Id_Usuario\":1,\"Nombre_Usuario\":\"Socrates Berrio\",\"Tipo_Usuario\":\"SUPER ADMINISTRADOR\"},\"menu\":[{\"Id_Entidad\":1,\"Id_Persona\":1,\"Rol\":\"SUPER ADMINISTRADOR\",\"Icono\":\"fa fa-home\",\"Nombre\":\"Inicio\",\"Ruta\":\"/supadmin/home\"},{\"Id_Entidad\":1,\"Id_Persona\":1,\"Rol\":\"SUPER ADMINISTRADOR\",\"Icono\":\"fa fa-cogs\",\"Nombre\":\"Configuración\",\"Ruta\":\"/supadmin/configuarion\"},{\"Id_Entidad\":1,\"Id_Persona\":1,\"Rol\":\"SUPER ADMINISTRADOR\",\"Icono\":\"fa fa-building\",\"Nombre\":\"Entidades\",\"Ruta\":\"/supadmin/entidades\"},{\"Id_Entidad\":1,\"Id_Persona\":1,\"Rol\":\"SUPER ADMINISTRADOR\",\"Icono\":\"fa fa-envelope\",\"Nombre\":\"Correos\",\"Ruta\":\"/supadmin/correos\"},{\"Id_Entidad\":1,\"Id_Persona\":1,\"Rol\":\"SUPER ADMINISTRADOR\",\"Icono\":\"fa fa-cube\",\"Nombre\":\"Modelos 3D\",\"Ruta\":\"/supadmin/modelos\"}]}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sub_preguntas`
--

DROP TABLE IF EXISTS `sub_preguntas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `sub_preguntas` (
  `Id_Sub_Preguntas` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(45) NOT NULL,
  `Cuestionario_Id_Cuestionario` int(11) NOT NULL,
  PRIMARY KEY (`Id_Sub_Preguntas`),
  KEY `fk_Sub_Preguntas_Cuestionario1_idx` (`Cuestionario_Id_Cuestionario`),
  CONSTRAINT `fk_Sub_Preguntas_Cuestionario1` FOREIGN KEY (`Cuestionario_Id_Cuestionario`) REFERENCES `cuestionario` (`id_cuestionario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_preguntas`
--

LOCK TABLES `sub_preguntas` WRITE;
/*!40000 ALTER TABLE `sub_preguntas` DISABLE KEYS */;
/*!40000 ALTER TABLE `sub_preguntas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_entidad`
--

DROP TABLE IF EXISTS `tipo_entidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `tipo_entidad` (
  `Id_Tipo_Entidad` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(45) NOT NULL,
  `Estado` enum('ACTIVO','INACTIVO') NOT NULL,
  `No_Usuarios` int(11) NOT NULL,
  PRIMARY KEY (`Id_Tipo_Entidad`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_entidad`
--

LOCK TABLES `tipo_entidad` WRITE;
/*!40000 ALTER TABLE `tipo_entidad` DISABLE KEYS */;
INSERT INTO `tipo_entidad` VALUES (1,'COLEGIO','ACTIVO',150),(2,'UNIVERSIDAD','ACTIVO',225),(3,'EMPRESA PRIVADA','ACTIVO',10),(4,'EMPRESA PUBLICA','ACTIVO',10);
/*!40000 ALTER TABLE `tipo_entidad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `usuario` (
  `Id_Usuario` int(11) NOT NULL AUTO_INCREMENT,
  `Usuario` varchar(45) NOT NULL,
  `Password` varchar(65) NOT NULL,
  `Persona_Id_Persona` int(11) NOT NULL,
  PRIMARY KEY (`Id_Usuario`),
  KEY `fk_Usuario_Persona1_idx` (`Persona_Id_Persona`),
  CONSTRAINT `fk_Usuario_Persona1` FOREIGN KEY (`Persona_Id_Persona`) REFERENCES `persona` (`id_persona`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'admin','$2a$10$cyqJNqM/NRADYGo.iZDY8edH1IaUNtCo11pX8Fh9b2vAANhun4M.u',1);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `variables_usuario`
--

DROP TABLE IF EXISTS `variables_usuario`;
/*!50001 DROP VIEW IF EXISTS `variables_usuario`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `variables_usuario` AS SELECT 
 1 AS `Id_Usuario`,
 1 AS `Id_Entidad`,
 1 AS `Nombre_Entidad`,
 1 AS `Nit_Entidad`,
 1 AS `Tipo_Entidad`,
 1 AS `Id_Empleado`,
 1 AS `Nombre_Usuario`,
 1 AS `Tipo_Usuario`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `consultar_entidad`
--

/*!50001 DROP VIEW IF EXISTS `consultar_entidad`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `consultar_entidad` AS select `entidad`.`Id_Entidad` AS `ID_Entidad`,`tipo_entidad`.`Nombre` AS `Tipo_Entidad`,`tipo_entidad`.`No_Usuarios` AS `No_Usuarios`,`entidad`.`Nombre` AS `Nombre_Entidad`,`entidad`.`Nit` AS `Nit`,`entidad`.`Encargado` AS `Encargado`,`entidad`.`Telefono` AS `Telefono`,`entidad`.`Direccion` AS `Direccion`,`entidad`.`Correo_Electronico` AS `Correo`,`entidad`.`Tiempo_Pago` AS `T_Pago`,`entidad`.`Estado` AS `Estado` from (`entidad` join `tipo_entidad` on((`tipo_entidad`.`Id_Tipo_Entidad` = `entidad`.`Tipo_Entidad_Id_Tipo_Entidad`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `menu_usuarios`
--

/*!50001 DROP VIEW IF EXISTS `menu_usuarios`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `menu_usuarios` AS select `entidad`.`Id_Entidad` AS `Id_Entidad`,`persona`.`Id_Persona` AS `Id_Persona`,`rol`.`Nombre` AS `Rol`,`menu`.`Icono` AS `Icono`,`menu`.`Nombre` AS `Nombre`,`menu`.`Ruta` AS `Ruta` from (((((`persona` join `registro_pe` on((`registro_pe`.`Persona_Id_Persona` = `persona`.`Id_Persona`))) join `entidad` on((`entidad`.`Id_Entidad` = `registro_pe`.`Entidad_Id_Entidad`))) join `rol` on((`rol`.`Id_Rol` = `registro_pe`.`Rol_Id_Rol`))) join `permisos` on((`permisos`.`Rol_Id_Rol` = `rol`.`Id_Rol`))) join `menu` on((`menu`.`Id_Menu` = `permisos`.`Menu_Id_Menu`))) order by (`menu`.`Nombre` = 'Inicio') desc,`menu`.`Orden` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `variables_usuario`
--

/*!50001 DROP VIEW IF EXISTS `variables_usuario`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `variables_usuario` AS select `usuario`.`Id_Usuario` AS `Id_Usuario`,`entidad`.`Id_Entidad` AS `Id_Entidad`,`entidad`.`Nombre` AS `Nombre_Entidad`,`entidad`.`Nit` AS `Nit_Entidad`,`tipo_entidad`.`Nombre` AS `Tipo_Entidad`,`persona`.`Id_Persona` AS `Id_Empleado`,concat(`persona`.`Nombre`,' ',`persona`.`Apellido`) AS `Nombre_Usuario`,`rol`.`Nombre` AS `Tipo_Usuario` from (((((`usuario` join `persona` on((`persona`.`Id_Persona` = `usuario`.`Persona_Id_Persona`))) join `registro_pe` on((`registro_pe`.`Persona_Id_Persona` = `persona`.`Id_Persona`))) join `entidad` on((`entidad`.`Id_Entidad` = `registro_pe`.`Entidad_Id_Entidad`))) join `tipo_entidad` on((`tipo_entidad`.`Id_Tipo_Entidad` = `entidad`.`Tipo_Entidad_Id_Tipo_Entidad`))) join `rol` on((`rol`.`Id_Rol` = `registro_pe`.`Rol_Id_Rol`))) where ((`registro_pe`.`Estado` = 'ACTIVO') and (`entidad`.`Estado` = 'ACTIVO')) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-07-24  0:15:28
