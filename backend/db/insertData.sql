-- Insert Dummy Data

-- Insert Universities
INSERT INTO university (name, country) VALUES
('Stanford University', 'USA'),
('MIT', 'USA'),
('Oxford University', 'UK'),
('Cambridge University', 'UK'),
('Indian Institute of Technology', 'India');

-- Insert Textbooks
INSERT INTO textbook (title, author, isbn, publication_year) VALUES
('Introduction to Algorithms', 'Thomas H. Cormen', '978-0262033848', 2009),
('Data Structures and Algorithms', 'Mark Allen Weiss', '978-0201361512', 2006),
('The C Programming Language', 'Brian W. Kernighan', '978-0131101630', 1988),
('Database System Concepts', 'Abraham Silberschatz', '978-0078022159', 2010),
('Web Development with HTML & CSS', 'Jon Duckett', '978-1118008188', 2011);

-- Insert Users (with bcrypt hashed password)
INSERT INTO user_ (email, password_hash, name, role, country, date_of_birth) VALUES
('admin1@example.com', '$2a$12$wkE.Abw9JBRALfTCeNm.pefZHHKhlR3Pmtps..VoOtNAiuqWOhemS', 'Alice Admin', 'Admin', 'USA', '1985-03-15'),
('instructor1@example.com', '$2a$12$wkE.Abw9JBRALfTCeNm.pefZHHKhlR3Pmtps..VoOtNAiuqWOhemS', 'Dr. John Smith', 'Instructor', 'USA', '1980-05-20'),
('instructor2@example.com', '$2a$12$wkE.Abw9JBRALfTCeNm.pefZHHKhlR3Pmtps..VoOtNAiuqWOhemS', 'Prof. Sarah Johnson', 'Instructor', 'UK', '1982-07-10'),
('instructor3@example.com', '$2a$12$wkE.Abw9JBRALfTCeNm.pefZHHKhlR3Pmtps..VoOtNAiuqWOhemS', 'Dr. Michael Brown', 'Instructor', 'India', '1981-11-25'),
('student1@example.com', '$2a$12$wkE.Abw9JBRALfTCeNm.pefZHHKhlR3Pmtps..VoOtNAiuqWOhemS', 'John Doe', 'Student', 'USA', '2002-01-12'),
('student2@example.com', '$2a$12$wkE.Abw9JBRALfTCeNm.pefZHHKhlR3Pmtps..VoOtNAiuqWOhemS', 'Jane Smith', 'Student', 'UK', '2001-06-18'),
('student3@example.com', '$2a$12$wkE.Abw9JBRALfTCeNm.pefZHHKhlR3Pmtps..VoOtNAiuqWOhemS', 'Robert Williams', 'Student', 'USA', '2003-04-22'),
('student4@example.com', '$2a$12$wkE.Abw9JBRALfTCeNm.pefZHHKhlR3Pmtps..VoOtNAiuqWOhemS', 'Emily Davis', 'Student', 'India', '2002-09-30'),
('student5@example.com', '$2a$12$wkE.Abw9JBRALfTCeNm.pefZHHKhlR3Pmtps..VoOtNAiuqWOhemS', 'Michael Chen', 'Student', 'USA', '2003-02-14'),
('analyst1@example.com', '$2a$12$wkE.Abw9JBRALfTCeNm.pefZHHKhlR3Pmtps..VoOtNAiuqWOhemS', 'David Analyst', 'Analyst', 'USA', '1990-08-05');

-- Insert Admin
INSERT INTO admin (user_id, permissions) VALUES
(1, 'all');

-- Insert Instructors
INSERT INTO instructor (user_id, university_id, department, qualification) VALUES
(2, 1, 'Computer Science', 'PhD'),
(3, 3, 'Computer Science', 'PhD'),
(4, 5, 'Information Technology', 'M.Tech');

-- Insert Students
INSERT INTO student (user_id, university_id, skill_level) VALUES
(5, 1, 'Intermediate'),
(6, 3, 'Beginner'),
(7, 1, 'Advanced'),
(8, 5, 'Intermediate'),
(9, 1, 'Beginner');

-- Insert Analyst
INSERT INTO analyst (user_id, specialization) VALUES
(10, 'Data Analytics');

-- Insert Courses
INSERT INTO course (title, description, code, credits, level, duration_weeks, start_date, end_date) VALUES
('Introduction to Data Structures', 'Learn fundamental data structures like arrays, linked lists, trees, and graphs', 'CS101', 3, 'Beginner', 8, '2024-01-15', '2024-03-15'),
('Advanced Algorithms', 'Deep dive into algorithm design and complexity analysis', 'CS201', 4, 'Intermediate', 10, '2024-02-01', '2024-04-15'),
('Database Management Systems', 'Understand relational databases, SQL, and database design', 'CS301', 3, 'Intermediate', 8, '2024-01-20', '2024-03-20'),
('Web Development Basics', 'Learn HTML, CSS, and JavaScript fundamentals', 'WEB101', 3, 'Beginner', 6, '2024-02-10', '2024-03-25'),
('Machine Learning Fundamentals', 'Introduction to ML algorithms and applications', 'AI101', 4, 'Intermediate', 10, '2024-03-01', '2024-05-15');

