-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 14-03-2025 a las 13:09:34
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
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `NID` int(11) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `telefono` int(10) NOT NULL,
  `correo` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`NID`, `Nombre`, `telefono`, `correo`) VALUES
(151520515, 'julian', 2147483647, 'asdjlas@gmail.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalles_p`
--

CREATE TABLE `detalles_p` (
  `id` int(11) NOT NULL,
  `orden` int(14) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `producto` varchar(12) NOT NULL,
  `precio_u` int(20) NOT NULL,
  `cantidad` int(3) NOT NULL,
  `total_p` int(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Disparadores `detalles_p`
--
DELIMITER $$
CREATE TRIGGER `d_cant` AFTER INSERT ON `detalles_p` FOR EACH ROW begin
DECLARE cant_p int;
SELECT cantidad into cant_p
FROM producto
where id = new.producto_id;
if cant_p is not null THEN
UPDATE producto
SET cantidad =cant_p - new.cantidad
WHERE producto_id= new.producto_id;
end if;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `monto_total` BEFORE INSERT ON `detalles_p` FOR EACH ROW begin
declare precio_u int;
SELECT precio into precio_u
from producto
where id =new.producto_id;
SET new.total_p =new.cantidad *precio_u;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `precio_u` BEFORE INSERT ON `detalles_p` FOR EACH ROW begin
declare precio_u int;
select precio into precio_u
from producto
where id = new.producto_id;
set new.precio_u = precio_u;
END
$$
DELIMITER ;

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mesa`
--

CREATE TABLE `mesa` (
  `N°` int(2) NOT NULL,
  `estado` varchar(50) NOT NULL DEFAULT 'disponible'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mesa`
--

INSERT INTO `mesa` (`N°`, `estado`) VALUES
(1, 'Reservado'),
(2, 'Reservado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orden`
--

CREATE TABLE `orden` (
  `id` int(14) NOT NULL,
  `mesa` int(2) NOT NULL,
  `emp` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id` int(11) NOT NULL,
  `nombre` varchar(12) NOT NULL,
  `tipo` int(3) NOT NULL,
  `cantidad` int(4) NOT NULL,
  `proveedor` int(11) NOT NULL,
  `precio` int(20) NOT NULL,
  `dir` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`id`, `nombre`, `tipo`, `cantidad`, `proveedor`, `precio`, `dir`) VALUES
(3, 'aguila', 3, 50, 13135465, 3500, '../productos/aguila.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto_add`
--

CREATE TABLE `producto_add` (
  `id` int(3) NOT NULL,
  `nombre` varchar(12) NOT NULL,
  `cantidad` int(4) NOT NULL,
  `proveedor` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto_add`
--

INSERT INTO `producto_add` (`id`, `nombre`, `cantidad`, `proveedor`) VALUES
(0, '', 30, '0'),
(0, '', 30, '0'),
(0, '', 30, '0'),
(0, '', 30, '0'),
(1, '', 30, '13135465'),
(3, '', 10, '13135465'),
(0, '', 30, '0'),
(0, '', 30, '0'),
(0, '', 30, '0'),
(0, '', 30, '0'),
(1, '', 30, '13135465'),
(3, '', 10, '13135465');

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor`
--

CREATE TABLE `proveedor` (
  `NID` int(11) NOT NULL,
  `nombre` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedor`
--

INSERT INTO `proveedor` (`NID`, `nombre`) VALUES
(13135465, 'wilson');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas`
--

CREATE TABLE `reservas` (
  `Id_re` int(11) NOT NULL,
  `fecha_hora` datetime NOT NULL,
  `NID` int(11) NOT NULL,
  `tipo_re` int(2) NOT NULL,
  `cantidad_p` int(3) NOT NULL,
  `mesa_asig` int(2) NOT NULL,
  `obser` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
    WHERE `N°` = NEW.mesa_asig;

    -- Si la hora actual y la hora de la reserva coinciden (sin segundos) y la mesa existe, actualizar el estado a 'Reservado'
    IF hora_actual = hora_reserva AND mesa_existente > 0 THEN
        UPDATE mesa
        SET estado = 'Reservado'
        WHERE `N°` = NEW.mesa_asig;
    END IF;
END
$$
DELIMITER ;

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

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cargo`
--
ALTER TABLE `cargo`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`NID`);

--
-- Indices de la tabla `detalles_p`
--
ALTER TABLE `detalles_p`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orden` (`orden`),
  ADD KEY `producto_id` (`producto_id`);

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
  ADD PRIMARY KEY (`N°`);

--
-- Indices de la tabla `orden`
--
ALTER TABLE `orden`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mesa` (`mesa`),
  ADD KEY `orden_ibfk_2` (`emp`);

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
  ADD KEY `NID` (`NID`),
  ADD KEY `tipo_re` (`tipo_re`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `mesa`
--
ALTER TABLE `mesa`
  MODIFY `N°` int(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `orden`
--
ALTER TABLE `orden`
  MODIFY `id` int(14) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `reservas`
--
ALTER TABLE `reservas`
  MODIFY `Id_re` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

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
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalles_p`
--
ALTER TABLE `detalles_p`
  ADD CONSTRAINT `detalles_p_ibfk_1` FOREIGN KEY (`orden`) REFERENCES `orden` (`id`),
  ADD CONSTRAINT `detalles_p_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`id`);

--
-- Filtros para la tabla `empleado`
--
ALTER TABLE `empleado`
  ADD CONSTRAINT `empleado_ibfk_1` FOREIGN KEY (`cargo`) REFERENCES `cargo` (`id`),
  ADD CONSTRAINT `empleado_ibfk_2` FOREIGN KEY (`cargo`) REFERENCES `cargo` (`id`);

--
-- Filtros para la tabla `orden`
--
ALTER TABLE `orden`
  ADD CONSTRAINT `orden_ibfk_1` FOREIGN KEY (`mesa`) REFERENCES `mesa` (`N°`),
  ADD CONSTRAINT `orden_ibfk_2` FOREIGN KEY (`emp`) REFERENCES `empleado` (`codigo`);

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
  ADD CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`NID`) REFERENCES `cliente` (`NID`),
  ADD CONSTRAINT `reservas_ibfk_2` FOREIGN KEY (`tipo_re`) REFERENCES `tipo_re` (`tipo`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
