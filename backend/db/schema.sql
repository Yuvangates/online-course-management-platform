-- Create Tables with Lowercase First Letter and Singular Form

-- University table
CREATE TABLE university (
    university_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    country VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Textbook table
CREATE TABLE textbook (
    textbook_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    publication_year INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Base User table
CREATE TABLE user_ (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Instructor', 'Student', 'Analyst')),
    country VARCHAR(100),
    date_of_birth DATE,
    profile_image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student table (role-specific)
CREATE TABLE student (
    student_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES user_(user_id) ON DELETE CASCADE,
    university_id INT REFERENCES university(university_id),
    skill_level VARCHAR(50),
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Instructor table (role-specific)
CREATE TABLE instructor (
    instructor_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES user_(user_id) ON DELETE CASCADE,
    university_id INT REFERENCES university(university_id),
    department VARCHAR(100),
    qualification VARCHAR(255),
    hire_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin table (role-specific)
CREATE TABLE admin (
    admin_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES user_(user_id) ON DELETE CASCADE,
    permissions VARCHAR(255),
    appointed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analyst table (role-specific)
CREATE TABLE analyst (
    analyst_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES user_(user_id) ON DELETE CASCADE,
    specialization VARCHAR(100),
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Course table
CREATE TABLE course (
    course_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    code VARCHAR(50) NOT NULL UNIQUE,
    credits INT DEFAULT 3,
    level VARCHAR(50),
    duration_weeks INT,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Module table
CREATE TABLE module (
    module_id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES course(course_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    module_number INT NOT NULL,
    duration_hours INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, module_number)
);

-- Module Content table
CREATE TABLE moduleContent (
    content_id SERIAL PRIMARY KEY,
    module_id INT NOT NULL REFERENCES module(module_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('Video', 'Document', 'Quiz', 'Assignment', 'Resource')),
    content_url VARCHAR(500),
    duration_minutes INT,
    sequence_number INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enrollment table
CREATE TABLE enrollment (
    enrollment_id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES student(student_id) ON DELETE CASCADE,
    course_id INT NOT NULL REFERENCES course(course_id) ON DELETE CASCADE,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completion_status VARCHAR(50) DEFAULT 'In Progress',
    grade DECIMAL(3,1),
    percentage_completed INT DEFAULT 0,
    last_accessed TIMESTAMP,
    UNIQUE(student_id, course_id)
);

-- Course Instructor table (many-to-many)
CREATE TABLE courseInstructor (
    course_instructor_id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES course(course_id) ON DELETE CASCADE,
    instructor_id INT NOT NULL REFERENCES instructor(instructor_id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT FALSE,
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, instructor_id)
);

-- Course Textbook table (many-to-many)
CREATE TABLE courseTextbook (
    course_textbook_id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES course(course_id) ON DELETE CASCADE,
    textbook_id INT NOT NULL REFERENCES textbook(textbook_id) ON DELETE CASCADE,
    is_required BOOLEAN DEFAULT TRUE,
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, textbook_id)
);

-- Create indexes for frequently searched columns
CREATE INDEX idx_user_email ON user_(email);
CREATE INDEX idx_student_user_id ON student(user_id);
CREATE INDEX idx_instructor_user_id ON instructor(user_id);
CREATE INDEX idx_enrollment_student_id ON enrollment(student_id);
CREATE INDEX idx_enrollment_course_id ON enrollment(course_id);
CREATE INDEX idx_course_instructor ON courseInstructor(instructor_id);
CREATE INDEX idx_module_course_id ON module(course_id);
