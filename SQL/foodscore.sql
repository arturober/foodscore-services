-- phpMyAdmin SQL Dump
-- version 4.6.6deb4
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 23-12-2018 a las 12:50:39
-- Versión del servidor: 10.1.26-MariaDB-0+deb9u1
-- Versión de PHP: 7.0.19-1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `foodscore`
--
CREATE DATABASE IF NOT EXISTS `foodscore` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `foodscore`;

DELIMITER $$
--
-- Funciones
--
CREATE DEFINER=`root`@`localhost` FUNCTION `haversine` (`lat1` FLOAT, `lon1` FLOAT, `lat2` FLOAT, `lon2` FLOAT) RETURNS FLOAT NO SQL
    DETERMINISTIC
    COMMENT 'Returns the distance in degrees on the Earth\r\n             between two known points of latitude and longitude'
BEGIN
    RETURN DEGREES(
        	ACOS(
              COS(RADIANS(lat1)) *
              COS(RADIANS(lat2)) *
              COS(RADIANS(lon2) - RADIANS(lon1)) +
              SIN(RADIANS(lat1)) * SIN(RADIANS(lat2))
            )
    	  )*111.045;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comment`
--

CREATE TABLE `comment` (
  `id` int(10) UNSIGNED NOT NULL,
  `stars` smallint(6) NOT NULL,
  `restaurantId` int(10) UNSIGNED NOT NULL,
  `userId` int(10) UNSIGNED NOT NULL,
  `text` varchar(1000) NOT NULL,
  `date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Disparadores `comment`
--
DELIMITER $$
CREATE TRIGGER `UPDATE_REST_STARS` AFTER INSERT ON `comment` FOR EACH ROW UPDATE restaurant SET stars = (
    SELECT AVG(stars) FROM `comment` 
    WHERE `comment`.restaurantId = NEW.restaurantId
) WHERE id = NEW.restaurantId
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `restaurant`
--

CREATE TABLE `restaurant` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(2000) NOT NULL,
  `daysOpen` text NOT NULL,
  `phone` varchar(20) NOT NULL,
  `image` varchar(100) NOT NULL,
  `cuisine` text NOT NULL,
  `creatorId` int(10) UNSIGNED NOT NULL,
  `stars` decimal(4,2) NOT NULL DEFAULT '0.00',
  `lat` decimal(10,7) NOT NULL DEFAULT '0.0000000',
  `lng` decimal(10,7) NOT NULL DEFAULT '0.0000000',
  `address` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `password` varchar(150) DEFAULT NULL,
  `avatar` varchar(100) NOT NULL DEFAULT 'img/profile.jpg',
  `email` varchar(150) NOT NULL,
  `lat` decimal(10,7) NOT NULL DEFAULT '0.0000000',
  `lng` decimal(10,7) NOT NULL DEFAULT '0.0000000'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_80ac01df3ea33eb2e732f6db16` (`restaurantId`,`userId`),
  ADD KEY `FK_c0354a9a009d3bb45a08655ce3b` (`userId`);

--
-- Indices de la tabla `restaurant`
--
ALTER TABLE `restaurant`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_89043c1ad06e2e7ed9dab170e99` (`creatorId`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `comment`
--
ALTER TABLE `comment`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `restaurant`
--
ALTER TABLE `restaurant`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `FK_15f084462e057a3958531cf88fc` FOREIGN KEY (`restaurantId`) REFERENCES `restaurant` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_c0354a9a009d3bb45a08655ce3b` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `restaurant`
--
ALTER TABLE `restaurant`
  ADD CONSTRAINT `FK_89043c1ad06e2e7ed9dab170e99` FOREIGN KEY (`creatorId`) REFERENCES `user` (`id`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
