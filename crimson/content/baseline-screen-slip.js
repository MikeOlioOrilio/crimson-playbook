// Box 1 uses the player numbers in Ryan Schultz's walkthrough.
window.CRIMSON_PLAY = (() => {
  const setupFrames = [
    {
      t: 0,
      pos: {
        p1: [66, 15], p2: [20, -6], p3: [34, 16], p4: [66, 35], p5: [33, 39],
        d1: [66, 22], d2: [23, 2], d3: [43, 18], d4: [57, 41], d5: [41, 33]
      },
      caption: 'Box setup • 2 inbounds; 3 and 1 are low, 5 and 4 high.'
    },
    {
      t: .12, pos: {p4: [66, 30], d4: [57, 39]},
      caption: '4 sets the first screen for 1 on the weak side.'
    },
    {
      t: .26, pos: {p1: [81, 62], d1: [73, 55]},
      via: {p1: [[81, 17], [83, 42]], d1: [[70, 23], [74, 27], [74, 42]]},
      caption: '1 runs out high as the safety; 4 waits for 1 to clear.'
    },
    {
      t: .36, pos: {p3: [41, 25], d3: [47, 20]},
      caption: '3 sets an up screen for 5 on the ball side.'
    },
    {
      t: .46, pos: {p5: [34, 12], d5: [43, 7]},
      via: {p5: [[31, 26], [31, 17]], d5: [[57, 31], [58, 17], [52, 9]]},
      caption: '5 dives toward the ball off 3’s screen.'
    },
    {
      t: .56, pos: {p3: [33, 27], p4: [56, 12], p5: [12, 17], d3: [39, 20], d4: [58, 22], d5: [19, 23]},
      via: {p4: [[63, 18]], p5: [[23, 13]], d5: [[36, 5], [31, 9], [24, 19]]},
      caption: '5 clears to the ball-side corner; 4 crosses the lane.'
    },
    {
      t: .64, pos: {p4: [40, 12], d4: [51, 16]},
      caption: '4 gets below X3 and plants the diagonal screen.'
    }
  ];

  const screens = [
    {p: 'p4', d: 'd1', from: .12, to: .24},
    {p: 'p3', d: 'd5', from: .36, to: .46},
    {p: 'p4', d: 'd3', from: .64, to: .76}
  ];

  function makeRead(label, read, frames, coverage = {}) {
    let pos = {};
    let ball = 'p2';
    return {
      label,
      read,
      frames: [...setupFrames, ...frames].map(frame => {
        pos = {...pos, ...frame.pos};
        ball = frame.ball ?? ball;
        return {...frame, pos, ball};
      }),
      screens,
      ...coverage
    };
  }

  const cutter = {
    t: .76, pos: {p3: [63, 11]},
    via: {p3: [[31, 13], [37, 4], [53, 4], [60, 6]]}
  };
  const inbounderEnters = {p2: [30, 6], d2: [23, 12]};

  return {
    slug: 'baseline-screen-slip',
    category: 'inbounds',
    title: 'Baseline: Box 1 screen & slip',
    description: 'Two setup screens lead to a weak-side layup, a screener’s roll, or a safe inbound to 1.',
    level: 'Foundation',
    setup: '2 takes the ball out on the left baseline. Start in a box: 3 on the ball-side block, 1 on the opposite block, 5 near the ball-side elbow, and 4 a step inside the free-throw line on the opposite side.',
    cues: [
      'On the official’s handoff, 4 screens to send 1 high. Then 3 screens up for 5, who dives toward the ball and clears to the ball-side corner.',
      '4 gets below 3’s defender and sets a stationary diagonal screen. 3 cuts to the weak-side block. If the defense switches, 4 seals and rolls toward the ball after 3 clears.',
      '2 looks for 3 at the rim, then 4 on the roll. If both are covered, pass out to 1. Keep the inbound count in mind.'
    ],
    practice: 'Walk through the screens without defenders. Then rehearse three reads: find 3, find 4 on a switch, and use 1 as the safety. Run live from either side and aim to release before the count of four.',
    video: {
      id: 'mzS1jbdf1yE',
      publisher: 'Breakthrough Basketball / Ryan Schultz',
      cue: 'Watch the setup from 0:30, the first full rep at 2:08, and the switch explanation at 3:31. The diagram uses the same player numbers as the video.',
      start: 30,
      end: 226,
      read: 1
    },
    options: [
      makeRead('Cutter open • Find 3',
        'X4 stays with 4 and X3 trails the cut. 2 finds 3 on the weak-side block.',
        [
          {...cutter, pos: {...cutter.pos, d3: [58, 22], d4: [49, 15]},
            via: {...cutter.via, d3: [[43, 33], [53, 34]]},
            caption: '3 clears the screen to the weak-side block. X3 trails.'},
          {t: .83, pos: {p4: [37, 15], d4: [46, 16]},
            caption: '2 sees 3 open and makes the inbound pass.'},
          {t: .9, ball: 'p3', caption: '3 catches at the weak-side block.'},
          {t: 1, pos: inbounderEnters, ball: [50, 10.5], caption: '3 finishes at the rim as 2 steps in.'}
        ]),
      makeRead('Defense switches • Find 4',
        'X4 steps out with 3. Once 3 clears, 4 seals X3 and rolls toward 2 for the pass.',
        [
          {...cutter, pos: {...cutter.pos, d3: [40, 20], d4: [60, 20]},
            caption: 'X4 switches onto 3. 4 waits until 3 has cleared.'},
          {t: .83, pos: {p4: [45, 9], d3: [46, 18], d4: [59, 19]},
            caption: '4 seals X3 and rolls toward the ball. 2 makes the pass.'},
          {t: .9, ball: 'p4', caption: '4 catches in the space left by the switch.'},
          {t: 1, pos: inbounderEnters, ball: [50, 10.5], caption: '4 finishes at the rim as 2 steps in.'}
        ],
        {switchAt: .76, assignments: {d3: 'p4', d4: 'p3'}}),
      makeRead('Both covered • Find 1',
        'The defense closes the two inside windows. 2 throws out to 1, who stayed high as the safety.',
        [
          {...cutter, pos: {...cutter.pos, d3: [57, 18], d4: [48, 15]},
            via: {...cutter.via, d3: [[44, 29], [54, 29]]},
            caption: 'The defenders cover 3’s cut and stay near 4.'},
          {t: .83, pos: {p1: [84, 63], d1: [72, 54]}, caption: '2 sees neither inside pass and looks high to 1.'},
          {t: .94, ball: 'p1', caption: '1 catches the safety pass and protects the ball.'},
          {t: 1, pos: inbounderEnters, caption: '2 steps in. Flow into the next action.'}
        ])
    ],
    duration: 12,
    sources: [
      {title: 'Breakthrough Basketball • Ryan Schultz’s Box 1 walkthrough', url: 'https://www.youtube.com/watch?v=mzS1jbdf1yE&t=30s'},
      {title: 'Breakthrough Basketball • Box 1 written breakdown', url: 'https://www.breakthroughbasketball.com/offense/three-blobs'},
      {title: 'NFHS • Guarding and screening guidance', url: 'https://www.nfhs.org/stories/how-its-coached-and-how-its-called-basketball-guarding'}
    ]
  };
})();
