# Ixotic’s House — implementation plan

Status: the core house experience is implemented. This document now records both the delivered scope and the original design target. Verification outcomes are tracked separately in `design/VERIFICATION.md`.

## Delivered scope and adaptations

- The homepage uses one connected, four-room Three.js cutaway with an orthographic pixel-art view, native-scroll camera stops, direct room navigation, and interactive geometry. The overview keeps a narrow roof fringe; there is no animated full roof or camera-facing wall reveal.
- A small semantic HTML room map and a Simple view provide direct access to room cards when visitors prefer the lightweight interface or WebGL is unavailable.
- The iMac, Game Boy, and independent bookshelf reader open in HTML dialogs from the room controls. They do not trigger an object-specific camera zoom. The Game Boy includes Work, About, Contact, and Pixel Quest; bookshelf journals remain independent of the computer.
- The kitchen has a stylized voxel avatar and a short coffee interaction. The table-tennis match uses a separate temporary Three.js renderer and pauses the house renderer while it is open. Its opponent shares the house avatar palette, but does not traverse from the kitchen into the games room.
- Match sound is omitted. The local match remains playable without an audio dependency.
- House geometry and illustrations are procedural. No paid services, APIs, or asset packs are needed.

The implementation status above describes code scope, not test results. See `design/VERIFICATION.md` for verification evidence and remaining checks.

The following sections preserve the original design target for context. Where they conflict with the delivered adaptations above, the delivered-scope notes describe the current implementation.

## Direction

Build one connected, furnished 3D house with the current pixel-art character. Actual geometry supplies depth, occlusion, lighting, and camera movement. An orthographic camera and a deliberately low-resolution render preserve the 2D game appearance. No photorealism, glossy materials, or CSS perspective substitutes.

The project began with a flat SVG room. The house implementation replaces that renderer with connected Three.js geometry while retaining the palette direction and portfolio content. Three.js and its types were already installed.

## House and tour

A cutaway single-storey house, viewed from above at an angle, with a front garden, porch, visible exterior wall thickness, and four connected rooms. Show a roofed exterior in the opening overview, then lift or hide the roof and camera-facing walls when exploring. Retain walls and doorways that explain the floor plan without hiding interactive furniture.

```
      ┌───────────────────┬────────────────────┐
      │ Study / workspace │ Library / lounge   │
      │ iMac + Game Boy   │ Independent books  │
      ├───────── connecting hall ──────────────┤
      │ Kitchen / coffee  │ Sports room        │
      │ Avatar + counter  │ Table tennis       │
      └──────── porch / garden entrance ───────┘
```

Native vertical scrolling progresses through overview → study → library → kitchen → sports. These are camera stops in one spatially connected scene, not separate flat illustrations. Reverse scrolling returns along the same route. Provide named room buttons and a small house map for direct access, plus room URL hashes. When a device or game is open, suspend scroll-driven camera movement; restore the previous room and scroll position on exit. With reduced motion, switch directly between stable room views.

## Visual corrections

- iMac: replace the landscape wallpaper with a quiet ink-blue pixel constellation. Folder icons use amber, cyan, coral and lilac; readable cream label plates and distinct silhouettes separate icons from the wallpaper. Selected icons also get a border and marker so state is not color-only.
- Cat: cream-and-charcoal fur on a dark teal cushion, separated from the wood floor. Give face, ears and tail distinct pixel shapes.
- Furniture: light oak desktop, dark structural edges, a muted blue chair, deep green foliage, and brick-red plant pots. Separate neighboring surfaces in brightness as well as hue.
- Rooms share a coherent palette but have different accents: amber study, sage library, terracotta kitchen, navy-and-cyan sports room.
- Use a small number of flat shades per material, crisp contact shadows, directional window light, visible furniture sides and wall/floor thickness. Pixel outlines should support object recognition rather than cover everything uniformly.
- Render scene artwork at a controlled low resolution and upscale with nearest-neighbor filtering. Keep UI and text in accessible HTML so content remains readable at phone sizes.

## Independent interactions

### Study

Clicking the iMac moves the camera closer and opens its desktop. Reuse Work, About and Contact; give each app its own icon and window state. Keep the handheld as a separate device with D-pad/A/B controls and Pixel Quest. The device interfaces should visually originate from their physical objects and restore the room when closed.

### Library / lounge

The bookshelf has its own interaction and content state. Clicking it zooms toward the shelf; selecting a spine opens a book or journal interface with pages. Start with project journals, a skills notebook, and an about journal using the existing portfolio content. Do not invent a personal reading list. Opening books must never launch or change the iMac.

A reading chair, contrasting cat cushion, side table and floor lamp make this a distinct place rather than another desk screen.

### Kitchen / coffee

