import { JudoTechnique } from '../../interfaces/judo.model';

export const KODOKAN_TECHNIQUES: JudoTechnique[] = [

  // ══════════════════════════════════════════════════════════════════
  // NAGE-WAZA  (Throwing Techniques)
  // ══════════════════════════════════════════════════════════════════

  // ── TE-WAZA  (Hand Techniques) ────────────────────────────────────
  {
    title_en: 'Shoulder Throw', title_romaji: 'Seoi-nage', title_kanji: '背負投',
    category: 'tachi-waza', sub_category: 'Te-waza',
    youtube_id: 'zIq0xI0ogxk',
    is_kata: false, is_theory: false,
    description: 'Tori pivots deeply into uke, loading them across the back, then rotates to throw them forward over the shoulder.',
    key_points: [
      'Pivot so both feet land inside uke\'s feet, hip must be below uke\'s centre of gravity',
      'Pull sharply with the sleeve hand to break uke\'s balance before entry',
      'Bend knees on entry, then extend them to lift and propel uke forward',
    ]
  },
  {
    title_en: 'One-Arm Shoulder Throw', title_romaji: 'Ippon-seoi-nage', title_kanji: '一本背負投',
    category: 'tachi-waza', sub_category: 'Te-waza',
    youtube_id: 'FQnOlCxo4oI',
    is_kata: false, is_theory: false,
    description: 'A single-arm variation of seoi-nage where tori traps uke\'s elbow under the armpit and throws forward.',
    key_points: [
      'Tuck uke\'s arm deep into your armpit, elbow should be locked against your body',
      'Your free arm controls uke\'s collar or lapel to guide the throw',
      'The driving rotation comes from the hips and knees, not the arms alone',
    ]
  },
  {
    title_en: 'Shoulder Drop', title_romaji: 'Seoi-otoshi', title_kanji: '背負落',
    category: 'tachi-waza', sub_category: 'Te-waza',
    youtube_id: 'vu1TMVNnq34',
    is_kata: false, is_theory: false,
    description: 'Similar to seoi-nage but tori drops to both knees during execution, sacrificing height for a lower and tighter throw.',
    key_points: [
      'Drop to both knees simultaneously, do not step through like seoi-nage',
      'Keep uke\'s arm locked against your body throughout the drop',
      'Drive elbows downward as you rotate to pull uke over your back',
    ]
  },
  {
    title_en: 'Body Drop', title_romaji: 'Tai-otoshi', title_kanji: '体落',
    category: 'tachi-waza', sub_category: 'Te-waza',
    youtube_id: '4x6S3Q-Ktv8',
    is_kata: false, is_theory: false,
    description: 'Tori pivots and extends their leg across uke\'s path as a blocking bar, using body rotation to throw uke forward over it.',
    key_points: [
      'Leg placement: straight across uke\'s front shin, not behind the knee',
      'Pull strongly with both hands while rotating your whole body, the leg is a barrier, not a reap',
      'Finish with head and chest pointing toward where uke will land',
    ]
  },
  {
    title_en: 'Shoulder Wheel', title_romaji: 'Kata-guruma', title_kanji: '肩車',
    category: 'tachi-waza', sub_category: 'Te-waza',
    youtube_id: 'cnHRhSy8yi4',
    is_kata: false, is_theory: false,
    description: 'Tori lifts uke across both shoulders and rotates to throw them, the original "fireman\'s carry" of judo.',
  },
  {
    title_en: 'Scooping Throw', title_romaji: 'Sukui-nage', title_kanji: '掬投',
    category: 'tachi-waza', sub_category: 'Te-waza',
    youtube_id: 'vU6aJ2kFxoI',
    is_kata: false, is_theory: false,
    description: 'Tori scoops both of uke\'s legs from behind and lifts to throw them backward.',
  },
  {
    title_en: 'Belt Drop', title_romaji: 'Obi-otoshi', title_kanji: '帯落',
    category: 'tachi-waza', sub_category: 'Te-waza',
    youtube_id: 'ff8U2TVZIYI',
    is_kata: false, is_theory: false,
    description: 'Tori grips uke\'s belt at the back and drops them directly to the mat using pulling force.',
  },
  {
    title_en: 'Floating Drop', title_romaji: 'Uki-otoshi', title_kanji: '浮落',
    category: 'tachi-waza', sub_category: 'Te-waza',
    youtube_id: '6H5tmncOY4Q',
    is_kata: false, is_theory: false,
    description: 'A hand technique using wrist and arm action to float uke forward off-balance without hip or leg contact.',
  },
  {
    title_en: 'Corner Drop', title_romaji: 'Sumi-otoshi', title_kanji: '隅落',
    category: 'tachi-waza', sub_category: 'Te-waza',
    youtube_id: 'lLU9wv52ni0',
    is_kata: false, is_theory: false,
    description: 'Tori applies diagonal kuzushi to take uke straight down into the corner behind them without hip or leg contact.',
  },
  {
    title_en: 'Mountain Storm', title_romaji: 'Yama-arashi', title_kanji: '山嵐',
    category: 'tachi-waza', sub_category: 'Te-waza',
    youtube_id: 'MGlyKmSuzdc',
    is_kata: false, is_theory: false,
    description: 'A powerful combination throw blending elements of seoi-nage and harai-goshi with a strong rotational drive.',
  },
  {
    title_en: 'Belt Grab Reversal', title_romaji: 'Obi-tori-gaeshi', title_kanji: '帯取返',
    category: 'tachi-waza', sub_category: 'Te-waza',
    youtube_id: 'bpc82SrunUU',
    is_kata: false, is_theory: false,
    description: 'A counter-throw that reverses uke\'s double-belt grip attack by rotating through and throwing them over.',
  },
  {
    title_en: 'Double Leg Grab', title_romaji: 'Morote-gari', title_kanji: '双手刈',
    category: 'tachi-waza', sub_category: 'Te-waza',
    youtube_id: 'BHLQS4K85bs',
    is_kata: false, is_theory: false,
    description: 'Tori dives low to grab both of uke\'s knees simultaneously and drives through to take them down.',
  },
  {
    title_en: 'Decayed Tree Drop', title_romaji: 'Kuchiki-taoshi', title_kanji: '朽木倒',
    category: 'tachi-waza', sub_category: 'Te-waza',
    youtube_id: 'ZNL47q1aJNY',
    is_kata: false, is_theory: false,
    description: 'A single-leg takedown where tori traps and lifts uke\'s near leg, unbalancing them until they fall.',
  },
  {
    title_en: 'Heel Reversal', title_romaji: 'Kibisu-gaeshi', title_kanji: '踵返',
    category: 'tachi-waza', sub_category: 'Te-waza',
    youtube_id: 'tJylJYfBliA',
    is_kata: false, is_theory: false,
    description: 'Tori grabs uke\'s heel and lifts sharply while pushing into them, causing a backward fall.',
  },
  {
    title_en: 'Inner Thigh Slip', title_romaji: 'Uchi-mata-sukashi', title_kanji: '内股すかし',
    category: 'tachi-waza', sub_category: 'Te-waza',
    youtube_id: 'V-RS3uhtVWM',
    is_kata: false, is_theory: false,
    description: 'A counter to uchi-mata: tori avoids the inner thigh lift by shifting weight, then topples uke sideways.',
  },
  {
    title_en: 'Minor Inner Reversal', title_romaji: 'Ko-uchi-gaeshi', title_kanji: '小内返',
    category: 'tachi-waza', sub_category: 'Te-waza',
    youtube_id: '_MWAdYi_LC4',
    is_kata: false, is_theory: false,
    description: 'A counter to ko-uchi-gari where tori deflects the reaping attempt and reverses the attack.',
  },

  // ── KOSHI-WAZA  (Hip Techniques) ──────────────────────────────────
  {
    title_en: 'Floating Hip Throw', title_romaji: 'Uki-goshi', title_kanji: '浮腰',
    category: 'tachi-waza', sub_category: 'Koshi-waza',
    youtube_id: 'bPKwtB4lyOQ',
    is_kata: false, is_theory: false,
    description: 'One of judo\'s oldest throws: tori inserts their hip under uke and rotates to float them over in a circular arc.',
    key_points: [
      'Hip insertion should be to uke\'s side, contact is at the hip, not the stomach',
      'Pull uke forward and upward with both hands before rotating',
      'Keep uke close to your body throughout the throw',
    ]
  },
  {
    title_en: 'Major Hip Throw', title_romaji: 'O-goshi', title_kanji: '大腰',
    category: 'tachi-waza', sub_category: 'Koshi-waza',
    youtube_id: 'yhu1mfy2vJ4',
    is_kata: false, is_theory: false,
    description: 'The classic hip throw: tori wraps an arm around uke\'s waist, inserts the hip beneath their centre of gravity, and rotates.',
    key_points: [
      'Arm wraps around uke\'s back at waist height, pull them tight against your side',
      'Hip must go fully across in front of uke\'s hips before rotating',
      'Bend your knees on entry to ensure your hip is lower than uke\'s',
    ]
  },
  {
    title_en: 'Hip Wheel', title_romaji: 'Koshi-guruma', title_kanji: '腰車',
    category: 'tachi-waza', sub_category: 'Koshi-waza',
    youtube_id: 'SU7Id6uVJ44',
    is_kata: false, is_theory: false,
    description: 'Tori places their arm around uke\'s neck and rotates them over the hip in a wheel-like motion.',
  },
  {
    title_en: 'Lifting Pulling Hip Throw', title_romaji: 'Tsurikomi-goshi', title_kanji: '釣込腰',
    category: 'tachi-waza', sub_category: 'Koshi-waza',
    youtube_id: 'McfzA0yRVt4',
    is_kata: false, is_theory: false,
    description: 'Tori uses their grip to lift and pull uke onto a pivoted hip, combining upward and rotational force.',
    key_points: [
      'High collar grip pulls uke\'s upper body upward to break posture before entry',
      'The "lifting" action creates the space for hip insertion',
    ]
  },
  {
    title_en: 'Sleeve Lifting Pulling Hip Throw', title_romaji: 'Sode-tsurikomi-goshi', title_kanji: '袖釣込腰',
    category: 'tachi-waza', sub_category: 'Koshi-waza',
    youtube_id: 'QsmAxpmYLOI',
    is_kata: false, is_theory: false,
    description: 'A variant of tsurikomi-goshi using a sleeve grip from both hands to achieve the lifting pulling entry.',
  },
  {
    title_en: 'Sweeping Hip Throw', title_romaji: 'Harai-goshi', title_kanji: '払腰',
    category: 'tachi-waza', sub_category: 'Koshi-waza',
    youtube_id: 'qTo8HlAAkOo',
    is_kata: false, is_theory: false,
    description: 'Tori enters with a hip pivot then sweeps their extended leg through uke\'s thigh while rotating the torso.',
    key_points: [
      'Enter like o-goshi, full hip contact before the sweep',
      'The sweeping leg is straight and rigid, acting as a scythe through uke\'s legs',
      'Rotate both arms downward as the leg sweeps through',
    ]
  },
  {
    title_en: 'Lifting Hip Throw', title_romaji: 'Tsuri-goshi', title_kanji: '釣腰',
    category: 'tachi-waza', sub_category: 'Koshi-waza',
    youtube_id: '51Htlp7xEvE',
    is_kata: false, is_theory: false,
    description: 'Tori grips uke\'s belt at the back and lifts them onto the hip, then rotates for the throw.',
  },
  {
    title_en: 'Springing Hip Throw', title_romaji: 'Hane-goshi', title_kanji: '跳腰',
    category: 'tachi-waza', sub_category: 'Koshi-waza',
    youtube_id: 'M9_7De6A1kk',
    is_kata: false, is_theory: false,
    description: 'Tori springs their bent leg into uke\'s thigh while rotating, using the spring to propel uke forward.',
    key_points: [
      'Entry is similar to o-goshi, hip across in front of uke',
      'Bend the contact leg and drive the knee forward into uke\'s thigh for the spring',
      'Spring and rotation happen simultaneously',
    ]
  },
  {
    title_en: 'Changing Hip Throw', title_romaji: 'Utsuri-goshi', title_kanji: '移腰',
    category: 'tachi-waza', sub_category: 'Koshi-waza',
    youtube_id: '4pQd_bEnlf0',
    is_kata: false, is_theory: false,
    description: 'A counter-throw: when uke attempts a hip throw, tori lifts them and repositions onto a higher hip to throw them back.',
  },
  {
    title_en: 'Rear Hip Throw', title_romaji: 'Ushiro-goshi', title_kanji: '後腰',
    category: 'tachi-waza', sub_category: 'Koshi-waza',
    youtube_id: 'ORIYstuxYT8',
    is_kata: false, is_theory: false,
    description: 'A counter-throw: tori lifts uke from behind over the hip when uke attempts a throw from the front.',
  },

  // ── ASHI-WAZA  (Foot & Leg Techniques) ───────────────────────────
  {
    title_en: 'Advanced Foot Sweep', title_romaji: 'De-ashi-harai', title_kanji: '出足払',
    category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: '4BUUvqxi_Kk',
    is_kata: false, is_theory: false,
    description: 'Tori sweeps uke\'s advancing foot at the precise moment it lifts from the mat, before weight is transferred.',
    key_points: [
      'Timing is everything, sweep at the peak of uke\'s step, before their foot lands',
      'The sweep is flat along the mat, not a kick, contact at the ankle',
      'Hands pull uke\'s upper body in the direction of the sweep',
    ]
  },
  {
    title_en: 'Knee Wheel', title_romaji: 'Hiza-guruma', title_kanji: '膝車',
    category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: 'JPJx9-oAVns',
    is_kata: false, is_theory: false,
    description: 'Tori places their foot against uke\'s knee and uses it as a wheel to rotate uke forward.',
    key_points: [
      'Place the sole of your foot on the side of uke\'s knee, not behind it',
      'Hands create the rotation, the leg is a pivot point, not the driving force',
    ]
  },
  {
    title_en: 'Propping Drawing Ankle Throw', title_romaji: 'Sasae-tsurikomi-ashi', title_kanji: '支釣込足',
    category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: '699i--pvYmE',
    is_kata: false, is_theory: false,
    description: 'Tori blocks uke\'s ankle with the sole of the foot while pulling upward with hands to rotate uke forward.',
  },
  {
    title_en: 'Major Outer Reaping', title_romaji: 'O-soto-gari', title_kanji: '大外刈',
    category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: 'c-A_nP7mKAc',
    is_kata: false, is_theory: false,
    description: 'Tori reaps uke\'s support leg from the outside while driving them backward off-balance.',
    key_points: [
      'Break kuzushi backward-right before entry, chest must be against uke\'s chest',
      'The reaping leg swings from the hip, using the back of the thigh to sweep through',
      'Lean forward and commit, do not lean back as you reap',
    ]
  },
  {
    title_en: 'Major Inner Reaping', title_romaji: 'O-uchi-gari', title_kanji: '大内刈',
    category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: '0itJFhV9pDQ',
    is_kata: false, is_theory: false,
    description: 'Tori steps through and reaps uke\'s support leg from the inside, driving them diagonally backward.',
    key_points: [
      'Step between uke\'s feet first, then reap, do not try to reap from outside',
      'Reap with the inner edge of your heel, driving through behind the ankle',
      'Push with both hands into uke\'s upper body as you reap',
    ]
  },
  {
    title_en: 'Minor Outer Reaping', title_romaji: 'Ko-soto-gari', title_kanji: '小外刈',
    category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: 'jeQ541ScLB4',
    is_kata: false, is_theory: false,
    description: 'A small outer reap targeting uke\'s ankle from the outside, best applied when uke\'s weight is on their back foot.',
  },
  {
    title_en: 'Minor Inner Reaping', title_romaji: 'Ko-uchi-gari', title_kanji: '小内刈',
    category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: '3Jb3tZvr9Ng',
    is_kata: false, is_theory: false,
    description: 'A short inner ankle reap applied from very close range, using the sole of the foot to hook the inner ankle.',
    key_points: [
      'Works best when uke steps forward, intercept as the foot lands',
      'Use the sole of your foot to reap along the floor, not a kick',
    ]
  },
  {
    title_en: 'Sliding Foot Sweep', title_romaji: 'Okuri-ashi-harai', title_kanji: '送足払',
    category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: 'nw1ZdRjrdRI',
    is_kata: false, is_theory: false,
    description: 'As uke steps sideways, tori sweeps both feet simultaneously, the trailing foot catches the lead foot mid-step.',
    key_points: [
      'Sweep both feet, not just one, contact first the lead foot to redirect the trailing one',
      'The timing is when uke\'s feet are closest together during lateral movement',
    ]
  },
  {
    title_en: 'Inner Thigh Throw', title_romaji: 'Uchi-mata', title_kanji: '内股',
    category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: 'iUpSu5J-bgw',
    is_kata: false, is_theory: false,
    description: 'Tori pivots and sweeps their leg upward between uke\'s legs, catching the inner thigh to throw uke forward.',
    key_points: [
      'Pivot on the support foot to face away from uke',
      'Sweep the attacking leg straight up through the middle, not a lateral sweep',
      'Upper body pulls forward and down to complete the rotation',
    ]
  },
  {
    title_en: 'Minor Outer Hook', title_romaji: 'Ko-soto-gake', title_kanji: '小外掛',
    category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: '8b6kY4s4zH4',
    is_kata: false, is_theory: false,
    description: 'Tori hooks their heel around the back of uke\'s ankle from the outside while pushing diagonally through them.',
  },
  {
    title_en: 'Leg Wheel', title_romaji: 'Ashi-guruma', title_kanji: '足車',
    category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: 'ROeayhvom9U',
    is_kata: false, is_theory: false,
    description: 'Tori extends their leg against uke\'s thigh as a wheel and uses rotational pulling force to throw uke forward.',
  },
  {
    title_en: 'Sweeping Drawing Ankle Throw', title_romaji: 'Harai-tsurikomi-ashi', title_kanji: '払釣込足',
    category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: 'gGPXvWL8VbE',
    is_kata: false, is_theory: false,
    description: 'Combines a foot sweep with upward pulling kuzushi to throw uke forward-diagonally.',
  },
  {
    title_en: 'Major Wheel', title_romaji: 'O-guruma', title_kanji: '大車',
    category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: 'SnZciTAY9vc',
    is_kata: false, is_theory: false,
    description: 'Tori extends a straight leg across uke\'s upper thighs and uses body rotation to wheel them forward.',
  },
  {
    title_en: 'Major Outer Wheel', title_romaji: 'O-soto-guruma', title_kanji: '大外車',
    category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: '92KbCm6pQeI',
    is_kata: false, is_theory: false,
    description: 'Tori sweeps both of uke\'s legs from the outside with a single wide sweeping leg action, throwing uke backward.',
  },
  {
    title_en: 'Major Outer Drop', title_romaji: 'O-soto-otoshi', title_kanji: '大外落',
    category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: '2DsVvDw7b8g',
    is_kata: false, is_theory: false,
    description: 'A stepping variant of o-soto-gari where tori steps through behind uke\'s leg rather than reaping, creating a dropping action.',
  },
  {
    title_en: 'Swallow Counter', title_romaji: 'Tsubame-gaeshi', title_kanji: '燕返',
    category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: 'GwweWqqFB5g',
    is_kata: false, is_theory: false,
    description: 'A counter to de-ashi-harai: tori lifts the swept foot over the attacking sweep and reverses with the same sweeping motion.',
  },
  {
    title_en: 'Major Outer Reaping Counter', title_romaji: 'O-soto-gaeshi', title_kanji: '大外返',
    category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: '8ZjM3X_EANo',
    is_kata: false, is_theory: false,
    description: 'A counter to o-soto-gari: tori uses a similar outside reaping action to reverse uke\'s throw.',
  },
  {
    title_en: 'Major Inner Reaping Counter', title_romaji: 'O-uchi-gaeshi', title_kanji: '大内返',
    category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: 'dCyZTXyjIXE',
    is_kata: false, is_theory: false,
    description: 'A counter to o-uchi-gari: tori shifts weight and reaps in the opposite direction to reverse the attack.',
  },
  {
    title_en: 'Springing Hip Counter', title_romaji: 'Hane-goshi-gaeshi', title_kanji: '跳腰返',
    category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: '9bZAZSBtnGs',
    is_kata: false, is_theory: false,
    description: 'A counter to hane-goshi where tori avoids the spring and falls forward to reverse the throw.',
  },
  {
    title_en: 'Sweeping Hip Counter', title_romaji: 'Harai-goshi-gaeshi', title_kanji: '払腰返',
    category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: '4U3It-7PPsc',
    is_kata: false, is_theory: false,
    description: 'A counter to harai-goshi: tori catches the sweep and reverses the rotation to throw uke.',
  },
  {
    title_en: 'Inner Thigh Counter', title_romaji: 'Uchi-mata-gaeshi', title_kanji: '内股返',
    category: 'tachi-waza', sub_category: 'Ashi-waza',
    youtube_id: 'Sy6sLWxkWYw',
    is_kata: false, is_theory: false,
    description: 'A counter to uchi-mata where tori blocks the inner thigh lift and topples uke sideways or backward.',
  },

  // ── MA-SUTEMI-WAZA  (Rear Sacrifice Techniques) ───────────────────
  {
    title_en: 'Circle Throw', title_romaji: 'Tomoe-nage', title_kanji: '巴投',
    category: 'tachi-waza', sub_category: 'Ma-sutemi-waza',
    youtube_id: '880WbHvHv6A',
    is_kata: false, is_theory: false,
    description: 'Tori falls backward, places one foot in uke\'s abdomen, and uses leg extension combined with pulling to launch uke overhead.',
    key_points: [
      'Place the ball of your foot in uke\'s lower abdomen, not the knee or hip',
      'Fall straight back, do not roll to the side',
      'Pull uke forward and down with both hands as you extend your leg',
    ]
  },
  {
    title_en: 'Corner Throw', title_romaji: 'Sumi-gaeshi', title_kanji: '隅返',
    category: 'tachi-waza', sub_category: 'Ma-sutemi-waza',
    youtube_id: '5VhduA5xkbA',
    is_kata: false, is_theory: false,
    description: 'Tori falls diagonally, hooks their inner thigh under uke\'s inner thigh, and uses the lever to throw uke over.',
  },
  {
    title_en: 'Pulling-In Reversal', title_romaji: 'Hikikomi-gaeshi', title_kanji: '引込返',
    category: 'tachi-waza', sub_category: 'Ma-sutemi-waza',
    youtube_id: '92zUYWBp5N8',
    is_kata: false, is_theory: false,
    description: 'Tori draws uke downward while falling, then uses a rolling motion to continue throwing uke over.',
  },
  {
    title_en: 'Rice Bale Throw', title_romaji: 'Tawara-gaeshi', title_kanji: '俵返',
    category: 'tachi-waza', sub_category: 'Ma-sutemi-waza',
    youtube_id: 'TmTWgrmViZc',
    is_kata: false, is_theory: false,
    description: 'A counter to a rear bearhug: tori drops to one knee, grabs uke\'s legs, and rolls them over the shoulder.',
  },
  {
    title_en: 'Rear Throw', title_romaji: 'Ura-nage', title_kanji: '裏投',
    category: 'tachi-waza', sub_category: 'Ma-sutemi-waza',
    youtube_id: 'Fgi9b8DJ5sQ',
    is_kata: false, is_theory: false,
    description: 'Tori wraps both arms around uke from behind and arches backward, throwing uke over their shoulder.',
  },

  // ── YOKO-SUTEMI-WAZA  (Side Sacrifice Techniques) ─────────────────
  {
    title_en: 'Side Drop', title_romaji: 'Yoko-otoshi', title_kanji: '横落',
    category: 'tachi-waza', sub_category: 'Yoko-sutemi-waza',
    youtube_id: 'MnNG67pF_a0',
    is_kata: false, is_theory: false,
    description: 'Tori drops to the side and extends a leg to trip uke diagonally across.',
  },
  {
    title_en: 'Valley Drop', title_romaji: 'Tani-otoshi', title_kanji: '谷落',
    category: 'tachi-waza', sub_category: 'Yoko-sutemi-waza',
    youtube_id: '3b9Me3Fohpk',
    is_kata: false, is_theory: false,
    description: 'Tori steps behind uke\'s legs and drops backward to pull uke into the valley between them.',
    key_points: [
      'Step behind uke\'s far leg, then drop directly backward',
      'Pull uke\'s upper body backward and downward with both hands as you fall',
    ]
  },
  {
    title_en: 'Springing Wraparound', title_romaji: 'Hane-makikomi', title_kanji: '跳巻込',
    category: 'tachi-waza', sub_category: 'Yoko-sutemi-waza',
    youtube_id: '6CRBGLGz9j8',
    is_kata: false, is_theory: false,
    description: 'Combines hane-goshi\'s springing leg action with a makikomi rolling fall, winding uke into the ground.',
  },
  {
    title_en: 'Outer Wraparound', title_romaji: 'Soto-makikomi', title_kanji: '外巻込',
    category: 'tachi-waza', sub_category: 'Yoko-sutemi-waza',
    youtube_id: 'bWG9O1BVKtQ',
    is_kata: false, is_theory: false,
    description: 'Tori wraps their arm around uke\'s arm from the outside and falls sideways, rolling uke over.',
  },
  {
    title_en: 'Inner Wraparound', title_romaji: 'Uchi-makikomi', title_kanji: '内巻込',
    category: 'tachi-waza', sub_category: 'Yoko-sutemi-waza',
    youtube_id: '5BowcjduxVc',
    is_kata: false, is_theory: false,
    description: 'Tori winds uke\'s inner arm under their own armpit and falls sideways, rolling uke into the mat.',
  },
  {
    title_en: 'Floating Technique', title_romaji: 'Uki-waza', title_kanji: '浮技',
    category: 'tachi-waza', sub_category: 'Yoko-sutemi-waza',
    youtube_id: 'weVOpJ63gII',
    is_kata: false, is_theory: false,
    description: 'Tori drops to the side while extending a leg to float uke off their feet diagonally forward.',
  },
  {
    title_en: 'Side Separation', title_romaji: 'Yoko-wakare', title_kanji: '横分',
    category: 'tachi-waza', sub_category: 'Yoko-sutemi-waza',
    youtube_id: 'bp1tscHlePI',
    is_kata: false, is_theory: false,
    description: 'Tori falls sideways beneath uke, using their leg and body to separate uke from their balance point.',
  },
  {
    title_en: 'Side Wheel', title_romaji: 'Yoko-guruma', title_kanji: '横車',
    category: 'tachi-waza', sub_category: 'Yoko-sutemi-waza',
    youtube_id: 'MehP6I5cY2c',
    is_kata: false, is_theory: false,
    description: 'Tori falls to the side and rotates uke over their body in a wheel-like motion.',
  },
  {
    title_en: 'Side Hook', title_romaji: 'Yoko-gake', title_kanji: '横掛',
    category: 'tachi-waza', sub_category: 'Yoko-sutemi-waza',
    youtube_id: 'tP1Sj1uDfSo',
    is_kata: false, is_theory: false,
    description: 'Tori hooks their foot against uke\'s ankle from the outside while falling sideways, pulling uke down.',
  },
  {
    title_en: 'Embrace Separation', title_romaji: 'Daki-wakare', title_kanji: '抱分',
    category: 'tachi-waza', sub_category: 'Yoko-sutemi-waza',
    youtube_id: 'Hr0cOMGBDYo',
    is_kata: false, is_theory: false,
    description: 'Tori encircles uke from behind, then falls sideways to throw uke over them.',
  },
  {
    title_en: 'Major Outer Wraparound', title_romaji: 'O-soto-makikomi', title_kanji: '大外巻込',
    category: 'tachi-waza', sub_category: 'Yoko-sutemi-waza',
    youtube_id: 'DGDv2oMwmas',
    is_kata: false, is_theory: false,
    description: 'Adds a rolling falling action to o-soto-gari, tori winds uke\'s arm and falls with the reap.',
  },
  {
    title_en: 'Inner Thigh Wraparound', title_romaji: 'Uchi-mata-makikomi', title_kanji: '内股巻込',
    category: 'tachi-waza', sub_category: 'Yoko-sutemi-waza',
    youtube_id: 'jZXENTLpJCI',
    is_kata: false, is_theory: false,
    description: 'Adds a rolling falling action to uchi-mata, tori winds uke\'s arm over as the thigh sweep lifts.',
  },
  {
    title_en: 'Sweeping Wraparound', title_romaji: 'Harai-makikomi', title_kanji: '払巻込',
    category: 'tachi-waza', sub_category: 'Yoko-sutemi-waza',
    youtube_id: 'VBaHzKaCXss',
    is_kata: false, is_theory: false,
    description: 'Adds a rolling falling action to harai-goshi, tori winds uke\'s arm during the sweeping hip rotation.',
  },
  {
    title_en: 'Minor Inner Wraparound', title_romaji: 'Ko-uchi-makikomi', title_kanji: '小内巻込',
    category: 'tachi-waza', sub_category: 'Yoko-sutemi-waza',
    youtube_id: '_1eygIXLD_w',
    is_kata: false, is_theory: false,
    description: 'A ko-uchi-gari variant with a rolling fall, winding uke\'s arm as the ankle is reaped.',
  },
  {
    title_en: 'Scissors Throw', title_romaji: 'Kani-basami', title_kanji: '蟹挟',
    category: 'tachi-waza', sub_category: 'Yoko-sutemi-waza',
    youtube_id: 'OR-HGHnarYc',
    is_kata: false, is_theory: false,
    description: 'Tori scissors both legs around uke\'s body, one in front, one behind, and falls sideways to throw. Prohibited in competition due to knee injury risk.',
  },
  {
    title_en: 'One-Leg Entanglement', title_romaji: 'Kawazu-gake', title_kanji: '河津掛',
    category: 'tachi-waza', sub_category: 'Yoko-sutemi-waza',
    youtube_id: 'w6G57bWACi0',
    is_kata: false, is_theory: false,
    description: 'Tori hooks their leg over uke\'s leg from the front and falls backward to entangle and throw. Prohibited in competition.',
  },

  // ══════════════════════════════════════════════════════════════════
  // KATAME-WAZA  (Grappling Techniques)
  // ══════════════════════════════════════════════════════════════════

  // ── OSAEKOMI-WAZA  (Hold-Down Techniques) ─────────────────────────
  {
    title_en: 'Scarf Hold', title_romaji: 'Kesa-gatame', title_kanji: '袈裟固',
    category: 'ne-waza', sub_category: 'Osaekomi-waza',
    youtube_id: 'NDaQuJOFBYk',
    is_kata: false, is_theory: false,
    description: 'The foundational hold-down: tori sits beside uke, controlling the head with one arm and the arm with the other, legs spread for stability.',
    key_points: [
      'Sit tight into uke\'s side, no gap between your hip and their body',
      'Control the head by wrapping the arm around it, pulling it into your side',
      'Trap uke\'s arm under your armpit and keep your elbow low to prevent escape',
      'Spread your legs wide and low to the mat for a stable base',
    ]
  },
  {
    title_en: 'Broken Scarf Hold', title_romaji: 'Kuzure-kesa-gatame', title_kanji: '崩袈裟固',
    category: 'ne-waza', sub_category: 'Osaekomi-waza',
    youtube_id: 'Q2fb9jaoUFQ',
    is_kata: false, is_theory: false,
    description: 'A modified kesa-gatame where tori\'s arm goes under uke\'s armpit rather than around the head.',
  },
  {
    title_en: 'Reverse Scarf Hold', title_romaji: 'Ushiro-kesa-gatame', title_kanji: '後袈裟固',
    category: 'ne-waza', sub_category: 'Osaekomi-waza',
    youtube_id: 'SBapox2M2dE',
    is_kata: false, is_theory: false,
    description: 'Tori sits beside uke facing uke\'s feet, controlling from behind with body weight over the hips and arm.',
  },
  {
    title_en: 'Shoulder Hold', title_romaji: 'Kata-gatame', title_kanji: '肩固',
    category: 'ne-waza', sub_category: 'Osaekomi-waza',
    youtube_id: 'zQR3IOXxO_Q',
    is_kata: false, is_theory: false,
    description: 'Tori pins uke\'s arm against the side of their own head, applying a simultaneous hold-down and choking threat.',
    key_points: [
      'Trap uke\'s arm over their own head, your shoulder presses into their cheek',
      'Clasp your hands together to lock the position',
      'Keep chest-to-chest contact and drive weight through your shoulder',
    ]
  },
  {
    title_en: 'Upper Four-Corner Hold', title_romaji: 'Kami-shiho-gatame', title_kanji: '上四方固',
    category: 'ne-waza', sub_category: 'Osaekomi-waza',
    youtube_id: 'HFuMjOv0WN8',
    is_kata: false, is_theory: false,
    description: 'Tori lies chest-to-chest over uke\'s head, gripping the belt with both hands, controlling all four corners of uke\'s upper body.',
    key_points: [
      'Lie fully on uke with head aligned to their sternum, not arching over',
      'Grip both sides of the belt deep, elbows on the mat for stability',
      'Spread your legs wide behind you, knees off the mat',
    ]
  },
  {
    title_en: 'Broken Upper Four-Corner Hold', title_romaji: 'Kuzure-kami-shiho-gatame', title_kanji: '崩上四方固',
    category: 'ne-waza', sub_category: 'Osaekomi-waza',
    youtube_id: 'YUrogQWdwiY',
    is_kata: false, is_theory: false,
    description: 'A variation of kami-shiho-gatame with a modified arm position, reaching under uke\'s armpit instead of gripping the belt.',
  },
  {
    title_en: 'Side Four-Corner Hold', title_romaji: 'Yoko-shiho-gatame', title_kanji: '横四方固',
    category: 'ne-waza', sub_category: 'Osaekomi-waza',
    youtube_id: 'TT7XJVSEQxA',
    is_kata: false, is_theory: false,
    description: 'Tori lies perpendicular across uke\'s torso, one arm through the legs, one through the neck, controlling four corners from the side.',
    key_points: [
      'One arm goes under the near leg and grips the belt; the other under the neck',
      'Chest and stomach apply weight, keep hips low to the mat',
      'Squeeze uke\'s body between your chest and arms',
    ]
  },
  {
    title_en: 'Vertical Four-Corner Hold', title_romaji: 'Tate-shiho-gatame', title_kanji: '縦四方固',
    category: 'ne-waza', sub_category: 'Osaekomi-waza',
    youtube_id: '55-rFmBx53g',
    is_kata: false, is_theory: false,
    description: 'Tori straddles uke chest-to-chest, controlling the head and arms with knees tight into uke\'s sides.',
    key_points: [
      'Knees must be pressed firmly into uke\'s sides to prevent bridging escape',
      'Hands control both sides of uke\'s head or grip the collar',
    ]
  },
  {
    title_en: 'Floating Hold', title_romaji: 'Uki-gatame', title_kanji: '浮固',
    category: 'ne-waza', sub_category: 'Osaekomi-waza',
    youtube_id: 'e_lAjik1SUM',
    is_kata: false, is_theory: false,
    description: 'An unusual hold-down where tori maintains control without traditional body contact, using positioning and joint pressure.',
  },
  {
    title_en: 'Reverse Hold', title_romaji: 'Ura-gatame', title_kanji: '裏固',
    category: 'ne-waza', sub_category: 'Osaekomi-waza',
    youtube_id: 'eeAHZB0v3XY',
    is_kata: false, is_theory: false,
    description: 'Applied when uke tries to escape to their knees: tori controls from an unconventional angle, trapping uke from behind.',
  },

  // ── SHIME-WAZA  (Strangulation Techniques) ────────────────────────
  {
    title_en: 'Normal Cross Strangle', title_romaji: 'Nami-juji-jime', title_kanji: '並十字絞',
    category: 'ne-waza', sub_category: 'Shime-waza',
    youtube_id: 'k2cHry9HByQ',
    is_kata: false, is_theory: false,
    description: 'Both hands grip the collar with thumbs inside, crossing to apply bilateral pressure on the carotid arteries.',
    key_points: [
      'Thumbs must be inside the collar, fingers pointing toward you',
      'Wrists rotate inward as elbows drive down and out',
      'Effective only from a position where arms can extend, typically kesa-gatame or mount',
    ]
  },
  {
    title_en: 'Reverse Cross Strangle', title_romaji: 'Gyaku-juji-jime', title_kanji: '逆十字絞',
    category: 'ne-waza', sub_category: 'Shime-waza',
    youtube_id: 't3tQriIPdlI',
    is_kata: false, is_theory: false,
    description: 'A cross strangle with fingers inside the collar pointing away from tori, allowing a different angle of pressure.',
  },
  {
    title_en: 'Half Cross Strangle', title_romaji: 'Kata-juji-jime', title_kanji: '片十字絞',
    category: 'ne-waza', sub_category: 'Shime-waza',
    youtube_id: '3VZVUAmiMD8',
    is_kata: false, is_theory: false,
    description: 'One hand grips thumb-in (nami) and the other thumb-out (gyaku), combining both approaches.',
  },
  {
    title_en: 'Naked Strangle', title_romaji: 'Hadaka-jime', title_kanji: '裸絞',
    category: 'ne-waza', sub_category: 'Shime-waza',
    youtube_id: '9f0n8jez7iA',
    is_kata: false, is_theory: false,
    description: 'A rear naked choke: tori\'s forearm wraps around uke\'s throat from behind, the other hand locks behind the head.',
    key_points: [
      'Apply from behind uke, arm goes under the chin and across the throat',
      'The choking arm\'s bicep and forearm squeeze simultaneously',
      'Other hand presses uke\'s head forward to tighten the choke',
    ]
  },
  {
    title_en: 'Sliding Collar Strangle', title_romaji: 'Okuri-eri-jime', title_kanji: '送襟絞',
    category: 'ne-waza', sub_category: 'Shime-waza',
    youtube_id: 'EiqyoVcIAi8',
    is_kata: false, is_theory: false,
    description: 'From behind uke, tori pulls one collar across the throat with one hand while the other arm chokes around the neck.',
  },
  {
    title_en: 'Single-Wing Strangle', title_romaji: 'Kataha-jime', title_kanji: '片羽絞',
    category: 'ne-waza', sub_category: 'Shime-waza',
    youtube_id: 'yaTGgRjnwB8',
    is_kata: false, is_theory: false,
    description: 'From behind, one arm applies the choke while the other traps uke\'s arm up behind their own head.',
  },
  {
    title_en: 'One-Hand Strangle', title_romaji: 'Katate-jime', title_kanji: '片手絞',
    category: 'ne-waza', sub_category: 'Shime-waza',
    youtube_id: 'cHeIs-fSqwE',
    is_kata: false, is_theory: false,
    description: 'A one-handed strangle applied with a single hand gripping the collar and pressing across the throat.',
  },
  {
    title_en: 'Two-Hand Strangle', title_romaji: 'Ryote-jime', title_kanji: '両手絞',
    category: 'ne-waza', sub_category: 'Shime-waza',
    youtube_id: '-RHC4V7TQiY',
    is_kata: false, is_theory: false,
    description: 'Both hands grip the collar and squeeze simultaneously across the throat from the front.',
  },
  {
    title_en: 'Sleeve Wheel Strangle', title_romaji: 'Sode-guruma-jime', title_kanji: '袖車絞',
    category: 'ne-waza', sub_category: 'Shime-waza',
    youtube_id: 'E3nvQzClcAU',
    is_kata: false, is_theory: false,
    description: 'Tori grips uke\'s sleeves and rotates their forearms to apply pressure on both sides of the neck simultaneously.',
  },
  {
    title_en: 'Thrust Choke', title_romaji: 'Tsukkomi-jime', title_kanji: '突込絞',
    category: 'ne-waza', sub_category: 'Shime-waza',
    youtube_id: 'dKKpnD3eLcY',
    is_kata: false, is_theory: false,
    description: 'Tori drives a single fist or wrist straight into uke\'s throat while the other hand braces or grips the collar.',
  },
  {
    title_en: 'Triangular Strangle', title_romaji: 'Sankaku-jime', title_kanji: '三角絞',
    category: 'ne-waza', sub_category: 'Shime-waza',
    youtube_id: 'lq1CUBRAm7s',
    is_kata: false, is_theory: false,
    description: 'Tori forms a triangle with their legs around uke\'s neck and one arm, applying pressure on the carotid arteries.',
    key_points: [
      'One of uke\'s arms must be inside the triangle, the other outside',
      'Leg position: one knee over the other ankle, forming a locked triangle',
      'Pull uke\'s head down and squeeze knees together to tighten',
    ]
  },
  {
    title_en: 'Trunk Strangle', title_romaji: 'Do-jime', title_kanji: '胴絞',
    category: 'ne-waza', sub_category: 'Shime-waza',
    youtube_id: 'D_0fFcoIbvY',
    is_kata: false, is_theory: false,
    description: 'Tori wraps their legs around uke\'s torso and squeezes. Restricted in competition at lower grades due to injury risk.',
  },

  // ── KANSETSU-WAZA  (Joint Locking Techniques) ─────────────────────
  {
    title_en: 'Arm Entanglement', title_romaji: 'Ude-garami', title_kanji: '腕緘',
    category: 'ne-waza', sub_category: 'Kansetsu-waza',
    youtube_id: 'AIlTvZb4RlE',
    is_kata: false, is_theory: false,
    description: 'A figure-four arm lock that bends the elbow in its natural direction but hyperextends the shoulder joint.',
    key_points: [
      'Bend uke\'s arm at 90° and grip the wrist; other hand reaches under to grip your own wrist',
      'Rotate uke\'s arm outward to apply shoulder and elbow pressure',
      'Keep uke\'s arm pinned close to the mat, do not let it rise',
    ]
  },
  {
    title_en: 'Cross Arm-Bar', title_romaji: 'Ude-hishigi-juji-gatame', title_kanji: '腕挫十字固',
    category: 'ne-waza', sub_category: 'Kansetsu-waza',
    youtube_id: 'OWgSOlCuMXw',
    is_kata: false, is_theory: false,
    description: 'The most common competition arm-bar: tori hyperextends uke\'s elbow across the hip while legs press on the shoulder and body.',
    key_points: [
      'Uke\'s arm runs across your hips, thumb pointing up for maximum effect',
      'Both legs squeeze tightly together against uke\'s shoulder and torso',
      'Raise hips upward while pulling uke\'s wrist down toward your chest',
    ]
  },
  {
    title_en: 'Arm Arm-Bar', title_romaji: 'Ude-hishigi-ude-gatame', title_kanji: '腕挫腕固',
    category: 'ne-waza', sub_category: 'Kansetsu-waza',
    youtube_id: 'SBf0aTma1VI',
    is_kata: false, is_theory: false,
    description: 'Tori uses their own arm or wrist as the fulcrum against uke\'s elbow joint to hyperextend it.',
  },
  {
    title_en: 'Knee Arm-Bar', title_romaji: 'Ude-hishigi-hiza-gatame', title_kanji: '腕挫膝固',
    category: 'ne-waza', sub_category: 'Kansetsu-waza',
    youtube_id: 'H2HtAJdiJcE',
    is_kata: false, is_theory: false,
    description: 'Tori uses their knee as the fulcrum against uke\'s elbow while pulling the wrist to hyperextend the joint.',
  },
  {
    title_en: 'Armpit Arm-Bar', title_romaji: 'Ude-hishigi-waki-gatame', title_kanji: '腕挫腋固',
    category: 'ne-waza', sub_category: 'Kansetsu-waza',
    youtube_id: '8F5p1zuJRG0',
    is_kata: false, is_theory: false,
    description: 'Tori traps uke\'s arm in the armpit and applies downward body pressure to hyperextend the elbow.',
  },
  {
    title_en: 'Abdomen Arm-Bar', title_romaji: 'Ude-hishigi-hara-gatame', title_kanji: '腕挫腹固',
    category: 'ne-waza', sub_category: 'Kansetsu-waza',
    youtube_id: 'ZzEycg8R_9M',
    is_kata: false, is_theory: false,
    description: 'Tori uses their abdomen or hip as the fulcrum under uke\'s elbow while pulling the wrist down.',
  },
  {
    title_en: 'Leg Arm-Bar', title_romaji: 'Ude-hishigi-ashi-gatame', title_kanji: '腕挫脚固',
    category: 'ne-waza', sub_category: 'Kansetsu-waza',
    youtube_id: 'ClY7g_pX-4s',
    is_kata: false, is_theory: false,
    description: 'Tori uses their leg or foot as the fulcrum against uke\'s elbow to apply the arm-bar.',
  },
  {
    title_en: 'Hand Arm-Bar', title_romaji: 'Ude-hishigi-te-gatame', title_kanji: '腕挫手固',
    category: 'ne-waza', sub_category: 'Kansetsu-waza',
    youtube_id: '6DnvhY0tQVM',
    is_kata: false, is_theory: false,
    description: 'A wrist lock applying pressure to the wrist and hand joints by rotating and bending the wrist.',
  },
  {
    title_en: 'Triangular Arm-Bar', title_romaji: 'Ude-hishigi-sankaku-gatame', title_kanji: '腕挫三角固',
    category: 'ne-waza', sub_category: 'Kansetsu-waza',
    youtube_id: 'WefAmW4azhk',
    is_kata: false, is_theory: false,
    description: 'Combines sankaku-jime\'s leg triangle with an arm-bar, applying simultaneous strangle and elbow lock.',
  },
  {
    title_en: 'Leg Entanglement', title_romaji: 'Ashi-garami', title_kanji: '足緘',
    category: 'ne-waza', sub_category: 'Kansetsu-waza',
    youtube_id: 'BWWb0GoAtZw',
    is_kata: false, is_theory: false,
    description: 'Tori entangles uke\'s leg to apply rotational pressure to the knee joint. Limited use in competition due to knee injury risk.',
  },

  // ══════════════════════════════════════════════════════════════════
  // CHISHIKI  (Knowledge)
  // ══════════════════════════════════════════════════════════════════
  {
    title_en: 'History and Origins of Judo', title_romaji: 'Judo no Rekishi', title_kanji: '柔道の歴史',
    category: 'knowledge', sub_category: 'History',
    is_kata: false, is_theory: true,
    description: 'Judo was founded in 1882 by Jigoro Kano at the Kodokan dojo in Tokyo, Japan, as a physical, mental, and moral pedagogy based on classical jujutsu.',
    key_points: [
      'Founded by Jigoro Kano (1860–1938) on May 1882 at Eisho-ji temple, Tokyo',
      'Kano synthesised and refined techniques from several jujutsu schools, particularly Tenjin Shin\'yo-ryu and Kito-ryu',
      'The Kodokan (meaning "a place to study the way") was formally established in 1882',
      'Judo became an Olympic sport at the 1964 Tokyo Games',
      '"Judo" means "the gentle way" (柔 jū = gentleness; 道 dō = way)',
    ]
  },
  {
    title_en: 'Core Principles of Judo', title_romaji: 'Judo no Genri', title_kanji: '柔道の原理',
    category: 'knowledge', sub_category: 'Philosophy',
    is_kata: false, is_theory: true,
    description: 'The two guiding maxims Kano established for judo: Seiryoku-Zenyo (maximum efficiency, minimum effort) and Jita-Kyoei (mutual welfare and benefit).',
    key_points: [
      'Seiryoku-Zenyo (精力善用): use energy most efficiently, yield to overcome, use uke\'s force against them',
      'Jita-Kyoei (自他共栄): by helping others you help yourself, judo as a tool for social improvement',
      'Kano intended judo not just as a fighting method but as a way of life and education',
      'These principles distinguish judo from sport-only martial arts',
    ]
  },
  {
    title_en: 'Etiquette and Ceremony', title_romaji: 'Rei-gi', title_kanji: '礼儀',
    category: 'knowledge', sub_category: 'Etiquette',
    is_kata: false, is_theory: true,
    description: 'Rei-gi encompasses the formal customs of judo practice: bowing, respect for the mat, for the opponent, and for the art.',
    key_points: [
      'Ritsu-rei (立礼): standing bow, used when entering/leaving the dojo and before randori or kata',
      'Za-rei (座礼): kneeling bow, used in formal ceremonies',
      'Bow to the dojo (joseki) on entering and leaving',
      'Bow before and after every practice, match, or kata',
      'Footwear must never be worn on the tatami',
    ]
  },
  {
    title_en: 'Ranks and Grades', title_romaji: 'Kyu-Dan Seido', title_kanji: '級段制度',
    category: 'knowledge', sub_category: 'Grading',
    is_kata: false, is_theory: true,
    description: 'The Kodokan grading system uses kyu (student) and dan (master) grades, represented by coloured and black belts respectively.',
    key_points: [
      'Kyu grades count downward: 6th kyu (rokkyu) is the lowest, 1st kyu (ikkyu) the highest student grade',
      'Dan grades count upward: 1st dan (shodan) through 10th dan (judan)',
      'White belt: 6th–4th kyu (varies by federation); Black belt: 1st dan and above',
      'The Kodokan awards red-and-white belts at 6th–8th dan and solid red at 9th–10th dan',
      'Grading criteria include technique, randori performance, kata, competition, and time in grade',
    ]
  },
  {
    title_en: 'Contest Rules', title_romaji: 'Shiai Kisoku', title_kanji: '試合規則',
    category: 'knowledge', sub_category: 'Rules',
    is_kata: false, is_theory: true,
    description: 'Judo competition is governed by IJF rules: matches are won by ippon (instant victory), or by accumulating waza-ari scores, or by penalty against the opponent.',
    key_points: [
      'Ippon (一本): full point, immediate win. Scored by: throw with force, speed, and landing uke on their back; osaekomi held for 20 seconds; successful shime-waza or kansetsu-waza (tap or verbal submission)',
      'Waza-ari (技あり): half point, two waza-ari equal an ippon. Scored by throws that are partial in force or landing',
      'Shido (指導): minor penalty, three shidos equal a hansoku-make loss for the opponent',
      'Hansoku-make (反則負け): disqualification, immediate loss. For serious rule violations',
      'Match time: 4 minutes (senior); golden score (sudden death) if tied after regulation',
    ]
  },
];
