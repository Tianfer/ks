CREATE TABLE IF NOT EXISTS `comment`(
  `id` INT UNSIGNED AUTO_INCREMENT,
  `class_id` int(11) NOT NULL,
  `teacher_id` char(32) NOT NULL,
  `teacher_name` CHAR(10) NOT NULL,
  `comment_teacher_id` char(32) NOT NULL,
  `comment_teacher_name` CHAR(10) NOT NULL,
  `course_id` char(16) NOT NULL,
  `course_name` char(24) NOT NULL,
  `time_week` int(2) NOT NULL,
  `time_day` int(1) NOT NULL,
  `time_detail` char(4) NOT NULL,
  `building` char(10) NOT NULL,
  `classroom` char(3) NOT NULL,
  `class_name` CHAR(40) NOT NULL,
  `class_type` char(5) NOT NULL,
  `grade` char(3) NOT NULL,
  `age` CHAR(1) NOT NULL,
  `pro_title` CHAR(10) NOT NULL,
  `unit` CHAR(10) NOT NULL,
  `all_people` int(3) NOT NULL,
  `presence` int(3) NOT NULL,
  `time_days` date NOT NULL,
  `class_room_type` CHAR(5) NOT NULL,
  `attitude_score` int(2) NOT NULL,
  `content_score` int(2) NOT NULL,
  `method_score` int(2) NOT NULL,
  `manage_score` int(2) NOT NULL,
  `effect_score` int(2) NOT NULL,
  `count_score` int(3) NOT NULL,
  `count_grade` char(1) NOT NULL,
  `imgs` varchar(500),
  `other_advise` char(200),
  `created_at` char(13) NOT NULL,
  `updated_at` char(13) NOT NULL,
  PRIMARY KEY ( `id` )
) ENGINE=InnoDB DEFAULT CHARSET=utf8;