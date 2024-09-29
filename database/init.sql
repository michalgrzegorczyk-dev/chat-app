DROP TABLE IF EXISTS public.message CASCADE;
DROP TABLE IF EXISTS public.conversationuser CASCADE;
DROP TABLE IF EXISTS public.conversation CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

DROP EXTENSION IF EXISTS "uuid-ossp";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
    last_message TEXT,
    last_message_timestamp TIMESTAMPTZ,
    last_message_sender_id UUID
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
    conversation_id UUID NOT NULL,
    local_message_id TEXT NOT NULL
);

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

INSERT INTO public.users (name, profile_photo_url) VALUES
('David', 'https://api.dicebear.com/9.x/adventurer/svg?seed=Mackenzie&skinColor=ecad80,f2d3b1'),
('Frank', 'https://api.dicebear.com/9.x/adventurer/svg?seed=Liam&skinColor=ecad80,f2d3b1'),
('Gizmo', 'https://api.dicebear.com/9.x/adventurer/svg?seed=George'),
('Bob', 'https://api.dicebear.com/9.x/adventurer/svg?seed=Brian&skinColor=ecad80,f2d3b1');

INSERT INTO public.conversation (name, avatar_url, chat_type) VALUES
('David and Bob', '', 'single'),
('David and Frank', '', 'single'),
('Bob and Frank', '', 'single'),
('Gizmo and David', '', 'single');

WITH user_ids AS (
    SELECT id, name FROM public.users
),
conv_ids AS (
    SELECT id, name FROM public.conversation
)
INSERT INTO public.conversationuser (conversation_id, user_id)
SELECT c.id, u.id
FROM (VALUES
      ('David and Bob', 'David'),
      ('David and Bob', 'Bob'),
      ('David and Frank', 'David'),
      ('David and Frank', 'Frank'),
      ('Bob and Frank', 'Bob'),
      ('Bob and Frank', 'Frank'),
      ('Gizmo and David', 'Gizmo'),
      ('Gizmo and David', 'David')
) AS data(conv_name, user_name)
JOIN conv_ids c ON c.name = data.conv_name
JOIN user_ids u ON u.name = data.user_name;

WITH user_ids AS (
    SELECT id, name FROM public.users
),
conv_ids AS (
    SELECT id, name FROM public.conversation
)
INSERT INTO public.message (content, status, created_at, sender_id, conversation_id, local_message_id)
SELECT
    m.content,
    m.status,
    TO_TIMESTAMP(m.created_at, 'YYYY-MM-DD HH24:MI:SS.US'),
    u.id,
    c.id,
    m.local_message_id
FROM (VALUES
    ('Hi Bob, how are you?', 'sent', '2024-08-27 10:15:00.12345', 'David', 'David and Bob', 'local1'),
    ('I am good, thanks! How about you?', 'sent', '2024-08-27 10:20:00.12345', 'Bob', 'David and Bob', 'local2'),
    ('Let’s discuss the project tomorrow.', 'sent', '2024-08-27 10:25:00.12345', 'David', 'David and Frank', 'local3'),
    ('Sure, I will be available.', 'sent', '2024-08-27 10:30:00.12345', 'Frank', 'David and Frank', 'local4'),
    ('Hey Bob, do you have the report?', 'sent', '2024-08-27 10:35:00.12345', 'Bob', 'Bob and Frank', 'local5'),
    ('Yes, I will send it to you shortly.', 'sent', '2024-08-27 10:40:00.12345', 'Frank', 'Bob and Frank', 'local6'),
    ('Hi David, do you need help with the presentation?', 'sent', '2024-08-27 10:45:00.12345', 'Gizmo', 'Gizmo and David', 'local7'),
    ('Yes, that would be great! Thanks!', 'sent', '2024-08-27 10:50:00.12345', 'David', 'Gizmo and David', 'local8')
) AS m(content, status, created_at, sender_name, conv_name, local_message_id)
JOIN user_ids u ON u.name = m.sender_name
JOIN conv_ids c ON c.name = m.conv_name;

WITH latest_messages AS (
    SELECT
        conversation_id,
        content AS last_message,
        created_at AS last_message_timestamp,
        sender_id AS last_message_sender_id
    FROM public.message
    WHERE created_at = (
        SELECT MAX(created_at)
        FROM public.message AS sub
        WHERE sub.conversation_id = public.message.conversation_id
    )
)
UPDATE public.conversation AS conv
SET
    last_message = lm.last_message,
    last_message_timestamp = lm.last_message_timestamp,
    last_message_sender_id = lm.last_message_sender_id
FROM latest_messages lm
WHERE conv.id = lm.conversation_id;

ALTER TABLE public.conversation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversationuser ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message ENABLE ROW LEVEL SECURITY;

CREATE POLICY conversation_policy ON public.conversation
    FOR ALL USING (true);

CREATE POLICY conversationuser_policy ON public.conversationuser
    FOR ALL USING (true);

CREATE POLICY message_policy ON public.message
    FOR ALL USING (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversation TO PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversationuser TO PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.message TO PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO PUBLIC;

GRANT USAGE ON SCHEMA public TO PUBLIC;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO PUBLIC;
