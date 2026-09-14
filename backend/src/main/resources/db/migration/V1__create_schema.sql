CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE account (
    account_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username        VARCHAR(50)  NOT NULL,
    email           VARCHAR(255),
    password        VARCHAR(255) NOT NULL,
    account_status  VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE'
        CHECK (account_status IN ('ACTIVE', 'INACTIVE', 'BANNED', 'DELETED')),
    role            VARCHAR(50)  NOT NULL DEFAULT 'USER'
        CHECK (role IN ('USER', 'MANAGER', 'ADMIN')),
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),

    CONSTRAINT uq_accounts_username UNIQUE (username)
);

CREATE INDEX idx_accounts_status ON account (account_status);
CREATE INDEX idx_accounts_role   ON account (role);

CREATE TRIGGER trg_accounts_updated_at
    BEFORE UPDATE ON account
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE media (
    media_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id    UUID NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
    type        VARCHAR(20)  NOT NULL CHECK (type IN ('IMAGE', 'VIDEO', 'AUDIO', 'FILE')),
    mime_type   VARCHAR(100) NOT NULL,
    storage_key TEXT NOT NULL,
    file_name   VARCHAR(255),
    file_size   BIGINT,
    width       INT,
    height      INT,
    duration    FLOAT,
    status      VARCHAR(20) NOT NULL DEFAULT 'PROCESSING'
        CHECK (status IN ('PROCESSING', 'READY', 'FAILED')),
    metadata    JSONB,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_media_owner  ON media (owner_id);
CREATE INDEX idx_media_status ON media (status);
CREATE INDEX idx_media_type   ON media (type);
CREATE INDEX idx_media_metadata_gin ON media USING GIN (metadata);

CREATE TRIGGER trg_media_updated_at
    BEFORE UPDATE ON media
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE media_variants (
    variant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_id   UUID NOT NULL REFERENCES media(media_id) ON DELETE CASCADE,
    variant    VARCHAR(20) NOT NULL,   -- thumbnail, medium, large, original
    url        TEXT NOT NULL,
    width      INT,
    height     INT,
    file_size  BIGINT,

    CONSTRAINT uq_media_variant UNIQUE (media_id, variant)
);

CREATE INDEX idx_media_variants_media ON media_variants (media_id);

CREATE TABLE profile (
    profile_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id      UUID NOT NULL UNIQUE REFERENCES account(account_id) ON DELETE CASCADE,
    first_name    VARCHAR(100),
    last_name     VARCHAR(100),
    date_of_birth DATE,
    organization TEXT,
    country VARCHAR(50),
    city VARCHAR(255),
    address TEXT,
    phone_number VARCHAR(15),
    is_phone_verified BOOLEAN,
    bio             TEXT,
    avatar_media_id UUID REFERENCES media(media_id) ON DELETE SET NULL,
    cover_media_id  UUID REFERENCES media(media_id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON profile
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE post (
    post_id     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    account_id  UUID NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
    content     TEXT,
    visibility  VARCHAR(20) NOT NULL DEFAULT 'PUBLIC'
        CHECK (visibility IN ('PUBLIC', 'FOLLOWERS', 'PRIVATE', 'EVENT_MEMBER')),
    status      VARCHAR(20) NOT NULL DEFAULT 'PUBLISHED'
        CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED', 'DELETED')),
    event_id BIGINT,
    like_count    INT NOT NULL DEFAULT 0,
    comment_count INT NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_posts_account    ON post (account_id);
CREATE INDEX idx_posts_created_at ON post (created_at DESC);
CREATE INDEX idx_posts_status     ON post (status);

CREATE TRIGGER trg_posts_updated_at
    BEFORE UPDATE ON post
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE post_media (
    post_id  BIGINT NOT NULL REFERENCES post(post_id)  ON DELETE CASCADE,
    media_id UUID NOT NULL REFERENCES media(media_id) ON DELETE CASCADE,
    position INT NOT NULL DEFAULT 0,

    PRIMARY KEY (post_id, media_id)
);

CREATE INDEX idx_post_media_media ON post_media (media_id);

CREATE TABLE comment (
    comment_id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    post_id           BIGINT NOT NULL REFERENCES post(post_id) ON DELETE CASCADE,
    account_id        UUID NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
    parent_comment_id BIGINT REFERENCES comment(comment_id) ON DELETE CASCADE,
    content           TEXT NOT NULL,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_comments_post    ON comment (post_id);
CREATE INDEX idx_comments_account ON comment (account_id);
CREATE INDEX idx_comments_parent  ON comment (parent_comment_id);

CREATE TRIGGER trg_comments_updated_at
    BEFORE UPDATE ON comment
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE follow (
    follower_id  UUID NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

    PRIMARY KEY (follower_id, following_id),
    CONSTRAINT chk_no_self_follow CHECK (follower_id <> following_id)
);

CREATE INDEX idx_follows_following ON follow (following_id);

CREATE TABLE refresh_token (
    token_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id  UUID NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
    token_hash  VARCHAR(255) NOT NULL,
    device_info VARCHAR(255),
    ip_address  INET,
    expires_at  TIMESTAMPTZ NOT NULL,
    revoked_at  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT uq_refresh_token_hash UNIQUE (token_hash)
);

CREATE INDEX idx_refresh_tokens_account ON refresh_tokens (account_id);

CREATE TABLE notification (
    notification_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    account_id  UUID NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
    actor_id    UUID REFERENCES account(account_id) ON DELETE CASCADE,
    type        VARCHAR(50) NOT NULL,   -- like, comment, follow, mention...
    content     TEXT NOT NULL,
    destination_type VARCHAR(50),
    destination_id   VARCHAR(255),
    is_read     BOOLEAN NOT NULL DEFAULT false,
    is_deleted  BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_account         ON notifications (account_id);
CREATE INDEX idx_notifications_account_unread  ON notifications (account_id, is_read) WHERE is_read = false;

CREATE TABLE event (
    event_id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title                VARCHAR(255) NOT NULL,
    created_at           TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at           TIMESTAMPTZ  NOT NULL DEFAULT now(),
    start_at             TIMESTAMPTZ,
    end_at               TIMESTAMPTZ,
    category             VARCHAR(255) NOT NULL,
    location             TEXT,
    description          TEXT,
    status               VARCHAR(20)  NOT NULL
        CHECK (status IN ('DRAFT', 'PUBLISHED', 'ONGOING', 'COMPLETED', 'CANCELLED')),
    attendee_count       INT NOT NULL DEFAULT 0 CHECK (attendee_count >= 0),
    like_count           INT NOT NULL DEFAULT 0 CHECK (like_count >= 0),
    slug                 VARCHAR(255),
    created_by_account_id UUID REFERENCES account(account_id) ON DELETE SET NULL,

    CONSTRAINT uq_event_slug UNIQUE (slug),
    CONSTRAINT chk_event_dates CHECK (end_at IS NULL OR start_at IS NULL OR end_at >= start_at)
);

ALTER TABLE post
    ADD CONSTRAINT fk_post_event
    FOREIGN KEY (event_id) REFERENCES event(event_id) ON DELETE SET NULL;

CREATE INDEX idx_event_status     ON event (status);
CREATE INDEX idx_event_category   ON event (category);
CREATE INDEX idx_event_start_at   ON event (start_at);
CREATE INDEX idx_event_created_by ON event (created_by_account_id);

CREATE TRIGGER trg_event_updated_at
    BEFORE UPDATE ON event
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE account_media (
    account_id UUID NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
    media_id   UUID NOT NULL REFERENCES media(media_id) ON DELETE CASCADE,

    PRIMARY KEY (account_id, media_id)
);

CREATE INDEX idx_account_media_media ON account_media (media_id);

CREATE TABLE post_like (
    account_id UUID NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
    post_id    BIGINT NOT NULL REFERENCES post(post_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    PRIMARY KEY (account_id, post_id)
);

CREATE INDEX idx_post_like_post ON post_like (post_id);

CREATE TABLE event_like (
    account_id UUID NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
    event_id   BIGINT NOT NULL REFERENCES event(event_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    PRIMARY KEY (account_id, event_id)
);

CREATE INDEX idx_event_like_event ON event_like (event_id);

CREATE TABLE event_user (
    account_id      UUID NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
    event_id        BIGINT NOT NULL REFERENCES event(event_id) ON DELETE CASCADE,
    registered_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('APPROVED', 'REJECTED', 'PENDING', 'FINISHED', 'UNFINISHED')),
    event_user_role VARCHAR(20) NOT NULL DEFAULT 'ATTENDEE'
        CHECK (event_user_role IN ('ATTENDEE', 'MANAGER')),
    start_at        TIMESTAMPTZ,
    end_at          TIMESTAMPTZ,

    PRIMARY KEY (account_id, event_id)
);

CREATE INDEX idx_event_user_event  ON event_user (event_id);
CREATE INDEX idx_event_user_status ON event_user (status);

CREATE TABLE event_media (
    event_id BIGINT NOT NULL REFERENCES event(event_id) ON DELETE CASCADE,
    media_id UUID   NOT NULL REFERENCES media(media_id) ON DELETE CASCADE,

    PRIMARY KEY (event_id, media_id)
);

CREATE INDEX idx_event_media_media ON event_media (media_id);

CREATE TABLE request (
    request_id     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    account_id     UUID NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
    status         VARCHAR(20) NOT NULL DEFAULT 'WAITING'
        CHECK (status IN ('WAITING', 'APPROVED', 'REJECTED')),
    reason         TEXT,
    admin_response TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_request_account ON request (account_id);
CREATE INDEX idx_request_status  ON request (status);

CREATE TRIGGER trg_request_updated_at
    BEFORE UPDATE ON request
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE fcm_token (
    fcm_token_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    token        VARCHAR(255) NOT NULL,
    account_id   UUID         NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),

    CONSTRAINT uq_fcm_token UNIQUE (token)
);

CREATE INDEX idx_fcm_token_account ON fcm_token (account_id);
