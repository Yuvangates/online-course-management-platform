-- Insert Dummy Data (India-focused)


-- Insert Universities
INSERT INTO university (name, country) VALUES
('Indian Institute of Technology Madras', 'India'),
('Indian Institute of Technology Bombay', 'India'),
('Indian Institute of Technology Delhi', 'India'),
('Indian Institute of Science Bangalore', 'India'),
('BITS Pilani', 'India'),
('Anna University', 'India'),
('National Institute of Technology Tiruchirappalli', 'India'),
('National Institute of Technology Surathkal', 'India'),
('Jadavpur University', 'India'),
('University of Delhi', 'India'),
('Savitribai Phule Pune University', 'India'),
('Vellore Institute of Technology', 'India');


-- Insert Textbooks
INSERT INTO textbook (isbn, name, author) VALUES
('978-93-0001-000-1', 'Data Structures Through C', 'Yashavant Kanetkar'),
('978-93-0001-000-2', 'Database Management Systems', 'P. K. Sinha'),
('978-93-0001-000-3', 'Operating Systems', 'D. M. Dhamdhere'),
('978-93-0001-000-4', 'Computer Networks', 'Sanjay Sharma'),
('978-93-0001-000-5', 'Software Engineering', 'S. K. Dubey'),
('978-93-0001-000-6', 'Programming in C', 'E. Balagurusamy'),
('978-93-0001-000-7', 'Java The Complete Reference', 'Herbert Schildt'),
('978-93-0001-000-8', 'Data Analytics with Python', 'Anita Verma'),
('978-93-0001-000-9', 'Machine Learning Basics', 'R. S. Bhatia'),
('978-93-0001-001-0', 'Web Technologies', 'Priya Nair'),
('978-93-0001-001-1', 'Digital Image Processing', 'R. C. Gonzalez'),
('978-93-0001-001-2', 'Introduction to AI', 'S. R. Babu');


-- Insert Users (with bcrypt hashed password)
-- Password is 'password123' hashed
INSERT INTO user_ (email, password_hash, name, role, country) VALUES
('admin@example.com', '$2a$12$wkE.Abw9JBRALfTCeNm.pefZHHKhlR3Pmtps..VoOtNAiuqWOhemS', 'Aarav Mehta', 'Admin', 'India'),
('instructor1@example.com', '$2a$12$wkE.Abw9JBRALfTCeNm.pefZHHKhlR3Pmtps..VoOtNAiuqWOhemS', 'Dr. Kavya Iyer', 'Instructor', 'India'),
('instructor2@example.com', '$2a$12$wkE.Abw9JBRALfTCeNm.pefZHHKhlR3Pmtps..VoOtNAiuqWOhemS', 'Prof. Rohan Kulkarni', 'Instructor', 'India'),
('instructor3@example.com', '$2a$12$wkE.Abw9JBRALfTCeNm.pefZHHKhlR3Pmtps..VoOtNAiuqWOhemS', 'Dr. Ananya Rao', 'Instructor', 'India'),
('instructor4@example.com', '$2a$12$wkE.Abw9JBRALfTCeNm.pefZHHKhlR3Pmtps..VoOtNAiuqWOhemS', 'Prof. Vivek Nair', 'Instructor', 'India'),
('instructor5@example.com', '$2a$12$wkE.Abw9JBRALfTCeNm.pefZHHKhlR3Pmtps..VoOtNAiuqWOhemS', 'Dr. Neha Sharma', 'Instructor', 'India'),
('student1@example.com', '$2a$12$wkE.Abw9JBRALfTCeNm.pefZHHKhlR3Pmtps..VoOtNAiuqWOhemS', 'Arjun Patil', 'Student', 'India'),
('student2@example.com', '$2a$12$wkE.Abw9JBRALfTCeNm.pefZHHKhlR3Pmtps..VoOtNAiuqWOhemS', 'Ishita Singh', 'Student', 'India'),
('student3@example.com', '$2a$12$wkE.Abw9JBRALfTCeNm.pefZHHKhlR3Pmtps..VoOtNAiuqWOhemS', 'Karan Joshi', 'Student', 'India'),
('student4@example.com', '$2a$12$wkE.Abw9JBRALfTCeNm.pefZHHKhlR3Pmtps..VoOtNAiuqWOhemS', 'Meera Pillai', 'Student', 'India'),
('student5@example.com', '$2a$12$wkE.Abw9JBRALfTCeNm.pefZHHKhlR3Pmtps..VoOtNAiuqWOhemS', 'Rahul Verma', 'Student', 'India'),
('analyst@example.com', '$2a$12$wkE.Abw9JBRALfTCeNm.pefZHHKhlR3Pmtps..VoOtNAiuqWOhemS', 'Sneha Desai', 'Analyst', 'India');


