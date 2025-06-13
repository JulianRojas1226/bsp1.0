-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-06-2025 a las 05:05:26
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
  `total_p` int(30) NOT NULL,
  `empleado` varchar(60) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Disparadores `detalles_p`
--
DELIMITER $$
CREATE TRIGGER `actualizar_estado_mesa` AFTER INSERT ON `detalles_p` FOR EACH ROW BEGIN
    UPDATE mesa
    SET estado = 'ocupada'
    WHERE id = NEW.mesa_id;
END
$$
DELIMITER ;
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
CREATE TRIGGER `liberar_mesa` BEFORE DELETE ON `detalles_p` FOR EACH ROW BEGIN
    UPDATE mesa
    SET estado = 'disponible'
    WHERE id = OLD.mesa_id;
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
  `costo` int(20) NOT NULL,
  `empleado` varchar(60) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `egresos`
--

INSERT INTO `egresos` (`id`, `hora`, `nombre`, `tipo`, `costo`, `empleado`) VALUES
(12, '2025-06-10 02:00:07', 'POKER BOTELLA', 1, 70000, 'julian'),
(13, '2025-06-12 21:34:56', 'Corona botella', 1, 102000, 'julian'),
(15, '2025-06-12 21:58:38', 'POKER BOTELLA', 1, 70000, 'julian'),
(16, '2025-06-13 00:12:40', 'BUDWEISER LATA', 1, 58320, 'julian');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleado`
--

CREATE TABLE `empleado` (
  `nombre` varchar(60) NOT NULL,
  `codigo` varchar(300) NOT NULL,
  `correo` varchar(60) NOT NULL,
  `cargo` int(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empleado`
--

