// Four fixed matchups for the pass-only shell, followed by a drive-and-kick read.
window.CRIMSON_PLAY = (() => {
  const perimeter = {
    p1: [67, 54], p2: [88, 32], p3: [12, 32], p4: [33, 54]
  };
  const leftWing = {
    d1: [46, 43], d2: [50, 26], d3: [19, 30], d4: [28, 43]
  };
  const rightWing = {
    d1: [72, 43], d2: [81, 30], d3: [50, 26], d4: [54, 43]
  };
  const rightSlot = {
    d1: [64, 47], d2: [78, 38], d3: [48, 29], d4: [46, 48]
  };
  const leftSlot = {
    d1: [54, 48], d2: [52, 29], d3: [22, 38], d4: [36, 47]
  };
  const drive = {
    p2: [62, 36], d1: [59, 28], d2: [70, 30], d3: [46, 18], d4: [47, 43]
  };
  const recover = {
    p2: drive.p2, d1: rightSlot.d1, d2: [70, 38], d3: rightSlot.d3, d4: rightSlot.d4
  };

  function frame(t, ball, positions, caption, via) {
    return {t, ball, pos: {...perimeter, ...positions}, caption, via};
  }

  return {
    slug: 'gap-help-recover',
    category: 'defense',
    title: 'Gap help: ball, you, man',
    description: 'Shift together as the ball swings. Close out to your own player and see both ball and player in help.',
    level: 'Foundation',
    setup: 'Set up 4-on-4 in the half court with two wings and two slots. X1 guards 1, X2 guards 2, X3 guards 3, and X4 guards 4. Start with passes while the offense holds its spots.',
    cues: [
      'Move as the pass leaves. If your player catches it, close out under control and contain.',
      'One pass away, step into the gap where you can see the ball and still recover to your player.',
      'On the weak side, move toward the lane. Open up so you can see both the ball and your player. When the ball swings, both sides shift and everyone keeps the same matchup.'
    ],
    practice: 'Start pass-only. Freeze the first few catches and ask each defender to point to the ball and their player. Swing it both ways, then allow one drive and a kick-out. Go live once the shifts happen on the pass. Finish with a stop and a rebound.',
    video: {
      id: 'XTIfQoI-kEI',
      publisher: 'Breakthrough Basketball / Jim Huber',
      cue: 'Watch the cross-court pass at 13:04 and the next closeout at 13:27. Follow a weak-side defender and watch them keep sight of their player as both sides shift.',
      start: 755,
      end: 831,
      read: 0
    },
    options: [
      {
        label: 'Ball swing • Shift together',
        read: 'Follow any colored matchup line. As the ball crosses the floor, the receiver’s defender closes out and the new weak side moves in to help.',
        frames: [
          frame(0, 'p3', leftWing, 'Ball on the left • X3 guards the ball. X1 and X2 see ball and player in help.'),
          frame(.13, 'p3', leftWing, 'Skip across • All four defenders move as 3 passes.'),
          frame(.25, 'p2', rightWing, 'Ball on the right • X2 closes to 2. X1 takes the gap. X3 and X4 move in to help.'),
          frame(.37, 'p2', rightWing, 'Pass up to the slot • X1 closes to 1 and X2 steps off 2 into the gap.'),
          frame(.47, 'p1', rightSlot, 'Ball in the right slot • X2 and X4 are one pass away. X3 stays deeper in help.'),
          frame(.58, 'p1', rightSlot, 'Swing across the top • X4 moves out to 4 as X1 drops into the gap.'),
          frame(.70, 'p4', leftSlot, 'Ball in the left slot • X4 guards the ball. X2 sinks as the low helper.'),
          frame(.82, 'p4', leftSlot, 'Pass down to the left wing • X3 closes to 3 and the right side moves in.'),
          frame(.92, 'p3', leftWing, 'Back on the left • X3 guards 3. X4 takes the gap. X1 and X2 are in help.'),
          frame(1, 'p3', leftWing, 'Check your matchup • Find the ball and the same player you started with.')
        ]
      },
      {
        label: 'Middle drive • Help and recover',
        read: 'X1 steps in to slow the drive while X2 recovers to 2. On the kick-out, X1 closes back to 1 and the other three adjust.',
        frames: [
          frame(0, 'p2', rightWing, 'Ball on the right • X2 guards 2. X1 is in the gap. X3 and X4 are in help.'),
          frame(.18, 'p2', rightWing, '2 drives middle • X1 steps in while X2 works back to 2.'),
          frame(.46, 'p2', drive, 'Show help • X1 slows the drive. X3 protects the lane while tracking 3.', {
            p2: [[86, 41], [72, 42]], d2: [[83, 25], [76, 25]], d1: [[64, 39], [57, 35]]
          }),
          frame(.57, 'p2', drive, 'Kick out to 1 • X1 recovers during the pass.'),
          frame(.75, 'p1', recover, 'X1 closes to 1 • X2 stays with 2. X3 and X4 adjust to the new ball spot.', {
            d1: [[53, 32], [54, 43]], d2: [[73, 32]]
          }),
          frame(1, 'p1', rightSlot, 'Reset the shell • 2 clears back to the wing and X2 moves with 2.', {
            p2: [[73, 32]], d2: [[74, 43]]
          })
        ]
      }
    ],
    duration: 12,
    help: true,
    matchups: true,
    sources: [
      {title: 'Breakthrough Basketball • Jim Huber’s 4-on-4 stationary shell', url: 'https://www.youtube.com/watch?v=XTIfQoI-kEI&t=755s'},
      {title: 'Breakthrough Basketball • Weak-side help positioning', url: 'https://www.breakthroughbasketball.com/defense/help-positioning'},
      {title: 'Coach’s Clipboard • Youth man-to-man defense', url: 'https://www.coachesclipboard.net/youth/M2MDefense.html'}
    ]
  };
})();
