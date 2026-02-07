-- ==========================================
-- 1. USER HIERARCHY (Generalization/Specialization)
-- ==========================================


-- Base User Table (Superclass)
CREATE TABLE user_ (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('Admin', 'Instructor', 'Student', 'Analyst')),
    country VARCHAR(100)
);


-- Student Details (Subclass)
CREATE TABLE student (
    student_id INT PRIMARY KEY REFERENCES user_(user_id) ON DELETE CASCADE,
    date_of_birth DATE,
    skill_level VARCHAR(50)
);


-- Instructor Details (Subclass)
CREATE TABLE instructor (
    instructor_id INT PRIMARY KEY REFERENCES user_(user_id) ON DELETE CASCADE,
    expertise VARCHAR(100),
    start_date DATE DEFAULT CURRENT_DATE
);


-- Admin Details (Subclass)
CREATE TABLE admin (
    admin_id INT PRIMARY KEY REFERENCES user_(user_id) ON DELETE CASCADE
);


CREATE TABLE analyst (
    analyst_id INT PRIMARY KEY REFERENCES user_(user_id) ON DELETE CASCADE
);
-- ==========================================
-- 2. COURSE ASSETS (Independent Entities)
-- ==========================================


CREATE TABLE university (
    university_id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL,
    country VARCHAR(100) NOT NULL
);


CREATE TABLE textbook (
    isbn VARCHAR(20) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    author VARCHAR(100) NOT NULL
);


-- ==========================================
-- 3. COURSE HIERARCHY (The Weak Entity Chain)
-- ==========================================


-- Level 1: Course (Strong Entity)
CREATE TABLE course (
    course_id SERIAL PRIMARY KEY,
    name VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    duration INT,
    university_id INT NOT NULL REFERENCES university(university_id),
    textbook_isbn VARCHAR(20) REFERENCES textbook(isbn),
    Fees INT
);


-- Level 2: module (Weak Entity)
-- Dependent on Course. PK = (course_id + module_number)
CREATE TABLE module (
    course_id INT NOT NULL REFERENCES course(course_id) ON DELETE CASCADE,
    module_number INT NOT NULL, -- Partial Key (e.g., 1, 2, 3)
    name VARCHAR(150) NOT NULL,
    duration_weeks INT,
   
    PRIMARY KEY (course_id, module_number)
);


-- Level 3: Module Content (Dependent Weak Entity)
-- Dependent on Module. PK = (course_id + module_number + content_id)
CREATE TABLE module_content (
    course_id INT NOT NULL,
    module_number INT NOT NULL,
    content_id INT NOT NULL, -- Partial Key (e.g., Video 1, Video 2)
   
    title VARCHAR(150) NOT NULL,
    content_type VARCHAR(20) CHECK (content_type IN ('Video', 'Note', 'assignment')),
    url VARCHAR(255),
   
    -- Composite Primary Key (The full chain)
    PRIMARY KEY (course_id, module_number, content_id),
   
    -- Foreign Key links to the specific parent Module
    FOREIGN KEY (course_id, module_number)
        REFERENCES module(course_id, module_number)
        ON DELETE CASCADE
);


-- ==========================================
-- 4. RELATIONSHIPS (Teaching & Enrollment)
-- ==========================================


-- Student enrollment (Many-to-Many: student <-> course)
CREATE TABLE enrollment (
    enrollment_id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES student(student_id),
    course_id INT NOT NULL REFERENCES course(course_id),
    enrollment_date DATE DEFAULT CURRENT_DATE,
    evaluation_score INT CHECK (evaluation_score BETWEEN 0 AND 100),
    Last_access TIMESTAMP,
    Review TEXT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
   
    UNIQUE(student_id, course_id)
);


-- Instructor Assignments (Many-to-Many: instructor <-> course)
CREATE TABLE course_instructor (
    course_id INT NOT NULL REFERENCES course(course_id) ON DELETE CASCADE,
    instructor_id INT NOT NULL REFERENCES instructor(instructor_id) ON DELETE CASCADE,
   
    PRIMARY KEY (course_id, instructor_id)
);

-- Tracks exactly which video/note a student has finished
CREATE TABLE student_progress (
    -- Who?
    student_id INT NOT NULL REFERENCES student(student_id) ON DELETE CASCADE,
    
    -- What? (References the composite PK of module_content)
    course_id INT NOT NULL,
    module_number INT NOT NULL,
    content_id INT NOT NULL,
    
    -- When?
    completion_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraint: Prevent marking the same video complete twice
    PRIMARY KEY (student_id, course_id, module_number, content_id),
    
    -- Foreign Key connecting to the specific content item
    FOREIGN KEY (course_id, module_number, content_id)
        REFERENCES module_content(course_id, module_number, content_id)
        ON DELETE CASCADE
);
