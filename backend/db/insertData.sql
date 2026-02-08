-- Insert Dummy Data


-- Insert Universities
INSERT INTO university (name, country) VALUES
('Stanford University', 'USA'),
('MIT', 'USA'),
('Oxford University', 'UK'),
('Cambridge University', 'UK'),
('Indian Institute of Technology', 'India');


-- Insert Textbooks
INSERT INTO textbook (isbn, name, author) VALUES
('978-0262033848', 'Introduction to Algorithms', 'Thomas H. Cormen'),
('978-0201361512', 'Data Structures and Algorithms', 'Mark Allen Weiss'),
('978-0131101630', 'The C Programming Language', 'Brian W. Kernighan'),
('978-0078022159', 'Database System Concepts', 'Abraham Silberschatz'),
('978-1118008188', 'Web Development with HTML & CSS', 'Jon Duckett');


-- Insert Users (with bcrypt hashed password)
-- Password is 'password123' hashed
INSERT INTO user_ (email, password_hash, name, role, country) VALUES
('admin1@example.com', '$2a$12$wkE.Abw9JBRALfTCeNm.pefZHHKhlR3Pmtps..VoOtNAiuqWOhemS', 'Alice Admin', 'Admin', 'USA'),
('instructor1@example.com', '$2a$12$wkE.Abw9JBRALfTCeNm.pefZHHKhlR3Pmtps..VoOtNAiuqWOhemS', 'Dr. John Smith', 'Instructor', 'USA'),
('instructor2@example.com', '$2a$12$wkE.Abw9JBRALfTCeNm.pefZHHKhlR3Pmtps..VoOtNAiuqWOhemS', 'Prof. Sarah Johnson', 'Instructor', 'UK'),
('instructor3@example.com', '$2a$12$wkE.Abw9JBRALfTCeNm.pefZHHKhlR3Pmtps..VoOtNAiuqWOhemS', 'Dr. Michael Brown', 'Instructor', 'India'),
('student1@example.com', '$2a$12$wkE.Abw9JBRALfTCeNm.pefZHHKhlR3Pmtps..VoOtNAiuqWOhemS', 'John Doe', 'Student', 'USA'),
('student2@example.com', '$2a$12$wkE.Abw9JBRALfTCeNm.pefZHHKhlR3Pmtps..VoOtNAiuqWOhemS', 'Jane Smith', 'Student', 'UK'),
('student3@example.com', '$2a$12$wkE.Abw9JBRALfTCeNm.pefZHHKhlR3Pmtps..VoOtNAiuqWOhemS', 'Robert Williams', 'Student', 'USA'),
('student4@example.com', '$2a$12$wkE.Abw9JBRALfTCeNm.pefZHHKhlR3Pmtps..VoOtNAiuqWOhemS', 'Emily Davis', 'Student', 'India'),
('student5@example.com', '$2a$12$wkE.Abw9JBRALfTCeNm.pefZHHKhlR3Pmtps..VoOtNAiuqWOhemS', 'Michael Chen', 'Student', 'USA'),
('analyst1@example.com', '$2a$12$wkE.Abw9JBRALfTCeNm.pefZHHKhlR3Pmtps..VoOtNAiuqWOhemS', 'David Analyst', 'Analyst', 'USA');


-- Insert Admin
INSERT INTO admin (admin_id) VALUES
(1);


-- Insert Instructors
INSERT INTO instructor (instructor_id, expertise, start_date) VALUES
(2, 'Computer Science', '2020-01-01'),
(3, 'Computer Science', '2021-03-15'),
(4, 'Information Technology', '2022-06-01');


-- Insert Students
INSERT INTO student (student_id, date_of_birth, skill_level) VALUES
(5, '2002-01-12', 'Intermediate'),
(6, '2001-06-18', 'Beginner'),
(7, '2003-04-22', 'Advanced'),
(8, '2002-09-30', 'Intermediate'),
(9, '2003-02-14', 'Beginner');


