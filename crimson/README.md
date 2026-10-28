# Crimson basketball playbook

25 animated lessons: four refined originals, the original twenty additions, and the requested alternating-elbow shooting drill.

The shared header uses your revised `assets/crimsonlogo.webp` followed by “/ PLAYBOOK”. **Positions & responsibilities** is now the featured item at the top of the sidebar, rather than a top-menu link. The public page at `position-guide/index.html` covers roles 1–5, offense, man-to-man defense, both sides of inbounding, shot priorities, and skill development. Each position has a shot-practice map and a defensive matchup example with Ball left / Ball right controls. These illustrate helping man defense, not fixed defensive zones. A five-out spacing diagram explains how jobs move. Edit the original text in `position-guide.html` and diagrams in `lessons/diagrams.cjs`, then run `node build.cjs`. These reference pages do not need Firebase records or a coach PIN.

## October 23, 2026: visual learning update

This version starts from the supplied CrimsonBasketball.zip. It preserves the revised logo, CNAME, Firebase setup/configuration, all 25 play records, the animation engine, and the additional folders in that archive. The original archive is not modified.

The Fundamentals library has eight lessons: rebound security, on-ball defense, back/reverse pivot, front/forward pivot, shot contests, legal screens, ball protection/retreat dribble, and catch–stop–read. Each uses three separate photo illustrations, readable HTML captions, a practice activity, and coaching references. The old canvas captions and crossfaded images are replaced to prevent text clipping and doubled bodies. Photo playback starts paused, holds each still for 4/7/10 seconds, and has continuous loop OFF by default. Show all steps supports side-by-side study of the lesson text as you scroll; Print lesson includes all three steps. With JavaScript disabled, all steps and both defensive maps remain readable.

Editable files:

- `lessons/fundamentals.cjs`: lesson copy, source links, images, and related lessons.
- `lessons/render.cjs`: shared sidebar, fundamentals library, photo lesson templates, position-page assembly.
- `lessons/diagrams.cjs`: precise SVG court maps, footwork and technique diagrams.
- `assets/learning.css` and `assets/learning.js`: responsive layout and local photo/map controls.
- `assets/fundamentals/*.png`: eight final AI-created photo sequences, produced with the built-in image generation tool. The prompt set is in `lessons/image-prompts.json`; the final defense framing edit is in `lessons/final-defense-image-prompt.txt`.

Run `node build.cjs` after changing lesson data or templates. Generated `*/index.html` files and root lesson-body `.html` copies are outputs; edit the data/template files above rather than the generated lesson bodies. The build now includes the previously untracked defensive-stance lesson, so rebuilding no longer drops it from the menu. Original JPEG assets are retained but the repaired lessons use the new PNGs.

Coaching corrections include controlled elbows rather than a supposed elbow “protection cage,” variable on-ball hand roles, recovery running when a slide is beaten, a clear difference between held-ball protection and a live retreat dribble, accurate pivot-foot release rules, stationary screens with room to avoid them, and shot contests that respect the shooter’s space. Photos are teaching illustrations rather than official rules diagrams; references are linked within each lesson.

Upload the CONTENTS of the updated ZIP directly into your existing published folder. Keep its folder structure, `.nojekyll`, and `CNAME`. Do not put this entire site inside another nested site folder. No Firebase console changes are required for this update.

## Use it

Open the website through GitHub Pages or a localhost web server. The Firebase edition needs an internet connection; opening index.html directly as a file is no longer supported. Complete the setup guide in firebase-setup/index.html before sharing the new version. Team View shows only selected plays. Coach View accepts a PIN only and shows the full library. Admin uses a separate email/password login to manage selections and coaches. Choose a category, open a lesson, choose a defensive read, and use Play, Step, or the timeline. Print lesson includes the current diagram and all reads. Copy this read includes its option and position; when used from the hosted website, this gives a shareable web link.

Every lesson now has a **Continuous loop** checkbox. Enable it and press Play to replay the selected animation until paused. It retains the current speed. Disabling loop lets the current replay finish; Pause, Reset, stepping, or scrubbing stops playback immediately. Switching reads resets playback while keeping the checkbox selection. Loop is off when a page first opens and restarts the original setup each time.

The **Alternating elbows: shoot, rebound, switch** drill runs 30 seconds with ten players and three balls. It shows six shots (L1, R1, L2, R2, L3, R3). Each shooter pursues an opposite-side rebound, jumps to attack the ball, feeds while moving, and continues between the waiting line and sideline to join from behind. The focus is anticipating the bounce and actively following every shot, with no planted wait for the rebound. Three balls support immediate-shoot-on-the-rebound timing: L1, R1 and L2 start with balls. The final four seconds finish the last feed and rotation; the seventh shot is intentionally not shown.

## Put it on your existing GitHub Pages site

1. Keep a copy of your current site before replacing it.
2. Copy the **contents** of this folder into the folder your repository already publishes (usually its root or `/docs`). Keep all subfolders and the `.nojekyll` file together. Do not upload only the top-level index.html or the zip.
3. Commit the files using your existing GitHub workflow. In repository Settings → Pages, keep the publishing branch/folder consistent with where you placed them. If your repository already uses an Actions deployment, keep that workflow and use these static files as its published artifact.
4. Wait for your normal Pages deployment, then open the root page and a play directly, such as `https://YOUR-NAME.github.io/YOUR-REPOSITORY/box-blob/`.

