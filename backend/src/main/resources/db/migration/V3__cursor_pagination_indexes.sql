-- Keyset (cursor) pagination indexes.
--
-- Why the existing single-column indexes are not enough: a keyset query looks like
--   WHERE (created_at, id) < (?, ?) ORDER BY created_at DESC, id DESC LIMIT ?
-- The tie-breaker column must be part of the index, otherwise PostgreSQL has to fetch and
-- sort every row that shares a boundary timestamp, which reintroduces the cost that keyset
-- pagination removes. The index column order must therefore match the ORDER BY exactly:
-- equality filter columns first, then the time column, then the primary key.
--
-- PostgreSQL reads a b-tree in either direction, so one index per column list serves both
-- ASC and DESC scans; there is no need for a mirrored ASC index.
--
-- Deliberately additive: the now-redundant single-column indexes (idx_posts_created_at,
-- idx_posts_account) are left in place. They are strict prefixes of the composites below and
-- can be dropped in a later migration once EXPLAIN confirms the new indexes are being used.
--
-- CREATE INDEX (not CONCURRENTLY) per the plan's decision Q8: Flyway runs each migration in a
-- transaction and the target tables are not yet under concurrent write load.

-- ---------------------------------------------------------------------------
-- post  (#1 GET /api/posts/search, #2 /by-event/{eventId}, #3 /by-account/{username})
-- All three list newest-first and exclude DELETED rows.
-- ---------------------------------------------------------------------------

-- Global newsfeed: no equality column, so the sort tuple leads.
CREATE INDEX idx_posts_created_id
    ON post (created_at DESC, post_id DESC);

-- Posts of one event.
CREATE INDEX idx_posts_event_created_id
    ON post (event_id, created_at DESC, post_id DESC);

-- Posts of one account (profile timeline).
CREATE INDEX idx_posts_account_created_id
    ON post (account_id, created_at DESC, post_id DESC);

-- ---------------------------------------------------------------------------
-- comment  (#4 GET /api/posts/{id}/comments, #5 /api/comments/search,
--           #6 /api/comments/{parentCommentId}/replies)
-- ---------------------------------------------------------------------------

-- Comments of one post, newest first.
CREATE INDEX idx_comments_post_created_id
    ON comment (post_id, created_at DESC, comment_id DESC);

-- Replies of one comment, oldest first (a thread reads top to bottom).
-- Partial: the query always constrains parent_comment_id to a concrete value, so root
-- comments (parent_comment_id IS NULL, the majority of rows) need not be indexed here.
CREATE INDEX idx_comments_parent_created_id
    ON comment (parent_comment_id, created_at, comment_id)
    WHERE parent_comment_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- event  (#7 GET /api/events/search-public)
-- ---------------------------------------------------------------------------

CREATE INDEX idx_event_created_id
    ON event (created_at DESC, event_id DESC);

-- ---------------------------------------------------------------------------
-- event_user  (#8 GET /api/events/{eventId}/participants)
--
-- Composite primary key (account_id, event_id), so account_id alone is not unique and cannot
-- be the tie-breaker on its own. With event_id pinned by the filter, account_id is unique
-- among the remaining rows and serves as the tie-breaker here.
-- ---------------------------------------------------------------------------

CREATE INDEX idx_event_user_event_registered_id
    ON event_user (event_id, registered_at, account_id);
