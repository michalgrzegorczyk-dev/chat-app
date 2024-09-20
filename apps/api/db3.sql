-- correct one !

-- Complete Supabase Setup Script with Fixes

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    profile_photo_url TEXT
);

CREATE TABLE IF NOT EXISTS public.conversation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    avatar_url TEXT,
    chat_type TEXT NOT NULL,
    last_message TEXT, //heer
    last_message_timestamp TIMESTAMPTZ, //her
);

CREATE TABLE IF NOT EXISTS public.conversationuser (
    conversation_id UUID,
    user_id UUID,
    PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.message (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    sender_id UUID NOT NULL,
    conversation_id UUID NOT NULL
);

-- Add foreign key constraints
ALTER TABLE public.conversationuser
ADD CONSTRAINT fk_conversation
FOREIGN KEY (conversation_id)
REFERENCES public.conversation(id);

ALTER TABLE public.conversationuser
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id)
REFERENCES public.users(id);

ALTER TABLE public.message
ADD CONSTRAINT fk_sender
FOREIGN KEY (sender_id)
REFERENCES public.users(id);

ALTER TABLE public.message
ADD CONSTRAINT fk_conversation
FOREIGN KEY (conversation_id)
REFERENCES public.conversation(id);

-- Insert initial data
INSERT INTO public.users (name, profile_photo_url) VALUES
('Bob', 'https://api.dicebear.com/6.x/bottts/svg?seed=Bob'),
('David', 'https://api.dicebear.com/6.x/micah/svg?seed=David'),
('Frank', 'https://api.dicebear.com/6.x/pixel-art/svg?seed=Frank'),
('Gizmo', 'https://api.dicebear.com/6.x/personas/svg?seed=Gizmo');

INSERT INTO public.conversation (name, avatar_url, chat_type) VALUES
('', 'https://scontent-fra3-2.xx.fbcdn.net/v/t39.30808-1/277746171_4907412222713449_1105463788788307087_n.jpg?stp=c0.619.1429.1429a_dst-jpg_s200x200&_nc_cat=111&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=Vv4jybY9wv0Q7kNvgGWVTNR&_nc_ad=z-m&_nc_cid=1365&_nc_ht=scontent-fra3-2.xx&oh=00_AYDLqBhbh-bYkxqL8gxqh-0lNTwpAMovtLlJvjIHTPcdPw&oe=66D42961', 'single'),
('Trip Tokyo', 'https://www.shareicon.net/data/128x128/2016/06/30/788858_group_512x512.png', 'group');

-- Insert conversation users (we need to fetch the UUIDs first)
WITH user_ids AS (
    SELECT id, name FROM public.users
),
conv_ids AS (
    SELECT id, name FROM public.conversation
)
INSERT INTO public.conversationuser (conversation_id, user_id)
SELECT c.id, u.id
FROM (VALUES
    ('', 'Bob'), ('', 'David'),
    ('Trip Tokyo', 'Bob'), ('Trip Tokyo', 'Frank'), ('Trip Tokyo', 'Gizmo')
) AS data(conv_name, user_name)
JOIN conv_ids c ON c.name = data.conv_name OR (c.name = '' AND data.conv_name = '')
JOIN user_ids u ON u.name = data.user_name;

-- Insert sample messages
WITH user_ids AS (
    SELECT id, name FROM public.users
),
conv_ids AS (
    SELECT id, name FROM public.conversation
)
INSERT INTO public.message (content, status, created_at, sender_id, conversation_id)
SELECT
    m.content,
    m.status,
    TO_TIMESTAMP(m.created_at, 'YYYY-MM-DD HH24:MI:SS.US'),
    u.id,
    c.id
FROM (VALUES
    ('Hello everyone!', 'sent', '2024-08-27 11:51:00.96027', 'Bob', ''),
    ('Are we still on for the meeting?', 'sent', '2024-08-27 11:51:00.96027', 'David', ''),
    ('Project deadline is tomorrow.', 'sent', '2024-08-27 11:51:00.96027', 'Frank', 'Trip Tokyo')
) AS m(content, status, created_at, sender_name, conv_name)
JOIN user_ids u ON u.name = m.sender_name
JOIN conv_ids c ON c.name = m.conv_name OR (c.name = '' AND m.conv_name = '');
