CREATE TABLE support_requests (
    request_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'General',
    priority VARCHAR(20) NOT NULL DEFAULT 'Medium',
    created_by VARCHAR(100) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'New',
    assigned_to VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT valid_priority CHECK (
        priority IN ('Low', 'Medium', 'High', 'Urgent')
    ),

    CONSTRAINT valid_status CHECK (
        status IN (
            'New',
            'In Review',
            'Assigned',
            'In Progress',
            'More Info Required',
            'Resolved',
            'Closed'
        )
    )
);


CREATE TABLE comments (
    comment_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    request_id INTEGER NOT NULL,
    author VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_comment_request
        FOREIGN KEY (request_id)
        REFERENCES support_requests(request_id)
        ON DELETE CASCADE
);


CREATE TABLE status_history (
    history_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    request_id INTEGER NOT NULL,
    old_status VARCHAR(30) NOT NULL,
    new_status VARCHAR(30) NOT NULL,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_history_request
        FOREIGN KEY (request_id)
        REFERENCES support_requests(request_id)
        ON DELETE CASCADE
);