Introduce a pixel-styled 3D avatar with clearly separated hair, clothing, skin and shoes. Keep appearance configurable; a stylized placeholder is not claimed to resemble the owner.

Use a small animation sequence: approach counter → reach for mug → pick up → raise mug → sip → set down. Model the mug and arm movement in 3D; the mug attaches to the hand during pickup. Trigger once on entering or clicking the coffee interaction, with a replay action. Include a coffee machine, tile backsplash, counter, stools and controlled steam particles. Avoid endless distracting animation and disable incidental movement for reduced motion.

### Sports room

A full table-tennis table with actual thickness, legs, white lines, net, paddles, scoreboard and enough clear space to read play. Clicking the table offers a match against the owner's avatar. The avatar follows a simple predefined route into position; avoid unexplained simultaneous copies in different rooms.

First playable version:
- Local single-player match against a computer-controlled avatar; no server or account.
- Brief instructions, serve countdown, visible score, pause, restart and exit.
- Pointer/touch movement controls the player's paddle; keyboard arrows or A/D provide an alternative. Space or a visible button serves.
- A forgiving automatic swing on contact, with shot direction influenced by contact position and paddle movement.
- True 3D ball position, velocity, gravity, table bounce, net collision, out-of-bounds detection and point resets, updated with a fixed physics timestep.
- Arcade scoring: first to 7, requiring a two-point lead. Label this as a short match, not a full rules simulation.
- Opponent has bounded speed, reaction delay and occasional errors. No impossible instant ball tracking.
- A victory/defeat screen and rematch. Pause physics when the tab is hidden or the match is paused; suspend house navigation during play.
- Optional sound is muted initially and enabled by an explicit control; simple browser-generated effects need no paid audio assets.

Later optional additions, after the core is polished: difficulty choices, best rally saved locally, alternate avatar outfits and a small garden interaction. Online multiplayer, complex character customization and additional games are outside the first implementation.

## Technical organization

- `HouseExperience`: room progress, hash aliases, reduced motion, room buttons, map, Simple view, lighting, status messages, and panel state.
- `HouseScene`: dynamically loaded house renderer, orthographic camera, lighting, pixel-resolution management, visibility pause, cleanup, geometry raycasting, and coffee animation.
- `scene/buildHouse.ts` and `scene/geometry.ts`: the four connected room layouts, avatar, furniture, materials, and shared geometry helpers.
- `DevicePanels.tsx`: iMac and Game Boy apps plus a separate HTML bookshelf reader.
- `TableTennis.tsx`: temporary match renderer and local match controls. It does not reuse the house renderer.
- The house and match have separately constructed voxel avatars in a shared palette; only the kitchen avatar has the coffee sequence.
- Semantic HTML controls mirror important scene interactions; keyboard users can open rooms, devices, books and the game without pixel hunting.
- The Simple view uses HTML room cards as the lightweight/WebGL-unavailable fallback. Pause the house scene while a dialog is open; bound pixel resolution and shadow quality for phones.
- Direct code geometry is sufficient for the house and furniture. Blender is optional only for assets that benefit from manual modeling. No paid service, asset pack or hosted AI is required.

## Build order and acceptance gates

The following sequence is the original implementation plan. Code coverage and runtime verification are separate: consult `design/VERIFICATION.md` for the checks and evidence.

1. **Depth and palette prototype:** build the exterior shell and one study in true 3D, establish pixel rendering, replace wallpaper and icons, and verify object contrast. Review desktop and mobile screenshots before duplicating the visual approach across rooms.
2. **Connected house:** add the remaining rooms, doors, hall, exterior, native-scroll camera tour and direct room navigation. Verify the rooms visibly occupy one consistent house.
3. **Room behavior:** reconnect device apps, build independent books, add coffee avatar and preserve lamp/cat/plant interactions. Verify return focus, Escape, room restoration and independent state.
4. **Playable sports room:** implement ball simulation, controls, opponent, score, pause/restart and match completion. Test tabletop bounce, net contact, out-of-bounds, score reset and predictable behavior across frame rates.
5. **Polish and performance:** adjust silhouettes, lighting and restrained animation; test touch targets, reduced motion, fallback, phone layout, navigation during/after games, GPU resource cleanup, lint, types and production build.

## Completion criteria

These remain the original product goals and should not be read as verification results. The delivered adaptations are listed at the top of this document.

The visitor can see a beautiful coherent house, scroll between four actual 3D rooms, read folders against a distinct wallpaper, use books independently of the computer, see the avatar pick up and drink coffee, and finish a table-tennis match against that avatar. The site keeps its pixel-art appearance, working portfolio links, responsive controls and free runtime.

Before public deployment, retain the previously identified tasks: confirm the owner's contact email and resolve the inherited production dependency advisories.
