# DATABASE_SPEC.md

## 1. Purpose

Define what belongs in persistent storage and what remains static/application data.

## 2. Guiding Principle

Do not store everything in the database.

### Static/configuration data

Prefer repository-managed content for the initial curriculum when practical:

- modules,
- topics,
- lesson content,
- examples,
- curated exercises,
- visualization presets.

### User-specific data

Persist:

- profile,
- progress,
- attempts,
- saved playgrounds,
- saved visualizations,
- preferences where required.

## 3. Logical Tables

Potential schema:

```text
profiles
modules
user_progress
topic_attempts
playground_sessions
saved_visualizations
```

A future CMS may add:

```text
topics
topic_sections
examples
exercises
visualization_presets
```

Do not introduce those tables until dynamic authoring is genuinely needed.

## 4. Profiles

Conceptual fields:

```text
id
created_at
updated_at
display_name
preferences
```

Avoid storing unnecessary personal data.

## 5. Progress

Conceptual:

```text
user_id
topic_id
status
progress_percent
last_opened_at
completed_at
```

Use stable topic IDs so content can be reordered without destroying progress history.

## 6. Attempts

Store only what is useful for learning analytics or resuming activity.

Potential fields:

```text
user_id
exercise_id
answer_state
is_correct
attempt_count
created_at
```

Do not store sensitive data unnecessarily.

## 7. Playground Sessions

Potential fields:

```text
id
user_id
question
response_summary
topic_id
visualization_spec
created_at
```

Large binary assets should use object storage rather than database blobs.

## 8. Row Level Security

Authenticated users should only access their own user-specific records unless a deliberate sharing feature exists.

## 9. Migrations

All schema changes must be versioned through migrations.

Never make undocumented production schema changes manually.

## 10. Content Migration

If curriculum moves from repository files to database-managed content later:

1. preserve stable IDs/slugs,
2. migrate content,
3. verify topic URLs,
4. verify visualization references,
5. verify progress mappings,
6. remove old source only after validation.
