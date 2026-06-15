# Lazy Songbook project

This project aims to create online songbook to store songs for playing with friends.

Primary use-case is for playing on guitar and singing.

## Core features

1. user can create and manage their own song library
2. user can share their library, so others can see their songs
   - via link or QR code
3. sing-along/play-along mode, others can see currently played song, so they can sing or play along
   - builds on library sharing feature

## Technical aspects

Project is already deployed, no data loss when manipulating with DB schemas.

- UI is in Vue/Nuxt
  - viewing is responsible, mobile-friendly
  - editing is meant for desktop, but still usable on mobile
- API is in Nuxt/H3
  - CRUD operations to DB
- DB - prostgres sql / object storage
  - DB calls are separated to service layer, so DB solution can be swapped later if needed (mostly)

## Instructions

- Do not run dev server or any processes that run on the background indefinitely
- Prefer imports with aliases `#server/` or `#shared/` over multiple `../`
  - These aliases **do** work, they are just scoped so `#server` cannot be used in `app` for example
