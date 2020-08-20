INSERT INTO `identificacion` (`Id_Identificacion`, `tipo`, `estado`) VALUES
(1, 'CEDULA DE CIUDADANIA', 'ACTIVO'),
(2, 'TARJETA DE IDENTIFICACION', 'ACTIVO'),
(3, 'REGISTRO CIVIL', 'INACTIVO'),
(4, 'PASAPORTE', 'ACTIVO'); 

INSERT INTO `menu` (`Id_Menu`, `Icono`, `nombre`, `ruta`, `orden`) VALUES
(default, 'fa fa-home', 'Inicio', '/supadmin/home', 1),
(default, 'fa fa-cogs', 'Configuración', '/supadmin/configuarion', 2),
(default, 'fa fa-building', 'Entidades', '/supadmin/entidades', 3),
(default, 'fa fa-envelope', 'Correos', '/supadmin/correos', 4),
(default, 'fa fa-cube', 'Modelos 3D', '/supadmin/modelos', 5),
(default, 'fa fa-home', 'Inicio', '/admin/inicio', 1),
(default, 'fa fa-industry', 'Empresa', '/admin/empresa', 2),
(default, 'fa fa-users', 'Docentes', '/admin/docentes', 3),
(default, 'fa fa-cube', 'Modelos 3D', '/admin/modelos', 4),
(default, 'fa fa-cube', 'Modelos 3D', '/models/inicio', 1),
(default, 'fa fa-users', 'Grupos', '/docente/grupos', 2),
(default, 'fa fa-text', 'Actividades', '/docente/actividades', 3),
(default, 'fa fa-pie-chart', 'Informes', '/docente/informes', 4),
(default, 'fa fa-text', 'Actividades', '/estudiante/actividades', 2);

INSERT INTO `rol` (`id_rol`, `Nombre`, `Tipo`) VALUES
(default, 'SUPER ADMINISTRADOR', 1),
(default, 'ADMINISTRADOR', 1),
(default, 'DOCENTE', 2),
(default, 'ESTUDIANTE', 3);

INSERT INTO `permisos` (`IdPermisos`, `Rol_Id_Rol`, `Menu_Id_Menu`) VALUES
(default, 1, 1),
(default, 1, 2),
(default, 1, 3),
(default, 1, 4),
(default, 1, 5),
(default, 2, 6),
(default, 2, 7),
(default, 2, 8),
(default, 2, 9),
(default, 3, 10),
(default, 3, 11),
(default, 3, 12),
(default, 3, 13),
(default, 4, 10),
(default, 4, 14);

INSERT INTO `tipo_entidad` (`Id_Tipo_Entidad`,`Nombre`,`Estado`,`No_Usuarios`) VALUES
(default, 'COLEGIO', 'ACTIVO', 150),
(default, 'UNIVERSIDAD', 'ACTIVO', 225),
(default, 'EMPRESA PRIVADA', 'ACTIVO', 10),
(default, 'EMPRESA PUBLICA', 'ACTIVO', 10);

INSERT INTO `entidad` (`Id_Entidad`, `Tipo_Entidad_Id_Tipo_Entidad`, `Nombre`, `Nit`, `Encargado`, `Telefono`, `Direccion`, `Correo_Electronico`, `Tiempo_Pago`, `No_Usuarios`, `Estado`, `Logo_Entidad`) VALUES
(default, 2, 'MasterCode', '900-234-567', 'Socrates Martinez', '3219876543', 'CALLE 1No01', 'generenciamastercode@gmail.com', '12', 150, 'ACTIVO', '/img/empresa.png');

INSERT INTO `persona` (`Id_Persona`, `Identificacion_idIdentificacion`, `Identificacion`, `Nombre`, `Apellido`, `Correo_Electronico`, `Imagen`) VALUES
(default, 1, 1117546877, 'Socrates', 'Berrio', 'socrates@mastercode.com.co', '/img/user.png');

INSERT INTO `registro_pe` (`Id_Registro_PE`, `fecha`, `estado`, `Persona_Id_Persona`, `Entidad_Id_Entidad`, `Rol_Id_Rol`) VALUES
(default, '2020-06-03 11:11:11', 'ACTIVO', 1, 1, 1);


CREATE OR REPLACE VIEW Consultar_Entidad AS select entidad.Id_Entidad as ID_Entidad, tipo_entidad.Nombre as Tipo_Entidad, tipo_entidad.No_Usuarios as No_Usuarios, entidad.Nombre as Nombre_Entidad, entidad.Nit as Nit, entidad.Encargado as Encargado, entidad.Telefono as Telefono, entidad.Direccion as Direccion, entidad.Correo_Electronico as Correo, entidad.Tiempo_Pago as T_Pago, entidad.Estado as Estado
from entidad
inner join tipo_entidad on tipo_entidad.Id_Tipo_Entidad = entidad.Tipo_Entidad_Id_Tipo_Entidad


