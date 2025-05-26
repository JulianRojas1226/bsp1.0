-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-05-2025 a las 05:02:25
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bassprod`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cargo`
--

CREATE TABLE `cargo` (
  `id` int(3) NOT NULL,
  `cargo` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cargo`
--

INSERT INTO `cargo` (`id`, `cargo`) VALUES
(1, 'admin'),
(2, 'empleado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalles_p`
--

CREATE TABLE `detalles_p` (
  `HORA` timestamp NOT NULL DEFAULT current_timestamp(),
  `id` int(11) NOT NULL,
  `mesa_id` int(14) NOT NULL,
  `id_prod` int(11) NOT NULL,
  `producto` varchar(12) NOT NULL,
  `precio_u` int(20) NOT NULL,
  `cantidad` int(3) NOT NULL,
  `total_p` int(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Disparadores `detalles_p`
--
DELIMITER $$
CREATE TRIGGER `asignar_nombre` BEFORE INSERT ON `detalles_p` FOR EACH ROW BEGIN
    -- Validar que el ID no sea nulo antes de buscar el nombre
    IF NEW.id_prod IS NOT NULL THEN
        SET NEW.producto = (SELECT nombre FROM producto WHERE id = NEW.id_prod);
    ELSE
        SET NEW.producto = 'Sin nombre'; -- Valor por defecto
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `d_cant` AFTER INSERT ON `detalles_p` FOR EACH ROW BEGIN
    IF NEW.id_prod IS NOT NULL THEN
        UPDATE producto 
        SET cantidad = cantidad - NEW.cantidad
        WHERE id = NEW.id_prod;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `mont_total` BEFORE INSERT ON `detalles_p` FOR EACH ROW BEGIN
    IF NEW.id_prod IS NOT NULL THEN
        SET NEW.total_p = NEW.cantidad * (SELECT precio FROM producto WHERE id = NEW.id_prod);
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `precio_u` BEFORE INSERT ON `detalles_p` FOR EACH ROW BEGIN
    IF NEW.id_prod IS NOT NULL THEN
        SET NEW.precio_u = (SELECT precio FROM producto WHERE id = NEW.id_prod);
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `egresos`
--

CREATE TABLE `egresos` (
  `id` int(11) NOT NULL,
  `hora` timestamp NOT NULL DEFAULT current_timestamp(),
  `nombre` varchar(100) NOT NULL,
  `tipo` int(4) NOT NULL,
  `costo` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `egresos`
--

INSERT INTO `egresos` (`id`, `hora`, `nombre`, `tipo`, `costo`) VALUES
(11, '2025-05-19 18:07:28', 'Smirnoff Tamarindo *750', 1, 500000),
(15, '2025-05-23 19:11:01', 'Club Roja Botella', 1, 85000),
(16, '2025-05-23 19:29:45', 'Stella Artois Lata', 1, 84000),
(17, '2025-05-23 19:31:53', 'CLUB DORADA BOTELLA', 1, 85000),
(18, '2025-05-23 19:53:51', 'Corona botella', 1, 105000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleado`
--

CREATE TABLE `empleado` (
  `codigo` varchar(300) NOT NULL,
  `nombre` varchar(60) NOT NULL,
  `correo` varchar(60) NOT NULL,
  `cargo` int(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empleado`
--

INSERT INTO `empleado` (`codigo`, `nombre`, `correo`, `cargo`) VALUES
('$2b$10$6iI8FIQVkpLmZuvxCc3nl.aEpA12m/gnuhI7RwNrQfpyAmm90ftF2', 'esteban', 'julianrojasc1226@gmail.com', 1),
('$2b$10$avTosT2BMjSqZaadO6efYeSIMxNP7xUgMRoh6aMMKJ7Zymw44fBDq', 'Administrador', 'julisrojas26@gmail.com', 1),
('$2b$10$nydUkpmTg6krzvv1GkrmSuWAClw7g.iyMD9pr.vKu4WdeVnucGXhy', 'julian', 'julsdad@gmail.com', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mesa`
--

CREATE TABLE `mesa` (
  `ID` int(2) NOT NULL,
  `NumeroMesa` int(11) DEFAULT NULL,
  `estado` varchar(50) NOT NULL DEFAULT 'disponible'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mesa`
--

INSERT INTO `mesa` (`ID`, `NumeroMesa`, `estado`) VALUES
(1, 1, 'Reservado'),
(2, 2, 'Reservado'),
(3, 3, 'disponible'),
(4, 4, '[DISPONIBLE]'),
(5, 0, '[disponible]');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id` int(3) NOT NULL,
  `mesa` int(3) NOT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` timestamp NOT NULL DEFAULT current_timestamp(),
  `metodo_pago` int(20) NOT NULL,
  `total` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pagos`
--

INSERT INTO `pagos` (`id`, `mesa`, `fecha_inicio`, `fecha_fin`, `metodo_pago`, `total`) VALUES
(1, 1, '2025-05-02 18:03:00', '2025-05-03 04:16:40', 1, 10500),
(2, 2, '2025-05-02 18:19:46', '2025-05-03 04:19:55', 1, 7000),
(3, 2, '2025-05-02 18:22:11', '2025-05-07 01:02:09', 1, 70500),
(4, 1, '2025-05-24 20:39:52', '2025-05-25 01:40:01', 1, 480000),
(5, 2, '2025-05-24 20:40:07', '2025-05-25 01:40:19', 2, 90000),
(6, 3, '2025-05-24 20:40:24', '2025-05-25 01:40:32', 1, 45000),
(7, 2, '2025-05-24 23:41:45', '2025-05-25 04:41:54', 1, 90000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `tipo` int(3) NOT NULL,
  `cantidad` int(4) NOT NULL,
  `proveedor` int(11) NOT NULL,
  `precio` int(20) NOT NULL,
  `Costo` int(11) NOT NULL,
  `dir` varchar(500) DEFAULT NULL,
  `minimo_cant` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`id`, `nombre`, `tipo`, `cantidad`, `proveedor`, `precio`, `Costo`, `dir`, `minimo_cant`) VALUES
(54, 'Smirnoff Tamarindo *750', 5, 6, 13135465, 120000, 500000, '/productos/1747678048272-smirnoff tamarindo.webp', 2),
(58, 'Club Roja Botella', 3, 30, 13135465, 4500, 85000, '/productos/1748027461138-club roja.png', 10),
(59, 'Stella Artois Lata', 3, 9, 13135465, 6000, 84000, '/productos/1748028585796-CERVEZA-STELLA-ARTOIS-LATA-.webp', 10),
(60, 'CLUB DORADA BOTELLA', 3, 10, 13135465, 4500, 85000, '/productos/1748028713139-club dorada.png', 10),
(61, 'Corona botella', 3, 20, 13135465, 4500, 105000, '/productos/1748030030900-84257633-corona-extra.webp', 10);

--
-- Disparadores `producto`
--
DELIMITER $$
CREATE TRIGGER `nuevo_egreso` AFTER INSERT ON `producto` FOR EACH ROW BEGIN
    DECLARE nombre_producto VARCHAR(100);
    DECLARE costo_producto INT(20);
    
    -- Obtener nombre y costo en una sola consulta
    SELECT nombre, costo INTO nombre_producto, costo_producto
    FROM producto 
    WHERE id = NEW.id;
    
    -- Insertar en egresos
    INSERT INTO egresos (nombre, tipo, costo) 
    VALUES (nombre_producto, 1, costo_producto);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto_add`
--

CREATE TABLE `producto_add` (
  `id` int(3) NOT NULL,
  `cantidad` int(4) NOT NULL,
  `proveedor` varchar(11) NOT NULL,
  `Costo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto_add`
--

INSERT INTO `producto_add` (`id`, `cantidad`, `proveedor`, `Costo`) VALUES
(0, 10, '13135465', 0),
(22, 20, '13135465', 0),
(23, 10, '13135465', 0),
(26, 20, '13135465', 0),
(41, 10, '1031648129', 0),
(42, 30, '13135465', 65000);

--
-- Disparadores `producto_add`
--
DELIMITER $$
CREATE TRIGGER `add_cant` AFTER INSERT ON `producto_add` FOR EACH ROW begin
DECLARE cant_p int;
SELECT cantidad into cant_p
FROM producto
where id = new.id;
if cant_p is not null THEN
UPDATE producto
SET cantidad =cant_p + new.cantidad
WHERE id= new.id;
end if;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `nuevo_egreso_add` AFTER INSERT ON `producto_add` FOR EACH ROW BEGIN
    DECLARE nombre_producto VARCHAR(100);
    DECLARE costo_producto INT(20);

    -- Obtener el nombre del producto desde la tabla producto
    SELECT nombre INTO nombre_producto
    FROM producto
    WHERE id = NEW.id;

    -- Insertar en egresos con el nombre obtenido
    INSERT INTO egresos (nombre, tipo, costo)
    VALUES (nombre_producto, 1, NEW.costo);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor`
--

CREATE TABLE `proveedor` (
  `NID` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `celular` int(10) NOT NULL,
  `correo` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedor`
--

INSERT INTO `proveedor` (`NID`, `nombre`, `celular`, `correo`) VALUES
(13135465, 'wilson', 312200056, 'dasd@gmail.com'),
(1031648129, 'JULIAN', 300474250, 'julisrojas@gmail.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas`
--

CREATE TABLE `reservas` (
  `Id_re` int(11) NOT NULL,
  `fecha_hora` date NOT NULL,
  `hora` time NOT NULL,
  `NID` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `correo` varchar(200) NOT NULL,
  `celular` int(12) NOT NULL,
  `tipo_re` int(2) NOT NULL,
  `cantidad_p` int(3) NOT NULL,
  `mesa_asig` int(2) NOT NULL,
  `obser` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reservas`
--

INSERT INTO `reservas` (`Id_re`, `fecha_hora`, `hora`, `NID`, `nombre`, `correo`, `celular`, `tipo_re`, `cantidad_p`, `mesa_asig`, `obser`) VALUES
(17, '2025-05-24', '20:10:00', 1031648129, 'julian r', 'ASDASD@GMAIL.COM', 2147483647, 1, 10, 5, 'NINGUNA');

--
-- Disparadores `reservas`
--
DELIMITER $$
CREATE TRIGGER `mesa_es` AFTER INSERT ON `reservas` FOR EACH ROW BEGIN
    DECLARE hora_actual TIMESTAMP;
    DECLARE hora_reserva TIMESTAMP;
    DECLARE mesa_existente INT;

    -- Obtener la hora actual y la hora de la reserva
    SET hora_actual = NOW();  -- Hora actual
    SET hora_reserva = NEW.fecha_hora;  -- Hora de la reserva

    -- Eliminar los segundos de ambas horas para la comparación
    SET hora_actual = DATE_FORMAT(hora_actual, '%Y-%m-%d %H:%i:00');
    SET hora_reserva = DATE_FORMAT(hora_reserva, '%Y-%m-%d %H:%i:00');

    -- Verificar si la mesa asignada existe
    SELECT COUNT(*)     INTO mesa_existente
    FROM mesa
    WHERE `ID` = NEW.mesa_asig;

    -- Si la hora actual y la hora de la reserva coinciden (sin segundos) y la mesa existe, actualizar el estado a 'Reservado'
    IF hora_actual = hora_reserva AND mesa_existente > 0 THEN
        UPDATE mesa
        SET estado = 'Reservado'
        WHERE `ID` = NEW.mesa_asig;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_egreso`
--

CREATE TABLE `tipo_egreso` (
  `id` int(4) NOT NULL,
  `nombre` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipo_egreso`
--

INSERT INTO `tipo_egreso` (`id`, `nombre`) VALUES
(1, 'Productos'),
(2, 'Servicios'),
(3, 'Impuestos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_pago`
--

CREATE TABLE `tipo_pago` (
  `id` int(3) NOT NULL,
  `nombre` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipo_pago`
--

INSERT INTO `tipo_pago` (`id`, `nombre`) VALUES
(1, 'efectivo'),
(2, 'Nequi'),
(3, 'Daviplata'),
(4, 'Tarjeta');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_pr`
--

CREATE TABLE `tipo_pr` (
  `id` int(3) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipo_pr`
--

INSERT INTO `tipo_pr` (`id`, `nombre`) VALUES
(3, 'cerveza'),
(5, 'Licor'),
(6, 'OTROS'),
(7, 'cOCTELES');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_re`
--

CREATE TABLE `tipo_re` (
  `tipo` int(2) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipo_re`
--

INSERT INTO `tipo_re` (`tipo`, `nombre`) VALUES
(1, 'cumpleaños');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas_res`
--

CREATE TABLE `ventas_res` (
  `id` int(3) NOT NULL,
  `id_orden` int(3) NOT NULL,
  `hora` datetime NOT NULL,
  `mesa` int(3) NOT NULL,
  `id_prod` int(3) NOT NULL,
  `producto` varchar(100) NOT NULL,
  `precio_u` int(20) NOT NULL,
  `cantidad` int(3) NOT NULL,
  `total_p` int(30) NOT NULL,
  `pago` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ventas_res`
--

INSERT INTO `ventas_res` (`id`, `id_orden`, `hora`, `mesa`, `id_prod`, `producto`, `precio_u`, `cantidad`, `total_p`, `pago`) VALUES
(7, 22, '2025-05-24 20:39:52', 1, 54, 'Smirnoff Tam', 120000, 2, 240000, 1),
(8, 23, '2025-05-24 20:39:56', 1, 54, 'Smirnoff Tam', 120000, 2, 240000, 1),
(9, 24, '2025-05-24 20:40:07', 2, 60, 'CLUB DORADA ', 4500, 10, 45000, 2),
(10, 25, '2025-05-24 20:40:10', 2, 60, 'CLUB DORADA ', 4500, 10, 45000, 2),
(11, 26, '2025-05-24 20:40:24', 3, 61, 'Corona botel', 4500, 10, 45000, 1),
(12, 27, '2025-05-24 23:41:45', 2, 59, 'Stella Artoi', 6000, 15, 90000, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cargo`
--
ALTER TABLE `cargo`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `detalles_p`
--
ALTER TABLE `detalles_p`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mesa` (`mesa_id`),
  ADD KEY `producto_id` (`id_prod`) USING BTREE;

--
-- Indices de la tabla `egresos`
--
ALTER TABLE `egresos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tipo` (`tipo`);

--
-- Indices de la tabla `empleado`
--
ALTER TABLE `empleado`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `cargo` (`cargo`);

--
-- Indices de la tabla `mesa`
--
ALTER TABLE `mesa`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `nmesa` (`NumeroMesa`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `metodo_pago` (`metodo_pago`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tipo` (`tipo`),
  ADD KEY `proveedor` (`proveedor`);

--
-- Indices de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  ADD PRIMARY KEY (`NID`);

--
-- Indices de la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`Id_re`),
  ADD KEY `tipo_re` (`tipo_re`);

--
-- Indices de la tabla `tipo_egreso`
--
ALTER TABLE `tipo_egreso`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tipo_pago`
--
ALTER TABLE `tipo_pago`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tipo_pr`
--
ALTER TABLE `tipo_pr`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tipo_re`
--
ALTER TABLE `tipo_re`
  ADD PRIMARY KEY (`tipo`);

--
-- Indices de la tabla `ventas_res`
--
ALTER TABLE `ventas_res`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pago` (`pago`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cargo`
--
ALTER TABLE `cargo`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `detalles_p`
--
ALTER TABLE `detalles_p`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de la tabla `egresos`
--
ALTER TABLE `egresos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `mesa`
--
ALTER TABLE `mesa`
  MODIFY `ID` int(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT de la tabla `reservas`
--
ALTER TABLE `reservas`
  MODIFY `Id_re` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `tipo_egreso`
--
ALTER TABLE `tipo_egreso`
  MODIFY `id` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tipo_pago`
--
ALTER TABLE `tipo_pago`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `tipo_pr`
--
ALTER TABLE `tipo_pr`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `tipo_re`
--
ALTER TABLE `tipo_re`
  MODIFY `tipo` int(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `ventas_res`
--
ALTER TABLE `ventas_res`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalles_p`
--
ALTER TABLE `detalles_p`
  ADD CONSTRAINT `detalles_p_ibfk_2` FOREIGN KEY (`id_prod`) REFERENCES `producto` (`id`),
  ADD CONSTRAINT `mesa` FOREIGN KEY (`mesa_id`) REFERENCES `mesa` (`ID`);

--
-- Filtros para la tabla `egresos`
--
ALTER TABLE `egresos`
  ADD CONSTRAINT `tipo` FOREIGN KEY (`tipo`) REFERENCES `tipo_egreso` (`id`);

--
-- Filtros para la tabla `empleado`
--
ALTER TABLE `empleado`
  ADD CONSTRAINT `empleado_ibfk_1` FOREIGN KEY (`cargo`) REFERENCES `cargo` (`id`),
  ADD CONSTRAINT `empleado_ibfk_2` FOREIGN KEY (`cargo`) REFERENCES `cargo` (`id`);

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `metodo_pago` FOREIGN KEY (`metodo_pago`) REFERENCES `tipo_pago` (`id`);

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`tipo`) REFERENCES `tipo_pr` (`id`),
  ADD CONSTRAINT `producto_ibfk_2` FOREIGN KEY (`proveedor`) REFERENCES `proveedor` (`NID`);

--
-- Filtros para la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD CONSTRAINT `reservas_ibfk_2` FOREIGN KEY (`tipo_re`) REFERENCES `tipo_re` (`tipo`);

--
-- Filtros para la tabla `ventas_res`
--
ALTER TABLE `ventas_res`
  ADD CONSTRAINT `pago` FOREIGN KEY (`pago`) REFERENCES `tipo_pago` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
