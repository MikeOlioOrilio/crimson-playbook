// Editable teaching content. Run node build.cjs after changing this file.
const refs = {
 guard: {title:'NFHS: guarding, verticality, screening and rebounding principles', url:'https://nfhs.org/stories/how-its-coached-and-how-its-called-basketball-guarding'},
 rules: {title:'NFHS: current basketball rules and season updates',url:'https://www.nfhs.org/sports/basketball/rules'},
 pivot: {title:'Iowa High School Athletic Association: pivot-foot and traveling clarification',url:'https://www.iahsaa.org/wp-content/uploads/2025/11/Memo_4_111525.pdf'},
 footwork: {title:'Jr. NBA: Starter Practice 1 — forward and reverse pivots',url:'https://jr.nba.com/basketball-practice-plans/starter/'},
 retreat: {title:'Jr. NBA: Starter Practice 2 — retreat dribble and shielding',url:'https://jr.nba.com/basketball-practice-plans/starter/page/2/'},
 defense: {title:'Jr. NBA: Rookie Practice 6 — defensive slides and balance',url:'https://jr.nba.com/basketball-practice-plans/rookie/page/6/'},
 retreatVideo: {title:'Watch: Jr. NBA Retreat Dribble Drill',url:'https://jr.nba.com/video/retreat-dribble-drill/'}
};
const pivotRule = 'For this drill, catch while standing with both feet down. Once one foot lifts, the other is your pivot. Turn on that spot; do not drag it or switch feet. To start a dribble, release the ball BEFORE lifting the pivot foot. To pass or shoot, you may lift it, but release before it returns to the floor. If you jump to pass or shoot, release before either foot lands. After ending a dribble, you cannot start another one.';
module.exports = [
 {
  slug:'rebound-ball-security', short:'Rebound & protect', level:'Ball security & toughness',
  title:'Attack. Secure. Find the outlet.', image:'rebound-security',
  description:'Go get the rebound, land in balance, and keep it safe long enough to make the next pass.',
  cue:'GO GET IT → CHIN IT → SEE THE FLOOR',
  intro:'Toughness means pursuing the ball and keeping control. Predict where the miss will go, move to it, and jump to meet it at your highest controllable reach. Do not wait under the ball with planted feet.',
  steps:[
   {title:'Attack the ball',cue:'Move first. Jump and catch with two hands.',alt:'Mustang jumps to meet a rebound with two hands above his head.',body:['Find the ball, get to its path, and take off under control. Reach with both hands and spread your fingers around the ball.','In a live game, establish legal rebounding position first. In our self-rebound drill, follow the shot immediately and pursue its bounce.'],watch:'Waiting flat-footed or jumping into another player. Go to an open landing space.'},
   {title:'Land and secure',cue:'Soft knees. Ball high. Elbows controlled.',alt:'Mustang lands balanced and holds the ball against his upper chest with elbows bent in.',body:['Bring the ball firmly toward your upper chest, just under the chin, as you regain balance. Keep your eyes available to see the floor.','Use a comfortable base and absorb the landing with bent knees. Keep elbows naturally bent; do not flare them out to hit or clear a defender.'],watch:'Dropping the ball into traffic or swinging elbows. Strong hands and body position protect it.'},
   {title:'Turn to the outlet',cue:'Body between pressure and ball. Look before passing.',alt:'Mustang turns with the ball held in two hands on the protected side of his body.',body:['Once balanced, pivot away from pressure and locate a teammate in a clear passing window. Keep the ball close during the turn.','A protected side pocket can be useful after the secure catch. Pass when the outlet is open; use a controlled dribble only when allowed and useful.'],watch:'A blind spin or automatic dribble into traffic. Scan, then decide.'}
  ],
  rule:'A wide elbow is not a free space-making tool. Do not push, displace, or swing through an opponent. Your landing and any pivot must remain legal.',
  practice:'Partner tosses the ball slightly off-center. Pursue, jump, secure, land, and find the coach’s outlet target. Do 5 controlled reps each way, then add a passive defender. Reward a clean catch and accurate outlet, not contact.',
  question:'Where will this miss go, and where is my first safe pass?',
  sources:[refs.guard,refs.rules], related:['hit-find-get','alternating-elbow-shooting']
 },
 {
  slug:'defensive-stance',short:'On-ball defense',level:'Individual defense & ball pressure',
  title:'Contain first. Make hands useful.',image:'defensive-stance',
  description:'A balanced base, a useful cushion, and active hands that pressure the ball without touching the player.',
  cue:'FEET CONTAIN → HANDS DISRUPT',
  intro:'Start roughly an arm’s length away, then adjust for the attacker’s speed, shooting range, and the coach’s plan. This is a teaching starting point, not a fixed distance. Stay between your matchup and the basket.',
  steps:[
   {title:'Balance and cushion',cue:'Hips down. Eyes on the torso. Hands available.',alt:'Burgundy Mustang faces blue Thunder with a balanced base, one hand toward the ball and the other higher.',body:['Bend at the hips and knees with feet a little wider than shoulders. Stay ready to push either way; do not squat so wide that you cannot move.','Use one hand near the ball’s path and the other to make a likely pass harder. Hands stay in space, not on the attacker. Which hand does which job changes with the ball.'],watch:'Leaning over your toes or touching the attacker to measure the gap.'},
   {title:'Contain the dribble',cue:'Move your feet before reaching with a hand.',alt:'Mustang lowers the ball-side hand as Thunder dribbles, while keeping a balanced defensive base.',body:['For a short slide, push off the trailing foot, step with the lead foot, then recover the base. Do not click heels together.','Keep a hand available near a low dribble without lunging. If beaten, turn and sprint to recover; trying to slide forever will not catch the ball handler.'],watch:'Swiping down, reaching across the body, or grabbing after getting beaten. Contact can be a foul in either swipe direction.'},
   {title:'React when it is picked up',cue:'Active hands. No contact. Stay balanced.',alt:'Mustang raises both hands to obstruct passing windows after Thunder holds the ball in two hands.',body:['When the dribble ends, make the next pass difficult with active hands and legal positioning. Follow the ball with your hands without falling for every fake.','Do not crowd chest-to-chest or reach through the arms. Stay responsible for a pivot, pass, or shot; your job is not over.'],watch:'Treating one hand as permanently low and one permanently high. Read the ball and the available pass.'}
  ],
  rule:'A hand in the passing lane is not permission to hold or hand-check. On-ball hands pressure the ball; off-ball defenders also need to see their matchup and the ball.',
  practice:'Pairs: 20 seconds mirroring without a ball, 20 seconds with a slow dribble, then 20 seconds with a picked-up ball. Switch roles. Score a balanced contain and clean contest; do not reward a risky steal that gives up a drive.',
  question:'Can I still stop the drive if the attacker moves right now?',sources:[refs.defense,refs.guard,refs.rules],related:['closeout-contain','gap-help-recover']
 },
 {
  slug:'reverse-pivot',short:'Back / reverse pivot',level:'Footwork & ball control',
  title:'Back pivot: open away from pressure.',image:'reverse-pivot',diagram:'reverse',
  description:'Keep one pivot point while the free foot sweeps backward and the body shields the ball.',
  cue:'ANCHOR → OPEN BACK → BALANCE',
  intro:'A back pivot is also called a reverse pivot. Your free foot steps backward relative to where you started facing. Use a small, controlled turn to find space and a passing angle. Practice with either foot as the anchor.',
  steps:[
   {title:'Name the pivot foot',cue:'Left foot stays in this example.',alt:'Mustang begins in a balanced two-foot stance holding the ball close.',body:['Start from a stationary two-foot catch. Choose the left foot for this teaching rep, and keep its forefoot on one floor spot.','Bend your knees and hold the ball firmly with two hands. Look at the defender and the open space before turning.'],watch:'Changing pivot feet after the turn has started.'},
   {title:'Open backward',cue:'Sweep the right foot low behind you.',alt:'Mustang turns his back-side shoulder as his free foot sweeps backward close to the floor.',body:['Move the right foot backward in an arc. Turn hips and shoulders together around the planted left forefoot. The heel may rotate.','Keep the step low and controlled; do not hop or kick the heel high. Hold the ball on the side away from pressure with elbows close.'],watch:'Dragging the anchor, twisting a knee while the shoe is stuck, or swinging an elbow into space occupied by a defender.'},
   {title:'Finish ready',cue:'Two feet balanced. Head up. Find the next pass.',alt:'Mustang finishes turned away with the ball protected near his hip.',body:['Set the free foot down with a comfortable base. Keep your body between pressure and the ball.','Read the floor. Pass, shoot, or start a legal dribble if you still have one. A pivot creates an angle; it does not require a full spin.'],watch:'Turning blindly into traffic or picking up and replacing the pivot foot while still holding the ball.'}
  ],rule:pivotRule,
  practice:'Put a small tape dot under the left forefoot. Make 5 slow quarter-turns backward and pass to a partner. Reset after each rep, then repeat with the right foot. Add a passive defender who shows which side is pressured.',
  question:'Which foot is my anchor, and did it stay on its spot?',sources:[refs.footwork,refs.pivot],related:['front-pivot','protect-retreat']
 },
 {
  slug:'front-pivot',short:'Front / forward pivot',level:'Footwork & ball control',
  title:'Front pivot: turn into a new angle.',image:'front-pivot',diagram:'front',
  description:'Sweep the free foot forward, turn the chest with the hips, and move the ball through clear space.',
  cue:'ANCHOR → STEP AROUND → SEE THE FLOOR',
  intro:'A front pivot is also called a forward pivot. The free foot travels forward relative to your starting stance, while the other foot stays at its pivot point. Use it to face a passing target or square to the basket.',
  steps:[
   {title:'Start with a strong base',cue:'Left foot anchors; right foot is free.',alt:'Mustang holds the ball by his hip with both feet in a balanced ready stance.',body:['Use a stationary two-foot catch for this rep. Choose the left foot as your pivot and keep your knees comfortably bent.','Grip the ball with two hands. Keep it close enough to protect, with your eyes looking at the next target.'],watch:'Standing straight up or holding the ball at full arm’s length.'},
   {title:'Sweep forward',cue:'Small step. Chest and hips turn together.',alt:'Mustang moves his free right foot low and forward while keeping the ball close in two hands.',body:['Move the right foot forward around the left pivot point. Turn on the left forefoot; do not slide that foot across the floor.','Move the ball compactly through an open low window, or another clear window the defender allows. Use your body as protection; avoid swinging the ball or elbows through the defender.'],watch:'A high kick, an overlarge crossover step, or letting the ball hang away from the body.'},
   {title:'Arrive ready to act',cue:'Balanced feet. Ball ready. Read first.',alt:'Mustang finishes the turn with feet separated and the ball held near his ready hip.',body:['Place the free foot down with space between your shoes and knees aligned naturally. Finish with the chest facing the new angle.','Pass if the window is there. If you drive, release the ball before lifting the pivot. If the drive is not available, keep your balance and look again.'],watch:'Rushing the first dribble and lifting the anchor too early.'}
  ],rule:pivotRule,
  practice:'Coach points to an open target. Forward-pivot a quarter-turn and make a firm two-hand pass. Do 5 reps off each pivot foot, then add a defender’s passive hand to make the ball path a decision.',
  question:'Did my body and the ball turn together without moving my anchor?',sources:[refs.footwork,refs.pivot],related:['reverse-pivot','catch-stop-read']
 },
 {
  slug:'shot-contest',short:'Contest without contact',level:'Closeouts & shot defense',
  title:'Make it hard. Keep it clean.',image:'shot-contest',
  description:'Mustang defends Thunder: arrive under control, contest in your own space, and protect the landing area.',
  cue:'BRAKE → HAND UP → STAY OUT OF THEIR SPACE',
  intro:'The goal is a difficult shot without unnecessary contact. No pose guarantees a no-call: timing, legal guarding position, and the actual contact matter. These are three teaching snapshots; the final one is a separate close-range verticality example.',
  steps:[
   {title:'Brake before the shooter',cue:'Arrive fast enough to help, slow enough to stop.',alt:'Mustang approaches Thunder with short braking steps and one hand raised.',body:['Close the distance, then shorten your steps and lower your hips before reaching the attacker. Keep enough room to respond to a drive.','Raise a hand without putting it on the player. Do not sprint through the shooter or fly past a shot fake.'],watch:'Closing so fast that you cannot stop without bumping the shooter.'},
   {title:'Contest with space',cue:'Hand toward the release. Body under control.',alt:'Grounded Mustang contests Thunder’s jump shot with an extended arm and a visible gap between players.',body:['For this perimeter teaching rep, stay grounded and make the release harder with a high hand. Keep that hand away from the shooter’s wrist and arm.','Leave the shooter room to land. If you are late, avoid launching into their path just to try for a block.'],watch:'Swatting down, touching the shooting arm, or putting a foot underneath the shooter.'},
   {title:'Go vertical at the rim',cue:'Establish position, then stay in your own space.',alt:'Mustang stands upright with both arms raised over his own shoulders opposite Thunder’s close-range shooting stance.',body:['This is a different situation near the basket. Establish legal guarding position before the opponent is airborne, then raise your arms within your vertical plane.','You may jump straight up from legal position. Do not lean, drift forward, or lower the arms onto the attacker. Finish the possession by finding the rebound.'],watch:'Thinking hands-up makes any body contact legal. Late position and forward movement still matter.'}
  ],rule:'Keep the shooter’s airborne and landing space clear. The official judges the complete play, not just whether the defender’s hands were up.',
  practice:'Partner catches, sometimes shoots and sometimes shot-fakes. Defender closes, brakes, and contests without touching. Start at half speed. Separately rehearse vertical arms at the rim without body contact; add live play only after control is consistent.',
  question:'Can I contest and still stop in my own space?',sources:[refs.guard,refs.rules],related:['defensive-stance','closeout-contain']
 },
 {
  slug:'legal-screen',short:'Legal screen technique',level:'Off-ball offense & teamwork',
  title:'Arrive. Hold. Become an option.',image:'legal-screen',diagram:'screen',
  description:'Mustang screens Thunder: useful angle, a still body, close arms, and a patient release.',
  cue:'GET THERE → GET SET → WAIT → RELEASE',
  intro:'A screen helps a teammate find space. It is not a collision to win. Your teammate waits for the screen, uses the available shoulder, and reads how the defender goes around it.',
  steps:[
   {title:'Find the angle early',cue:'Get to open space before contact.',alt:'Mustang approaches a screening spot beside Thunder with hands close to his body.',body:['Choose the angle that puts your stationary body in the defender’s route. Arrive early enough to stop.','Give a moving defender time and distance to avoid the screen. A blind screen on a stationary defender needs room for a normal backward step.'],watch:'Running into the defender or setting a last-second screen directly in a moving player’s path.'},
   {title:'Be a still target',cue:'Feet set. Elbows in. No lean.',alt:'Mustang is planted with hands close to his abdomen while Thunder moves around him.',body:['Use a stable, comfortable stance with arms close to the body. Hold your position through the cutter’s use of the screen.','Do not widen a leg, turn a hip into contact, shove with a shoulder, or grab the defender. Let the defender go around.'],watch:'Following the defender with a moving screen or reaching out to make the screen bigger.'},
   {title:'Release after the action clears',cue:'Now turn and show your hands.',alt:'Thunder has passed the screening spot; Mustang turns and shows his hands as a receiving target.',body:['After the cutter and defender clear the screen, turn into the next useful space and show a target.','Roll, pop, or fill as the play calls. A planned slip is a separate read made before contact; never turn into a defender to manufacture contact.'],watch:'Rolling before your teammate can use the screen or standing still after the action has finished.'}
  ],rule:'A legal contact screen needs stationary legal position, arms close, and the required time and distance. A moving defender must be able to avoid it. Do not use the photo spacing as a rules measurement.',
  practice:'Three players: screener, cutter, passive defender. Walk through arrive–set–wait–cut–release. Coach freezes the action at the screen and checks feet, arms, and space. Add reads before adding speed.',
  question:'Was I set before contact, and did my teammate actually have time to use me?',sources:[refs.guard,refs.rules],related:['screen-away','screen-read-3v3']
 },
 {
  slug:'protect-retreat',short:'Protect & retreat',level:'Handling pressure',
  title:'Protect the ball. Create breathing room.',image:'protect-retreat',diagram:'retreat',
  description:'Use the body as a shield, keep a live dribble outside pressure, and retreat to regain a useful angle.',
  cue:'SHIELD → BACK OUT → LOOK AGAIN',
  intro:'Two situations are shown here. Step 1 is protecting a held ball. Steps 2–3 are a separate live-dribble sequence. If you have already ended your dribble, you must pivot and pass or shoot; you cannot begin a retreat dribble.',
  steps:[
   {title:'Protect a held ball',cue:'Two hands. Far hip. Body between.',alt:'Mustang holds the ball in two hands at the hip away from Thunder.',body:['Use a balanced stance and turn your torso to put your shoulder and hip between the defender and the ball. Keep elbows bent and the ball close.','If your dribble is over, maintain your pivot and find a pass. Strong protection is positioning and grip, not a stiff-arm.'],watch:'Swinging elbows, pushing the defender away, or restarting a finished dribble.'},
   {title:'Keep the dribble outside',cue:'Live-dribble example: shield with the body.',alt:'Mustang dribbles on the outside of his body, farther from Thunder’s pressure, with the free arm bent close.',body:['With a live dribble, turn partly sideways and bounce with the outside hand. Keep the ball on the protected side.','Keep the hand on top or the side of the ball as you push it down. The free arm stays bent naturally; it must not extend to push or hold the defender.'],watch:'Scooping under the ball, letting it come to rest, or bouncing it in front of the defender.'},
   {title:'Retreat and read',cue:'Short backward steps. Eyes stay up.',alt:'Mustang continues the protected dribble after moving farther away from Thunder.',body:['Take two controlled retreat dribbles into open space, keeping your body between the ball and pressure. Stay balanced and see the court.','Once space opens, square up and choose a pass or a new attack. Check the sideline, baseline, backcourt status, and the team’s spacing before retreating.'],watch:'Backing out blindly toward a boundary, carrying, or retreating across midcourt after frontcourt control.'}
  ],rule:'Do not push with the free arm. A retreat keeps an existing dribble alive; it does not reset a dribble you already picked up or remove backcourt restrictions.',
  practice:'First do 5 protect-and-pivot reps with a passive defender. Reset. Then advance to a cone, take two retreat dribbles, and pass or reattack on a coach’s signal. Repeat using both hands. Gradually add controlled pressure.',
  question:'Is my dribble still live, and is the space behind me clear?',sources:[refs.retreat,refs.retreatVideo,refs.pivot,refs.rules],related:['reverse-pivot','press-break']
 },
 {
  slug:'catch-stop-read',short:'Catch, stop & read',level:'Every-player foundation',
  title:'Catch in balance. See your choices.',image:'catch-stop-read',
  description:'A simple airborne catch into a simultaneous landing, followed by a calm pass, shot, or drive decision.',
  cue:'SHOW HANDS → LAND SOFT → LOOK UP',
  intro:'Good footwork makes every next decision easier. This example starts with the player catching while airborne and then landing on both feet at the same time. It is not the same as every possible stop at the end of a dribble.',
  steps:[
   {title:'Meet the pass',cue:'Show a target. Two hands to the ball.',alt:'Mustang catches a pass with both hands during a small low hop, both feet in the air.',body:['Move into a clear passing window and show your hands. Track the ball into your fingers.','Keep the hop small. Catching is the priority; there is no need for a big leap or an extra step afterward.'],watch:'Waiting for the pass to reach your body with hands down.'},
   {title:'Land together',cue:'Both feet at once. Knees absorb.',alt:'Mustang has landed on both feet with knees bent and ball held close to the chest.',body:['For this airborne-catch example, land on both feet simultaneously with a comfortable base. Stay balanced instead of stumbling into another step.','Either foot may become the pivot in this example. Once one lifts, the other is the anchor. Some other jump-stop sequences do not allow a pivot; learn the difference with your coach.'],watch:'An extra shuffle after landing, or assuming every two-foot stop allows a new choice of pivot.'},
   {title:'Read before rushing',cue:'Eyes up. Pass, shoot, or drive.',alt:'Mustang holds the ball at the ready hip with eyes up and feet balanced.',body:['See the basket, defender, and teammates. Shoot if open and in range, pass to an advantage, or attack available space.','If starting a dribble, release the ball before lifting the pivot foot. If pressure closes the gap, protect and pivot instead of panicking.'],watch:'Bouncing automatically before seeing an open teammate.'}
  ],rule:'How and when you control the ball determines your pivot options. A jump stop is not permission for extra steps. This lesson specifically uses an airborne catch followed by a simultaneous two-foot landing.',
  practice:'Partner passes while the receiver makes a low hop catch and simultaneous landing. Coach shows one of three signals: pass to target, balanced shot, or legal first dribble. Do 6 deliberate reps, then rotate.',
  question:'What did I see before my first dribble?',sources:[refs.pivot,refs.footwork],related:['front-pivot','cut-read-3v3']
 }
];
