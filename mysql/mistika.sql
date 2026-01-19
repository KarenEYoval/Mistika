-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: mistika
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text,
  `precio` decimal(10,2) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `categoria` varchar(50) NOT NULL DEFAULT 'General',
  `stock` int NOT NULL DEFAULT '0',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,'Cera de soya (alto punto de fusión)','Cera para velas. Alto punto de fusión.',115.00,'/images/products/Parafina.jpeg','cera-de-soya-alto-punto-de-fusion','Ceras',0,1,'2026-01-18 19:44:31','2026-01-18 20:31:03'),(2,'Cera de Malasia','Cera para velas.',95.00,'/images/products/Malasia.jpeg','cera-de-malasia','Ceras',0,1,'2026-01-18 19:44:31','2026-01-18 20:17:47'),(3,'Parafina china premium','Parafina premium para velas.',55.00,'/images/products/ParafinaChina.jpeg','parafina-china-premium','Ceras',0,1,'2026-01-18 19:44:31','2026-01-18 20:17:47'),(4,'Tablita de incienso','Base/tablita para incienso.',25.00,'/images/products/Tabla.jpeg','tablita-de-incienso','Accesorios',0,1,'2026-01-18 19:44:31','2026-01-18 20:17:47'),(5,'Palo santo (4 palitos)','Paquete de 4 palitos de palo santo.',72.00,'/images/products/PaloSanto.jpeg','palo-santo-4-palitos','Accesorios',0,1,'2026-01-18 19:44:31','2026-01-18 20:17:47'),(6,'Veladora aromática de violetas','Veladora aromática.',50.00,'/images/products/VelaVioleta.jpeg','veladora-aromatica-de-violetas','Veladoras',0,1,'2026-01-18 19:44:31','2026-01-18 20:17:47'),(7,'Veladora aromática de rosas','Veladora aromática.',50.00,'/images/products/VelaRosas.jpeg','veladora-aromatica-de-rosas','Veladoras',0,1,'2026-01-18 19:44:31','2026-01-18 20:17:47'),(8,'Cera de soya (bajo punto de fusión)','Cera para velas. Bajo punto de fusión.',115.00,'/images/products/cera-soya-bajo.jpg','cera-de-soya-bajo-punto-de-fusion','Ceras',0,1,'2026-01-18 19:44:31','2026-01-18 19:55:57'),(9,'Veladora aromática de coco','Veladora aromática.',50.00,'/images/products/VelaCoco.jpeg','veladora-aromatica-de-coco','Veladoras',0,1,'2026-01-18 19:44:31','2026-01-18 20:17:47'),(10,'Veladora aromática de naranja-mandarina','Veladora aromática.',50.00,'/images/products/veladora-aromatica-de-naranja-mandarina.jpeg','veladora-aromatica-de-naranja-mandarina','Veladoras',0,1,'2026-01-18 19:44:31','2026-01-18 20:31:03'),(11,'Veladora aromática de canela','Veladora aromática.',50.00,'/images/products/veladora-aromatica-de-canela.jpeg','veladora-aromatica-de-canela','Veladoras',0,1,'2026-01-18 19:44:31','2026-01-18 20:31:03');
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-18 22:15:53
