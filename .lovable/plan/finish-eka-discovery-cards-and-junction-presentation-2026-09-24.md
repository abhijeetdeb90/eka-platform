# Finish EKA discovery cards and Junction presentation

## Scope

- Build one reusable EKA card system for knowledge, places, culture, creators, communities, and events.
- Preserve the current ivory, charcoal, warm-bronze palette, Fraunces/Karla typography, photography, and calm editorial motion.
- Replace the Junction's bespoke place tiles and cultural-item blocks with the shared cards.
- Add clear card states for images, provenance/context, actions, and navigation without changing underlying business behavior.
- Improve the Junction and place pages where the existing data already supports it: search, connected-place paths, map-point links, loading, empty, and error states.

## Technical details

- Add focused card components and shared card primitives under the existing app component system.
- Use semantic design tokens and existing Button, Avatar, Badge, and router Link patterns.
- Keep data shapes flexible so current knowledge, profile, community, and event records can use the same visual language.
- Do not add new database tables or launch unrelated features.
- Verify compilation, preview rendering, and representative mobile and desktop layouts.

## Completion boundary

- Complete the six requested card types and wire the place/culture variants into the live Junction.
- Leave broader feed replacement, recommendation logic, and full in-app geographic map work as separate follow-up tasks unless time permits after the cards are verified.
