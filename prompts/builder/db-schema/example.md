-- Users Table
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bugs Table
CREATE TABLE Bugs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Open', -- e.g., Open, In Progress, Closed
    reporter_id INT REFERENCES Users(id),
    assignee_id INT REFERENCES Users(id),
    severity VARCHAR(20) DEFAULT 'Medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments Table
CREATE TABLE Comments (
    id SERIAL PRIMARY KEY,
    bug_id INT REFERENCES Bugs(id) ON DELETE CASCADE,
    commenter_id INT REFERENCES Users(id),
    text TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_bugs_status ON Bugs(status);
CREATE INDEX idx_bugs_assignee ON Bugs(assignee_id);