CREATE OR REPLACE VIEW `Menu_Usuarios` AS select Entidad.Id_Entidad AS Id_Entidad, persona.Id_Persona AS Id_Persona, rol.Nombre AS Nombre_Rol, Menu.Nombre AS Menu, Menu.Icono AS Icono_Menu, Menu.Ruta AS Rutas_Menu 
from persona 
inner join registro_pe on registro_pe.Persona_Id_Persona = persona.Id_Persona
inner join entidad on entidad.Id_Entidad = registro_pe.Entidad_Id_Entidad
inner join rol on rol.Id_Rol = registro_pe.Rol_Id_Rol
inner join permisos on permisos.Rol_Id_Rol = rol.Id_Rol
inner join menu on menu.Id_Menu = rol.Id_Rol
ORDER BY Menu='Inicio' desc, Menu;

create or replace view `VariablesUsuario` as 
select usuario.Id_Usuario as Id_Usuario ,entidad.Id_Entidad as Id_entidad, entidad.Nombre as Nombre_Entidad, entidad.Nit as Nit_Entidad, tipo_entidad.Nombre as Tipo_Entidad, persona.Id_Persona as Id_Empleado, concat(persona.Nombre, ' ', persona.Apellido) as Nombre_Usuario, rol.Nombre as Tipo_Usuario
from usuario
inner join persona on persona.Id_Persona = usuario.Persona_Id_Persona 
inner join registro_pe on registro_pe.Persona_Id_Persona = persona.Id_Persona 
inner join entidad on entidad.Id_Entidad = registro_pe.Entidad_Id_Entidad 
inner join tipo_entidad on tipo_entidad.Id_Tipo_Entidad = entidad.Tipo_Entidad_Id_Tipo_Entidad
inner join rol on rol.Id_Rol = registro_pe.Rol_Id_Rol 
where registro_pe.Estado = 'ACTIVO' and entidad.Estado = 'ACTIVO'


create procedure Registro_Entidades(IN TipoEntidad INT, NombreEntidad VARCHAR(45), NitEntidad VARCHAR(45),TelefonoEntidad VARCHAR(25),DireccionEntidad VARCHAR(45),CorreoEntidad VARCHAR(45),PlanPago INT,NoUsuarios INT,NombreContacto VARCHAR(45),IdContacto VARCHAR(45),Contrasena VARCHAR(65)) 
not deterministic
begin 			
	declare Id_Empresa int;
	declare Id_Persona int;
	declare Users int;	
	
	select tipo_entidad.No_Usuarios into Users from tipo_entidad where Id_Tipo_Entidad = TipoEntidad;

	INSERT INTO `entidad` (`Id_Entidad`, `Tipo_Entidad_Id_Tipo_Entidad`, `Nombre`, `Nit`, `Encargado`, `Telefono`, `Direccion`, `Correo_Electronico`, `Tiempo_Pago`, `No_Usuarios`, `Estado`, `Logo_Entidad`) VALUES
	(default, TipoEntidad, NombreEntidad, NitEntidad, NombreContacto, TelefonoEntidad, DireccionEntidad, CorreoEntidad, PlanPago, Users, 'ACTIVO', '/img/empresa.png');
	
	INSERT INTO `persona` (`Id_Persona`, `Identificacion_idIdentificacion`, `Identificacion`, `Nombre`, `Apellido`, `Correo_Electronico`, `Imagen`) VALUES
	(default, 1, IdContacto, NombreContacto, 'Default', 'default@osteo3d.com', '/files/assets/images/user.png');
	
	select entidad.Id_Entidad into Id_Empresa from entidad where entidad.Nit = NitEntidad;

	select persona.Id_Persona into Id_Persona from persona where persona.Identificacion = IdContacto;
		
	INSERT INTO `registro_pe` (`Id_Registro_PE`, `fecha`, `estado`, `Persona_Id_Persona`, `Entidad_Id_Entidad`, `Rol_Id_Rol`) VALUES
	(default, now(), 'ACTIVO', Id_Persona, Id_Empresa, 2);
	
	INSERT INTO `usuario` (`Id_Usuario`, `Usuario`, `Password`, `Persona_Id_Persona`) VALUES
	(default, IdContacto, Contrasena, Id_Persona);
			
end;


CREATE FUNCTION Registro_Animal(Nombre_Animal VARCHAR(65),Nombre_Cientifico VARCHAR(100),Descripcion_Animal VARCHAR(250),Id_Entidad INT) 
	returns boolean 
	DETERMINISTIC
