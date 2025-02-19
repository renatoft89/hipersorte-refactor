-- MySQL dump 10.13  Distrib 9.2.0, for Linux (x86_64)
--
-- Host: localhost    Database: loto_results
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Bet`
--

DROP TABLE IF EXISTS `Bet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Bet` (
  `id` int NOT NULL AUTO_INCREMENT,
  `game_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `numbers` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Bet_user_id_fkey` (`user_id`),
  CONSTRAINT `Bet_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Bet`
--

LOCK TABLES `Bet` WRITE;
/*!40000 ALTER TABLE `Bet` DISABLE KEYS */;
INSERT INTO `Bet` VALUES (3,'lotofacil','[\"Desconhecido\"]','2025-02-18 21:58:36.000','2025-02-19 00:21:48.499',1),(4,'mega','[\"2830\",\"01\",\"28\",\"34\",\"36\",\"51\",\"52\"]','2025-02-18 21:58:54.541','2025-02-19 00:18:43.265',1),(5,'quina','[\"6660\",\"05\",\"15\",\"21\",\"35\",\"43\"]','2025-02-18 22:06:06.070','2025-02-18 22:06:06.070',1);
/*!40000 ALTER TABLE `Bet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Users_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'João Silva','joao.silva@example.com','senha_secreta','usuario','2025-02-18 21:58:16.000','2025-02-18 21:58:16.000'),(2,'Renato Alves','renato.alves@gmail.com','$2a$08$uFwZtmm2nfJqwgjeFaGGYOxq9DSq2pjNuHQj2OwT44yOEq1GCEy7i','admin','2025-02-18 22:34:54.697','2025-02-19 00:17:48.422'),(4,'Renato Alves','renatoft89@gmail.com','$2a$08$d0FUp2sGyAPbQ8yo1YDS/OesRAEFKreDXN6.P/fAXbiBL0xnQ2ROa','user','2025-02-18 22:43:20.410','2025-02-18 22:43:20.410'),(5,'Teste1','teste1.gmail@gmail.com','$2a$08$h6Ffmbcu/fw2IDowX7pU6OHIp7C8avgLV.uppAsE5ZKHB.BFtLegW','user','2025-02-18 22:43:59.221','2025-02-18 22:43:59.221'),(6,'Teste2','teste2.gmail@gmail.com','$2a$08$iG7UkHYTqQDO9BqF4/0K1OAp.ntQcJCtmHmDn2XeKKYufy3VO9/cC','user','2025-02-18 22:46:26.098','2025-02-18 22:46:26.098'),(7,'TESTE444','teste444.silva@email.com','$2a$08$mLPmEcLWwYnAudxiqzj/peE0yiGkVPPRh47XI4kSTM3iILn3U0iu2','admin','2025-02-18 22:46:44.517','2025-02-18 22:46:44.517'),(8,'Teste3','teste3.gmail@gmail.com','$2a$08$Zoui4iH6GysmXsq4KLZ4/OIhhnj9BiqEf4Wykb5PfaWHjc623dbym','user','2025-02-18 22:50:48.952','2025-02-18 22:50:48.952'),(9,'Teste4','teste4.gmail@gmail.com','$2a$08$gGM2Qqm2o3tDTVLX8ZV2FeH/raAPsWaFpF9yKs2qMd3Hys7f9YnWS','user','2025-02-18 22:53:11.910','2025-02-18 22:53:11.910'),(10,'Teste5','teste5.gmail@gmail.com','$2a$08$MMTCx7fjhDQvfatI9FWBoeFHSghOFRGH09htgZD.qq/eXh1hQTaSO','user','2025-02-18 23:37:11.219','2025-02-18 23:37:11.219'),(11,'Teste6','teste6.gmail@gmail.com','$2a$08$Mxy8oeGd7fKdxP0h9Ml0AO7w2BBFIq9UH33T.EuhLpu1QOmouow3i','user','2025-02-18 23:39:01.053','2025-02-18 23:39:01.053'),(12,'Teste7','teste7.gmail@gmail.com','$2a$08$QsntCUELITwfp6WiBHcmkO.XiTfKVlanyzosWduna1A6DXdHnp7zq','user','2025-02-18 23:42:00.015','2025-02-18 23:42:00.015'),(13,'Teste8','teste8.gmail@gmail.com','$2a$08$vRB8TomNs4OowPh7xHH8aO.IVSpYEeU7xqUm.iG0LXZ.Jv18duPG.','user','2025-02-18 23:42:36.824','2025-02-18 23:42:36.824'),(14,'Teste9','teste9.gmail@gmail.com','$2a$08$RozU.ZuEU1DZzIMOm03XbeiyNjWWhKYozg3ZF0IjLOh0VxxjouND2','user','2025-02-18 23:45:52.376','2025-02-18 23:45:52.376'),(15,'Teste10','teste12.gmail@gmail.com','$2a$08$eG0i0Cbc3.9giWzTY58rKuJnlb47Hlqwa/1.pF51fBP2n0gFujwhG','user','2025-02-18 23:47:32.396','2025-02-18 23:47:32.396'),(16,'Teste23','teste23.gmail@gmail.com','$2a$08$6ECOBfGMHXHhK4bLdImwI.15ZhZ.mS6ggcLyjVrLN937vbNJ2.gNm','user','2025-02-18 23:52:15.993','2025-02-18 23:52:15.993'),(17,'Teste25','teste25.gmail@gmail.com','$2a$08$az4ym9sCG6kIWMWrQZZaLeDlkgS3W02SPVd2BRbSUTQvrFgUD73Yy','user','2025-02-18 23:53:16.737','2025-02-18 23:53:16.737'),(18,'Teste42','teste42.gmail@gmail.com','$2a$08$g1Dr1xjDpD3MZFKeThWr2eJhxKPvKu/wqua/uZjL92hH3H/sR4pX6','user','2025-02-18 23:56:34.891','2025-02-18 23:56:34.891'),(19,'Teste255','teste255.gmail@gmail.com','$2a$08$lsETkp/ZqbQldCjaYa03ZuwG6j0XLfX7ZUhvQdaLyDPyxhvrYPlHq','user','2025-02-18 23:57:20.659','2025-02-18 23:57:20.659');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('7faa1035-4cfa-48d7-a74d-2de293e67ca2','d12d34d8da708347ae36464b1ce39fc858dcb387a4517123c360afec4cb973e7','2025-02-18 19:57:43.784','20250212223258_update_contest_table',NULL,NULL,'2025-02-18 19:57:43.677',1),('a1be8ca1-5ebc-47c0-94c0-b2851c55347e','100f3c9b977c594874622753886fc592009ca9c38785258a0c8d4c18088ae0b2','2025-02-18 19:57:43.671','20250212223046_create_contest_table',NULL,NULL,'2025-02-18 19:57:43.622',1),('f7252a9e-ecd3-48ea-82ed-cd4a7430d650','ddd76a280b3e36f8772ce9b4459f302e2634c9a1d7e60d467b2db3d3c77ed9c7','2025-02-18 19:57:43.614','20240228145241_first',NULL,NULL,'2025-02-18 19:57:43.437',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contests`
--

DROP TABLE IF EXISTS `contests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contests` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `game_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `currentContest` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `contests_currentContest_key` (`currentContest`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contests`
--

LOCK TABLES `contests` WRITE;
/*!40000 ALTER TABLE `contests` DISABLE KEYS */;
/*!40000 ALTER TABLE `contests` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-19  0:28:36