-- Insert Admin
INSERT INTO admin (admin_id) VALUES
(1);


-- Insert Instructors
INSERT INTO instructor (instructor_id, expertise, start_date) VALUES
(2, 'Computer Science', '2019-07-01'),
(3, 'Data Engineering', '2020-08-15'),
(4, 'Artificial Intelligence', '2018-01-20'),
(5, 'Software Engineering', '2021-06-10'),
(6, 'Cyber Security', '2017-03-05');


-- Insert Students
INSERT INTO student (student_id, date_of_birth, skill_level) VALUES
(7, '2002-04-12', 'Intermediate'),
(8, '2001-11-05', 'Beginner'),
(9, '2003-07-22', 'Advanced'),
(10, '2002-02-18', 'Intermediate'),
(11, '2003-09-30', 'Beginner');


-- Insert Courses
INSERT INTO course (name, description, duration, university_id, textbook_isbn, Fees, image_url) VALUES
('Data Structures in C', 'Core data structures with C implementations', 8, 1, '978-93-0001-000-1', 2500, 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop'),
('DBMS Fundamentals', 'Relational model, SQL, and normalization', 8, 2, '978-93-0001-000-2', 2800, 'https://images.unsplash.com/photo-1516534775068-bb57e39c2d0b?w=500&h=300&fit=crop'),
('Operating Systems', 'Processes, memory, and scheduling concepts', 10, 3, '978-93-0001-000-3', 3000, 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=500&h=300&fit=crop'),
('Computer Networks', 'Networking layers, protocols, and routing', 8, 4, '978-93-0001-000-4', 2800, 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&h=300&fit=crop'),
('Software Engineering Practices', 'SDLC, agile, and testing', 8, 5, '978-93-0001-000-5', 2600, 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&h=300&fit=crop'),
('Programming in C', 'C syntax, pointers, and file handling', 6, 6, '978-93-0001-000-6', 2000, 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop'),
('Java Programming', 'OOP, collections, and exceptions in Java', 10, 7, '978-93-0001-000-7', 3200, 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&h=300&fit=crop'),
('Data Analytics with Python', 'Pandas, visualization, and basic stats', 8, 8, '978-93-0001-000-8', 3500, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop'),
('Machine Learning Basics', 'Supervised learning and evaluation', 10, 9, '978-93-0001-000-9', 4200, 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&h=300&fit=crop'),
('Web Technologies', 'HTML, CSS, JS, and responsive design', 6, 10, '978-93-0001-001-0', 2400, 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=500&h=300&fit=crop'),
('Digital Image Processing', 'Image enhancement, filtering, and morphology', 8, 11, '978-93-0001-001-1', 3800, 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&h=300&fit=crop'),
('Introduction to AI', 'Search, knowledge representation, and planning', 10, 12, '978-93-0001-001-2', 4500, 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=500&h=300&fit=crop'),
('DevOps Essentials', 'CI/CD, containers, and monitoring basics', 8, 7, '978-93-0001-000-5', 3600, 'https://images.unsplash.com/photo-1667372393119-c85c02088947?w=500&h=300&fit=crop'),
('Cyber Security Basics', 'Security principles and safe practices', 8, 8, '978-93-0001-000-4', 3400, 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&h=300&fit=crop'),
('IoT with Arduino', 'Sensors, microcontrollers, and IoT apps', 6, 9, '978-93-0001-001-0', 3000, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=300&fit=crop'),
('Android App Development', 'UI, activities, and data storage', 8, 10, '978-93-0001-000-7', 3600, 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&h=300&fit=crop'),
('Full Stack MERN', 'React, Node, and MongoDB stack', 12, 11, '978-93-0001-001-0', 5200, 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=500&h=300&fit=crop'),
('Big Data Foundations', 'Hadoop basics and batch processing', 8, 12, '978-93-0001-000-8', 4000, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop'),
('NLP Basics', 'Text preprocessing and embeddings', 8, 4, '978-93-0001-001-2', 4200, 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=500&h=300&fit=crop'),
('Blockchain Fundamentals', 'Distributed ledgers and smart contracts', 8, 5, '978-93-0001-000-2', 4500, 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&h=300&fit=crop');


-- Insert Modules
INSERT INTO module (course_id, module_number, name, duration_weeks) VALUES
(1, 1, 'DS Basics', 2),
(1, 2, 'Stacks and Queues', 2),
(2, 1, 'Relational Model', 3),
(2, 2, 'SQL and Normalization', 3),
(3, 1, 'Processes and Threads', 3),
(3, 2, 'Memory Management', 3),
(4, 1, 'Network Layers', 2),
(4, 2, 'Routing and Switching', 2),
(5, 1, 'SDLC Models', 2),
(5, 2, 'Testing and QA', 2),
(6, 1, 'C Syntax', 2),
(6, 2, 'Pointers and Files', 2),
(7, 1, 'OOP in Java', 3),
(7, 2, 'Collections and Streams', 3),
(8, 1, 'Pandas Basics', 3),
(8, 2, 'Visualization', 2),
(9, 1, 'Supervised Learning', 3),
(9, 2, 'Model Evaluation', 3),
(10, 1, 'HTML and CSS', 2),
(10, 2, 'JavaScript Basics', 2),
(11, 1, 'Image Enhancement', 3),
(11, 2, 'Filtering', 3),
(12, 1, 'Search Algorithms', 3),
(12, 2, 'Knowledge Representation', 3),
(13, 1, 'CI/CD Basics', 3),
(13, 2, 'Containers', 2),
(14, 1, 'Security Principles', 3),
(14, 2, 'Network Security', 2),
(15, 1, 'Sensors and Boards', 2),
(15, 2, 'IoT Applications', 2),
(16, 1, 'Android UI', 3),
(16, 2, 'Data Storage', 2),
(17, 1, 'React Basics', 3),
(17, 2, 'Node API', 3),
(18, 1, 'Hadoop Intro', 3),
(18, 2, 'Batch Processing', 2),
(19, 1, 'Text Cleaning', 2),
(19, 2, 'Embeddings', 2),
(20, 1, 'Blockchain Basics', 3),
(20, 2, 'Smart Contracts', 3);


-- Insert Module Content
INSERT INTO module_content (course_id, module_number, content_id, title, content_type, url) VALUES
(1, 1, 1, 'Why Data Structures Matter', 'Video', '/videos/ds-intro-1.mp4'),
(1, 1, 2, 'DS Notes', 'Note', '/notes/ds-overview.pdf'),
(2, 1, 1, 'Relational Model Overview', 'Video', '/videos/dbms-relational.mp4'),
(2, 2, 1, 'Normalization Guide', 'Note', '/notes/normalization.pdf'),
(3, 1, 1, 'Processes Explained', 'Video', '/videos/os-processes.mp4'),
(4, 1, 1, 'OSI Model', 'Video', '/videos/net-osi.mp4'),
(5, 1, 1, 'SDLC Models', 'Note', '/notes/sdlc-models.pdf'),
(6, 1, 1, 'C Basics', 'Video', '/videos/c-basics.mp4'),
(7, 1, 1, 'Java OOP', 'Video', '/videos/java-oop.mp4'),
(8, 1, 1, 'Pandas Setup', 'Note', '/notes/pandas-setup.pdf'),
(9, 1, 1, 'ML Intro', 'Video', '/videos/ml-intro.mp4'),
(10, 1, 1, 'HTML Basics', 'Video', '/videos/html-basics.mp4'),
(11, 1, 1, 'Image Enhancement', 'Video', '/videos/dip-enhance.mp4'),
(12, 1, 1, 'AI Search', 'Video', '/videos/ai-search.mp4'),
(13, 1, 1, 'CI/CD Pipeline', 'Video', '/videos/devops-cicd.mp4'),
(14, 1, 1, 'Security Essentials', 'Note', '/notes/security-essentials.pdf'),
(15, 1, 1, 'IoT Boards', 'Video', '/videos/iot-boards.mp4'),
(16, 1, 1, 'Android Studio', 'Video', '/videos/android-studio.mp4'),
(17, 1, 1, 'React Components', 'Video', '/videos/react-components.mp4'),
(18, 1, 1, 'Hadoop Intro', 'Video', '/videos/hadoop-intro.mp4'),
(19, 1, 1, 'Text Cleaning', 'Note', '/notes/nlp-cleaning.pdf'),
(20, 1, 1, 'Blockchain Intro', 'Video', '/videos/blockchain-intro.mp4');


-- Insert Course Instructors
INSERT INTO course_instructor (course_id, instructor_id) VALUES
(1, 2),
(2, 2),
(3, 3),
(4, 3),
(5, 5),
(6, 2),
(7, 4),
(8, 4),
(9, 4),
(10, 5),
(11, 3),
(12, 4),
(13, 5),
(14, 6),
(15, 6),
(16, 5),
(17, 2),
(18, 3),
(19, 4),
(20, 6);


-- Insert Student Enrollments
INSERT INTO enrollment (student_id, course_id, enrollment_date, evaluation_score, Last_access, Review, rating) VALUES
(7, 1, '2024-01-10', 84, '2024-02-02 10:15:00', 'Clear explanations and good pace.', 5),
(7, 2, '2024-01-20', 78, '2024-02-08 11:00:00', 'SQL practice helped a lot.', 4),
(7, 3, '2024-02-05', 81, '2024-02-20 09:30:00', 'OS concepts are well covered.', 4),
(7, 10, '2024-02-18', NULL, '2024-03-01 13:40:00', NULL, NULL),
(7, 17, '2024-03-05', NULL, '2024-03-18 16:10:00', NULL, NULL),
(8, 1, '2024-01-12', 69, '2024-02-01 10:00:00', 'Some topics were tough.', 3),
(8, 6, '2024-01-25', 72, '2024-02-05 12:00:00', 'Pointers need more examples.', 3),
(8, 10, '2024-02-02', 80, '2024-02-16 15:30:00', 'Loved the frontend basics.', 4),
(8, 16, '2024-02-20', NULL, '2024-03-02 09:00:00', NULL, NULL),
(8, 14, '2024-03-01', 76, '2024-03-15 10:45:00', 'Good introduction to security.', 4),
(9, 7, '2024-01-18', 90, '2024-02-12 11:20:00', 'Java topics are solid.', 5),
(9, 8, '2024-02-01', 88, '2024-02-20 14:00:00', 'Great data analysis demos.', 5),
(9, 9, '2024-02-10', 92, '2024-02-28 18:10:00', 'ML basics are well structured.', 5),
(9, 12, '2024-02-28', NULL, '2024-03-10 16:30:00', NULL, NULL),
(9, 19, '2024-03-08', NULL, '2024-03-20 19:00:00', NULL, NULL),
(10, 2, '2024-01-22', 75, '2024-02-10 10:20:00', 'Need more SQL problems.', 3),
(10, 4, '2024-02-05', 79, '2024-02-18 12:10:00', 'Networking basics are good.', 4),
(10, 11, '2024-02-20', 83, '2024-03-05 17:30:00', 'Nice examples for filtering.', 4),
(10, 13, '2024-03-01', NULL, '2024-03-16 13:00:00', NULL, NULL),
(10, 20, '2024-03-10', NULL, '2024-03-22 10:10:00', NULL, NULL),
(11, 3, '2024-01-25', 77, '2024-02-12 08:40:00', 'Good coverage of OS.', 4),
(11, 5, '2024-02-08', 82, '2024-02-22 09:25:00', 'Agile section was useful.', 4),
(11, 15, '2024-02-22', NULL, '2024-03-08 12:05:00', NULL, NULL),
(11, 18, '2024-03-02', 79, '2024-03-18 14:15:00', 'Hadoop intro is clear.', 4),
(11, 14, '2024-03-12', NULL, '2024-03-25 16:45:00', NULL, NULL);

-- Insert Student Progress
INSERT INTO student_progress (student_id, course_id, module_number, content_id, completion_date) VALUES
(7, 1, 1, 1, '2024-01-15 10:00:00'),
(7, 1, 1, 2, '2024-01-16 11:30:00'),
(7, 2, 1, 1, '2024-01-22 12:10:00'),
(7, 2, 2, 1, '2024-01-24 10:40:00'),
(7, 3, 1, 1, '2024-02-08 09:15:00'),
(8, 1, 1, 1, '2024-01-18 11:00:00'),
(8, 1, 1, 2, '2024-01-19 12:30:00'),
(8, 6, 1, 1, '2024-01-28 09:30:00'),
(8, 10, 1, 1, '2024-02-05 15:00:00'),
(8, 14, 1, 1, '2024-03-05 10:20:00'),
(9, 7, 1, 1, '2024-01-22 10:20:00'),
(9, 8, 1, 1, '2024-02-06 14:30:00'),
(9, 9, 1, 1, '2024-02-14 16:10:00'),
(10, 2, 1, 1, '2024-01-28 10:10:00'),
(10, 2, 2, 1, '2024-02-01 11:20:00'),
(10, 4, 1, 1, '2024-02-07 12:15:00'),
(10, 11, 1, 1, '2024-02-24 18:40:00'),
(11, 3, 1, 1, '2024-02-02 08:55:00'),
(11, 5, 1, 1, '2024-02-14 09:50:00'),
(11, 18, 1, 1, '2024-03-06 12:35:00');