begin 		
	declare NA int;	
	select animal.Id_Animal into NA from animal where animal.Nombre_Cientifico = Nombre_Cientifico and animal.Entidad_Id_Entidad = Id_Entidad;
	if NA != 0 then
	return false;
	else
	INSERT INTO `animal` (`Id_Animal` , `Nombre`, `Nombre_Cientifico`, `Descripcion`, `Fotografia`, `Estado`, `Entidad_Id_Entidad`) VALUES
	(default, Nombre_Animal, Nombre_Cientifico, Descripcion_Animal, 'imagenes/animal/1.png', 'ACTIVO', Id_Entidad);
	return true;		
	end if;
end;

create or replace view `Lista_Animales` as 
select entidad.Id_Entidad as Id_Entidad, animal.Id_Animal as Id_Animal, animal.Nombre as Nombre_Animal, animal.Nombre_Cientifico as N_Cientifico, animal.Fotografia as Foto_Animal ,animal.Estado as Estado_Animal
from animal 
inner join entidad on entidad.Id_Entidad = animal.Entidad_Id_Entidad
where entidad.Estado = 'ACTIVO';

CREATE FUNCTION Registro_Parte_Animal(Id_Animal INT, Nombre_Hueso VARCHAR(45), Descripcion_Hueso VARCHAR(250), Descripcion_Especial VARCHAR(200), Ruta_Url TEXT) 
	returns boolean 
	DETERMINISTIC
begin 		
	declare NH int;	
	
	select huesos.Id_Huesos into NH from huesos where huesos.Nombre = Nombre_Hueso;

	if NH != 0 then
	return false;
	else
	INSERT INTO `huesos` (Id_Huesos , Nombre, Descripcion, Caracteres, Ruta) VALUES
	(default, Nombre_Hueso, Nombre_Hueso, Descripcion_Especial, Ruta_Url);
	return true;		
	end if;
end;

create or replace view `Lista_Partes_Animales` as 
select entidad.Id_Entidad as Id_Entidad, animal.Id_Animal as Id_Animal, animal.Nombre as Nombre_Animal, animal.Nombre_Cientifico as N_Cientifico, huesos.Id_Huesos as Id_Huesos, huesos.Nombre as Nombre_Hueso, huesos.Estado as Estado_Hueso
from entidad
inner join animal on animal.Entidad_Id_Entidad = entidad.Id_Entidad 
inner join asignacion_ah on asignacion_ah.Animal_Id_Animal = animal.Id_Animal 
inner join huesos on huesos.Id_Huesos  = asignacion_ah.Huesos_Id_Huesos 
where entidad.Estado = 'ACTIVO' and animal.Estado = 'ACTIVO';

CREATE PROCEDURE `Registro_Docente`(IN NombreUsuario VARCHAR(45), ApellidoUsuario VARCHAR(45), Identificacion INT, CorreoUsuario VARCHAR(65), Id_Entidad INT, Contrasena VARCHAR(65))
begin 				
	declare Id_Pers int;	
	
	INSERT INTO `persona` (`Id_Persona`, `Identificacion_idIdentificacion`, `Identificacion`, `Nombre`, `Apellido`, `Correo_Electronico`, `Imagen`, `Modificacion`) VALUES
	(default, 1, Identificacion, NombreUsuario, ApellidoUsuario, CorreoUsuario, '/files/assets/images/user.png', 1);
		
	select persona.Id_Persona into Id_Pers from persona where persona.Identificacion = Identificacion;
		
	INSERT INTO `registro_pe` (`Id_Registro_PE`, `fecha`, `estado`, `Persona_Id_Persona`, `Entidad_Id_Entidad`, `Rol_Id_Rol`) VALUES
	(default, now(), 'ACTIVO', Id_Pers, Id_Entidad, 3);
	
	INSERT INTO `usuario` (`Id_Usuario`, `Usuario`, `Password`, `Persona_Id_Persona`) VALUES
	(default, Identificacion, Contrasena, Id_Pers);
			
end;

create or replace view `Lista_Docente` as
select entidad.Id_Entidad as Id_Entidad, persona.Nombre as Nombre_Persona, persona.Apellido as Apellido_Persona, persona.Identificacion as Identificacion_Persona, persona.Correo_Electronico as Correo_Persona, rol.Nombre as Perfil 
from persona 
inner join registro_pe on registro_pe.Persona_Id_Persona = persona.Id_Persona 
inner join rol on rol.Id_Rol = registro_pe.Rol_Id_Rol 
inner join entidad on entidad.Id_Entidad = registro_pe.Entidad_Id_Entidad 
where registro_pe.Estado = 'ACTIVO' and rol.Nombre = 'DOCENTE';