Each play has a real folder containing index.html. Direct links and browser refresh work without a special router or server rewrite. All local asset links are relative so repository subpaths work. Links use explicit index.html for direct navigation. Firebase modules must run through HTTPS or localhost. The prior `#/box-blob` and `#box-blob` links redirect to the new corresponding page when used on the menu page.

GitHub reference: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## Maintain it

```
index.html                 Generated category menu
box-blob/index.html        Generated page for one lesson
.../index.html             One page for every other lesson
coach-guide/index.html     Generated coach's guide
content/*.js               EDIT HERE: one lesson record per file
assets/court.js            Shared SVG drawing and interpolation
assets/app.js              Shared filters, playback, and controls
assets/style.css           Shared visual styling and responsive layout
assets/catalog.js          Generated menu records
assets/library.js          Team filtering and PIN-only Coach View
assets/play-access.js      Selected-play navigation and direct-link focus gate
assets/admin.js            Selection editor and coach management
assets/firebase-store.js   Firebase reads, transactions, and administrator authentication
assets/firebase-config.js  Public project configuration
assets/access-model.js     Selection validation and PIN derivation
admin/index.html           Generated admin page
firebase-setup/index.html  Generated step-by-step setup guide
admin.html                 EDIT HERE: admin page structure
firebase-setup.html        EDIT HERE: Firebase setup instructions
firestore.rules            Publish separately in the Firebase console
UPDATE-FILES.txt           Upload checklist for this release
guide.html                 EDIT HERE: coaching guide content
build.cjs                  Shared page template and static generator
.nojekyll                  Publish as ordinary static files
```

To edit a lesson, change its file in `content/`, then run `node build.cjs` from this folder. Node is needed only for maintenance; GitHub Pages and local viewing need no runtime. The static build has no npm dependencies. The Firebase features require your Firebase project, published Firestore rules, and administrator account. The public web configuration is in assets/firebase-config.js. Firebase SDK browser modules load from Google; there are no Cloud Functions or paid services required by this design. Firebase usage quotas still apply. The published HTML remains generated and reviewable. Do not hand-edit a generated lesson index.html unless you also intend to update the template.

To add a lesson, copy a content file, give it a unique lowercase hyphenated `slug`, and use one of `drills`, `offense`, `defense`, `inbounds` for `category`. Update its coaching text and options. Add its slug to the preferred `order` list in build.cjs if desired; unlisted records appear at the end. Run the build and inspect it in your browser.

Each option has complete keyframes from t=0 to t=1. Positions are x/y pairs. For half court, x=0..100 and y=0..94; attack is toward y=10.5. Full court uses x=0..188 and y=0..100; attack is toward x=177.5. Out-of-bounds throwers sit just outside the boundary. `ball` is a player key or a coordinate pair. Matching owners keep possession while moving; a change of owner animates the pass between those frames. A destination frame may include `via: { p1: [[x, y], [x, y]] }` to route that player around a screen during the incoming interval. Travel follows those points at constant path speed. Use these waypoints to keep players from moving through markers.

Screens specify the offensive player (`p`), screened defender (`d`), and `from`/`to` times. Keep the screener at exactly the same position throughout that interval. The gold bar faces the defender. Give the cutter time to clear before moving the screener. Defenders need separately authored positions in each read; avoid changing only the ball's destination.

Multi-ball drills use a `balls` map on every frame, such as `{ A: 'p1', B: 'p6', C: 'p2' }`. Values follow the same player-key or coordinate-pair format as `ball`. A `players` map supplies custom marker labels and colors. An optional `steps` array provides concise `{ t, caption }` teaching stops separate from the denser animation frames. Optional `jumps` events use `{ p, from, peak, to }` with normalized times to show a lifted marker, shadow, and jump cue while its court movement continues. Existing single-ball lessons remain supported. Use `sequence: true` for a drill without defensive reads.

## Coaching scope

The coach's guide includes an installation sequence, 75-minute practice, sources, and rules notes. Numbers are roles rather than fixed positions. All new defensive strategies are man-to-man; the original zone buster remains an offensive answer to opponents' zones. The Laker drill preserves a genuine 5-on-0 rehearsal and adds guided defensive reads. Run-and-jump is marked optional and advanced.

The animations illustrate selected teaching reads; they do not model every possible defensive recovery or guarantee a score. The user’s actual competition rules need confirmation with the event organizer, particularly pressing restrictions. Sources and distinctions are documented in the guide.

Complete the Firebase setup guide before uploading this version. The package does not provision your live Firebase database or publish your GitHub repository. See UPDATE-FILES.txt for the complete upload list. Names are admin-only; PINs are derived lookup keys for a lightweight focus gate over public static plays, not private-content protection. Administrator writes use Firebase Authentication and Firestore Security Rules. Coach names may be duplicated but PINs must be unique. Admin can change PINs and disable access. Coach session access expires after 12 hours and is rechecked on navigation or refresh.

## Rules guide

The top-menu Rules page is public at rules/index.html. It contains 14 illustrated rules, topic filters, backcourt and free-throw step diagrams, and six self-check questions. No Firebase changes are needed.

Edit lessons/rules.cjs for explanations and source links; lessons/rule-diagrams.cjs for original SVG visuals. Styling and optional interactions live in assets/rules.css and assets/rules.js. Run node build.cjs after changing content. All reference content works without JavaScript.

Rules reviewed October 24, 2026 against NFHS 2026–27 changes and the linked rule explanations. Utah high-school changes and Utah Bantam examples are identified separately. The team's exact event is not confirmed; recheck its current rules before treating the example press restriction as applicable.
