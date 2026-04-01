--drop schema producto;
--drop schema transaccion;
--drop user netby_user;
-- use master;
-- go
-- create login netby_user with password = 'msgaifyo@vq2p!nfhay';
-- go
-- create database netby_test;
-- go
use gestion_reserva;
go
-- create user netby_user for login netby_user;
-- alter role db_owner add member netby_user;
-- select name, type_desc from sys.database_principals where name = 'netby_user';
-- go
create schema producto;
go
create schema sujeto;
go
-- create schema transaccion;
go

create table producto.pr_categoria (
	cat_id int not null identity(1,1),
	cat_nombre nvarchar(250) collate latin1_general_ci_as not null ,
	cat_estado bit not null,
	constraint pk_categoria primary key(cat_id)
);

create table producto.pr_tipo_estado_producto (
	tep_id int not null identity(1,1),
	tep_nombre nvarchar(250) collate latin1_general_ci_as not null,
	tep_estado bit not null,
	constraint pk_tipo_estado_producto primary key(tep_id),
);

create table producto.pr_producto (
	pr_id int not null identity(1,1),
	pr_nombre nvarchar(250) collate latin1_general_ci_as not null,
	pr_descripcion nvarchar(500) collate latin1_general_ci_as not null,
	pr_imagen nvarchar(250) collate latin1_general_ci_as not null,
	pr_precio decimal(6,4) not null,
	pr_stock int not null,
	pr_cat_id int not null
	pr_activo bit not null,
	constraint pk_producto primary key(pr_id),
	constraint fk_producto_categoria foreign key (pr_cat_id) references producto.pr_categoria(cat_id)
);

create table sujeto.su_rol (
	rl_id int not null identity(1,1),
	rl_nombre nvarchar(100) not null,
	rl_estado bit not null
	constraint pk_rol primary key (rl_id)
);

create table sujeto.su_usuario (
	us_id int not null identity (1,1),
	us_nombre nvarchar(250) collate latin1_general_ci_as not null ,
	us_usuario nvarchar(250) collate latin1_general_ci_as not null ,
	us_clave nvarchar(250) collate latin1_general_ci_as not null ,
	us_fecha_ingreso datetime not null
	us_rl_id int not null,
	us_estado bit not null,
	constraint pk_usuario primary key (us_id),
	constraint fk_usuario_rol foreign key (us_rl_id) references sujeto.su_rol (rl_id)
);

create table sujeto.su_tipo_negocio (
	tn_id int not null identity (1,1),
	tn_nombre nvarchar(250) collate latin1_general_ci_as not null ,
	tn_es_entrega bit not null,
	tn_estado bit not null,
	constraint pk_tipo_negocio primary key (tn_id),
);

create table sujeto.su_empresa (
	em_id int not null identity (1,1),
	em_nombre nvarchar(250) collate latin1_general_ci_as not null ,
	em_identificacion nvarchar(13) not null ,
	em_tn_id int not null,
	em_fecha_ingreso datetime not null,
	em_correo nvarchar(250) collate latin1_general_ci_as not null ,
	em_estado bit not null,
	constraint pk_empresa primary key (cl_id),
	constraint fk_empresa_tipo_negocio foreign key (em_tn_id) references sujeto.su_tipo_negocio (tn_id)
);

create table sujeto.su_sucursal
(
	su_id int not null identity (1,1),
	su_longitud decimal(9,6) not null,
	su_latitud decimal(9,6) not null,
	su_matriz bit not null,
	su_telefono nvarchar(13) not null ,
	su_direccion nvarchar(255) collate latin1_general_ci_as not null ,
	su_em_id int not null,
	su_estado bit not null,
	su_fecha datetime not null,
	constraint pk_sucursal primary key (su_id),
	constraint fk_sucursal_cliente foreign key (su_em_id) references sujeto.su_empresa (em_id)
)

-- create table transaccion.tipo_transaccion (
	-- id int not null identity(1,1),
	-- nombre nvarchar(250) collate latin1_general_ci_as not null ,
	-- estado bit not null
	-- constraint pk_tipo_transaccion primary key (id)
-- );

-- create table transaccion.transacciones (
	-- id int not null identity(1,1),
	-- fecha date not null,
	-- cantidad int not null,
	-- precio_unitario decimal(6,4) not null,
	-- precio_total decimal(6,4) not null,
	-- detalle nvarchar(500) collate latin1_general_ci_as not null ,
	-- tipo_transaccion_id int not null,
	-- producto_id int not null,
	-- estado bit not null,
-- --	usuario_id int not null,
	-- constraint pk_transaccion primary key (id),
	-- constraint fk_transaccion_tipo_trans foreign key (tipo_transaccion_id) references transaccion.tipo_transaccion (id),
	-- constraint fk_transaccion_producto foreign key (producto_id) references producto.productos (id),
-- --	constraint fk_transaccion_usuario foreign key (usuario_id) references sujeto.usuario (id),
-- );

-- insert into transaccion.tipo_transaccion (nombre, estado)
-- values('compra', 1),
-- ('venta', 1);

insert into sujeto.rol
(
	rl_nombre,
	rl_estado,
)
values
(
	'SUPERADMIN',
	1
)

insert into sujeto.rol
(
	rl_nombre,
	rl_estado,
)
values
(
	'ADMIN',
	1
)

DECLARE @w_id_rol int = 0;

SELECT @w_id_rol = rl_id FROM usuario.rol rl where rl.rl_nombre = 'SUPERADMIN'

if @w_id_rol != 0
begin
	insert into sujeto.usuario
	(
		us_nombre,
		us_usuario,
		us_clave,
		us_rl_id
		us_estado,
	)
	values
	(
		'BRYAM PARRA',
		'bparrasp'
		'',
		@w_id_rol,
		1
	)

	print 'USUARIO CREADO'

end
ELSE
begin
	print 'USUARIO NO CREADO, FALTA EL ROL'
end