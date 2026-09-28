> Canonical EKA documentation. Source of truth for product, architecture, trust and delivery decisions.
> Versioning: v0.1, v0.2, v1.0. Mark assumptions as `ASSUMPTION` and unresolved decisions as `OPEN`.
> Never store passwords, API keys, tokens, private user data or production secrets in this repository.

# MVP Scope and Priorities

## MVP objective

Validate whether users repeatedly discover, consume, save, discuss, and contribute trusted cultural/spiritual/local knowledge.

## Must-have

- Account creation and authentication
- User profiles and interests
- Feed and discovery
- Content cards and detailed content pages
- Structured content metadata
- Source and attribution fields
- Categories, tags, locations, and entities
- Save/bookmark functionality
- Comments and reporting
- Creator submission flow
- Admin review queue
- Basic search
- Audit logging for important actions
- Basic analytics
- Responsive web experience

## Should-have

- Related content and entity recommendations
- Community context contributions
- Map/list discovery
- Creator dashboard
- Trust labels
- Notifications
- Basic moderation rules

## Later

- Creator subscriptions
- Revenue sharing
- Advanced recommendation engine
- Multi-language workflows
- Marketplace and bookings
- Partner APIs
- Advanced knowledge graph
- Mobile native applications

## Exit criteria

The MVP is ready for controlled testing when critical user journeys work, sensitive data is protected, moderation exists, errors are observable, and rollback procedures are documented.

---

# MVP Build Backlog

## Epic 1: Foundation

- Repository and environments
- Authentication
- Database migrations
- Roles and permissions
- Design tokens and base components

## Epic 2: Knowledge layer

- Content model
- Sources and citations
- Entities and relations
- Taxonomy
- Content detail page
- Review workflow

## Epic 3: Social layer

- Feed
- Save
- Follow
- Comments
- Reports
- Notifications

## Epic 4: Creator layer

- Creator profile
- Drafts
- Submission
- Review feedback
- Basic analytics

## Epic 5: Operations

- Admin console
- Audit logs
- Monitoring
- Backup and restore
- Launch checklist

## Definition of done

Each backlog item needs acceptance criteria, permission rules, analytics events, error states, test cases, and owner.
