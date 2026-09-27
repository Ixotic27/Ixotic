# Ixotic — rooms on the internet

A full-screen illustrated 2D portfolio. The study, packed project library and playable tennis room occupy the viewport, with eased scene motion during native scrolling. The ending revisits the detailed front door, house and small Earth.

## Run

```sh
npm install
npm run dev
```

Production: `npm run build`, then `npm start`. Local site: http://127.0.0.1:3000.

## Explore

- Study: open the iMac for Work, About and Contact; play Pixel Quest or Maze Run on the Game Boy. WASD, arrows and touch D-pad work. Use the color drawer for live changes to the cat, plant, pot and cabinet. Object feedback appears nearby.
- Library: all 23 public repositories retrieved from Ixotic27 are books on the shelf. Hover or focus pulls a spine outward. Click or Enter opens the book. Arrow keys, swipe and Previous/Next turn its two-page spreads. Escape closes it. Forks are identified; missing project evidence is not invented.
- Tennis: play directly in the illustrated room. Move with pointer/touch, arrows or A/D. Space serves, P pauses. V/Z/X/C select drive/topspin/backspin/smash. Touch buttons select the same shots. First to seven, win by two. The match pauses when the room leaves view, the tab is hidden or a dialog opens.
- Ending: scroll from the detailed door to the house, then a small house on Earth. Reduced motion shows the final scene. Contact and quote panels remain readable and scrollable.
- Music: the sound button or M enables one continuous ambient track across the rooms, with an original platformer-style chiptune during active table tennis. No paid service or asset is required.

## Content sources

`design/github-repositories.json` is the complete public GitHub API snapshot (23 repositories, no further pagination). `design/github-readmes.json` stores the 17 available READMEs. Curated display notes live in `components/portfolio/projectNotes.ts`; raw READMEs are not included in the browser bundle. Refresh these snapshots when adding projects. Private repositories are not included.

## Main files

- `components/portfolio/StudyRoom.tsx`, `PortraitStudyArt.tsx`, `fullscreen-rooms.css`: fullscreen study, portrait composition and native scroll transitions.
- `LibraryRoom.tsx`, `ProjectBook.tsx`, `projectCatalog.ts`, `projectNotes.ts`: packed bookshelf and page reader.
- `SportsRoom.tsx`, `lib/tennisPhysics.ts`: inline SVG game and unchanged deterministic physics.
- `RoomEnding.tsx`: framing of the preserved detailed `EndingArt`.
- `components/house/DevicePanels.tsx`: information desktop, games handheld and independent journals.
- `components/journey/useRoomMusic.ts`: optional locally synthesized sound.

Earlier house and immersive journey components remain preserved but unmounted. GitHub Actions publishes the static export to https://ixotic27.github.io/Ixotic/ on pushes to main. The original GitHub README is preserved in archive/original-github/README.md. See `design/VERIFICATION.md` for checks and limitations.


## GitHub Pages

The deployment uses Next.js static export, GitHub Actions and free GitHub Pages hosting. No server or paid API is required. The workflow sets `GITHUB_PAGES=true` and `NEXT_PUBLIC_BASE_PATH=/Ixotic`; normal local builds keep the root path and Next server. Legacy /about, /projects, /skills and /contact routes redirect in the browser and include fallback links.

Configuration references: [Next.js static export](https://nextjs.org/docs/app/guides/static-exports) and [GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