INSERT INTO `empleado` (`nombre`, `codigo`, `correo`, `cargo`) VALUES
('Administrador', '$2b$10$avTosT2BMjSqZaadO6efYeSIMxNP7xUgMRoh6aMMKJ7Zymw44fBDq', 'julisrojas26@gmail.com', 1),
('esteban', '$2b$10$6iI8FIQVkpLmZuvxCc3nl.aEpA12m/gnuhI7RwNrQfpyAmm90ftF2', 'julianrojasc1226@gmail.com', 1),
('julian', '$2b$10$nydUkpmTg6krzvv1GkrmSuWAClw7g.iyMD9pr.vKu4WdeVnucGXhy', 'julsdad@gmail.com', 1);

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
(1, 1, 'disponible'),
(2, 2, 'disponible'),
(3, 3, 'disponible'),
(4, 4, 'disponible'),
(5, 5, 'disponible');

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
(23, 1, '2025-06-09 21:16:49', '2025-06-10 02:16:53', 1, 35000),
(25, 1, '2025-06-09 22:13:16', '2025-06-10 03:15:51', 1, 35000),
(26, 1, '2025-06-10 15:32:20', '2025-06-10 20:32:30', 1, 35000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id` int(11) NOT NULL,
  `hora` timestamp NOT NULL DEFAULT current_timestamp(),
  `nombre` varchar(100) NOT NULL,
  `tipo` int(3) NOT NULL,
  `cantidad` int(4) NOT NULL,
  `proveedor` int(11) NOT NULL,
  `precio` int(20) NOT NULL,
  `Costo` int(11) NOT NULL,
  `dir` varchar(500) DEFAULT NULL,
  `minimo_cant` int(3) NOT NULL,
  `empleado` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`id`, `hora`, `nombre`, `tipo`, `cantidad`, `proveedor`, `precio`, `Costo`, `dir`, `minimo_cant`, `empleado`) VALUES
(67, '2025-06-10 01:39:55', 'POKER BOTELLA', 3, 30, 13135465, 3500, 65000, '/productos/1749519595554-Cerveza Poker botella 330 ml.png', 10, 'julian'),
(74, '2025-06-12 21:34:56', 'Corona botella', 3, 30, 13135465, 5000, 102000, '/productos/1749764096366-84257633-corona-extra.webp', 10, 'julian'),
(75, '2025-06-13 00:12:40', 'BUDWEISER LATA', 3, 24, 13135465, 3500, 58320, '/productos/1749773560589-BUD.webp', 10, 'julian');

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
    INSERT INTO egresos (nombre, tipo, costo,empleado) 
    VALUES (nombre_producto, 1, costo_producto,new.empleado);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto_add`
--

CREATE TABLE `producto_add` (
  `id` int(10) NOT NULL,
  `id_prod` int(11) NOT NULL,
  `cantidad` int(4) NOT NULL,
  `Proveedor` int(11) NOT NULL,
  `hora` timestamp NOT NULL DEFAULT current_timestamp(),
  `costo` int(20) NOT NULL,
  `empleado` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto_add`
--

INSERT INTO `producto_add` (`id`, `id_prod`, `cantidad`, `Proveedor`, `hora`, `costo`, `empleado`) VALUES
(4, 67, 30, 13135465, '2025-06-12 21:58:38', 70000, 'julian');

--
-- Disparadores `producto_add`
--
DELIMITER $$
CREATE TRIGGER `add_cant` AFTER INSERT ON `producto_add` FOR EACH ROW BEGIN
    DECLARE cant_p INT;
    
    -- Obtener cantidad actual del producto usando NEW.id_prod
    SELECT cantidad INTO cant_p 
    FROM producto 
    WHERE id = NEW.id_prod;  -- Corregido aquí
    
    -- Si el producto existe, actualizar la cantidad
    IF cant_p IS NOT NULL THEN
        UPDATE producto 
        SET cantidad = cant_p + NEW.cantidad  
        WHERE id = NEW.id_prod;  -- Corregido aquí
    END IF;
    
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `egreso` AFTER INSERT ON `producto_add` FOR EACH ROW BEGIN
    DECLARE nombre_producto VARCHAR(100);
    DECLARE costo_producto INT(20);
    DECLARE producto_existe INT DEFAULT 0;
    
    -- Verificar que el producto existe y obtener el nombre
    SELECT COUNT(*), COALESCE(nombre, 'Producto no encontrado') 
    INTO producto_existe, nombre_producto
    FROM producto 
    WHERE id = NEW.id_prod;
    
    -- Solo insertar si el producto existe
    IF producto_existe > 0 THEN
        INSERT INTO egresos (nombre, tipo, costo, empleado)
        VALUES (nombre_producto, 1, NEW.costo, NEW.empleado);  -- NEW.empleado
    END IF;
    
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
  `obser` text NOT NULL,
  `estado` varchar(50) NOT NULL DEFAULT 'Reservada'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reservas`
--

INSERT INTO `reservas` (`Id_re`, `fecha_hora`, `hora`, `NID`, `nombre`, `correo`, `celular`, `tipo_re`, `cantidad_p`, `mesa_asig`, `obser`, `estado`) VALUES
(17, '2025-05-24', '20:10:00', 1031648129, 'julian r', 'ASDASD@GMAIL.COM', 2147483647, 1, 10, 5, 'NINGUNA', 'Reservada');

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
  `id_orden` int(11) NOT NULL,
  `empleado` varchar(60) DEFAULT NULL,
  `hora` datetime NOT NULL,
  `mesa` int(3) NOT NULL,
  `id_prod` int(3) NOT NULL,
  `producto` varchar(100) NOT NULL,
  `tipo` int(11) DEFAULT NULL,
  `precio_u` int(20) NOT NULL,
  `cantidad` int(3) NOT NULL,
  `total_p` int(30) NOT NULL,
  `pago` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ventas_res`
--

INSERT INTO `ventas_res` (`id`, `id_orden`, `empleado`, `hora`, `mesa`, `id_prod`, `producto`, `tipo`, `precio_u`, `cantidad`, `total_p`, `pago`) VALUES
(38, 65, 'julian', '2025-06-09 21:16:49', 1, 67, 'POKER BOTELL', 3, 3500, 10, 35000, 1),
(39, 66, 'julian', '2025-06-09 22:13:16', 1, 67, 'POKER BOTELL', 3, 3500, 10, 35000, 1),
(40, 67, 'julian', '2025-06-10 15:32:20', 1, 67, 'POKER BOTELL', 3, 3500, 10, 35000, 1);

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
  ADD KEY `producto_id` (`id_prod`) USING BTREE,
  ADD KEY `empleado` (`empleado`);

--
-- Indices de la tabla `egresos`
--
ALTER TABLE `egresos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tipo` (`tipo`),
  ADD KEY `empleado` (`empleado`);

--
-- Indices de la tabla `empleado`
--
ALTER TABLE `empleado`
  ADD PRIMARY KEY (`nombre`),
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
-- Indices de la tabla `producto_add`
--
ALTER TABLE `producto_add`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_prod` (`id_prod`),
  ADD KEY `empleado` (`empleado`);

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
  ADD KEY `tipo_re` (`tipo_re`),
  ADD KEY `mesa_asig` (`mesa_asig`);

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
  ADD KEY `pago` (`pago`),
  ADD KEY `empleado` (`empleado`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT de la tabla `egresos`
--
ALTER TABLE `egresos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `mesa`
--
ALTER TABLE `mesa`
  MODIFY `ID` int(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT de la tabla `producto_add`
--
ALTER TABLE `producto_add`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
  MODIFY `id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalles_p`
--
ALTER TABLE `detalles_p`
  ADD CONSTRAINT `detalles_p_ibfk_2` FOREIGN KEY (`id_prod`) REFERENCES `producto` (`id`),
  ADD CONSTRAINT `detalles_p_ibfk_3` FOREIGN KEY (`empleado`) REFERENCES `empleado` (`nombre`),
  ADD CONSTRAINT `mesa` FOREIGN KEY (`mesa_id`) REFERENCES `mesa` (`ID`);

--
-- Filtros para la tabla `egresos`
--
ALTER TABLE `egresos`
  ADD CONSTRAINT `egresos_ibfk_1` FOREIGN KEY (`empleado`) REFERENCES `empleado` (`nombre`),
  ADD CONSTRAINT `tipo` FOREIGN KEY (`tipo`) REFERENCES `tipo_egreso` (`id`);

--
-- Filtros para la tabla `empleado`
--
ALTER TABLE `empleado`
  ADD CONSTRAINT `empleado_ibfk_1` FOREIGN KEY (`cargo`) REFERENCES `cargo` (`id`);

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
-- Filtros para la tabla `producto_add`
--
ALTER TABLE `producto_add`
  ADD CONSTRAINT `producto_add_ibfk_1` FOREIGN KEY (`id_prod`) REFERENCES `producto` (`id`),
  ADD CONSTRAINT `producto_add_ibfk_2` FOREIGN KEY (`empleado`) REFERENCES `empleado` (`nombre`);

--
-- Filtros para la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD CONSTRAINT `reservas_ibfk_2` FOREIGN KEY (`tipo_re`) REFERENCES `tipo_re` (`tipo`),
  ADD CONSTRAINT `reservas_ibfk_3` FOREIGN KEY (`mesa_asig`) REFERENCES `mesa` (`ID`);

--
-- Filtros para la tabla `ventas_res`
--
ALTER TABLE `ventas_res`
  ADD CONSTRAINT `fk_ventas_empleado` FOREIGN KEY (`empleado`) REFERENCES `empleado` (`nombre`),
  ADD CONSTRAINT `pago` FOREIGN KEY (`pago`) REFERENCES `tipo_pago` (`id`),
  ADD CONSTRAINT `ventas_res_ibfk_1` FOREIGN KEY (`tipo`) REFERENCES `tipo_pr` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