-- Insert Modules for Course 1 (CS101)
INSERT INTO module (course_id, title, description, module_number, duration_hours) VALUES
(1, 'Introduction to Data Structures', 'Overview and importance of data structures', 1, 2),
(1, 'Arrays and Lists', 'Array operations, linked lists, and variations', 2, 3),
(1, 'Stacks and Queues', 'Stack and queue data structures and applications', 3, 3),
(1, 'Trees', 'Binary trees, BST, and tree traversal methods', 4, 4);

-- Insert Modules for Course 2 (CS201)
INSERT INTO module (course_id, title, description, module_number, duration_hours) VALUES
(2, 'Algorithm Basics', 'Algorithm design paradigms and analysis', 1, 3),
(2, 'Sorting Algorithms', 'Quick sort, merge sort, and other sorting techniques', 2, 4),
(2, 'Graph Algorithms', 'BFS, DFS, shortest path algorithms', 3, 5),
(2, 'Dynamic Programming', 'DP concepts and problem-solving approaches', 4, 5);

-- Insert Modules for Course 3 (CS301)
INSERT INTO module (course_id, title, description, module_number, duration_hours) VALUES
(3, 'Database Fundamentals', 'Introduction to databases and DBMS', 1, 2),
(3, 'Relational Model', 'Relations, attributes, and normalization', 2, 3),
(3, 'SQL Basics', 'SELECT, INSERT, UPDATE, DELETE queries', 3, 4);

-- Insert Modules for Course 4 (WEB101)
INSERT INTO module (course_id, title, description, module_number, duration_hours) VALUES
(4, 'HTML Fundamentals', 'HTML structure, tags, and semantic markup', 1, 2),
(4, 'CSS Styling', 'Selectors, positioning, flexbox, and grid', 2, 3),
(4, 'JavaScript Basics', 'Variables, functions, DOM manipulation', 3, 4);

-- Insert Modules for Course 5 (AI101)
INSERT INTO module (course_id, title, description, module_number, duration_hours) VALUES
(5, 'ML Introduction', 'Supervised, unsupervised, and reinforcement learning', 1, 3),
(5, 'Linear Regression', 'Simple and multiple linear regression models', 2, 4),
(5, 'Classification Algorithms', 'Logistic regression, decision trees, SVM', 3, 5),
(5, 'Neural Networks', 'Perceptrons, feedforward networks, backpropagation', 4, 5);

-- Insert Module Contents
INSERT INTO moduleContent (module_id, title, content_type, content_url, duration_minutes, sequence_number) VALUES
(1, 'Why Data Structures Matter', 'Video', '/videos/ds-intro-1.mp4', 15, 1),
(1, 'DS Overview Document', 'Document', '/documents/ds-overview.pdf', NULL, 2),
(2, 'Arrays Tutorial', 'Video', '/videos/arrays-tutorial.mp4', 25, 1),
(2, 'Linked Lists Visualization', 'Video', '/videos/linked-lists.mp4', 20, 2),
(2, 'Arrays vs Lists Quiz', 'Quiz', '/quizzes/arrays-vs-lists.html', 15, 3),
(3, 'Stack Implementation', 'Video', '/videos/stack-impl.mp4', 18, 1),
(3, 'Queue Implementation', 'Video', '/videos/queue-impl.mp4', 18, 2),
(3, 'Stack and Queue Assignment', 'Assignment', '/assignments/stack-queue.pdf', NULL, 3),
(4, 'Binary Trees Explained', 'Video', '/videos/binary-trees.mp4', 30, 1),
(4, 'Tree Traversal Methods', 'Document', '/documents/tree-traversal.pdf', NULL, 2),
(5, 'Algorithm Design Paradigms', 'Video', '/videos/algorithm-paradigms.mp4', 25, 1),
(6, 'Quick Sort Tutorial', 'Video', '/videos/quicksort.mp4', 20, 1),
(7, 'Graph Algorithms Overview', 'Video', '/videos/graph-algorithms.mp4', 30, 1),
(10, 'Introduction to ML', 'Video', '/videos/ml-intro.mp4', 20, 1),
(11, 'Linear Regression Basics', 'Video', '/videos/linear-regression.mp4', 25, 1);

-- Insert Course Instructors
INSERT INTO courseInstructor (course_id, instructor_id, is_primary) VALUES
(1, 1, TRUE),
(2, 1, TRUE),
(3, 2, TRUE),
(4, 3, TRUE),
(5, 1, FALSE),
(5, 2, TRUE);

-- Insert Course Textbooks
INSERT INTO courseTextbook (course_id, textbook_id, is_required) VALUES
(1, 2, TRUE),
(2, 1, TRUE),
(3, 4, TRUE),
(4, 5, TRUE),
(1, 3, FALSE),
(2, 2, FALSE);

-- Insert Student Enrollments
INSERT INTO enrollment (student_id, course_id, enrollment_date, completion_status, grade, percentage_completed) VALUES
(1, 1, '2024-01-15', 'In Progress', 4.0, 65),
(1, 2, '2024-02-01', 'In Progress', NULL, 30),
(2, 1, '2024-01-15', 'In Progress', 3.5, 50),
(2, 4, '2024-02-10', 'In Progress', NULL, 20),
(3, 1, '2024-01-15', 'Completed', 4.0, 100),
(3, 3, '2024-01-20', 'In Progress', 3.8, 75),
(4, 2, '2024-02-01', 'In Progress', 3.2, 40),
(4, 5, '2024-03-01', 'In Progress', NULL, 10),
(5, 1, '2024-01-15', 'In Progress', 3.0, 45),
(5, 4, '2024-02-10', 'In Progress', NULL, 15);
