-- SprintShield v3.0 MVP - SQL Schema
-- Status: Final Draft for MVP

-- Users table: Stores information about individual users.
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,              -- Unique identifier for the user
    name VARCHAR(255) NOT NULL,         -- User's full name
    email VARCHAR(255) UNIQUE NOT NULL, -- User's email address (must be unique)
    avatar_url TEXT,                    -- URL to the user's avatar image (optional)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Timestamp of user creation
);

-- Projects table: Stores information about each project.
CREATE TABLE Projects (
    id SERIAL PRIMARY KEY,              -- Unique identifier for the project
    name VARCHAR(255) NOT NULL,         -- Name of the project
    description TEXT,                   -- Detailed description of the project (optional)
    created_by_user_id INTEGER NOT NULL, -- User ID of the project creator
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Timestamp of project creation
    FOREIGN KEY (created_by_user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- ProjectMembers table: Links users to projects, defining project membership.
CREATE TABLE ProjectMembers (
    project_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    role VARCHAR(50) DEFAULT 'member', -- Role of the user in the project (e.g., 'admin', 'member')
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, user_id), -- Composite primary key
    FOREIGN KEY (project_id) REFERENCES Projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- KanbanColumns table: Defines the columns for the Kanban board within each project.
CREATE TABLE KanbanColumns (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,         -- Name of the Kanban column (e.g., "To Do", "In Progress")
    column_order INTEGER NOT NULL,      -- Order of the column on the board
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES Projects(id) ON DELETE CASCADE,
    UNIQUE (project_id, name),          -- Column names must be unique within a project
    UNIQUE (project_id, column_order)   -- Column order must be unique within a project
);

-- Tasks table: Stores information about individual tasks within a project.
CREATE TABLE Tasks (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL,
    column_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,        -- Task title
    description TEXT,                   -- Detailed description of the task (optional)
    assignee_user_id INTEGER,           -- User ID of the person assigned to the task (optional)
    due_date DATE,                      -- Due date for the task (optional)
    figma_link TEXT,                    -- URL to the current Figma design file
    figma_preview_url TEXT,             -- URL to the preview image of the Figma design
    created_by_user_id INTEGER NOT NULL, -- User ID of the task creator
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Timestamp of last update
    FOREIGN KEY (project_id) REFERENCES Projects(id) ON DELETE CASCADE,
    FOREIGN KEY (column_id) REFERENCES KanbanColumns(id) ON DELETE RESTRICT, -- Prevent deleting column if tasks exist
    FOREIGN KEY (assignee_user_id) REFERENCES Users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by_user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- DesignProposals table: Stores information about proposed design changes for a task.
CREATE TABLE DesignProposals (
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL,
    proposed_by_user_id INTEGER NOT NULL,
    new_figma_link TEXT NOT NULL,       -- URL to the new Figma design file
    reason TEXT NOT NULL,               -- Justification for the proposed change
    status VARCHAR(50) DEFAULT 'pending' NOT NULL, -- Status: 'pending', 'approved', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reviewed_by_user_id INTEGER,        -- User ID of the person who reviewed the proposal (optional)
    reviewed_at TIMESTAMP WITH TIME ZONE, -- Timestamp of when the proposal was reviewed
    FOREIGN KEY (task_id) REFERENCES Tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (proposed_by_user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by_user_id) REFERENCES Users(id) ON DELETE SET NULL
);

-- TaskActivities table: Logs all activities related to a task (e.g., creation, comments, status changes, consensus, proposals).
CREATE TABLE TaskActivities (
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,           -- User who performed the activity
    activity_type VARCHAR(100) NOT NULL, -- Type of activity (e.g., 'created', 'commented', 'status_changed', 'consensus_recorded', 'design_proposed', 'design_approved', 'design_rejected')
    content TEXT,                       -- Details of the activity (e.g., comment text, new status, link to DesignProposal)
    design_proposal_id INTEGER,         -- Optional link to a design proposal
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES Tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (design_proposal_id) REFERENCES DesignProposals(id) ON DELETE SET NULL
);

-- Indexes for frequently queried columns
CREATE INDEX idx_tasks_project_column ON Tasks(project_id, column_id);
CREATE INDEX idx_task_activities_task_id ON TaskActivities(task_id);
CREATE INDEX idx_project_members_project_id ON ProjectMembers(project_id);
CREATE INDEX idx_project_members_user_id ON ProjectMembers(user_id);

-- Initial Data (Optional - for demo purposes, can be populated by the application later)
-- Example: Add default Kanban columns for a new project (this would typically be done by application logic)
-- INSERT INTO KanbanColumns (project_id, name, column_order) VALUES (1, '待規劃', 0);
-- INSERT INTO KanbanColumns (project_id, name, column_order) VALUES (1, '待辦', 1);
-- INSERT INTO KanbanColumns (project_id, name, column_order) VALUES (1, '進行中', 2);
-- INSERT INTO KanbanColumns (project_id, name, column_order) VALUES (1, '待測試', 3);
-- INSERT INTO KanbanColumns (project_id, name, column_order) VALUES (1, '已完成', 4);

COMMENT ON TABLE Users IS 'Stores information about individual users.';
COMMENT ON TABLE Projects IS 'Stores information about each project.';
COMMENT ON TABLE ProjectMembers IS 'Links users to projects, defining project membership.';
COMMENT ON TABLE KanbanColumns IS 'Defines the columns for the Kanban board within each project.';
COMMENT ON TABLE Tasks IS 'Stores information about individual tasks within a project.';
COMMENT ON TABLE DesignProposals IS 'Stores information about proposed design changes for a task.';
COMMENT ON TABLE TaskActivities IS 'Logs all activities related to a task (e.g., creation, comments, status changes, consensus, proposals).';