-- Insert Courses
INSERT INTO course (name, description, duration, university_id, textbook_isbn, Fees, image_url) VALUES
('Introduction to Data Structures', 'Learn fundamental data structures like arrays, linked lists, trees, and graphs', 8, 1, '978-0201361512', 100, 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop'),
('Advanced Algorithms', 'Deep dive into algorithm design and complexity analysis', 10, 1, '978-0262033848', 150, 'https://images.unsplash.com/photo-1516321356521-4fead9b2596f?w=500&h=300&fit=crop'),
('Database Management Systems', 'Understand relational databases, SQL, and database design', 8, 3, '978-0078022159', 120, 'https://images.unsplash.com/photo-1516534775068-bb57e39c2d0b?w=500&h=300&fit=crop'),
('Web Development Basics', 'Learn HTML, CSS, and JavaScript fundamentals', 6, 4, '978-1118008188', 80, 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop'),
('Machine Learning Fundamentals', 'Introduction to ML algorithms and applications', 10, 1, '978-0262033848', 200, 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&h=300&fit=crop');


-- Insert Modules
INSERT INTO module (course_id, module_number, name, duration_weeks) VALUES
(1, 1, 'Introduction to Data Structures', 2),
(1, 2, 'Arrays and Lists', 2),
(1, 3, 'Stacks and Queues', 2),
(1, 4, 'Trees', 2),
(2, 1, 'Algorithm Basics', 2),
(2, 2, 'Sorting Algorithms', 3),
(2, 3, 'Graph Algorithms', 3),
(2, 4, 'Dynamic Programming', 2),
(3, 1, 'Database Fundamentals', 2),
(3, 2, 'Relational Model', 3),
(3, 3, 'SQL Basics', 3),
(4, 1, 'HTML Fundamentals', 2),
(4, 2, 'CSS Styling', 2),
(4, 3, 'JavaScript Basics', 2),
(5, 1, 'ML Introduction', 2),
(5, 2, 'Linear Regression', 3),
(5, 3, 'Classification Algorithms', 3),
(5, 4, 'Neural Networks', 2);


-- Insert Module Content
INSERT INTO module_content (course_id, module_number, content_id, title, content_type, url) VALUES
(1, 1, 1, 'Why Data Structures Matter', 'Video', '/videos/ds-intro-1.mp4'),
(1, 1, 2, 'DS Overview Note', 'Note', '/notes/ds-overview.pdf'),
(1, 2, 1, 'Arrays Tutorial', 'Video', '/videos/arrays-tutorial.mp4'),
(1, 2, 2, 'Linked Lists Visualization', 'Video', '/videos/linked-lists.mp4'),
(1, 2, 3, 'Array Assignment', 'assignment', '/assignments/array-assignment.pdf'),
(2, 1, 1, 'Algorithm Design Paradigms', 'Video', '/videos/algorithm-paradigms.mp4'),
(3, 1, 1, 'Database Fundamentals Video', 'Video', '/videos/db-intro.mp4'),
(4, 1, 1, 'HTML Basics', 'Video', '/videos/html-basics.mp4'),
(5, 1, 1, 'Introduction to ML', 'Video', '/videos/ml-intro.mp4');


-- Insert Course Instructors
INSERT INTO course_instructor (course_id, instructor_id) VALUES
(1, 2),
(2, 2),
(3, 3),
(4, 4),
(5, 2),
(5, 3);


-- Insert Student Enrollments
INSERT INTO enrollment (student_id, course_id, enrollment_date, evaluation_score, Last_access, Review, rating) VALUES
(5, 1, '2024-01-15', 85, '2024-03-10 10:00:00', 'Great course!', 5),
(5, 2, '2024-02-01', NULL, '2024-03-12 11:00:00', NULL, NULL),
(6, 1, '2024-01-15', 70, '2024-03-05 09:00:00', 'Good, but challenging.', 4),
(6, 4, '2024-02-10', NULL, '2024-03-11 14:00:00', NULL, NULL),
(7, 1, '2024-01-15', 95, '2024-03-13 16:00:00', 'Excellent course, highly recommended.', 5),
(7, 3, '2024-01-20', 88, '2024-03-14 12:00:00', 'Very informative.', 4),
(8, 2, '2024-02-01', 75, '2024-03-09 18:00:00', 'Could be better.', 3),
(8, 5, '2024-03-01', NULL, '2024-03-15 10:00:00', NULL, NULL),
(9, 1, '2024-01-15', 60, '2024-03-01 11:00:00', 'I struggled a bit.', 3),
(9, 4, '2024-02-10', NULL, '2024-03-12 13:00:00', NULL, NULL);

-- Insert Student Progress
INSERT INTO student_progress (student_id, course_id, module_number, content_id, completion_date) VALUES
(5, 1, 1, 1, '2024-01-20 10:00:00'),
(5, 1, 1, 2, '2024-01-21 11:00:00'),
(5, 1, 2, 1, '2024-01-25 14:00:00'),
(6, 1, 1, 1, '2024-01-22 09:00:00');
