# Crimson basketball playbook

25 animated lessons: four refined originals, the original twenty additions, and the requested alternating-elbow shooting drill.

## Use it

Open `index.html` in a modern browser. Everything works locally without installing packages or an internet connection. Choose a category, open a lesson, choose a defensive read, and use Play, Step, or the timeline. Print lesson includes the current diagram and all reads. Copy this read includes its option and position; when used from the hosted website, this gives a shareable web link.

Every lesson now has a **Continuous loop** checkbox. Enable it and press Play to replay the selected animation until paused. It retains the current speed. Disabling loop lets the current replay finish; Pause, Reset, stepping, or scrubbing stops playback immediately. Switching reads resets playback while keeping the checkbox selection. Loop is off when a page first opens and restarts the original setup each time.

The **Alternating elbows: shoot, rebound, switch** drill runs 30 seconds with ten players and three balls. It shows six shots (L1, R1, L2, R2, L3, R3), each shooter's own rebound, a feed across, and a move to the opposite line. Three balls are required for the requested immediate-shoot-on-the-rebound timing: L1, R1 and L2 start with balls. The final four seconds finish the last feed and rotation; the seventh shot is intentionally not shown.

## Put it on your existing GitHub Pages site

1. Keep a copy of your current site before replacing it.
2. Copy the **contents** of this folder into the folder your repository already publishes (usually its root or `/docs`). Keep all subfolders and the `.nojekyll` file together. Do not upload only the top-level index.html or the zip.
3. Commit the files using your existing GitHub workflow. In repository Settings → Pages, keep the publishing branch/folder consistent with where you placed them. If your repository already uses an Actions deployment, keep that workflow and use these static files as its published artifact.
4. Wait for your normal Pages deployment, then open the root page and a play directly, such as `https://YOUR-NAME.github.io/YOUR-REPOSITORY/box-blob/`.

Each play has a real folder containing index.html. Direct links and browser refresh work without a special router or server rewrite. All local asset links are relative so repository subpaths work. Links use explicit index.html to support opening the files offline as well. The prior `#/box-blob` and `#box-blob` links redirect to the new corresponding page when used on the menu page.

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
guide.html                 EDIT HERE: coaching guide content
build.cjs                  Shared page template and static generator
.nojekyll                  Publish as ordinary static files
```

To edit a lesson, change its file in `content/`, then run `node build.cjs` from this folder. Node is needed only for maintenance; GitHub Pages and local viewing need no runtime. There are no npm dependencies, accounts, API keys, build services, or paid hosting requirements. The published HTML remains generated and reviewable. Do not hand-edit a generated lesson index.html unless you also intend to update the template.

To add a lesson, copy a content file, give it a unique lowercase hyphenated `slug`, and use one of `drills`, `offense`, `defense`, `inbounds` for `category`. Update its coaching text and options. Add its slug to the preferred `order` list in build.cjs if desired; unlisted records appear at the end. Run the build and inspect it in your browser.

Each option has complete keyframes from t=0 to t=1. Positions are x/y pairs. For half court, x=0..100 and y=0..94; attack is toward y=10.5. Full court uses x=0..188 and y=0..100; attack is toward x=177.5. Out-of-bounds throwers sit just outside the boundary. `ball` is a player key or a coordinate pair. Matching owners keep possession while moving; a change of owner animates the pass between those frames. A destination frame may include `via: { p1: [[x, y], [x, y]] }` to route that player around a screen during the incoming interval. Travel follows those points at constant path speed. Use these waypoints to keep players from moving through markers.

Screens specify the offensive player (`p`), screened defender (`d`), and `from`/`to` times. Keep the screener at exactly the same position throughout that interval. The gold bar faces the defender. Give the cutter time to clear before moving the screener. Defenders need separately authored positions in each read; avoid changing only the ball's destination.

Multi-ball drills use a `balls` map on every frame, such as `{ A: 'p1', B: 'p6', C: 'p2' }`. Values follow the same player-key or coordinate-pair format as `ball`. A `players` map supplies custom marker labels and colors. An optional `steps` array provides concise `{ t, caption }` teaching stops separate from the denser animation frames. Existing single-ball lessons remain supported. Use `sequence: true` for a drill without defensive reads.

## Coaching scope

The coach's guide includes an installation sequence, 75-minute practice, sources, and rules notes. Numbers are roles rather than fixed positions. All new defensive strategies are man-to-man; the original zone buster remains an offensive answer to opponents' zones. The Laker drill preserves a genuine 5-on-0 rehearsal and adds guided defensive reads. Run-and-jump is marked optional and advanced.

The animations illustrate selected teaching reads; they do not model every possible defensive recovery or guarantee a score. The user’s actual competition rules need confirmation with the event organizer, particularly pressing restrictions. Sources and distinctions are documented in the guide.

This delivery is ready to upload. It has not changed or published your existing GitHub repository.
