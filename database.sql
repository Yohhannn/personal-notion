-- PostgreSQL Database Initialization Schema for YH Lab Notion
-- Run this on your Homelab PostgreSQL instance!

-- 1. Enable unique identifiers
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Workspaces
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Kanban Categories (e.g. 'To Do', 'In Progress')
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    sort_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Kanban Cards
CREATE TABLE cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT, -- TipTap HTML String
    sort_order INTEGER NOT NULL,
    
    -- Sub-tasks stored recursively as JSONB to prevent heavy drag-n-drop calculation lag
    sub_tasks JSONB DEFAULT '[]'::jsonb, 
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Helper Function: Update the card's updated_at timestamp on edit
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cards_modtime
BEFORE UPDATE ON cards
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
