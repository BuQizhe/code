-- MySQL dump 10.13  Distrib 5.7.44, for Linux (x86_64)
--
-- Host: localhost    Database: lottery_system
-- ------------------------------------------------------
-- Server version	5.7.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activity`
--

DROP TABLE IF EXISTS `activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activity` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `gmt_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `activity_name` varchar(255) NOT NULL COMMENT '活动名称',
  `description` varchar(255) NOT NULL COMMENT '活动描述',
  `status` varchar(255) NOT NULL COMMENT '活动状态',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uk_id` (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity`
--

LOCK TABLES `activity` WRITE;
/*!40000 ALTER TABLE `activity` DISABLE KEYS */;
INSERT INTO `activity` VALUES (1,'2026-03-29 19:37:18','2026-03-29 19:37:31','测试','...','COMPLETED'),(2,'2026-03-30 10:03:55','2026-03-30 10:04:28','项目测试二','教七','COMPLETED'),(3,'2026-03-30 20:34:03','2026-03-30 20:34:28','测试三','..','COMPLETED'),(4,'2026-03-30 20:46:40','2026-03-30 20:46:53','test4','...','COMPLETED'),(5,'2026-03-31 18:59:36','2026-03-31 19:00:02','测试四','..','COMPLETED');
/*!40000 ALTER TABLE `activity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_prize`
--

DROP TABLE IF EXISTS `activity_prize`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activity_prize` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `gmt_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `activity_id` bigint(20) NOT NULL COMMENT '活动id',
  `prize_id` bigint(20) NOT NULL COMMENT '活动关联的奖品id',
  `prize_amount` bigint(20) NOT NULL DEFAULT '1' COMMENT '关联奖品的数量',
  `prize_tiers` varchar(255) NOT NULL COMMENT '奖品等级',
  `status` varchar(255) NOT NULL COMMENT '活动奖品状态',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uk_id` (`id`) USING BTREE,
  UNIQUE KEY `uk_a_p_id` (`activity_id`,`prize_id`) USING BTREE,
  KEY `idx_activity_id` (`activity_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_prize`
--

LOCK TABLES `activity_prize` WRITE;
/*!40000 ALTER TABLE `activity_prize` DISABLE KEYS */;
INSERT INTO `activity_prize` VALUES (1,'2026-03-29 19:37:18','2026-03-29 19:37:31',1,1,1,'FIRST_PRIZE','COMPLETED'),(2,'2026-03-30 10:03:55','2026-03-30 10:04:16',2,4,1,'FIRST_PRIZE','COMPLETED'),(3,'2026-03-30 10:03:55','2026-03-30 10:04:23',2,3,2,'SECOND_PRIZE','COMPLETED'),(4,'2026-03-30 10:03:55','2026-03-30 10:04:28',2,2,2,'THIRD_PRIZE','COMPLETED'),(5,'2026-03-30 20:34:03','2026-03-30 20:34:19',3,4,2,'SECOND_PRIZE','COMPLETED'),(6,'2026-03-30 20:34:03','2026-03-30 20:34:11',3,3,2,'FIRST_PRIZE','COMPLETED'),(7,'2026-03-30 20:34:03','2026-03-30 20:34:28',3,2,1,'THIRD_PRIZE','COMPLETED'),(8,'2026-03-30 20:46:40','2026-03-30 20:46:51',4,4,1,'SECOND_PRIZE','COMPLETED'),(9,'2026-03-30 20:46:40','2026-03-30 20:46:48',4,3,1,'FIRST_PRIZE','COMPLETED'),(10,'2026-03-30 20:46:40','2026-03-30 20:46:53',4,2,1,'THIRD_PRIZE','COMPLETED'),(11,'2026-03-31 18:59:36','2026-03-31 19:00:02',5,1,1,'FIRST_PRIZE','COMPLETED');
/*!40000 ALTER TABLE `activity_prize` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_user`
--

DROP TABLE IF EXISTS `activity_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activity_user` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `gmt_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `activity_id` bigint(20) NOT NULL COMMENT '活动时间',
  `user_id` bigint(20) NOT NULL COMMENT '圈选的用户id',
  `user_name` varchar(255) NOT NULL COMMENT '用户名',
  `status` varchar(255) NOT NULL COMMENT '用户状态',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uk_id` (`id`) USING BTREE,
  UNIQUE KEY `uk_a_u_id` (`activity_id`,`user_id`) USING BTREE,
  KEY `idx_activity_id` (`activity_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_user`
--

LOCK TABLES `activity_user` WRITE;
/*!40000 ALTER TABLE `activity_user` DISABLE KEYS */;
INSERT INTO `activity_user` VALUES (1,'2026-03-29 19:37:18','2026-03-29 19:37:18',1,3,'003','INIT'),(2,'2026-03-29 19:37:18','2026-03-29 19:37:31',1,2,'002','COMPLETED'),(3,'2026-03-30 10:03:55','2026-03-30 10:04:23',2,8,'张伟杰','COMPLETED'),(4,'2026-03-30 10:03:55','2026-03-30 10:04:23',2,7,'谢昊','COMPLETED'),(5,'2026-03-30 10:03:55','2026-03-30 10:04:28',2,6,'黄华金','COMPLETED'),(6,'2026-03-30 10:03:55','2026-03-30 10:04:16',2,4,'陈梓良','COMPLETED'),(7,'2026-03-30 10:03:55','2026-03-30 10:04:28',2,3,'严崇靖','COMPLETED'),(8,'2026-03-30 20:34:03','2026-03-30 20:34:28',3,8,'张伟杰','COMPLETED'),(9,'2026-03-30 20:34:03','2026-03-30 20:34:19',3,7,'谢昊','COMPLETED'),(10,'2026-03-30 20:34:03','2026-03-30 20:34:19',3,6,'黄华金','COMPLETED'),(11,'2026-03-30 20:34:03','2026-03-30 20:34:11',3,4,'陈梓良','COMPLETED'),(12,'2026-03-30 20:34:03','2026-03-30 20:34:11',3,3,'严崇靖','COMPLETED'),(13,'2026-03-30 20:46:40','2026-03-30 20:46:40',4,8,'张伟杰','INIT'),(14,'2026-03-30 20:46:40','2026-03-30 20:46:40',4,7,'谢昊','INIT'),(15,'2026-03-30 20:46:40','2026-03-30 20:46:51',4,6,'黄华金','COMPLETED'),(16,'2026-03-30 20:46:40','2026-03-30 20:46:48',4,4,'陈梓良','COMPLETED'),(17,'2026-03-30 20:46:40','2026-03-30 20:46:53',4,3,'严崇靖','COMPLETED'),(18,'2026-03-31 18:59:36','2026-03-31 19:00:02',5,8,'张伟杰','COMPLETED'),(19,'2026-03-31 18:59:36','2026-03-31 18:59:36',5,6,'黄华金','INIT');
/*!40000 ALTER TABLE `activity_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prize`
--

DROP TABLE IF EXISTS `prize`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `prize` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `gmt_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `name` varchar(255) NOT NULL COMMENT '奖品名称',
  `description` varchar(255) DEFAULT NULL COMMENT '奖品描述',
  `price` decimal(10,2) NOT NULL COMMENT '奖品价值',
  `image_url` varchar(2048) DEFAULT NULL COMMENT '奖品展示图',
  `probability` double DEFAULT '10' COMMENT '中奖概率(%)',
  `stock` int(11) DEFAULT '100' COMMENT '剩余库存',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uk_id` (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prize`
--

LOCK TABLES `prize` WRITE;
/*!40000 ALTER TABLE `prize` DISABLE KEYS */;
INSERT INTO `prize` VALUES (1,'2026-03-29 19:36:00','2026-03-31 18:59:20','001','....',9999.00,'6e90ddad-2ae3-4cdd-bf66-c72c5fdc2ecb.png',0,100),(2,'2026-03-30 09:30:23','2026-03-31 19:00:07','AirPods','三等奖',1999.00,'9c775e4d-fb47-45e0-a6c1-2d276f0e0a41.jpg',10,99),(3,'2026-03-30 09:31:06','2026-03-31 19:00:04','奔驰','二等奖',999999.00,'bc38a5cf-2787-481b-9d86-5fd6c96556ce.jpg',10,98),(4,'2026-03-30 09:31:45','2026-03-31 18:59:59','日本旅游','一等奖',99999.00,'362d0b25-97f5-4b65-bbb4-2f9dacad19be.jpg',10,99);
/*!40000 ALTER TABLE `prize` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `gmt_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `user_name` varchar(255) NOT NULL COMMENT '用户姓名',
  `email` varchar(255) NOT NULL COMMENT '邮箱',
  `phone_number` varchar(255) NOT NULL COMMENT '手机号',
  `password` varchar(255) DEFAULT NULL COMMENT '登录密码',
  `identity` varchar(255) NOT NULL COMMENT '用户身份',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uk_id` (`id`) USING BTREE,
  UNIQUE KEY `uk_email` (`email`(30)) USING BTREE,
  UNIQUE KEY `uk_phone_number` (`phone_number`(11)) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'2026-03-29 17:42:41','2026-03-30 20:59:08','林健','3849578254@qq.com','004e29b9a48618f18ef139e956b7feb6','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','ADMIN'),(3,'2026-03-30 08:44:06','2026-03-30 10:01:19','严崇靖','1422711746@qq.com','dcf6ba3b2bc6cf711fd4449a11dd2d45','55de7cd1e474af8faf368b303bafdd1fa9d299de3f656f89c48397da6953520a','NORMAL'),(4,'2026-03-30 09:42:25','2026-03-30 10:01:19','陈梓良','3070068479@qq.com','09d5d6334f503a4f48620d70d40d2945','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','NORMAL'),(6,'2026-03-30 09:45:16','2026-03-30 10:01:19','黄华金','3158244537@qq.com','42f11d07e2146ff89c2b50b81c776746','c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646','NORMAL'),(7,'2026-03-30 09:47:08','2026-03-30 10:01:19','谢昊','2083028377@qq.com','cf6162203c02f7681d352413b71c4b72','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','NORMAL'),(8,'2026-03-30 09:49:30','2026-03-30 10:01:19','张伟杰','3606679080@qq.com','fcd9b0995b278474e7d851c32df6338e','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','NORMAL');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `winning_record`
--

DROP TABLE IF EXISTS `winning_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `winning_record` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `gmt_create` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `gmt_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `activity_id` bigint(20) NOT NULL COMMENT '活动id',
  `activity_name` varchar(255) NOT NULL COMMENT '活动名称',
  `prize_id` bigint(20) NOT NULL COMMENT '奖品id',
  `prize_name` varchar(255) NOT NULL COMMENT '奖品名称',
  `prize_tier` varchar(255) NOT NULL COMMENT '奖品等级',
  `winner_id` bigint(20) NOT NULL COMMENT '中奖人id',
  `winner_name` varchar(255) NOT NULL COMMENT '中奖人姓名',
  `winner_email` varchar(255) NOT NULL COMMENT '中奖人邮箱',
  `winner_phone_number` varchar(255) NOT NULL COMMENT '中奖人电话',
  `winning_time` datetime NOT NULL COMMENT '中奖时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uk_id` (`id`) USING BTREE,
  UNIQUE KEY `uk_w_a_p_id` (`winner_id`,`activity_id`,`prize_id`) USING BTREE,
  KEY `idx_activity_id` (`activity_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `winning_record`
--

LOCK TABLES `winning_record` WRITE;
/*!40000 ALTER TABLE `winning_record` DISABLE KEYS */;
INSERT INTO `winning_record` VALUES (1,'2026-03-29 19:37:31','2026-03-29 19:37:31',1,'测试',1,'001','FIRST_PRIZE',2,'002','19500299882@163.com','e1ef7c4a1381358011a3934761cd0b9b','2026-03-29 19:37:32'),(2,'2026-03-30 10:04:16','2026-03-30 10:04:16',2,'项目测试二',4,'日本旅游','FIRST_PRIZE',4,'陈梓良','3070068479@qq.com','09d5d6334f503a4f48620d70d40d2945','2026-03-30 10:04:17'),(3,'2026-03-30 10:04:23','2026-03-30 10:04:23',2,'项目测试二',3,'奔驰','SECOND_PRIZE',7,'谢昊','2083028377@qq.com','cf6162203c02f7681d352413b71c4b72','2026-03-30 10:04:24'),(4,'2026-03-30 10:04:23','2026-03-30 10:04:23',2,'项目测试二',3,'奔驰','SECOND_PRIZE',8,'张伟杰','3606679080@qq.com','fcd9b0995b278474e7d851c32df6338e','2026-03-30 10:04:24'),(5,'2026-03-30 10:04:28','2026-03-30 10:04:28',2,'项目测试二',2,'AirPods','THIRD_PRIZE',3,'严崇靖','1422711746@qq.com','dcf6ba3b2bc6cf711fd4449a11dd2d45','2026-03-30 10:04:29'),(6,'2026-03-30 10:04:28','2026-03-30 10:04:28',2,'项目测试二',2,'AirPods','THIRD_PRIZE',6,'黄华金','3158244537@qq.com','42f11d07e2146ff89c2b50b81c776746','2026-03-30 10:04:29'),(7,'2026-03-30 18:03:52','2026-03-30 18:03:52',0,'幸运大转盘',4,'日本旅游','PARTICIPATION',8,'张伟杰','3606679080@qq.com','fcd9b0995b278474e7d851c32df6338e','2026-03-30 18:03:54'),(8,'2026-03-30 18:05:42','2026-03-30 18:05:42',0,'幸运大转盘',1,'001','PARTICIPATION',7,'谢昊','2083028377@qq.com','cf6162203c02f7681d352413b71c4b72','2026-03-30 18:05:44'),(10,'2026-03-30 19:39:41','2026-03-30 19:39:41',0,'幸运大转盘',4,'日本旅游','PARTICIPATION',7,'谢昊','2083028377@qq.com','cf6162203c02f7681d352413b71c4b72','2026-03-30 19:39:42'),(11,'2026-03-30 19:39:43','2026-03-30 19:39:43',0,'幸运大转盘',2,'AirPods','PARTICIPATION',7,'谢昊','2083028377@qq.com','cf6162203c02f7681d352413b71c4b72','2026-03-30 19:39:44'),(14,'2026-03-30 20:34:11','2026-03-30 20:34:11',3,'测试三',3,'奔驰','FIRST_PRIZE',3,'严崇靖','1422711746@qq.com','dcf6ba3b2bc6cf711fd4449a11dd2d45','2026-03-30 20:34:11'),(15,'2026-03-30 20:34:11','2026-03-30 20:34:11',3,'测试三',3,'奔驰','FIRST_PRIZE',4,'陈梓良','3070068479@qq.com','09d5d6334f503a4f48620d70d40d2945','2026-03-30 20:34:11'),(16,'2026-03-30 20:34:19','2026-03-30 20:34:19',3,'测试三',4,'日本旅游','SECOND_PRIZE',6,'黄华金','3158244537@qq.com','42f11d07e2146ff89c2b50b81c776746','2026-03-30 20:34:19'),(17,'2026-03-30 20:34:19','2026-03-30 20:34:19',3,'测试三',4,'日本旅游','SECOND_PRIZE',7,'谢昊','2083028377@qq.com','cf6162203c02f7681d352413b71c4b72','2026-03-30 20:34:19'),(18,'2026-03-30 20:34:28','2026-03-30 20:34:28',3,'测试三',2,'AirPods','THIRD_PRIZE',8,'张伟杰','3606679080@qq.com','fcd9b0995b278474e7d851c32df6338e','2026-03-30 20:34:28'),(19,'2026-03-30 20:46:48','2026-03-30 20:46:48',4,'test4',3,'奔驰','FIRST_PRIZE',4,'陈梓良','3070068479@qq.com','09d5d6334f503a4f48620d70d40d2945','2026-03-30 20:46:48'),(20,'2026-03-30 20:46:51','2026-03-30 20:46:51',4,'test4',4,'日本旅游','SECOND_PRIZE',6,'黄华金','3158244537@qq.com','42f11d07e2146ff89c2b50b81c776746','2026-03-30 20:46:51'),(21,'2026-03-30 20:46:53','2026-03-30 20:46:53',4,'test4',2,'AirPods','THIRD_PRIZE',3,'严崇靖','1422711746@qq.com','dcf6ba3b2bc6cf711fd4449a11dd2d45','2026-03-30 20:46:54'),(22,'2026-03-31 18:59:50','2026-03-31 18:59:50',0,'幸运大转盘',3,'奔驰','PARTICIPATION',6,'黄华金','3158244537@qq.com','42f11d07e2146ff89c2b50b81c776746','2026-03-31 18:59:51'),(23,'2026-03-31 19:00:02','2026-03-31 19:00:02',5,'测试四',1,'001','FIRST_PRIZE',8,'张伟杰','3606679080@qq.com','fcd9b0995b278474e7d851c32df6338e','2026-03-31 19:00:02');
/*!40000 ALTER TABLE `winning_record` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-31 22:05:39
