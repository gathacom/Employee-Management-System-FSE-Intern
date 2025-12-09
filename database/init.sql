CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    position VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    salary INTEGER NOT NULL,
    hire_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active' NOT NULL,
    
    CONSTRAINT positive_salary CHECK (salary >= 0),
    CONSTRAINT valid_status CHECK (status IN ('active', 'inactive'))
);

INSERT INTO employees (name, email, position, department, salary, hire_date, status) VALUES
('Budi Santoso', 'budi.santoso@corp.com', 'Software Engineer', 'Technology', 60000000, '2022-01-15', 'active'),
('Citra Dewi', 'citra.dewi@corp.com', 'Product Manager', 'Product', 85000000, '2021-05-20', 'active'),
('Ahmad Kalla', 'ahmad.kalla@corp.com', 'HR Specialist', 'Human Resources', 45000000, '2023-03-10', 'active'),
('Dewi Anggraeni', 'dewi.a@corp.com', 'UX Designer', 'Product', 70000000, '2022-11-01', 'active'),
('Eko Prasetyo', 'eko.p@corp.com', 'Data Analyst', 'Technology', 55000000, '2023-08-25', 'active'),
('Fanny Tania', 'fanny.t@corp.com', 'Senior Engineer', 'Technology', 95000000, '2021-01-05', 'inactive');