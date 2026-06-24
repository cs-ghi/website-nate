import { JudoTechnique } from '../../interfaces/judo.model';

export const UOFT_TECHNIQUES: JudoTechnique[] = [

  // ══════════════════════════════════════════════════════════════════
  // YELLOW BELT (Gokyu)
  // ══════════════════════════════════════════════════════════════════

  // ── Nage Waza ─────────────────────────────────────────────────────
  {
    title_en: 'Major Hip Throw', title_romaji: 'O Goshi', title_kanji: '大腰',
    belt_requirement: 'yellow', category: 'tachi-waza', sub_category: 'Koshi-waza',
    youtube_id: 'yhu1mfy2vJ4',
    is_kata: false, is_theory: false,
    description: 'The classic hip throw — one of judo\'s most fundamental techniques. Tori inserts their hip under uke\'s centre of gravity and rotates to throw.',
    key_points: [
      'Wrap your arm around uke\'s waist (or grip the belt) to pull them close',
      'Step in deep so your hip is directly in front of uke\'s hips',
      'Bend your knees slightly to get under uke\'s centre',
      'Pull uke onto your back and rotate/straighten your legs to throw',
      'Keep uke close throughout — space between bodies kills the throw'
    ]
  },
  {
    title_en: 'Major Outer Reaping', title_romaji: 'O Soto Gari', title_kanji: '大外刈',
    belt_requirement: 'yellow', category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: 'c-A_nP7mKAc',
    is_kata: false, is_theory: false,
    description: 'A major leg reaping technique where tori sweeps uke\'s leg from the outside while driving them backward off-balance.',
    key_points: [
      'Break uke\'s balance (kuzushi) diagonally backward to their right',
      'Drive chest-to-chest as your reaping leg sweeps their supporting leg',
      'Keep your head up and back straight throughout the throw',
      'The reaping motion uses the back of your leg — swing through, don\'t tap',
      'Commit fully: lean into uke as you reap to complete the throw'
    ]
  },
  {
    title_en: 'One-Arm Shoulder Throw', title_romaji: 'Ippon Seoi Nage', title_kanji: '一本背負投',
    belt_requirement: 'yellow', category: 'tachi-waza', sub_category: 'Te-waza',
    youtube_id: 'FQnOlCxo4oI',
    is_kata: false, is_theory: false,
    description: 'A one-arm variation of Seoi Nage where tori hooks a single arm under uke\'s sleeve-side arm. Extremely common in competition.',
    key_points: [
      'Grip the sleeve with your right hand and drive that elbow straight up into uke\'s armpit',
      'Your elbow traps uke\'s arm across your shoulder — not your hand',
      'Drop low with bent knees; your back must be lower than uke\'s hips',
      'Pull the collar hand down and forward as you lift and rotate',
      'The entry (tsugi-ashi or ayumi-ashi footwork) must be fast'
    ]
  },
  {
    title_en: 'Minor Inner Reaping', title_romaji: 'Kouchi Gari', title_kanji: '小内刈',
    belt_requirement: 'yellow', category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: '3Jb3tZvr9Ng',
    is_kata: false, is_theory: false,
    description: 'A small inner reap catching uke\'s heel from the inside as their weight shifts backward.',
    key_points: [
      'Break uke\'s balance directly backward',
      'Hook the heel of your foot against the inside of uke\'s heel',
      'Scoop the leg forward — the reap is a scooping motion, not a kick',
      'Lean in over uke as you reap to maintain pressure',
      'Works well in combination with Ouchi Gari'
    ]
  },
  {
    title_en: 'Advancing Foot Sweep', title_romaji: 'De Ashi Harai', title_kanji: '出足払',
    belt_requirement: 'yellow', category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: '4BUUvqxi_Kk',
    is_kata: false, is_theory: false,
    description: 'A timing-based foot sweep that catches uke\'s advancing foot at the moment their weight transfers onto it.',
    key_points: [
      'Timing is everything — sweep as uke\'s foot contacts the mat and weight shifts',
      'Sweep with the sole of your foot across the mat, not upward',
      'Simultaneously pull in the sweep direction with your sleeve hand',
      'Small movement, no wind-up — the sweep should be quick and flat',
      'Works best when moving with uke\'s rhythm rather than forcing it'
    ]
  },
  {
    title_en: 'Major Inner Reaping', title_romaji: 'O Uchi Gari', title_kanji: '大内刈',
    belt_requirement: 'yellow', category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: '0itJFhV9pDQ',
    is_kata: false, is_theory: false,
    description: 'A major leg reap from the inside, stepping deep between uke\'s legs to sweep the supporting leg backward.',
    key_points: [
      'Step forward and between uke\'s legs with your reaping leg',
      'Break balance to uke\'s rear — pull/push the upper body backward',
      'Your reaping leg hooks behind uke\'s knee or thigh',
      'The motion is a large back-and-up swing, like a pendulum',
      'Effective when uke\'s weight is on the back leg'
    ]
  },
  {
    title_en: 'Sliding Foot Sweep', title_romaji: 'Okuri Ashi Barai', title_kanji: '送足払',
    belt_requirement: 'yellow', category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: 'nw1ZdRjrdRI',
    is_kata: false, is_theory: false,
    description: 'A two-foot sweep catching both of uke\'s feet as they step laterally. Requires excellent timing with uke\'s movement.',
    key_points: [
      'Best applied while both players are moving laterally (ayumi-ashi)',
      'Sweep as uke\'s feet come close together — the moment between steps',
      'The sweeping foot moves flat along the mat to catch both feet',
      'Pull in the direction of uke\'s movement to enhance off-balance',
      'Timing over power: a gentle sweep at the right moment beats a strong one late'
    ]
  },

  // ── Osaekomi Waza ─────────────────────────────────────────────────
  {
    title_en: 'Scarf Hold', title_romaji: 'Kesa Gatame', title_kanji: '袈裟固',
    belt_requirement: 'yellow', category: 'ne-waza', sub_category: 'Osaekomi-waza',
    youtube_id: 'NDaQuJOFBYk',
    is_kata: false, is_theory: false,
    description: 'The most fundamental groundwork pin. Tori sits alongside uke, controlling the head under their arm and gripping the sleeve.',
    key_points: [
      'Sit diagonally beside uke, hips on the mat for a low centre of gravity',
      'Trap uke\'s head tightly under your arm — elbow points toward uke\'s feet',
      'Hold uke\'s near arm at the sleeve with your other hand, hugging it to your body',
      'Keep your legs spread wide apart for base — right leg forward, left back',
      'Squeeze with your arm and lean weight into uke to prevent escape'
    ]
  },
  {
    title_en: 'Shoulder Hold', title_romaji: 'Kata Gatame', title_kanji: '肩固',
    belt_requirement: 'yellow', category: 'ne-waza', sub_category: 'Osaekomi-waza',
    youtube_id: 'zQR3IOXxO_Q',
    is_kata: false, is_theory: false,
    description: 'A pin and choke combination where tori traps uke\'s head and shoulder together, with the arm pressed against the neck.',
    key_points: [
      'Lie across uke at a perpendicular angle, similar to side control',
      'Drive uke\'s arm up against their own neck using your head',
      'Press your own head down on uke\'s arm to trap it against the carotid',
      'This simultaneously pins and chokes — even a pure pin scores',
      'Clasp hands together under uke\'s shoulder to lock the position'
    ]
  },
  {
    title_en: 'Vertical Four-Corner Hold', title_romaji: 'Tate Shiho Gatame', title_kanji: '縦四方固',
    belt_requirement: 'yellow', category: 'ne-waza', sub_category: 'Osaekomi-waza',
    youtube_id: '55-rFmBx53g',
    is_kata: false, is_theory: false,
    description: 'A mounted pin where tori straddles uke face-to-face, controlling collars and trapping uke\'s arms with their legs.',
    key_points: [
      'Sit astride uke\'s torso (mounted position)',
      'Thread your arms under uke\'s armpits and grip the collar on both sides',
      'Tuck your feet under uke\'s legs (hooking the thighs) to prevent bridging',
      'Keep your hips low and weight forward into uke\'s chest',
      'This is the only pin in judo applied from mount'
    ]
  },
  {
    title_en: 'Side Four-Corner Hold', title_romaji: 'Yoko Shiho Gatame', title_kanji: '横四方固',
    belt_requirement: 'yellow', category: 'ne-waza', sub_category: 'Osaekomi-waza',
    youtube_id: 'TT7XJVSEQxA',
    is_kata: false, is_theory: false,
    description: 'A side control pin where tori lies perpendicular to uke, controlling the head and far hip.',
    key_points: [
      'Lie alongside uke at a perpendicular angle, chest-to-chest',
      'Pass one arm under uke\'s neck and grip the far collar or shoulder',
      'Pass the other arm between uke\'s legs and grip the belt or trouser',
      'Spread your legs wide for base and keep your chest heavy on uke',
      'Hips stay low — lifting your hips makes it easier for uke to escape'
    ]
  },
  {
    title_en: 'Upper Four-Corner Hold', title_romaji: 'Kami Shiho Gatame', title_kanji: '上四方固',
    belt_requirement: 'yellow', category: 'ne-waza', sub_category: 'Osaekomi-waza',
    youtube_id: 'HFuMjOv0WN8',
    is_kata: false, is_theory: false,
    description: 'A pin applied from above uke\'s head. Tori faces uke\'s feet, controlling both arms by threading hands under the armpits.',
    key_points: [
      'Position above uke\'s head, facing toward their feet',
      'Thread both arms under uke\'s armpits to grip their belt at the sides',
      'Press your chest and face into uke\'s chest to weight the pin',
      'Legs extend back and spread wide for base',
      'Squeeze your elbows inward to trap uke\'s arms'
    ]
  },

  // ── Shime Waza ────────────────────────────────────────────────────
  {
    title_en: 'Sliding Collar Strangle', title_romaji: 'Okuri Eri Jime', title_kanji: '送襟絞',
    belt_requirement: 'yellow', category: 'ne-waza', sub_category: 'Shime-waza',
    youtube_id: 'EiqyoVcIAi8',
    is_kata: false, is_theory: false,
    description: 'A collar choke from behind using cross-collar grips that slide to compress both carotid arteries.',
    key_points: [
      'Applied from behind uke, both hands grip the collar',
      'One hand enters palm-up deep into the far collar',
      'The other hand crosses over and grips uke\'s near collar palm-down',
      'Pull the elbows apart and outward — the crossing collars compress the neck',
      'Keep uke\'s back against your chest to prevent them rolling out'
    ]
  },
  {
    title_en: 'Naked Strangle', title_romaji: 'Hadaka Jime', title_kanji: '裸絞',
    belt_requirement: 'yellow', category: 'ne-waza', sub_category: 'Shime-waza',
    youtube_id: '9f0n8jez7iA',
    is_kata: false, is_theory: false,
    description: 'A rear naked choke applied without using the gi. The forearm presses against the windpipe or carotid arteries.',
    key_points: [
      'Applied from behind uke; take the back position first',
      'Forearm of one arm slides across the throat (carotid choke) or windpipe',
      'Clasp hands together — palm of applying hand grips the bicep of the support arm',
      'Support hand pushes uke\'s head forward into the choke',
      'Squeeze with the arm and use body weight leaning back to tighten'
    ]
  },
  {
    title_en: 'Single-Wing Strangle', title_romaji: 'Kata Ha Jime', title_kanji: '片羽絞',
    belt_requirement: 'yellow', category: 'ne-waza', sub_category: 'Shime-waza',
    youtube_id: 'yaTGgRjnwB8',
    is_kata: false, is_theory: false,
    description: 'From behind uke, one arm applies the collar choke while the other traps uke\'s arm up behind their own head, creating a "single wing" lock.',
    key_points: [
      'Take uke\'s back; one arm threads under their armpit and pushes their arm up',
      'The other hand grips deep into the far collar from behind the neck',
      'The trapped arm prevents uke from defending the choke',
      'Pull the collar across while the wing arm locks the shoulder in place',
      'Keep your chest tight against uke\'s back to prevent escape'
    ]
  },

  // ── Kansetsu Waza ─────────────────────────────────────────────────
  {
    title_en: 'Cross Armlock', title_romaji: 'Juji Gatame', title_kanji: '腕挫十字固',
    belt_requirement: 'yellow', category: 'ne-waza', sub_category: 'Kansetsu-waza',
    youtube_id: 'OWgSOlCuMXw',
    is_kata: false, is_theory: false,
    description: 'The standard straight armbar. The elbow is hyperextended by raising the hips while the arm is controlled between the thighs.',
    key_points: [
      'Trap uke\'s arm between your thighs, thumb-side of uke\'s arm pointing up',
      'Grip uke\'s wrist with both hands and control their arm against your chest',
      'Raise your hips upward while pulling the wrist down — this hyperextends the elbow',
      'Knees should be together to prevent uke from pulling the arm out',
      'Apply pressure gradually — the lock comes on quickly'
    ]
  },
  {
    title_en: 'Arm Entanglement', title_romaji: 'Ude Garami', title_kanji: '腕緘',
    belt_requirement: 'yellow', category: 'ne-waza', sub_category: 'Kansetsu-waza',
    youtube_id: 'AIlTvZb4RlE',
    is_kata: false, is_theory: false,
    description: 'A figure-four armlock that rotates uke\'s elbow joint against its natural range of motion.',
    key_points: [
      'Trap uke\'s arm on the mat; their elbow should be bent at roughly 90\u00b0',
      'Thread your arm under uke\'s arm and grip their wrist from below',
      'Your other hand grips your own wrist to form the figure-four',
      'Rotate uke\'s wrist toward their shoulder (internally) \u2014 do not apply suddenly',
      'Control their shoulder with your body weight to prevent escape'
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // ORANGE BELT (Yonkyu)
  // ══════════════════════════════════════════════════════════════════

  // ── Nage Waza ─────────────────────────────────────────────────────
  {
    title_en: 'Minor Inner Reaping', title_romaji: 'Kouchi Gari', title_kanji: '小内刈',
    belt_requirement: 'orange', category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: '3Jb3tZvr9Ng',
    is_kata: false, is_theory: false,
    description: 'Review at orange belt level. A small inner reap catching uke\'s heel from the inside as their weight shifts backward.',
    key_points: [
      'Break uke\'s balance directly backward',
      'Hook the heel of your foot against the inside of uke\'s heel',
      'Scoop the leg forward \u2014 the reap is a scooping motion, not a kick',
      'At orange level, focus on using Kouchi Gari as a setup and in combinations'
    ]
  },
  {
    title_en: 'Lifting Pulling Hip Throw', title_romaji: 'Tsurikomi Goshi', title_kanji: '釣込腰',
    belt_requirement: 'orange', category: 'tachi-waza', sub_category: 'Koshi-waza',
    youtube_id: 'McfzA0yRVt4',
    is_kata: false, is_theory: false,
    description: 'Tori uses a high collar grip to lift and pull uke onto a pivoted hip, combining upward and rotational force.',
    key_points: [
      'High collar grip pulls uke\'s upper body upward to break posture before entry',
      'The "tsuri" (lifting) action creates the space for hip insertion',
      'Turn in deeply with both feet between uke\'s feet',
      'Bend knees on entry and straighten them as you rotate to project uke',
      'The lift distinguishes this throw from standard hip throws'
    ]
  },
  {
    title_en: 'Sweeping Hip Throw', title_romaji: 'Harai Goshi', title_kanji: '払腰',
    belt_requirement: 'orange', category: 'tachi-waza', sub_category: 'Koshi-waza',
    youtube_id: 'qTo8HlAAkOo',
    is_kata: false, is_theory: false,
    description: 'A hip throw where tori\'s extended sweeping leg catches uke\'s thigh, adding rotation to the hip projection.',
    key_points: [
      'Turn in like Ogoshi but extend your right leg back and across',
      'The sweeping leg swings across uke\'s thighs \u2014 not a reap, a sweep',
      'Hip contact is essential: your hip must block uke\'s hip',
      'Pull strongly with both hands as you sweep to maximize rotation',
      'Common error: sweeping the lower leg instead of the thigh'
    ]
  },
  {
    title_en: 'Hip Wheel', title_romaji: 'Koshi Guruma', title_kanji: '腰車',
    belt_requirement: 'orange', category: 'tachi-waza', sub_category: 'Koshi-waza',
    youtube_id: 'SU7Id6uVJ44',
    is_kata: false, is_theory: false,
    description: 'Tori places their arm around uke\'s neck and rotates them over the hip in a wheel-like motion.',
    key_points: [
      'The arm around uke\'s neck (not waist) distinguishes this from O Goshi',
      'Use your hip as the fulcrum \u2014 uke wheels over it',
      'Pull uke tight against your body before rotating',
      'Bend your knees to get your hip lower than uke\'s centre of gravity'
    ]
  },
  {
    title_en: 'Two-Arm Shoulder Throw', title_romaji: 'Morote Seoi Nage', title_kanji: '双手背負投',
    belt_requirement: 'orange', category: 'tachi-waza', sub_category: 'Te-waza',
    youtube_id: 'zIq0xI0ogxk',
    is_kata: false, is_theory: false,
    description: 'The two-arm shoulder throw where tori grips the lapel and sleeve, then turns in to throw uke over the shoulder.',
    key_points: [
      'Step deep \u2014 both feet between uke\'s, back facing uke\'s chest',
      'Lapel arm bends so the elbow presses against uke\'s chest',
      'Sleeve arm pulls uke\'s arm tight across your body',
      'Bend forward with a flat back and straighten legs to project uke',
      'Common error: not getting low enough before the throw'
    ]
  },
  {
    title_en: 'Propping Drawing Ankle Throw', title_romaji: 'Sasae Tsurikomi Ashi', title_kanji: '支釣込足',
    belt_requirement: 'orange', category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: '699i--pvYmE',
    is_kata: false, is_theory: false,
    description: 'A blocking foot throw where tori\'s foot props against uke\'s ankle as both hands pull and lift to rotate uke over the block.',
    key_points: [
      'Place the sole of your foot against uke\'s ankle as a fixed block',
      'Pull up strongly with the collar hand (tsuri = lifting pull) while pulling forward with the sleeve',
      'The block plus the upward pull creates a rotation over the foot',
      'Timing is key: block as uke steps forward',
      'Your blocking foot stays fixed \u2014 this is not a sweep'
    ]
  },
  {
    title_en: 'Sliding Foot Sweep', title_romaji: 'Okuri Ashi Barai', title_kanji: '送足払',
    belt_requirement: 'orange', category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: 'nw1ZdRjrdRI',
    is_kata: false, is_theory: false,
    description: 'Review at orange belt level. A two-foot sweep catching both of uke\'s feet as they step laterally.',
    key_points: [
      'At orange level, focus on applying Okuri Ashi Barai during dynamic movement',
      'Sweep as uke\'s feet come close together \u2014 the moment between steps',
      'Coordinate hand pull with the sweep for maximum effect'
    ]
  },
  {
    title_en: 'Rear Hip Throw', title_romaji: 'Ushiro Goshi', title_kanji: '後腰',
    belt_requirement: 'orange', category: 'tachi-waza', sub_category: 'Koshi-waza',
    youtube_id: 'ORIYstuxYT8',
    is_kata: false, is_theory: false,
    description: 'A counter-throw: tori lifts uke from behind over the hip when uke attempts a forward throw.',
    key_points: [
      'Used as a counter when uke turns in for a hip or shoulder throw',
      'Wrap both arms around uke\'s waist from behind',
      'Lift uke off the ground by straightening your legs and arching backward',
      'Rotate uke over your hip to the side or behind you',
      'Timing is critical \u2014 counter before uke completes their entry'
    ]
  },

  // ── Osaekomi Waza ─────────────────────────────────────────────────
  {
    title_en: 'Broken Scarf Hold', title_romaji: 'Kuzure Kesa Gatame', title_kanji: '崩袈裟固',
    belt_requirement: 'orange', category: 'ne-waza', sub_category: 'Osaekomi-waza',
    youtube_id: 'Q2fb9jaoUFQ',
    is_kata: false, is_theory: false,
    description: 'A modified scarf hold where tori\'s arm reaches under uke\'s back or far armpit rather than clasping the sleeve.',
    key_points: [
      'Start in the standard Kesa Gatame position',
      'Slide your sleeve-side arm under uke\'s back/shoulder instead of gripping the sleeve',
      'Your head-side arm still controls uke\'s head and collar',
      'Often easier to maintain when uke tries to roll toward you',
      'Wider base options available depending on which variation is used'
    ]
  },
  {
    title_en: 'Broken Side Four-Corner Hold', title_romaji: 'Kuzure Yoko Shiho Gatame', title_kanji: '崩横四方固',
    belt_requirement: 'orange', category: 'ne-waza', sub_category: 'Osaekomi-waza',
    is_kata: false, is_theory: false,
    description: 'A modified Yoko Shiho Gatame where one arm position is adjusted \u2014 typically the far-side arm wraps around the neck instead of going between the legs.',
    key_points: [
      'Lie perpendicular across uke as in Yoko Shiho Gatame',
      'Adjust one arm position: wrap the neck instead of threading between the legs',
      'The modified grip gives more head control and choking potential',
      'Keep hips low and chest heavy on uke',
      'Spread your legs wide for a stable base'
    ]
  },
  {
    title_en: 'Broken Upper Four-Corner Hold', title_romaji: 'Kuzure Kami Shiho Gatame', title_kanji: '崩上四方固',
    belt_requirement: 'orange', category: 'ne-waza', sub_category: 'Osaekomi-waza',
    youtube_id: 'YUrogQWdwiY',
    is_kata: false, is_theory: false,
    description: 'A modified form of Kami Shiho Gatame where one arm control is adjusted \u2014 typically one arm controls the neck and the other the arm.',
    key_points: [
      'From Kami Shiho, release one belt grip and wrap the arm around uke\'s neck',
      'Or: trap one arm under your body while the other grips the far collar',
      'Often more stable against rolling escapes than the standard version',
      'Weight stays in uke\'s chest and upper body',
      'Adjust leg position as needed to prevent uke from bridging'
    ]
  },

  // ── Shime Waza ────────────────────────────────────────────────────
  {
    title_en: 'Half Cross Strangle', title_romaji: 'Kata Juji Jime', title_kanji: '片十字絞',
    belt_requirement: 'orange', category: 'ne-waza', sub_category: 'Shime-waza',
    youtube_id: '3VZVUAmiMD8',
    is_kata: false, is_theory: false,
    description: 'A cross-collar choke where one hand is palm-up and the other is palm-down, forming a half-cross grip.',
    key_points: [
      'Applied from guard (uke on back, tori between legs) or from mount',
      'One hand drives deep palm-up into uke\'s far collar',
      'The other hand grips the near collar palm-down',
      'Bring elbows together and down toward uke\'s chest to apply pressure',
      'Press your forearms against uke\'s carotids, not the windpipe'
    ]
  },
  {
    title_en: 'Single-Wing Strangle', title_romaji: 'Kata Ha Jime', title_kanji: '片羽絞',
    belt_requirement: 'orange', category: 'ne-waza', sub_category: 'Shime-waza',
    youtube_id: 'yaTGgRjnwB8',
    is_kata: false, is_theory: false,
    description: 'From behind uke, one arm applies the collar choke while the other traps uke\'s arm up behind their own head.',
    key_points: [
      'Take uke\'s back; one arm threads under their armpit and pushes their arm up',
      'The other hand grips deep into the far collar from behind the neck',
      'The trapped arm prevents uke from defending the choke',
      'Pull the collar across while the wing arm locks the shoulder in place'
    ]
  },

  // ── Kansetsu Waza ─────────────────────────────────────────────────
  {
    title_en: 'Arm Entanglement', title_romaji: 'Ude Garami', title_kanji: '腕緘',
    belt_requirement: 'orange', category: 'ne-waza', sub_category: 'Kansetsu-waza',
    youtube_id: 'AIlTvZb4RlE',
    is_kata: false, is_theory: false,
    description: 'Review at orange belt level. A figure-four armlock that rotates uke\'s elbow joint against its natural range of motion.',
    key_points: [
      'At orange level, practise from multiple positions: guard, mount, side control',
      'Thread your arm under uke\'s arm and grip their wrist from below',
      'Your other hand grips your own wrist to form the figure-four',
      'Rotate uke\'s wrist toward their shoulder \u2014 do not apply suddenly'
    ]
  },
  {
    title_en: 'Arm Lock', title_romaji: 'Ude Gatame', title_kanji: '腕挫腕固',
    belt_requirement: 'orange', category: 'ne-waza', sub_category: 'Kansetsu-waza',
    youtube_id: 'SBf0aTma1VI',
    is_kata: false, is_theory: false,
    description: 'A straight armlock applied by pressing uke\'s elbow against a fixed part of tori\'s body, usually the chest or shoulder.',
    key_points: [
      'Trap uke\'s straight arm \u2014 keep it extended and under control',
      'Press the arm against your chest, shoulder, or armpit to create the lever',
      'Both your hands control uke\'s wrist \u2014 the pressure point is the elbow',
      'Can be applied from a standing position or from the ground',
      'Apply slowly \u2014 the elbow joint has limited range; the lock is immediate'
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // GREEN BELT (Sankyu)
  // ══════════════════════════════════════════════════════════════════

  // ── Nage Waza ─────────────────────────────────────────────────────
  {
    title_en: 'Minor Outer Reaping', title_romaji: 'Kosoto Gari', title_kanji: '小外刈',
    belt_requirement: 'green', category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: 'jeQ541ScLB4',
    is_kata: false, is_theory: false,
    description: 'A small outer reap that hooks the outside of uke\'s heel, toppling them sideways and backward.',
    key_points: [
      'Break uke\'s balance to the rear-corner on the reaping side',
      'Hook the back of your heel against the outside of uke\'s heel',
      'Use a sweeping, scooping motion \u2014 heel to heel',
      'Push across with your grip to assist the off-balance',
      'Often effective as a combination follow-up from Ouchi Gari'
    ]
  },
  {
    title_en: 'Minor Outer Hook', title_romaji: 'Kosoto Gake', title_kanji: '小外掛',
    belt_requirement: 'green', category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: '8b6kY4s4zH4',
    is_kata: false, is_theory: false,
    description: 'Tori hooks their heel around the back of uke\'s ankle from the outside while pushing diagonally through them.',
    key_points: [
      'Hook the outside of uke\'s ankle with the back of your heel',
      'Push through uke\'s body diagonally as you hook \u2014 the hook alone is not enough',
      'Differs from Kosoto Gari in that the foot hooks and stays rather than reaping through',
      'Drive forward into uke to topple them over the hooked leg'
    ]
  },
  {
    title_en: 'Leg Wheel', title_romaji: 'Ashi Guruma', title_kanji: '足車',
    belt_requirement: 'green', category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: 'ROeayhvom9U',
    is_kata: false, is_theory: false,
    description: 'A leg wheel that blocks across both of uke\'s legs. The blocking leg acts as the wheel\'s axle.',
    key_points: [
      'Turn in and extend your blocking leg across both of uke\'s shins/thighs',
      'Your leg is a fixed block \u2014 no sweeping motion',
      'Pull strongly in a circular arc with both hands to wheel uke over the block',
      'The throw is entirely in the hands \u2014 the leg only provides the pivot',
      'Differentiate from Harai Goshi: this targets lower and across both legs'
    ]
  },
  {
    title_en: 'Inner Thigh Throw', title_romaji: 'Uchi Mata', title_kanji: '内股',
    belt_requirement: 'green', category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: 'iUpSu5J-bgw',
    is_kata: false, is_theory: false,
    description: 'One of judo\'s highest-scoring techniques in competition. Tori\'s leg reaches between uke\'s legs to reap the inner thigh.',
    key_points: [
      'Turn in and drive your reaping leg up between uke\'s legs to the inner thigh',
      'The reaping action is upward, lifting rather than backward-sweeping',
      'Off-balance uke forward and slightly to the side before entering',
      'Pull the sleeve down and out while lifting the collar arm high',
      'Hip contact varies \u2014 can be hip-to-hip or thigh-dominant depending on style'
    ]
  },
  {
    title_en: 'Shoulder Wheel', title_romaji: 'Kata Guruma', title_kanji: '肩車',
    belt_requirement: 'green', category: 'tachi-waza', sub_category: 'Te-waza',
    youtube_id: 'cnHRhSy8yi4',
    is_kata: false, is_theory: false,
    description: 'Tori lifts uke across both shoulders and rotates to throw them \u2014 the original "fireman\'s carry" of judo.',
    key_points: [
      'Drop low and thread your arm between uke\'s legs',
      'Lift uke across your shoulders with both arms',
      'Stand up and rotate to throw uke forward',
      'Requires significant strength and good timing on the entry',
      'Modern competition variants use modified entries due to leg-grab rules'
    ]
  },
  {
    title_en: 'Circle Throw', title_romaji: 'Tomoe Nage', title_kanji: '巴投',
    belt_requirement: 'green', category: 'tachi-waza', sub_category: 'Ma-sutemi-waza',
    youtube_id: '880WbHvHv6A',
    is_kata: false, is_theory: false,
    description: 'A sacrifice throw where tori falls backward, places a foot on uke\'s stomach, and uses uke\'s momentum to circle them overhead.',
    key_points: [
      'Draw uke forward strongly to commit their weight',
      'Fall backward and place your foot on uke\'s lower abdomen/belt area',
      'As your back contacts the mat, extend your leg to launch uke overhead',
      'Both hands maintain grip throughout to guide uke\'s rotation',
      'The foot placement is the key \u2014 too high (chest) or too low (thigh) reduces power'
    ]
  },
  {
    title_en: 'Shoulder Drop', title_romaji: 'Seoi Otoshi', title_kanji: '背負落',
    belt_requirement: 'green', category: 'tachi-waza', sub_category: 'Te-waza',
    youtube_id: 'vu1TMVNnq34',
    is_kata: false, is_theory: false,
    description: 'Similar to Seoi Nage but tori drops to both knees during execution, sacrificing height for a lower and tighter throw.',
    key_points: [
      'Drop to both knees simultaneously \u2014 do not step through like Seoi Nage',
      'Keep uke\'s arm locked against your body throughout the drop',
      'Drive elbows downward as you rotate to pull uke over your back',
      'The low entry makes this effective against taller opponents'
    ]
  },
  {
    title_en: 'Double Leg Grab', title_romaji: 'Morote Gari', title_kanji: '双手刈',
    belt_requirement: 'green', category: 'tachi-waza', sub_category: 'Te-waza',
    youtube_id: 'BHLQS4K85bs',
    is_kata: false, is_theory: false,
    description: 'Tori dives low to grab both of uke\'s knees simultaneously and drives through to take them down.',
    key_points: [
      'Change level quickly by dropping your hips',
      'Both hands grip behind uke\'s knees or thighs simultaneously',
      'Drive forward with your shoulder into uke\'s abdomen as you grip',
      'Continue driving forward to topple uke backward',
      'Note: banned in IJF competition since 2010 but still part of judo\'s technique catalogue'
    ]
  },
  {
    title_en: 'Scooping Throw', title_romaji: 'Sukui Nage', title_kanji: '掬投',
    belt_requirement: 'green', category: 'tachi-waza', sub_category: 'Te-waza',
    youtube_id: 'vU6aJ2kFxoI',
    is_kata: false, is_theory: false,
    description: 'Tori scoops uke\'s legs from behind and lifts to throw them backward.',
    key_points: [
      'Scoop both legs or a single leg from behind',
      'Lift upward while driving forward with your body',
      'The scooping action disrupts uke\'s base completely',
      'Often used as a counter-throw when uke overcommits forward'
    ]
  },
  {
    title_en: 'Spring Hip Throw', title_romaji: 'Hane Goshi', title_kanji: '跳腰',
    belt_requirement: 'green', category: 'tachi-waza', sub_category: 'Koshi-waza',
    youtube_id: 'M9_7De6A1kk',
    is_kata: false, is_theory: false,
    description: 'A hip throw with a springing/kicking leg that adds power to the projection. The bent reaping leg springs upward to "bounce" uke over.',
    key_points: [
      'Turn in like Harai Goshi but bend the reaping knee as it contacts uke\'s thigh',
      'Spring the bent leg upward and backward to generate the "hane" (spring) action',
      'Hip contact is important: your hip must block uke\'s hip',
      'The spring replaces the sweeping \u2014 think bounce, not sweep',
      'Excellent combination with Ouchi Gari: outer reap \u2192 hip throw'
    ]
  },
  {
    title_en: 'Swallow Counter', title_romaji: 'Tsubame Gaeshi', title_kanji: '燕返',
    belt_requirement: 'green', category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: 'GwweWqqFB5g',
    is_kata: false, is_theory: false,
    description: 'A counter to De Ashi Harai: tori lifts the swept foot over the attacking sweep and reverses with the same sweeping motion.',
    key_points: [
      'Anticipate uke\'s foot sweep and lift your foot just before it connects',
      'Immediately sweep uke\'s now-exposed support leg with the same foot',
      'The "swallow" imagery: your foot dips and rises like a swallow in flight',
      'Requires sharp reflexes and excellent reading of uke\'s timing'
    ]
  },
  {
    title_en: 'Body Drop', title_romaji: 'Tai Otoshi', title_kanji: '体落',
    belt_requirement: 'green', category: 'tachi-waza', sub_category: 'Te-waza',
    youtube_id: '4x6S3Q-Ktv8',
    is_kata: false, is_theory: false,
    description: 'A hand technique that uses a blocking leg to pivot uke over a fixed point. The leg does not reap \u2014 it blocks like a tripwire while tori rotates.',
    key_points: [
      'Break balance forward to uke\'s right front corner',
      'Step across with your right foot, placing it in front of uke\'s right foot',
      'Extend your left leg across to block in front of both of uke\'s feet',
      'Rotate your entire body to your left \u2014 the block + rotation = throw',
      'Pull strongly with both hands as you rotate'
    ]
  },

  // ── Osaekomi Waza ─────────────────────────────────────────────────
  {
    title_en: 'Shoulder Hold', title_romaji: 'Kata Gatame', title_kanji: '肩固',
    belt_requirement: 'green', category: 'ne-waza', sub_category: 'Osaekomi-waza',
    youtube_id: 'zQR3IOXxO_Q',
    is_kata: false, is_theory: false,
    description: 'Review at green belt level. Focus on entries and transitions into Kata Gatame from various positions.',
    key_points: [
      'At green level, practise transitioning into Kata Gatame from passing guard',
      'Work on finishing both the pin and the choke aspects',
      'Clasp hands together tightly and squeeze uke\'s arm against their neck'
    ]
  },
  {
    title_en: 'Vertical Four-Corner Hold', title_romaji: 'Tate Shiho Gatame', title_kanji: '縦四方固',
    belt_requirement: 'green', category: 'ne-waza', sub_category: 'Osaekomi-waza',
    youtube_id: '55-rFmBx53g',
    is_kata: false, is_theory: false,
    description: 'Review at green belt level. Focus on maintaining the mount against active escape attempts.',
    key_points: [
      'At green level, focus on maintaining mount against uke\'s bridging and shrimping',
      'Hook your feet under uke\'s thighs to prevent being bucked off',
      'Keep your weight forward and distributed through your chest'
    ]
  },
  {
    title_en: 'Reverse Scarf Hold', title_romaji: 'Ushiro Kesa Gatame', title_kanji: '後袈裟固',
    belt_requirement: 'green', category: 'ne-waza', sub_category: 'Osaekomi-waza',
    youtube_id: 'SBapox2M2dE',
    is_kata: false, is_theory: false,
    description: 'Tori sits beside uke facing uke\'s feet, controlling from behind with body weight over the hips and arm.',
    key_points: [
      'Sit beside uke but face toward their feet \u2014 the reverse of standard Kesa Gatame',
      'One arm wraps around uke\'s near hip or belt from behind',
      'The other arm controls uke\'s near arm at the sleeve',
      'Your back presses into uke\'s side for weight distribution',
      'Spread legs wide for base and keep your hips low'
    ]
  },

  // ── Shime Waza ────────────────────────────────────────────────────
  {
    title_en: 'Triangle Strangle', title_romaji: 'Sankaku Jime', title_kanji: '三角絞',
    belt_requirement: 'green', category: 'ne-waza', sub_category: 'Shime-waza',
    youtube_id: 'lq1CUBRAm7s',
    is_kata: false, is_theory: false,
    description: 'A triangle choke applying pressure to the carotid arteries using the legs. One of the most powerful strangles in judo.',
    key_points: [
      'Trap uke\'s head and one arm between your thighs',
      'Lock the triangle: place one ankle behind the opposite knee',
      'Squeeze your thighs together while pulling uke\'s trapped arm across',
      'The trapped arm against the neck creates additional carotid pressure',
      'Angle your hips perpendicular to uke\'s spine for maximum compression'
    ]
  },

  // ── Kansetsu Waza ─────────────────────────────────────────────────
  {
    title_en: 'Armpit Lock', title_romaji: 'Waki Gatame', title_kanji: '腕挫腋固',
    belt_requirement: 'green', category: 'ne-waza', sub_category: 'Kansetsu-waza',
    youtube_id: '8F5p1zuJRG0',
    is_kata: false, is_theory: false,
    description: 'A straight armlock where tori traps uke\'s arm under their own armpit, pressing the elbow against the side of their body.',
    key_points: [
      'Grab uke\'s wrist and trap their arm under your armpit',
      'Drive your body weight downward onto the trapped arm',
      'Uke\'s elbow presses against your body (rib/hip area) \u2014 this is the fulcrum',
      'Keep the arm straight \u2014 if uke bends it, reposition',
      'Can be applied from standing or on the ground; often from a failed grip'
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // BLUE BELT (Nikyu)
  // ══════════════════════════════════════════════════════════════════

  // ── Nage Waza ─────────────────────────────────────────────────────
  {
    title_en: 'Changing Hip Throw', title_romaji: 'Utsuri Goshi', title_kanji: '移腰',
    belt_requirement: 'blue', category: 'tachi-waza', sub_category: 'Koshi-waza',
    youtube_id: '4pQd_bEnlf0',
    is_kata: false, is_theory: false,
    description: 'A counter-throw: when uke attempts a hip throw, tori lifts them and repositions onto a higher hip to throw them back.',
    key_points: [
      'Used as a counter when uke turns in for a hip throw',
      'Block uke\'s throw by sinking your hips lower than theirs',
      'Lift uke from behind and reposition your hip underneath',
      'The "changing" (utsuri) refers to switching the hip position from defence to attack'
    ]
  },
  {
    title_en: 'Inner Thigh Counter', title_romaji: 'Uchi Mata Gaeshi', title_kanji: '内股返',
    belt_requirement: 'blue', category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: 'Sy6sLWxkWYw',
    is_kata: false, is_theory: false,
    description: 'A counter to Uchi Mata where tori blocks the inner thigh lift and topples uke sideways or backward.',
    key_points: [
      'As uke enters for Uchi Mata, block the sweeping leg by stepping your leg over it',
      'Use the momentum of uke\'s failed attack to reverse the throw',
      'Push uke in the direction they are already off-balance',
      'Requires reading uke\'s attack early enough to initiate the counter'
    ]
  },
  {
    title_en: 'Major Outer Drop', title_romaji: 'Osoto Otoshi', title_kanji: '大外落',
    belt_requirement: 'blue', category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: '2DsVvDw7b8g',
    is_kata: false, is_theory: false,
    description: 'A stepping variant of O Soto Gari where tori steps through behind uke\'s leg rather than reaping, creating a dropping action.',
    key_points: [
      'Step your leg behind uke\'s leg \u2014 place it on the mat rather than reaping',
      'Drive uke backward over the planted leg',
      'The "drop" (otoshi) comes from uke falling over the fixed obstacle',
      'Strong upper-body drive is essential since there is no reaping action'
    ]
  },
  {
    title_en: 'Major Outer Wheel', title_romaji: 'Osoto Guruma', title_kanji: '大外車',
    belt_requirement: 'blue', category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: '92KbCm6pQeI',
    is_kata: false, is_theory: false,
    description: 'Tori sweeps both of uke\'s legs from the outside with a single wide sweeping leg action, throwing uke backward.',
    key_points: [
      'Similar entry to O Soto Gari but the sweep catches both legs',
      'The sweeping leg extends wide to contact both of uke\'s legs simultaneously',
      'The "wheel" (guruma) action rotates uke backward over your leg',
      'Strong kuzushi backward is critical before the sweep'
    ]
  },
  {
    title_en: 'Major Wheel', title_romaji: 'O Guruma', title_kanji: '大車',
    belt_requirement: 'blue', category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: 'SnZciTAY9vc',
    is_kata: false, is_theory: false,
    description: 'Tori extends a straight leg across uke\'s upper thighs and uses body rotation to wheel them forward.',
    key_points: [
      'Turn in and extend your leg across both of uke\'s upper thighs',
      'The leg acts as the axle of the wheel',
      'Pull strongly with both hands to rotate uke over the blocking leg',
      'Differs from Ashi Guruma by targeting the upper thigh rather than the knee/shin'
    ]
  },
  {
    title_en: 'Inner Thigh Slip Counter', title_romaji: 'Uchi Mata Sukashi', title_kanji: '内股すかし',
    belt_requirement: 'blue', category: 'tachi-waza', sub_category: 'Te-waza',
    youtube_id: 'V-RS3uhtVWM',
    is_kata: false, is_theory: false,
    description: 'A counter to Uchi Mata: tori avoids the inner thigh lift by shifting weight, then topples uke sideways.',
    key_points: [
      'As uke enters for Uchi Mata, sidestep to let the sweeping leg pass through empty space',
      'The "sukashi" (slip/void) means making uke\'s attack hit nothing',
      'Use uke\'s forward momentum to guide them to the ground',
      'Timing and body positioning are more important than strength'
    ]
  },
  {
    title_en: 'Springing Wraparound', title_romaji: 'Hane Makikomi', title_kanji: '跳巻込',
    belt_requirement: 'blue', category: 'tachi-waza', sub_category: 'Yoko-sutemi-waza',
    youtube_id: '6CRBGLGz9j8',
    is_kata: false, is_theory: false,
    description: 'Combines Hane Goshi\'s springing leg action with a rolling makikomi fall, winding uke into the ground.',
    key_points: [
      'Enter as for Hane Goshi but wrap your arm around uke\'s arm',
      'Spring with the bent leg while simultaneously rolling/falling sideways',
      'The wrap prevents uke from posting to stop the throw',
      'Commit fully to the fall \u2014 half-hearted execution loses the throw'
    ]
  },
  {
    title_en: 'Outer Wraparound', title_romaji: 'Soto Makikomi', title_kanji: '外巻込',
    belt_requirement: 'blue', category: 'tachi-waza', sub_category: 'Yoko-sutemi-waza',
    youtube_id: 'bWG9O1BVKtQ',
    is_kata: false, is_theory: false,
    description: 'Tori wraps their arm around uke\'s arm from the outside and falls sideways, rolling uke over.',
    key_points: [
      'Wrap your arm over and around uke\'s arm from the outside',
      'Fall to your side while keeping uke\'s arm trapped',
      'The rolling fall and arm trap combine to throw uke over your body',
      'Effective when uke stiffens their arm defensively'
    ]
  },
  {
    title_en: 'Side Drop', title_romaji: 'Yoko Otoshi', title_kanji: '横落',
    belt_requirement: 'blue', category: 'tachi-waza', sub_category: 'Yoko-sutemi-waza',
    youtube_id: 'MnNG67pF_a0',
    is_kata: false, is_theory: false,
    description: 'Tori drops to the side and extends a leg to trip uke diagonally across.',
    key_points: [
      'Pull uke forward and to the side while dropping your own body',
      'Extend one leg across uke\'s path as you fall',
      'Your body dropping creates the pulling force that breaks uke\'s balance',
      'Keep strong grip throughout \u2014 the throw depends on hand control'
    ]
  },
  {
    title_en: 'Side Circle Throw', title_romaji: 'Yoko Tomoe Nage', title_kanji: '横巴投',
    belt_requirement: 'blue', category: 'tachi-waza', sub_category: 'Yoko-sutemi-waza',
    is_kata: false, is_theory: false,
    description: 'A side variation of Tomoe Nage where tori falls to the side and places a foot on uke\'s hip or thigh, launching them laterally.',
    key_points: [
      'Fall to your side rather than straight back as in standard Tomoe Nage',
      'Place the foot on uke\'s hip or inner thigh rather than the abdomen',
      'Extend the foot-leg to launch uke sideways and overhead',
      'Pull uke over your body using strong hand control',
      'Effective against opponents with a wide, defensive stance'
    ]
  },
  {
    title_en: 'Valley Drop', title_romaji: 'Tani Otoshi', title_kanji: '谷落',
    belt_requirement: 'blue', category: 'tachi-waza', sub_category: 'Yoko-sutemi-waza',
    youtube_id: '3b9Me3Fohpk',
    is_kata: false, is_theory: false,
    description: 'A side sacrifice throw where tori drops behind uke\'s legs and pulls them backward into the "valley".',
    key_points: [
      'Step behind uke and between their legs, then drop to the mat',
      'Pull uke directly over you as you fall \u2014 they fall into the space behind them',
      'One leg extends behind uke\'s far leg as a block',
      'Effective when uke is leaning backward defensively',
      'Often used as a counter to uke\'s forward motion'
    ]
  },

  // ── Renraku Waza (Combination Techniques) ─────────────────────────
  {
    title_en: 'Shoulder Throw to Minor Inner Reap (and vice versa)', title_romaji: 'Seoi Nage \u2194 Kouchi Gari', title_kanji: '背負投 \u2194 小内刈',
    belt_requirement: 'blue', category: 'tachi-waza', sub_category: 'Renraku-waza',
    is_kata: false, is_theory: false,
    description: 'A bidirectional combination: attack with Seoi Nage to draw uke\'s weight forward, then switch to Kouchi Gari as they resist backward \u2014 or vice versa.',
    key_points: [
      'Seoi Nage \u2192 Kouchi Gari: when uke resists the forward throw by pulling back, their heel becomes exposed for the reap',
      'Kouchi Gari \u2192 Seoi Nage: when uke resists the backward reap by pushing forward, they walk into the shoulder throw',
      'The key is reading uke\'s reaction and attacking in the direction they move'
    ]
  },
  {
    title_en: 'Knee Wheel to Major Outer Reap (and vice versa)', title_romaji: 'Hiza Guruma \u2194 Osoto Gari', title_kanji: '膝車 \u2194 大外刈',
    belt_requirement: 'blue', category: 'tachi-waza', sub_category: 'Renraku-waza',
    is_kata: false, is_theory: false,
    description: 'A bidirectional combination: Hiza Guruma pulls uke forward \u2014 if they resist by pushing back, switch to Osoto Gari, and vice versa.',
    key_points: [
      'Hiza Guruma \u2192 Osoto Gari: uke pushes back against the knee block, exposing their rear balance for the reap',
      'Osoto Gari \u2192 Hiza Guruma: uke resists the reap by leaning forward, creating the forward off-balance for the wheel',
      'Smooth transitions between attacks are more important than power'
    ]
  },
  {
    title_en: 'Major Outer Reap to Scarf Hold', title_romaji: 'Osoto Gari \u2192 Kesa Gatame', title_kanji: '大外刈 \u2192 袈裟固',
    belt_requirement: 'blue', category: 'tachi-waza', sub_category: 'Renraku-waza',
    is_kata: false, is_theory: false,
    description: 'A standing-to-ground transition: execute Osoto Gari and immediately follow uke to the ground, securing Kesa Gatame.',
    key_points: [
      'After completing the throw, do not release your grips',
      'Follow uke to the ground and transition directly into Kesa Gatame',
      'Control uke\'s arm throughout the transition to prevent escape',
      'Speed of transition is critical \u2014 secure the pin before uke can recover'
    ]
  },
  {
    title_en: 'Shoulder Throw to Cross Armlock', title_romaji: 'Seoi Nage \u2192 Juji Gatame', title_kanji: '背負投 \u2192 十字固',
    belt_requirement: 'blue', category: 'tachi-waza', sub_category: 'Renraku-waza',
    is_kata: false, is_theory: false,
    description: 'A standing-to-ground transition: execute Seoi Nage and flow into Juji Gatame on the trapped arm.',
    key_points: [
      'As you complete Seoi Nage, maintain control of uke\'s arm',
      'Transition by swinging your leg over uke\'s head while keeping the arm trapped',
      'Fall back into Juji Gatame position with uke\'s arm controlled between your thighs',
      'Practise the throw-to-armbar transition as one fluid movement'
    ]
  },
  {
    title_en: 'Body Drop to Normal Cross Strangle', title_romaji: 'Tai Otoshi \u2192 Nami Juji Jime', title_kanji: '体落 \u2192 並十字絞',
    belt_requirement: 'blue', category: 'tachi-waza', sub_category: 'Renraku-waza',
    is_kata: false, is_theory: false,
    description: 'A standing-to-ground transition: execute Tai Otoshi and immediately follow with Nami Juji Jime on the ground.',
    key_points: [
      'After completing Tai Otoshi, follow uke to the ground maintaining collar grips',
      'Slide into mount or side control and apply Nami Juji Jime',
      'The collar grips used for the throw can transition directly into the strangle',
      'Speed and grip retention make the transition seamless'
    ]
  },

  // ── Osaekomi Waza ─────────────────────────────────────────────────
  {
    title_en: 'Pillow Scarf Hold', title_romaji: 'Makura Kesa Gatame', title_kanji: '枕袈裟固',
    belt_requirement: 'blue', category: 'ne-waza', sub_category: 'Osaekomi-waza',
    is_kata: false, is_theory: false,
    description: 'A variant of Kesa Gatame where tori\'s arm reaches behind uke\'s head like a pillow, controlling from above rather than the side.',
    key_points: [
      'Position as in Kesa Gatame but slide your arm behind uke\'s head',
      'Your arm acts as a "pillow" cradling uke\'s head \u2014 controlling their movement',
      'The other hand can grip uke\'s arm, belt, or collar',
      'Maintain a wide base with your legs for stability'
    ]
  },
  {
    title_en: 'Chest Hold', title_romaji: 'Mune Gatame', title_kanji: '胸固',
    belt_requirement: 'blue', category: 'ne-waza', sub_category: 'Osaekomi-waza',
    is_kata: false, is_theory: false,
    description: 'A pin where tori lies chest-to-chest with uke at a roughly perpendicular angle, controlling the collar and the near arm.',
    key_points: [
      'Lie across uke with your chest directly on theirs',
      'One arm reaches under the neck to grip the far shoulder or collar',
      'The other arm traps uke\'s near arm between your arm and body',
      'Spread your legs wide for a stable base \u2014 no knee contact with the mat',
      'Keep your hips low; drive your weight through your chest'
    ]
  },

  // ── Shime Waza ────────────────────────────────────────────────────
  {
    title_en: 'Two-Hand Strangle', title_romaji: 'Ryo Te Jime', title_kanji: '両手絞',
    belt_requirement: 'blue', category: 'ne-waza', sub_category: 'Shime-waza',
    youtube_id: '-RHC4V7TQiY',
    is_kata: false, is_theory: false,
    description: 'Both hands grip the collar and squeeze simultaneously across the throat from the front.',
    key_points: [
      'Both hands grip the collar on each side of uke\'s neck',
      'Squeeze inward and down to compress the carotid arteries',
      'Keep your chest close to uke to prevent them from creating space',
      'Effective from mount or inside uke\'s guard'
    ]
  },
  {
    title_en: 'One-Hand Strangle', title_romaji: 'Kata Te Jime', title_kanji: '片手絞',
    belt_requirement: 'blue', category: 'ne-waza', sub_category: 'Shime-waza',
    youtube_id: 'cHeIs-fSqwE',
    is_kata: false, is_theory: false,
    description: 'A one-handed strangle applied with a single hand gripping the collar and pressing across the throat.',
    key_points: [
      'One hand grips deep into the collar across uke\'s throat',
      'The free hand can brace against uke\'s body or control their arm',
      'Rotate the gripping hand to tighten the collar against the neck',
      'Often used in transitions when only one hand can reach the collar'
    ]
  },

  // ── Kansetsu Waza ─────────────────────────────────────────────────
  {
    title_en: 'Knee Arm-Bar', title_romaji: 'Hiza Gatame', title_kanji: '腕挫膝固',
    belt_requirement: 'blue', category: 'ne-waza', sub_category: 'Kansetsu-waza',
    youtube_id: 'H2HtAJdiJcE',
    is_kata: false, is_theory: false,
    description: 'An elbow lock where tori uses their knee as the fulcrum to press uke\'s arm against.',
    key_points: [
      'Trap uke\'s arm and place your knee at the crook of their elbow',
      'Your hands control uke\'s wrist \u2014 pulling it toward you',
      'The knee pressing into the elbow joint from below creates the lever',
      'Keep uke\'s arm straight \u2014 bending it removes the pressure',
      'Apply gradually and smoothly; elbow locks can come on quickly'
    ]
  },
  {
    title_en: 'Abdomen Arm-Bar', title_romaji: 'Hara Gatame', title_kanji: '腕挫腹固',
    belt_requirement: 'blue', category: 'ne-waza', sub_category: 'Kansetsu-waza',
    youtube_id: 'ZzEycg8R_9M',
    is_kata: false, is_theory: false,
    description: 'Tori uses their abdomen or hip as the fulcrum under uke\'s elbow while pulling the wrist down.',
    key_points: [
      'Trap uke\'s straight arm across your abdomen or hip',
      'Your abdomen acts as the fulcrum pressing against the elbow from below',
      'Both hands grip uke\'s wrist and pull it downward',
      'Apply pressure by extending your hips forward into the arm'
    ]
  },

  // ── Nage no Kata ──────────────────────────────────────────────────
  {
    title_en: 'Forms of Throwing \u2014 Hand Techniques', title_romaji: 'Nage-no-Kata: Te-waza', title_kanji: '投の形：手技',
    belt_requirement: 'blue', category: 'kata', sub_category: 'Nage-no-Kata',
    is_kata: true, is_theory: false,
    description: 'The first set of Nage-no-Kata \u2014 three hand techniques performed in formal pairs demonstrating the principles of te-waza.',
    kata_forms: [
      'Uki Otoshi (Floating Drop)',
      'Seoi Nage (Shoulder Throw)',
      'Kata Guruma (Shoulder Wheel)'
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // BROWN BELT (Ikkyu)
  // ══════════════════════════════════════════════════════════════════

  // ── Nage Waza ─────────────────────────────────────────────────────
  {
    title_en: 'Corner Drop', title_romaji: 'Sumi Otoshi', title_kanji: '隅落',
    belt_requirement: 'brown', category: 'tachi-waza', sub_category: 'Te-waza',
    youtube_id: 'lLU9wv52ni0',
    is_kata: false, is_theory: false,
    description: 'Tori applies diagonal kuzushi to take uke straight down into the corner behind them without hip or leg contact.',
    key_points: [
      'Pure hand technique \u2014 no hip or leg contact with uke',
      'Break uke\'s balance diagonally to their rear corner',
      'Pull downward and across to collapse uke into the void behind them',
      'Requires precise kuzushi and timing \u2014 power is not the key'
    ]
  },
  {
    title_en: 'Rice Bale Throw', title_romaji: 'Tawara Gaeshi', title_kanji: '俵返',
    belt_requirement: 'brown', category: 'tachi-waza', sub_category: 'Ma-sutemi-waza',
    youtube_id: 'TmTWgrmViZc',
    is_kata: false, is_theory: false,
    description: 'A counter to a rear bearhug: tori drops to one knee, grabs uke\'s legs, and rolls them over the shoulder like a rice bale.',
    key_points: [
      'Often used as a counter to a rear body lock or Morote Gari',
      'Grip uke\'s legs from behind and drop your weight',
      'Roll backward, taking uke over your shoulder',
      'The name comes from the motion of heaving a rice bale'
    ]
  },
  {
    title_en: 'Major Outer Wraparound', title_romaji: 'Osoto Makikomi', title_kanji: '大外巻込',
    belt_requirement: 'brown', category: 'tachi-waza', sub_category: 'Yoko-sutemi-waza',
    youtube_id: 'DGDv2oMwmas',
    is_kata: false, is_theory: false,
    description: 'Adds a rolling falling action to O Soto Gari \u2014 tori winds uke\'s arm and falls with the reap.',
    key_points: [
      'Enter for O Soto Gari but wrap your sleeve-grip arm around uke\'s arm',
      'Fall into uke (rather than staying upright) while continuing to reap',
      'Your body wraps tightly against uke so they can\'t extend an arm to break the fall',
      'Execute quickly \u2014 the wrap and reap must happen together'
    ]
  },
  {
    title_en: 'Inner Thigh Wraparound', title_romaji: 'Uchi Mata Makikomi', title_kanji: '内股巻込',
    belt_requirement: 'brown', category: 'tachi-waza', sub_category: 'Yoko-sutemi-waza',
    youtube_id: 'jZXENTLpJCI',
    is_kata: false, is_theory: false,
    description: 'Adds a rolling falling action to Uchi Mata \u2014 tori winds uke\'s arm over as the thigh sweep lifts.',
    key_points: [
      'Enter for Uchi Mata but wrap your arm around uke\'s arm',
      'Continue the inner thigh sweep while falling and rolling sideways',
      'The arm wrap prevents uke from escaping the throw',
      'Effective when uke defends standard Uchi Mata by stiffening their arm'
    ]
  },
  {
    title_en: 'Sweeping Wraparound', title_romaji: 'Harai Makikomi', title_kanji: '払巻込',
    belt_requirement: 'brown', category: 'tachi-waza', sub_category: 'Yoko-sutemi-waza',
    youtube_id: 'VBaHzKaCXss',
    is_kata: false, is_theory: false,
    description: 'Adds a rolling falling action to Harai Goshi \u2014 tori winds uke\'s arm during the sweeping hip rotation.',
    key_points: [
      'Enter for Harai Goshi but wrap your arm around uke\'s arm',
      'Continue the hip sweep while falling and rolling with uke',
      'The combination of sweep and wrap creates a powerful throw',
      'Often used when the standard Harai Goshi is blocked'
    ]
  },
  {
    title_en: 'Mountain Storm', title_romaji: 'Yama Arashi', title_kanji: '山嵐',
    belt_requirement: 'brown', category: 'tachi-waza', sub_category: 'Te-waza',
    youtube_id: 'MGlyKmSuzdc',
    is_kata: false, is_theory: false,
    description: 'A powerful combination throw blending elements of Seoi Nage and Harai Goshi with a strong rotational drive.',
    key_points: [
      'Enter with a strong lapel grip, driving the arm across uke\'s chest',
      'Combine a turning motion with a leg sweep or hip contact',
      'The power comes from the coordinated rotation of the entire body',
      'Historically one of judo\'s most feared throws \u2014 Shiro Saigo\'s signature technique'
    ]
  },
  {
    title_en: 'Sweeping Drawing Ankle Throw', title_romaji: 'Harai Tsurikomi Ashi', title_kanji: '払釣込足',
    belt_requirement: 'brown', category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: 'gGPXvWL8VbE',
    is_kata: false, is_theory: false,
    description: 'Combines the upward collar pull of Sasae Tsurikomi Ashi with a sweeping foot action at the ankle.',
    key_points: [
      'Strong upward lifting pull with the collar hand (tsuri komi)',
      'The foot sweeps uke\'s ankle outward rather than blocking it',
      'Works best when uke is stepping forward \u2014 catch the ankle mid-step',
      'The lift forces uke onto their toes, making the sweep easier',
      'Combine the sweep and the lift simultaneously for maximum effect'
    ]
  },
  {
    title_en: 'Side Separation', title_romaji: 'Yoko Wakare', title_kanji: '横分',
    belt_requirement: 'brown', category: 'tachi-waza', sub_category: 'Yoko-sutemi-waza',
    youtube_id: 'bp1tscHlePI',
    is_kata: false, is_theory: false,
    description: 'A side sacrifice throw where tori falls sideways beneath uke, using their leg and body to separate uke from their balance point.',
    key_points: [
      'Pull uke forward and fall sideways \u2014 the separation between bodies creates the throw',
      'Drive one leg in front of uke\'s legs to sweep or block',
      'Use strong bilateral hand action to guide uke\'s rotation',
      'Keep pulling as you fall \u2014 release of grip kills the technique'
    ]
  },

  // ── Renraku Waza (General Requirement) ────────────────────────────
  {
    title_en: 'Combination Techniques (General)', title_romaji: 'Renraku Waza', title_kanji: '連絡技',
    belt_requirement: 'brown', category: 'knowledge', sub_category: 'Requirement',
    is_kata: false, is_theory: true,
    description: 'At brown belt level: demonstrate at least one combination technique for each technique through brown belt. This requires the ability to chain attacks together fluidly.',
    key_points: [
      'Every technique in the syllabus should have at least one combination entry',
      'Combinations can flow in any direction: forward-to-backward, standing-to-ground, etc.',
      'The key principle is reading uke\'s reaction and attacking in the direction of their movement',
      'Smooth transitions between techniques are more important than the power of any single attack'
    ]
  },

  // ── Kaeshi Waza (General Requirement) ─────────────────────────────
  {
    title_en: 'Counter Techniques (General)', title_romaji: 'Kaeshi Waza', title_kanji: '返技',
    belt_requirement: 'brown', category: 'knowledge', sub_category: 'Requirement',
    is_kata: false, is_theory: true,
    description: 'At brown belt level: demonstrate at least one counter throw for each technique through brown belt. This requires the ability to defend and reverse attacks.',
    key_points: [
      'Every technique in the syllabus should have at least one counter',
      'Counters exploit the attacker\'s commitment \u2014 they are most vulnerable mid-throw',
      'Common counter strategies: block and reverse, sidestep and redirect, absorb and throw back',
      'Timing is critical \u2014 counter too early and the attack hasn\'t committed; too late and you\'re already thrown'
    ]
  },

  // ── Osaekomi Waza ─────────────────────────────────────────────────
  {
    title_en: 'Triangle Hold-Down', title_romaji: 'Sankaku Gatame', title_kanji: '三角固',
    belt_requirement: 'brown', category: 'ne-waza', sub_category: 'Osaekomi-waza',
    is_kata: false, is_theory: false,
    description: 'A hold-down using the triangle leg configuration. Tori entangles their legs around uke\'s head and arm to immobilize them on their back.',
    key_points: [
      'Form the triangle by placing one ankle behind the opposite knee around uke\'s head and arm',
      'Control uke\'s upper body with the leg triangle while using hands for additional control',
      'Can transition directly from Sankaku Jime if the strangle is not effective',
      'The triangle position limits uke\'s ability to bridge or roll to escape'
    ]
  },

  // ── Shime Waza ────────────────────────────────────────────────────
  {
    title_en: 'Thrust Choke', title_romaji: 'Tsukkomi Jime', title_kanji: '突込絞',
    belt_requirement: 'brown', category: 'ne-waza', sub_category: 'Shime-waza',
    youtube_id: 'dKKpnD3eLcY',
    is_kata: false, is_theory: false,
    description: 'Tori drives a single fist or wrist straight into uke\'s throat while the other hand braces or grips the collar.',
    key_points: [
      'One hand grips the collar and drives the knuckles or wrist into uke\'s throat',
      'The other hand can grip the far collar for additional leverage',
      'The "thrust" (tsukkomi) creates direct pressure against the airway or carotids',
      'Can be applied from mount, side control, or when uke is turtled'
    ]
  },
  {
    title_en: 'Sleeve Wheel Strangle', title_romaji: 'Sode Guruma Jime', title_kanji: '袖車絞',
    belt_requirement: 'brown', category: 'ne-waza', sub_category: 'Shime-waza',
    youtube_id: 'E3nvQzClcAU',
    is_kata: false, is_theory: false,
    description: 'Tori grips uke\'s sleeves and rotates their forearms to apply pressure on both sides of the neck simultaneously.',
    key_points: [
      'Grip both of uke\'s sleeves or use one sleeve and one collar grip',
      'Rotate your forearms inward to create a "wheel" of pressure around uke\'s neck',
      'The sleeves act as levers to multiply the choking force',
      'Effective from guard or when controlling uke from behind'
    ]
  },

  // ── Nage no Kata ──────────────────────────────────────────────────
  {
    title_en: 'Forms of Throwing \u2014 Hip & Leg Techniques', title_romaji: 'Nage-no-Kata: Koshi-waza & Ashi-waza', title_kanji: '投の形：腰技・足技',
    belt_requirement: 'brown', category: 'kata', sub_category: 'Nage-no-Kata',
    is_kata: true, is_theory: false,
    description: 'The second and third sets of Nage-no-Kata \u2014 three hip techniques and three leg techniques performed in formal pairs.',
    kata_forms: [
      'Koshi-waza: Uki Goshi (Floating Hip) \u00b7 Harai Goshi (Sweeping Hip) \u00b7 Tsurikomi Goshi (Lifting Pulling Hip)',
      'Ashi-waza: Okuri Ashi Barai (Sliding Foot Sweep) \u00b7 Sasae Tsurikomi Ashi (Propping Drawing Ankle) \u00b7 Uchi Mata (Inner Thigh)'
    ]
  },
];
