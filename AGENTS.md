# Lazy Songbook project

This project aims to create online songbook to store songs for playing with friends.

Primary use-case is for playing on guitar and singing.

## Target core features

1. user can create and manage their own song library
2. user can share their library, so others can see their songs
   - via link, later also QR code
3. sing-along/play-along mode, others can see currently played song, so they can sing or play along
   - builds on library sharing feature
4. vote for next song in sing-along mode
   - user can vote for next song from the shared library

## Technical idea

Goal is to make functional PoC locally.

When the PoC passes expectations, local solutions will be swapped for deployable and maintainable ones.

- UI is in Vue/Nuxt
  - viewing is responsible, mobile-friendly
  - editing is meant for desktop, but still usable on mobile
- API is in Nuxt/H3
  - CRUD operations for users
  - later also sharing
- DB - sqlite for now
  - calls to DB will be separated from the rest of the app in service layer, so DB solution can be swapped later if needed

## Instructions

- Do not run dev server or any processes that run on the background indefinitely
