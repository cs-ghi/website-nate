import { Component, OnInit, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { JudoTechnique, BeltLevel, MainCategory } from '../../interfaces/judo.model';
import { KODOKAN_TECHNIQUES } from './kodokan.data';
import { UOFT_TECHNIQUES } from './uoft.data';

@Component({
    selector: 'app-judo',
    templateUrl: './judo.component.html',
    styleUrls: ['./judo.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class JudoComponent implements OnInit {

  searchQuery = '';
  selectedBelt: BeltLevel | 'all' = 'all';
  selectedCategory: MainCategory | 'all' = 'all';
  syllabus = 'judo-canada';
  filteredTechniques: JudoTechnique[] = [];
  bookmarked: Set<string> = new Set();
  selectedTechnique: JudoTechnique | null = null;

  controlsCollapsed = false;
  atTop = true;
  glossaryOpen = false;
  playingCardId: string | null = null;
  modalVideoPlaying = false;
  private lastScrollY = 0;

  // ── Flashcard study mode ──────────────────────────────────────────
  studyMode = false;
  studyDeck: JudoTechnique[] = [];
  deckIndex = 0;
  cardFlipped = false;
  studyVideoPlaying = false;
  private touchStartX = 0;
  private touchStartY = 0;
  private didSwipe = false;

  @HostListener('window:scroll')
  onScroll(): void {
    const currentY = window.scrollY;
    this.controlsCollapsed = currentY > 200 && currentY > this.lastScrollY;
    this.atTop = currentY < 50;
    this.lastScrollY = currentY;
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    if (this.studyMode) { this.exitStudy(); return; }
    this.closeModal();
  }

  @HostListener('window:keydown.arrowright')
  onArrowRight(): void { if (this.studyMode) this.nextCard(); }

  @HostListener('window:keydown.arrowleft')
  onArrowLeft(): void { if (this.studyMode) this.prevCard(); }

  // Typed as Event, not KeyboardEvent: Angular types a host listener's $event
  // as Event, and preventDefault is all this needs.
  @HostListener('window:keydown.space', ['$event'])
  onSpace(e: Event): void {
    if (this.studyMode) { e.preventDefault(); this.flipCard(); }
  }

  beltOptions: { value: BeltLevel | 'all'; label: string }[] = [
    { value: 'all', label: 'All Belts' },
    { value: 'white', label: 'White (Rokkyu)' },
    { value: 'yellow', label: 'Yellow (Gokyu)' },
    { value: 'orange', label: 'Orange (Yonkyu)' },
    { value: 'green', label: 'Green (Sankyu)' },
    { value: 'blue', label: 'Blue (Nikyu)' },
    { value: 'brown', label: 'Brown (Ikkyu)' },
    { value: 'black', label: 'Black (Dan)' },
  ];

  categoryOptions: { value: MainCategory | 'all'; label: string }[] = this.buildCategoryOptions('judo-canada');

  private buildCategoryOptions(syllabus: string): { value: MainCategory | 'all'; label: string }[] {
    if (syllabus === 'kodokan') {
      return [
        { value: 'all', label: 'All Categories' },
        { value: 'tachi-waza', label: 'Nage-waza (Throwing)' },
        { value: 'ne-waza', label: 'Katame-waza (Grappling)' },
        { value: 'knowledge', label: 'Knowledge' },
      ];
    }
    if (syllabus === 'uoft') {
      return [
        { value: 'all', label: 'All Categories' },
        { value: 'tachi-waza', label: 'Tachi-waza (Standing)' },
        { value: 'ne-waza', label: 'Ne-waza (Ground)' },
        { value: 'kata', label: 'Kata' },
        { value: 'knowledge', label: 'Knowledge' },
      ];
    }
    return [
      { value: 'all', label: 'All Categories' },
      { value: 'tachi-waza', label: 'Tachi-waza (Standing)' },
      { value: 'ne-waza', label: 'Ne-waza (Ground)' },
      { value: 'kiso', label: 'Kiso (Basics)' },
      { value: 'kata', label: 'Kata' },
      { value: 'knowledge', label: 'Knowledge' },
    ];
  }

  syllabusOptions = [
    { value: 'judo-canada', label: 'Judo Canada' },
    { value: 'kodokan', label: 'Kodokan (100 techniques)' },
    { value: 'uoft', label: 'U of T Judo Club' },
    { value: 'ijf', label: 'IJF (coming soon)', disabled: true },
  ];

  readonly kodokanTechniques: JudoTechnique[] = KODOKAN_TECHNIQUES;
  readonly uoftTechniques: JudoTechnique[] = UOFT_TECHNIQUES;

  get activeTechniques(): JudoTechnique[] {
    if (this.syllabus === 'kodokan') return this.kodokanTechniques;
    if (this.syllabus === 'uoft') return this.uoftTechniques;
    return this.techniques;
  }

  get showBeltFilter(): boolean {
    return this.syllabus === 'judo-canada' || this.syllabus === 'uoft';
  }

  onSyllabusChange(): void {
    if (this.syllabus !== 'judo-canada') {
      this.selectedBelt = 'all';
    }
    this.selectedCategory = 'all';
    this.categoryOptions = this.buildCategoryOptions(this.syllabus);
    this.filter();
  }

  readonly techniques: JudoTechnique[] = [
    // ── WHITE (Rokkyu) ──────────────────────────────────────────────
    {
      title_en: 'Major Outer Reaping', title_romaji: 'Osoto Gari', title_kanji: '大外刈',
      belt_requirement: 'white', category: 'tachi-waza', sub_category: 'Ashi-waza',
      youtube_id: 'c-A_nP7mKAc',
      is_kata: false, is_theory: false,
      description: 'A major leg reaping technique where tori sweeps uke\'s leg from the outside while driving them backward off-balance.',
      key_points: [
        'Break uke\'s balance (kuzushi) diagonally backward to their right',
        'Drive chest-to-chest as your reaping leg sweeps their supporting leg',
        'Keep your head up and back straight throughout the throw',
        'The reaping motion uses the back of your leg, swing through, don\'t tap',
        'Commit fully: lean into uke as you reap to complete the throw'
      ]
    },
    {
      title_en: 'Major Hip Throw', title_romaji: 'Ogoshi', title_kanji: '大腰',
      belt_requirement: 'white', category: 'tachi-waza', sub_category: 'Koshi-waza',
      youtube_id: 'yhu1mfy2vJ4',
      is_kata: false, is_theory: false,
      description: 'The classic hip throw, one of judo\'s most fundamental techniques. Tori inserts their hip under uke\'s centre of gravity and rotates to throw.',
      key_points: [
        'Wrap your arm around uke\'s waist (or grip the belt) to pull them close',
        'Step in deep so your hip is directly in front of uke\'s hips',
        'Bend your knees slightly to get under uke\'s centre',
        'Pull uke onto your back and rotate/straighten your legs to throw',
        'Keep uke close throughout, space between bodies kills the throw'
      ]
    },
    {
      title_en: 'Shoulder Throw', title_romaji: 'Seoi Nage', title_kanji: '背負投',
      belt_requirement: 'white', category: 'tachi-waza', sub_category: 'Te-waza',
      youtube_id: 'zIq0xI0ogxk',
      is_kata: false, is_theory: false,
      description: 'A hand technique where tori turns in and loads uke across the back, throwing them over the shoulder. One of judo\'s most recognized throws.',
      key_points: [
        'Pull uke forward and turn in sharply, step across with your lead foot',
        'Drive your elbow under uke\'s armpit to lift their arm onto your shoulder',
        'Both feet should end up between uke\'s feet, knees bent',
        'Bend forward and straighten legs simultaneously to project uke over',
        'Keep uke\'s sleeve arm pulled tight against your chest'
      ]
    },
    {
      title_en: 'Body Drop', title_romaji: 'Tai Otoshi', title_kanji: '体落',
      belt_requirement: 'white', category: 'tachi-waza', sub_category: 'Te-waza',
      youtube_id: '4x6S3Q-Ktv8',
      is_kata: false, is_theory: false,
      description: 'A hand technique that uses a blocking leg to pivot uke over a fixed point. The leg does not reap, it blocks like a tripwire while tori rotates.',
      key_points: [
        'Break balance forward to uke\'s right front corner',
        'Step across with your right foot, placing it in front of uke\'s right foot',
        'Extend your left leg across to block in front of both of uke\'s feet',
        'Rotate your entire body to your left, the block + rotation = throw',
        'Pull strongly with both hands as you rotate'
      ]
    },
    {
      title_en: 'Advancing Foot Sweep', title_romaji: 'De Ashi Barai', title_kanji: '出足払',
      belt_requirement: 'white', category: 'tachi-waza', sub_category: 'Ashi-waza',
      youtube_id: '4BUUvqxi_Kk',
      is_kata: false, is_theory: false,
      description: 'A timing-based foot sweep that catches uke\'s advancing foot at the moment their weight transfers onto it.',
      key_points: [
        'Timing is everything, sweep as uke\'s foot contacts the mat and weight shifts',
        'Sweep with the sole of your foot across the mat, not upward',
        'Simultaneously pull in the sweep direction with your sleeve hand',
        'Small movement, no wind-up, the sweep should be quick and flat',
        'Works best when moving with uke\'s rhythm rather than forcing it'
      ]
    },
    // Ne-waza, Osaekomi (white)
    {
      title_en: 'Scarf Hold', title_romaji: 'Kesa Gatame', title_kanji: '袈裟固',
      belt_requirement: 'white', category: 'ne-waza', sub_category: 'Osaekomi-waza',
      youtube_id: 'NDaQuJOFBYk',
      is_kata: false, is_theory: false,
      description: 'The most fundamental groundwork pin. Tori sits alongside uke, controlling the head under their arm and gripping the sleeve.',
      key_points: [
        'Sit diagonally beside uke, hips on the mat for a low centre of gravity',
        'Trap uke\'s head tightly under your arm, elbow points toward uke\'s feet',
        'Hold uke\'s near arm at the sleeve with your other hand, hugging it to your body',
        'Keep your legs spread wide apart for base, right leg forward, left back',
        'Squeeze with your arm and lean weight into uke to prevent escape'
      ]
    },
    {
      title_en: 'Side Four-Corner Hold', title_romaji: 'Yoko Shiho Gatame', title_kanji: '横四方固',
      belt_requirement: 'white', category: 'ne-waza', sub_category: 'Osaekomi-waza',
      youtube_id: 'TT7XJVSEQxA',
      is_kata: false, is_theory: false,
      description: 'A side control pin where tori lies perpendicular to uke, controlling the head and far hip.',
      key_points: [
        'Lie alongside uke at a perpendicular angle, chest-to-chest',
        'Pass one arm under uke\'s neck and grip the far collar or shoulder',
        'Pass the other arm between uke\'s legs and grip the belt or trouser',
        'Spread your legs wide for base and keep your chest heavy on uke',
        'Hips stay low, lifting your hips makes it easier for uke to escape'
      ]
    },
    {
      title_en: 'Fundamental Scarf Hold', title_romaji: 'Hon Kesa Gatame', title_kanji: '本袈裟固',
      belt_requirement: 'white', category: 'ne-waza', sub_category: 'Osaekomi-waza',
      youtube_id: 'NDaQuJOFBYk',
      is_kata: false, is_theory: false,
      description: 'The original form of Kesa Gatame as codified in the Kodokan, where tori grips both the arm and the collar simultaneously.',
      key_points: [
        'Same base position as Kesa Gatame, sit diagonally beside uke',
        'Grip uke\'s collar with the arm that traps the head',
        'The other hand controls uke\'s near arm at the sleeve or wrist',
        'Maintain the same wide-leg base and low hip position',
        'The collar grip gives additional control over head movement'
      ]
    },
    // Kiso, Ukemi (white)
    {
      title_en: 'Forward Fall', title_romaji: 'Mae Ukemi', title_kanji: '前受身',
      belt_requirement: 'white', category: 'kiso', sub_category: 'Ukemi',
      is_kata: false, is_theory: false,
      description: 'The forward breakfall protects against falling face-first. Arms absorb impact in a push-up position before the body lands.',
      key_points: [
        'From standing, fall forward with arms extended in front at 45°',
        'Both forearms and palms contact the mat simultaneously with a sharp slap',
        'Keep toes pointed, the ball of the foot makes light contact, not the knee',
        'Turn your head to one side to protect the face',
        'Practice from knees first, then standing; arms must be slightly bent at impact'
      ]
    },
    {
      title_en: 'Backward Fall', title_romaji: 'Ushiro Ukemi', title_kanji: '後受身',
      belt_requirement: 'white', category: 'kiso', sub_category: 'Ukemi',
      is_kata: false, is_theory: false,
      description: 'The backward breakfall distributes impact across the upper back. The chin is pulled to the chest to protect the head.',
      key_points: [
        'Chin firmly to chest, never let the head hit the mat',
        'Round your back as you fall, avoid landing flat',
        'Both arms slap simultaneously at ~45° from the body at the moment of impact',
        'Bend knees and pull feet close to the body',
        'Practice from a crouch first, gradually increasing height'
      ]
    },
    {
      title_en: 'Side Fall', title_romaji: 'Yoko Ukemi', title_kanji: '横受身',
      belt_requirement: 'white', category: 'kiso', sub_category: 'Ukemi',
      is_kata: false, is_theory: false,
      description: 'The side breakfall is used when thrown to the side. The top arm strikes the mat to absorb impact before the body lands.',
      key_points: [
        'The falling arm extends at roughly 45° from the body and slaps the mat',
        'Top leg extends in the direction of the fall for balance',
        'Bottom leg and hip absorb some impact, but the arm slap comes first',
        'Keep the head off the mat, raise it slightly on impact',
        'Practise to both left and right sides equally'
      ]
    },
    {
      title_en: 'Rolling Forward Fall', title_romaji: 'Mae Mawari Ukemi', title_kanji: '前回り受身',
      belt_requirement: 'white', category: 'kiso', sub_category: 'Ukemi',
      is_kata: false, is_theory: false,
      description: 'A rolling breakfall used when thrown with forward-rotating throws. The body rolls diagonally across the back, ending in a side fall.',
      key_points: [
        'Roll diagonally, from one hand across the arm, shoulder, and opposite hip',
        'Do not roll straight over the top of the spine',
        'Complete the roll by ending in Yoko Ukemi position with a slap',
        'Keep your body rounded, a flat roll is dangerous',
        'Eyes look at your own belly button through the roll'
      ]
    },

    // ── YELLOW (Gokyu) ──────────────────────────────────────────────
    {
      title_en: 'One-Arm Shoulder Throw', title_romaji: 'Ippon Seoi Nage', title_kanji: '一本背負投',
      belt_requirement: 'yellow', category: 'tachi-waza', sub_category: 'Te-waza',
      youtube_id: 'FQnOlCxo4oI',
      is_kata: false, is_theory: false,
      description: 'A one-arm variation of Seoi Nage where tori hooks a single arm under uke\'s sleeve-side arm. Extremely common in competition.',
      key_points: [
        'Grip the sleeve with your right hand and drive that elbow straight up into uke\'s armpit',
        'Your elbow traps uke\'s arm across your shoulder, not your hand',
        'Drop low with bent knees; your back must be lower than uke\'s hips',
        'Pull the collar hand down and forward as you lift and rotate',
        'The entry (tsugi-ashi or ayumi-ashi footwork) must be fast'
      ]
    },
    {
      title_en: 'Two-Arm Shoulder Throw', title_romaji: 'Morote Seoi Nage', title_kanji: '双手背負投',
      belt_requirement: 'yellow', category: 'tachi-waza', sub_category: 'Te-waza',
      youtube_id: 'zIq0xI0ogxk',
      is_kata: false, is_theory: false,
      description: 'The two-arm shoulder throw where tori grips the lapel and sleeve, then turns in to throw uke over the shoulder.',
      key_points: [
        'Step deep, both feet between uke\'s, back facing uke\'s chest',
        'Lapel arm bends so the elbow presses against uke\'s chest',
        'Sleeve arm pulls uke\'s arm tight across your body',
        'Bend forward with a flat back and straighten legs to project uke',
        'Common error: not getting low enough before the throw'
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
        'Scoop the leg forward, the reap is a scooping motion, not a kick',
        'Lean in over uke as you reap to maintain pressure',
        'Works well in combination with Ouchi Gari'
      ]
    },
    {
      title_en: 'Major Inner Reaping', title_romaji: 'Ouchi Gari', title_kanji: '大内刈',
      belt_requirement: 'yellow', category: 'tachi-waza', sub_category: 'Ashi-waza',
      youtube_id: '0itJFhV9pDQ',
      is_kata: false, is_theory: false,
      description: 'A major leg reap from the inside, stepping deep between uke\'s legs to sweep the supporting leg backward.',
      key_points: [
        'Step forward and between uke\'s legs with your reaping leg',
        'Break balance to uke\'s rear, pull/push the upper body backward',
        'Your reaping leg hooks behind uke\'s knee or thigh',
        'The motion is a large back-and-up swing, like a pendulum',
        'Effective when uke\'s weight is on the back leg'
      ]
    },
    {
      title_en: 'Minor Outer Reaping', title_romaji: 'Kosoto Gari', title_kanji: '小外刈',
      belt_requirement: 'yellow', category: 'tachi-waza', sub_category: 'Ashi-waza',
      youtube_id: 'jeQ541ScLB4',
      is_kata: false, is_theory: false,
      description: 'A small outer reap that hooks the outside of uke\'s heel, toppling them sideways and backward.',
      key_points: [
        'Break uke\'s balance to the rear-corner on the reaping side',
        'Hook the back of your heel against the outside of uke\'s heel',
        'Use a sweeping, scooping motion, heel to heel',
        'Push across with your grip to assist the off-balance',
        'Often effective as a combination follow-up from Ouchi Gari'
      ]
    },
    {
      title_en: 'Broken Scarf Hold', title_romaji: 'Kuzure Kesa Gatame', title_kanji: '崩袈裟固',
      belt_requirement: 'yellow', category: 'ne-waza', sub_category: 'Osaekomi-waza',
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
      title_en: 'Chest Hold', title_romaji: 'Mune Gatame', title_kanji: '胸固',
      belt_requirement: 'yellow', category: 'ne-waza', sub_category: 'Osaekomi-waza',
      is_kata: false, is_theory: false,
      description: 'A pin where tori lies chest-to-chest with uke at a roughly perpendicular angle, controlling the collar and the near arm.',
      key_points: [
        'Lie across uke with your chest directly on theirs',
        'One arm reaches under the neck to grip the far shoulder or collar',
        'The other arm traps uke\'s near arm between your arm and body',
        'Spread your legs wide for a stable base, no knee contact with the mat',
        'Keep your hips low; drive your weight through your chest'
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
    {
      title_en: 'Broken Upper Four-Corner Hold', title_romaji: 'Kuzure Kami Shiho Gatame', title_kanji: '崩上四方固',
      belt_requirement: 'yellow', category: 'ne-waza', sub_category: 'Osaekomi-waza',
      youtube_id: 'YUrogQWdwiY',
      is_kata: false, is_theory: false,
      description: 'A modified form of Kami Shiho Gatame where one arm control is adjusted, typically one arm controls the neck and the other the arm.',
      key_points: [
        'From Kami Shiho, release one belt grip and wrap the arm around uke\'s neck',
        'Or: trap one arm under your body while the other grips the far collar',
        'Often more stable against rolling escapes than the standard version',
        'Weight stays in uke\'s chest and upper body',
        'Adjust leg position as needed to prevent uke from bridging'
      ]
    },

    // ── ORANGE (Yonkyu) ──────────────────────────────────────────────
    {
      title_en: 'Sweeping Hip Throw', title_romaji: 'Harai Goshi', title_kanji: '払腰',
      belt_requirement: 'orange', category: 'tachi-waza', sub_category: 'Koshi-waza',
      youtube_id: 'qTo8HlAAkOo',
      is_kata: false, is_theory: false,
      description: 'A hip throw where tori\'s extended sweeping leg catches uke\'s thigh, adding rotation to the hip projection.',
      key_points: [
        'Turn in like Ogoshi but extend your right leg back and across',
        'The sweeping leg swings across uke\'s thighs, not a reap, a sweep',
        'Hip contact is essential: your hip must block uke\'s hip',
        'Pull strongly with both hands as you sweep to maximize rotation',
        'Common error: sweeping the lower leg instead of the thigh'
      ]
    },
    {
      title_en: 'Inner Thigh Throw', title_romaji: 'Uchi Mata', title_kanji: '内股',
      belt_requirement: 'orange', category: 'tachi-waza', sub_category: 'Ashi-waza',
      youtube_id: 'iUpSu5J-bgw',
      is_kata: false, is_theory: false,
      description: 'One of judo\'s highest-scoring techniques in competition. Tori\'s leg reaches between uke\'s legs to reap the inner thigh.',
      key_points: [
        'Turn in and drive your reaping leg up between uke\'s legs to the inner thigh',
        'The reaping action is upward, lifting rather than backward-sweeping',
        'Off-balance uke forward and slightly to the side before entering',
        'Pull the sleeve down and out while lifting the collar arm high',
        'Hip contact varies, can be hip-to-hip or thigh-dominant depending on style'
      ]
    },
    {
      title_en: 'Propping Drawing Ankle Throw', title_romaji: 'Sasae Tsuri Komi Ashi', title_kanji: '支釣込足',
      belt_requirement: 'orange', category: 'tachi-waza', sub_category: 'Ashi-waza',
      youtube_id: '699i--pvYmE',
      is_kata: false, is_theory: false,
      description: 'A blocking foot throw where tori\'s foot props against uke\'s ankle as both hands pull and lift to rotate uke over the block.',
      key_points: [
        'Place the sole of your foot against uke\'s ankle as a fixed block',
        'Pull up strongly with the collar hand (tsuri = lifting pull) while pulling forward with the sleeve',
        'The block plus the upward pull creates a rotation over the foot',
        'Timing is key: block as uke steps forward',
        'Your blocking foot stays fixed, this is not a sweep'
      ]
    },
    {
      title_en: 'Sliding Foot Sweep', title_romaji: 'Okuri Ashi Barai', title_kanji: '送足払',
      belt_requirement: 'orange', category: 'tachi-waza', sub_category: 'Ashi-waza',
      youtube_id: 'nw1ZdRjrdRI',
      is_kata: false, is_theory: false,
      description: 'A two-foot sweep catching both of uke\'s feet as they step laterally. Requires excellent timing with uke\'s movement.',
      key_points: [
        'Best applied while both players are moving laterally (ayumi-ashi)',
        'Sweep as uke\'s feet come close together, the moment between steps',
        'The sweeping foot moves flat along the mat to catch both feet',
        'Pull in the direction of uke\'s movement to enhance off-balance',
        'Timing over power: a gentle sweep at the right moment beats a strong one late'
      ]
    },
    {
      title_en: 'Minor Inner Winding Throw', title_romaji: 'Kouchi Makikomi', title_kanji: '小内巻込',
      belt_requirement: 'orange', category: 'tachi-waza', sub_category: 'Makikomi-waza',
      youtube_id: '_1eygIXLD_w',
      is_kata: false, is_theory: false,
      description: 'A winding variation of Kouchi Gari where tori wraps the arm around uke and falls, dragging uke to the mat.',
      key_points: [
        'Enter for Kouchi Gari then wrap your arm around uke\'s arm/torso',
        'Fall into uke while still reaping, dragging them down with your body weight',
        'The "winding" means your body wraps around uke rather than remaining upright',
        'Uke cannot easily post to stop the fall because their arm is wrapped',
        'Execute quickly, the wrap must happen simultaneously with the reap'
      ]
    },
    {
      title_en: 'Vertical Four-Corner Hold', title_romaji: 'Tate Shiho Gatame', title_kanji: '縦四方固',
      belt_requirement: 'orange', category: 'ne-waza', sub_category: 'Osaekomi-waza',
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
      title_en: 'Broken Vertical Four-Corner Hold', title_romaji: 'Kuzure Tate Shiho Gatame', title_kanji: '崩縦四方固',
      belt_requirement: 'orange', category: 'ne-waza', sub_category: 'Osaekomi-waza',
      is_kata: false, is_theory: false,
      description: 'A modified Tate Shiho Gatame where one arm is repositioned, often wrapping around the neck or trapping a single arm differently.',
      key_points: [
        'From Tate Shiho, adjust one arm to wrap around uke\'s neck/head',
        'Or trap uke\'s arm against your body while gripping the far collar',
        'Keep your legs hooked under uke\'s thighs for base',
        'This variation is harder for uke to escape by rolling',
        'Pressure maintained through chest-to-chest contact'
      ]
    },

    // ── GREEN (Sankyu) ──────────────────────────────────────────────
    {
      title_en: 'Floating Hip Throw', title_romaji: 'Uki Goshi', title_kanji: '浮腰',
      belt_requirement: 'green', category: 'tachi-waza', sub_category: 'Koshi-waza',
      youtube_id: 'bPKwtB4lyOQ',
      is_kata: false, is_theory: false,
      description: 'A refined hip throw where uke floats over tori\'s hip in a circular arc. Less load-and-lift than Ogoshi; relies on rotation.',
      key_points: [
        'Hip does not fully load uke, contact is lighter, more floating',
        'Circular pull with both hands drives uke around the hip',
        'Turn in with smaller footwork than Ogoshi; hip contacts uke\'s hip',
        'Back arm wraps around uke\'s waist with grip on the back',
        'The throw is a smooth arc, not a vertical lift'
      ]
    },
    {
      title_en: 'Lifting Hip Throw', title_romaji: 'Tsuri Goshi', title_kanji: '釣腰',
      belt_requirement: 'green', category: 'tachi-waza', sub_category: 'Koshi-waza',
      youtube_id: '51Htlp7xEvE',
      is_kata: false, is_theory: false,
      description: 'A hip throw where tori grips uke\'s belt to literally lift them over the hip, combining upward pull with rotation.',
      key_points: [
        'Grip uke\'s belt at the back (or side), this is the "tsuri" (lifting) grip',
        'Turn in as with Ogoshi, but use the belt grip to lift uke upward',
        'The lifting hand pulls up while the other hand pulls forward/down',
        'Uke is lifted onto tori\'s hip, not just swept',
        'Bend the knees to get under uke and straighten them to lift'
      ]
    },
    {
      title_en: 'Knee Wheel', title_romaji: 'Hiza Guruma', title_kanji: '膝車',
      belt_requirement: 'green', category: 'tachi-waza', sub_category: 'Ashi-waza',
      youtube_id: 'JPJx9-oAVns',
      is_kata: false, is_theory: false,
      description: 'Tori\'s foot blocks uke\'s knee as both hands rotate uke around that fixed point.',
      key_points: [
        'Place the sole of your foot against uke\'s knee, not the ankle',
        'The block at the knee acts as the wheel\'s axle',
        'Pull strongly in a large circular motion with both arms to spin uke around the block',
        'Your body moves backward as you pull, don\'t stand still',
        'Timing with uke\'s advancing step gives the most power'
      ]
    },
    {
      title_en: 'Stomach Throw', title_romaji: 'Tomoe Nage', title_kanji: '巴投',
      belt_requirement: 'green', category: 'tachi-waza', sub_category: 'Ma-sutemi-waza',
      youtube_id: '880WbHvHv6A',
      is_kata: false, is_theory: false,
      description: 'A sacrifice throw where tori falls backward, places a foot on uke\'s stomach, and uses uke\'s momentum to circle them overhead.',
      key_points: [
        'Draw uke forward strongly to commit their weight',
        'Fall backward and place your foot on uke\'s lower abdomen/belt area',
        'As your back contacts the mat, extend your leg to launch uke overhead',
        'Both hands maintain grip throughout to guide uke\'s rotation',
        'The foot placement is the key, too high (chest) or too low (thigh) reduces power'
      ]
    },
    {
      title_en: 'Valley Drop', title_romaji: 'Tani Otoshi', title_kanji: '谷落',
      belt_requirement: 'green', category: 'tachi-waza', sub_category: 'Yoko-sutemi-waza',
      youtube_id: '3b9Me3Fohpk',
      is_kata: false, is_theory: false,
      description: 'A side sacrifice throw where tori drops behind uke\'s legs and pulls them backward into the "valley".',
      key_points: [
        'Step behind uke and between their legs, then drop to the mat',
        'Pull uke directly over you as you fall, they fall into the space behind them',
        'One leg extends behind uke\'s far leg as a block',
        'Effective when uke is leaning backward defensively',
        'Often used as a counter to uke\'s forward motion'
      ]
    },
    // Ne-waza, Shime-waza (green)
    {
      title_en: 'Naked Strangle', title_romaji: 'Hadaka Jime', title_kanji: '裸絞',
      belt_requirement: 'green', category: 'ne-waza', sub_category: 'Shime-waza',
      youtube_id: '9f0n8jez7iA',
      is_kata: false, is_theory: false,
      description: 'A rear naked choke applied without using the gi. The forearm presses against the windpipe or carotid arteries.',
      key_points: [
        'Applied from behind uke; take the back position first',
        'Forearm of one arm slides across the throat (carotid choke) or windpipe',
        'Clasp hands together, palm of applying hand grips the bicep of the support arm',
        'Support hand pushes uke\'s head forward into the choke',
        'Squeeze with the arm and use body weight leaning back to tighten'
      ]
    },
    {
      title_en: 'Sliding Collar Strangle', title_romaji: 'Okuri Eri Jime', title_kanji: '送襟絞',
      belt_requirement: 'green', category: 'ne-waza', sub_category: 'Shime-waza',
      youtube_id: 'EiqyoVcIAi8',
      is_kata: false, is_theory: false,
      description: 'A collar choke from behind using cross-collar grips that slide to compress both carotid arteries.',
      key_points: [
        'Applied from behind uke, both hands grip the collar',
        'One hand enters palm-up deep into the far collar',
        'The other hand crosses over and grips uke\'s near collar palm-down',
        'Pull the elbows apart and outward, the crossing collars compress the neck',
        'Keep uke\'s back against your chest to prevent them rolling out'
      ]
    },
    {
      title_en: 'Half Cross Strangle', title_romaji: 'Kata Juji Jime', title_kanji: '片十字絞',
      belt_requirement: 'green', category: 'ne-waza', sub_category: 'Shime-waza',
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
      title_en: 'Arm Entanglement', title_romaji: 'Ude Garami', title_kanji: '腕緘',
      belt_requirement: 'green', category: 'ne-waza', sub_category: 'Kansetsu-waza',
      youtube_id: 'AIlTvZb4RlE',
      is_kata: false, is_theory: false,
      description: 'A figure-four armlock that rotates uke\'s elbow joint against its natural range of motion.',
      key_points: [
        'Trap uke\'s arm on the mat; their elbow should be bent at roughly 90°',
        'Thread your arm under uke\'s arm and grip their wrist from below',
        'Your other hand grips your own wrist to form the figure-four',
        'Rotate uke\'s wrist toward their shoulder (internally), do not apply suddenly',
        'Control their shoulder with your body weight to prevent escape'
      ]
    },

    // ── BLUE (Nikyu) ──────────────────────────────────────────────
    {
      title_en: 'Spring Hip Throw', title_romaji: 'Hane Goshi', title_kanji: '跳腰',
      belt_requirement: 'blue', category: 'tachi-waza', sub_category: 'Koshi-waza',
      youtube_id: 'M9_7De6A1kk',
      is_kata: false, is_theory: false,
      description: 'A hip throw with a springing/kicking leg that adds power to the projection. The bent reaping leg springs upward to "bounce" uke over.',
      key_points: [
        'Turn in like Harai Goshi but bend the reaping knee as it contacts uke\'s thigh',
        'Spring the bent leg upward and backward to generate the "hane" (spring) action',
        'Hip contact is important: your hip must block uke\'s hip',
        'The spring replaces the sweeping, think bounce, not sweep',
        'Excellent combination with Ouchi Gari: outer reap → hip throw'
      ]
    },
    {
      title_en: 'Leg Wheel', title_romaji: 'Ashi Guruma', title_kanji: '足車',
      belt_requirement: 'blue', category: 'tachi-waza', sub_category: 'Ashi-waza',
      youtube_id: 'ROeayhvom9U',
      is_kata: false, is_theory: false,
      description: 'A leg wheel that blocks across both of uke\'s legs. The blocking leg acts as the wheel\'s axle.',
      key_points: [
        'Turn in and extend your blocking leg across both of uke\'s shins/thighs',
        'Your leg is a fixed block, no sweeping motion',
        'Pull strongly in a circular arc with both hands to wheel uke over the block',
        'The throw is entirely in the hands, the leg only provides the pivot',
        'Differentiate from Harai Goshi: this targets lower and across both legs'
      ]
    },
    {
      title_en: 'Sweeping Drawing Ankle Throw', title_romaji: 'Harai Tsuri Komi Ashi', title_kanji: '払釣込足',
      belt_requirement: 'blue', category: 'tachi-waza', sub_category: 'Ashi-waza',
      youtube_id: 'gGPXvWL8VbE',
      is_kata: false, is_theory: false,
      description: 'Combines the upward collar pull of Sasae Tsuri Komi Ashi with a sweeping foot action at the ankle.',
      key_points: [
        'Strong upward lifting pull with the collar hand (tsuri komi)',
        'The foot sweeps uke\'s ankle outward rather than blocking it',
        'Works best when uke is stepping forward, catch the ankle mid-step',
        'The lift forces uke onto their toes, making the sweep easier',
        'Combine the sweep and the lift simultaneously for maximum effect'
      ]
    },
    {
      title_en: 'Major Outer Winding Throw', title_romaji: 'Osoto Makikomi', title_kanji: '大外巻込',
      belt_requirement: 'blue', category: 'tachi-waza', sub_category: 'Makikomi-waza',
      youtube_id: 'DGDv2oMwmas',
      is_kata: false, is_theory: false,
      description: 'A winding variation of Osoto Gari where tori wraps the arm around uke and falls with them, preventing uke from posting out.',
      key_points: [
        'Enter for Osoto Gari but wrap your sleeve-grip arm around uke\'s arm',
        'Fall into uke (rather than staying upright) while continuing to reap',
        'Your body wraps tightly against uke so they can\'t extend an arm to break the fall',
        'Execute quickly, the wrap and reap must happen together',
        'Often used when uke defends Osoto Gari by stiffening the arm'
      ]
    },
    {
      title_en: 'Sleeve Lifting Hip Throw', title_romaji: 'Sode Tsuri Komi Goshi', title_kanji: '袖釣込腰',
      belt_requirement: 'blue', category: 'tachi-waza', sub_category: 'Koshi-waza',
      youtube_id: 'QsmAxpmYLOI',
      is_kata: false, is_theory: false,
      description: 'A hip throw using a sleeve grip to lift uke\'s arm high over the throwing shoulder while the hip blocks.',
      key_points: [
        'Release the collar and grip uke\'s sleeve with both hands',
        'Lift the sleeve-side arm high above your head as you turn in',
        'Your hip blocks against uke\'s hip; the lifted arm unbalances uke forward',
        'The lifting action opens uke\'s side for the throw',
        'Often used from a two-sleeve grip (double sleeve grip: Sode) entry'
      ]
    },
    // Ne-waza, Shime-waza (blue)
    {
      title_en: 'Normal Cross Strangle', title_romaji: 'Nami Juji Jime', title_kanji: '並十字絞',
      belt_requirement: 'blue', category: 'ne-waza', sub_category: 'Shime-waza',
      youtube_id: 'k2cHry9HByQ',
      is_kata: false, is_theory: false,
      description: 'A cross-collar choke from mount or guard with both palms facing down, applying pressure to the carotid arteries.',
      key_points: [
        'Both hands grip the collar palm-down (thumbs inside)',
        'Hands cross each other at the wrists against uke\'s neck',
        'Drive elbows down and outward to apply bilateral carotid pressure',
        'Keep your chest close to uke, distance reduces the choke\'s effectiveness',
        'Distinguish from Gyaku Juji Jime (palms up) and Kata Juji Jime (mixed)'
      ]
    },
    {
      title_en: 'Reverse Cross Strangle', title_romaji: 'Gyaku Juji Jime', title_kanji: '逆十字絞',
      belt_requirement: 'blue', category: 'ne-waza', sub_category: 'Shime-waza',
      youtube_id: 't3tQriIPdlI',
      is_kata: false, is_theory: false,
      description: 'A cross-collar choke with both palms facing up, creating a different angle of pressure on the carotid arteries.',
      key_points: [
        'Both hands grip the collar palm-up (thumbs outside)',
        'Entry requires driving both hands deep under the collar from below',
        'Cross the wrists at uke\'s throat and expand outward',
        'This variation is generally easier to achieve from inside uke\'s guard',
        'Applied from guard: use legs to prevent uke from posturing up'
      ]
    },
    // Ne-waza, Kansetsu-waza (blue)
    {
      title_en: 'Cross Armlock', title_romaji: 'Juji Gatame', title_kanji: '十字固',
      belt_requirement: 'blue', category: 'ne-waza', sub_category: 'Kansetsu-waza',
      youtube_id: 'OWgSOlCuMXw',
      is_kata: false, is_theory: false,
      description: 'The standard straight armbar. The elbow is hyperextended by raising the hips while the arm is controlled between the thighs.',
      key_points: [
        'Trap uke\'s arm between your thighs, thumb-side of uke\'s arm pointing up',
        'Grip uke\'s wrist with both hands and control their arm against your chest',
        'Raise your hips upward while pulling the wrist down, this hyperextends the elbow',
        'Knees should be together to prevent uke from pulling the arm out',
        'Apply pressure gradually, the lock comes on quickly'
      ]
    },
    {
      title_en: 'Arm Lock', title_romaji: 'Ude Gatame', title_kanji: '腕固',
      belt_requirement: 'blue', category: 'ne-waza', sub_category: 'Kansetsu-waza',
      youtube_id: 'SBf0aTma1VI',
      is_kata: false, is_theory: false,
      description: 'A straight armlock applied by pressing uke\'s elbow against a fixed part of tori\'s body, usually the chest or shoulder.',
      key_points: [
        'Trap uke\'s straight arm, keep it extended and under control',
        'Press the arm against your chest, shoulder, or armpit to create the lever',
        'Both your hands control uke\'s wrist, the pressure point is the elbow',
        'Can be applied from a standing position or from the ground',
        'Apply slowly, the elbow joint has limited range; the lock is immediate'
      ]
    },
    {
      title_en: 'Shoulder Hold', title_romaji: 'Kata Gatame', title_kanji: '肩固',
      belt_requirement: 'blue', category: 'ne-waza', sub_category: 'Osaekomi-waza',
      youtube_id: 'zQR3IOXxO_Q',
      is_kata: false, is_theory: false,
      description: 'A pin and choke combination where tori traps uke\'s head and shoulder together, with the arm pressed against the neck.',
      key_points: [
        'Lie across uke at a perpendicular angle, similar to side control',
        'Drive uke\'s arm up against their own neck using your head',
        'Press your own head down on uke\'s arm to trap it against the carotid',
        'This simultaneously pins and chokes, even a pure pin scores',
        'Clasp hands together under uke\'s shoulder to lock the position'
      ]
    },

    // ── BROWN (Ikkyu) ──────────────────────────────────────────────
    {
      title_en: 'Rear Throw', title_romaji: 'Ura Nage', title_kanji: '裏投',
      belt_requirement: 'brown', category: 'tachi-waza', sub_category: 'Ma-sutemi-waza',
      youtube_id: 'Fgi9b8DJ5sQ',
      is_kata: false, is_theory: false,
      description: 'A rear sacrifice throw where tori grabs uke from the front, arches backward, and throws uke over their own head.',
      key_points: [
        'Grab uke around the waist (or grip the belt from the back)',
        'Arch your back and throw your own weight backward',
        'Lift uke\'s hips up and over as you arch, they fly over your head',
        'Often used as a counter to uke\'s forward-lunging attacks',
        'Requires flexibility in the back, build up gradually'
      ]
    },
    {
      title_en: 'Corner Throw', title_romaji: 'Sumi Gaeshi', title_kanji: '隅返',
      belt_requirement: 'brown', category: 'tachi-waza', sub_category: 'Ma-sutemi-waza',
      youtube_id: '5VhduA5xkbA',
      is_kata: false, is_theory: false,
      description: 'A sacrifice throw where tori hooks a foot inside uke\'s thigh and falls backward, somersaulting uke over to the corner.',
      key_points: [
        'Break uke\'s balance forward; they must be leaning toward you',
        'Hook your foot inside uke\'s inner thigh (not the knee)',
        'Fall backward while pulling uke close and extending the hooked leg upward',
        'The foot hook + backward fall propels uke over in an arc',
        'Distinguish from Tomoe Nage: foot goes inside the thigh, not on the stomach'
      ]
    },
    {
      title_en: 'Floating Throw', title_romaji: 'Uki Waza', title_kanji: '浮技',
      belt_requirement: 'brown', category: 'tachi-waza', sub_category: 'Yoko-sutemi-waza',
      youtube_id: 'weVOpJ63gII',
      is_kata: false, is_theory: false,
      description: 'A side sacrifice throw where tori floats uke forward by falling to the side while pulling them over.',
      key_points: [
        'Break uke\'s balance diagonally forward',
        'Fall to your side while pulling uke over your body with both hands',
        'One leg may extend to assist the throw, but it\'s primarily a pull and fall',
        'Uke "floats" over tori in an arc',
        'Often combined with movement to catch uke mid-step'
      ]
    },
    {
      title_en: 'Side Separation', title_romaji: 'Yoko Wakare', title_kanji: '横分',
      belt_requirement: 'brown', category: 'tachi-waza', sub_category: 'Yoko-sutemi-waza',
      youtube_id: 'bp1tscHlePI',
      is_kata: false, is_theory: false,
      description: 'A side sacrifice throw where tori falls to the side and pulls uke over them by separating their own body from uke\'s.',
      key_points: [
        'Pull uke forward and fall sideways, the separation between bodies creates the throw',
        'Drive one leg in front of uke\'s legs to sweep or block',
        'Use strong bilateral hand action to guide uke\'s rotation',
        'Keep pulling as you fall, release of grip kills the technique',
        'Can be used as a counter or from a standing attack'
      ]
    },
    {
      title_en: 'Side Wheel', title_romaji: 'Yoko Guruma', title_kanji: '横車',
      belt_requirement: 'brown', category: 'tachi-waza', sub_category: 'Yoko-sutemi-waza',
      youtube_id: 'MehP6I5cY2c',
      is_kata: false, is_theory: false,
      description: 'A side sacrifice throw where tori spins under uke and throws them in a wheeling motion to the side.',
      key_points: [
        'Dive under uke\'s centre; wrap arms around their waist or hips',
        'Fall to the side and spin uke around your body',
        'The "wheel" action rotates uke around your torso',
        'Often a counter to uke\'s attack, using their momentum',
        'Requires good timing to get under uke\'s defence'
      ]
    },
    {
      title_en: 'Triangle Strangle', title_romaji: 'Sangaku Jime', title_kanji: '三角絞',
      belt_requirement: 'brown', category: 'ne-waza', sub_category: 'Shime-waza',
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
    {
      title_en: 'Knee Lock', title_romaji: 'Hiza Gatame', title_kanji: '膝固',
      belt_requirement: 'brown', category: 'ne-waza', sub_category: 'Kansetsu-waza',
      youtube_id: 'H2HtAJdiJcE',
      is_kata: false, is_theory: false,
      description: 'An elbow lock where tori uses their knee as the fulcrum to press uke\'s arm against.',
      key_points: [
        'Trap uke\'s arm and place your knee at the crook of their elbow',
        'Your hands control uke\'s wrist, pulling it toward you',
        'The knee pressing into the elbow joint from below creates the lever',
        'Keep uke\'s arm straight, bending it removes the pressure',
        'Apply gradually and smoothly; elbow locks can come on quickly'
      ]
    },
    {
      title_en: 'Armpit Lock', title_romaji: 'Waki Gatame', title_kanji: '腋固',
      belt_requirement: 'brown', category: 'ne-waza', sub_category: 'Kansetsu-waza',
      youtube_id: '8F5p1zuJRG0',
      is_kata: false, is_theory: false,
      description: 'A straight armlock where tori traps uke\'s arm under their own armpit, pressing the elbow against the side of their body.',
      key_points: [
        'Grab uke\'s wrist and trap their arm under your armpit',
        'Drive your body weight downward onto the trapped arm',
        'Uke\'s elbow presses against your body (rib/hip area), this is the fulcrum',
        'Keep the arm straight, if uke bends it, reposition',
        'Can be applied from standing or on the ground; often from a failed grip'
      ]
    },

    // ── BLACK (Dan) ──────────────────────────────────────────────
    {
      title_en: 'Forms of Throwing', title_romaji: 'Nage-no-Kata', title_kanji: '投の形',
      belt_requirement: 'black', category: 'kata', sub_category: 'Kata',
      is_kata: true, is_theory: false,
      description: 'A formal demonstration of 15 representative throwing techniques organized into 5 groups. Performed in pairs (tori and uke) with precise footwork, posture, and form.',
      kata_forms: [
        'Te-waza (Hand Techniques): Uki Otoshi · Seoi Nage · Kata Guruma',
        'Koshi-waza (Hip Techniques): Uki Goshi · Harai Goshi · Tsuri Komi Goshi',
        'Ashi-waza (Foot/Leg Techniques): Okuri Ashi Barai · Sasae Tsuri Komi Ashi · Uchi Mata',
        'Ma-sutemi-waza (Rear Sacrifice): Tomoe Nage · Ura Nage · Sumi Gaeshi',
        'Yoko-sutemi-waza (Side Sacrifice): Yoko Gake · Yoko Guruma · Uki Waza'
      ]
    },
    {
      title_en: 'Forms of Grappling', title_romaji: 'Katame-no-Kata', title_kanji: '固の形',
      belt_requirement: 'black', category: 'kata', sub_category: 'Kata',
      is_kata: true, is_theory: false,
      description: 'A formal demonstration of 15 groundwork techniques organized into 3 groups: pins, chokes, and armlocks. Performed in pairs with precise transitions and form.',
      kata_forms: [
        'Osaekomi-waza (Holding Techniques): Kesa Gatame · Kata Gatame · Kami Shiho Gatame · Yoko Shiho Gatame · Kuzure Kami Shiho Gatame',
        'Shime-waza (Strangling Techniques): Kata Juji Jime · Hadaka Jime · Okuri Eri Jime · Kata Ha Jime · Gyaku Juji Jime',
        'Kansetsu-waza (Joint Lock Techniques): Ude Garami · Juji Gatame · Ude Gatame · Hiza Gatame · Ashi Garami'
      ]
    },
    // Knowledge
    {
      title_en: 'Maximum Efficiency', title_romaji: 'Seiryoku Zenyo', title_kanji: '精力善用',
      belt_requirement: 'black', category: 'knowledge', sub_category: 'Maxim',
      is_kata: false, is_theory: true,
      description: 'One of the two core principles of judo, formulated by Jigoro Kano. It means "maximum efficiency with minimum effort", using one\'s physical and mental energy in the most effective way possible.',
      key_points: [
        'Do not resist force with force; redirect and use the opponent\'s energy',
        'Every action in judo should achieve the maximum result with minimal wasted effort',
        'Applies both to physical technique and to mental/moral conduct in life',
        'Underlies why judo throws use kuzushi (off-balance) before the throw, not brute strength',
        'Kano intended this principle to extend beyond judo into all areas of life'
      ]
    },
    {
      title_en: 'Mutual Welfare and Benefit', title_romaji: 'Jita Kyoei', title_kanji: '自他共栄',
      belt_requirement: 'black', category: 'knowledge', sub_category: 'Maxim',
      is_kata: false, is_theory: true,
      description: 'The second core principle of judo: "self and others, together flourishing." Judo practice should benefit both participants, the community, and society.',
      key_points: [
        'Training partners help each other improve, judo cannot be practised alone',
        'Winning at the expense of your partner\'s well-being contradicts this principle',
        'Applies to the dojo: care for your partner, teach junior students, maintain the training environment',
        'Kano saw judo as a means of social and moral development, not just sport',
        'Works in tandem with Seiryoku Zenyo: efficiency serves mutual benefit'
      ]
    },
    {
      title_en: 'Etiquette', title_romaji: 'Reigi', title_kanji: '礼儀',
      belt_requirement: 'black', category: 'knowledge', sub_category: 'Etiquette',
      is_kata: false, is_theory: true,
      description: 'Reigi encompasses all forms of etiquette and respectful conduct in judo, from bowing to mat care to treating opponents and sensei with respect.',
      key_points: [
        'Rei (礼) = bow: bow when entering/leaving the dojo, at the start and end of every match or practice',
        'Ritsurei = standing bow; Zarei = kneeling bow (used in formal opening/closing)',
        'Bow to opponents before and after every practice match (randori) or competition bout',
        'Remove shoes before entering the mat; keep the dojo clean',
        'Address instructors as "Sensei" and senior belts with appropriate respect'
      ]
    },
    {
      title_en: 'History of Judo, Jigoro Kano', title_romaji: 'Jigoro Kano', title_kanji: '嘉納治五郎',
      belt_requirement: 'black', category: 'knowledge', sub_category: 'History',
      is_kata: false, is_theory: true,
      description: 'The founder of judo. Kano synthesized multiple schools of jujutsu into a unified system and established judo as a modern martial art and educational practice.',
      key_points: [
        'Born: October 28, 1860 in Mikage, Japan. Died: May 4, 1938.',
        'Founded judo in 1882 at the Eishoji temple in Tokyo',
        'Drew primarily from Tenjin Shin\'yo-ryu and Kito-ryu jujutsu',
        'First Japanese member of the International Olympic Committee (IOC), elected 1909',
        'Toured the world to promote judo and international physical education',
        'His goal was to use judo to cultivate character, not merely physical strength'
      ]
    },
    {
      title_en: 'History of Judo, Kodokan', title_romaji: 'Kodokan', title_kanji: '講道館',
      belt_requirement: 'black', category: 'knowledge', sub_category: 'History',
      is_kata: false, is_theory: true,
      description: 'The headquarters and governing organization of judo, founded by Jigoro Kano in 1882. "Kodokan" translates as "a place to study the way."',
      key_points: [
        'Founded in 1882 in a small room at Eishoji Buddhist temple in Tokyo',
        'Name: Ko (講) = lecture/study; Do (道) = way/path; Kan (館) = hall/building',
        'Established the dan/kyu ranking system still used worldwide',
        'Developed and maintains the official classification of judo techniques (Gokyo no Waza)',
        'Located in Bunkyo, Tokyo; current facility opened in 1984',
        'Recognized as the international authority on judo technique and kata'
      ]
    },
    {
      title_en: 'Scoring, Full Point / Half Point', title_romaji: 'Ippon / Waza-ari', title_kanji: '一本 / 技有',
      belt_requirement: 'black', category: 'knowledge', sub_category: 'Rules',
      is_kata: false, is_theory: true,
      description: 'The two scoring values in judo. Ippon ends the match immediately; two Waza-ari equal one Ippon.',
      key_points: [
        'Ippon (一本): full point, match ends immediately. Awarded for: throw with speed, power, and largely on the back; pin for 20 seconds; tap-out from choke or armlock',
        'Waza-ari (技有): half point. Awarded for: throw that meets most but not all Ippon criteria; pin held for 10–19 seconds',
        'Two Waza-ari = Ippon (Waza-ari awasete Ippon)',
        'In competition: the player ahead in Waza-ari at time wins; ties go to Golden Score (sudden death)',
        'Yuko (advantage) was abolished in 2010, only Ippon and Waza-ari now count'
      ]
    },
    {
      title_en: 'Penalties, Minor / Major', title_romaji: 'Shido / Hansoku-make', title_kanji: '指導 / 反則負',
      belt_requirement: 'black', category: 'knowledge', sub_category: 'Rules',
      is_kata: false, is_theory: true,
      description: 'The two penalty levels in judo. Shido is a minor infraction; three Shido equal Hansoku-make. Hansoku-make results in immediate disqualification.',
      key_points: [
        'Shido (指導): minor infraction, awarded for stalling, defensive posture, going out of bounds, false attacks, etc.',
        'Three Shido = Hansoku-make: the opponent wins immediately',
        'Hansoku-make (反則負): major infraction, direct disqualification. Given for dangerous techniques, deliberate harm, or three accumulated Shido',
        'Direct Hansoku-make (no Shido required) for: head-dive throws, leg grabs (since 2010 rule change), dangerous holds',
        'Shido count against the penalized player; opponent does not receive a score'
      ]
    },
  ];

  ngOnInit(): void {
    this.filteredTechniques = [...this.activeTechniques];
  }

  get hasActiveFilters(): boolean {
    return this.searchQuery.trim() !== ''
      || (this.showBeltFilter && this.selectedBelt !== 'all')
      || this.selectedCategory !== 'all';
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedBelt = 'all';
    this.selectedCategory = 'all';
    this.filter();
  }

  private fuzzyMatch(query: string, text: string): boolean {
    let qi = 0;
    for (let i = 0; i < text.length && qi < query.length; i++) {
      if (text[i] === query[qi]) qi++;
    }
    return qi === query.length;
  }

  filter(): void {
    const q = this.searchQuery.toLowerCase().trim();
    this.filteredTechniques = this.activeTechniques.filter(t => {
      const matchesSearch = !q
        || this.fuzzyMatch(q, t.title_en.toLowerCase())
        || this.fuzzyMatch(q, t.title_romaji.toLowerCase())
        || t.title_kanji.includes(q);
      const matchesBelt = this.selectedBelt === 'all' || !t.belt_requirement || t.belt_requirement === this.selectedBelt;
      const matchesCategory = this.selectedCategory === 'all' || t.category === this.selectedCategory;
      return matchesSearch && matchesBelt && matchesCategory;
    });
  }

  openModal(t: JudoTechnique): void {
    this.selectedTechnique = t;
    this.modalVideoPlaying = false;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.selectedTechnique = null;
    this.modalVideoPlaying = false;
    document.body.style.overflow = '';
  }

  playCard(youtubeId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.playingCardId = youtubeId;
  }

  toggleBookmark(t: JudoTechnique, event: MouseEvent): void {
    event.stopPropagation();
    const key = t.title_romaji;
    if (this.bookmarked.has(key)) {
      this.bookmarked.delete(key);
    } else {
      this.bookmarked.add(key);
    }
  }

  isBookmarked(t: JudoTechnique): boolean {
    return this.bookmarked.has(t.title_romaji);
  }

  // ── Flashcard methods ─────────────────────────────────────────────
  startStudy(): void {
    const all = [...this.techniques, ...this.kodokanTechniques, ...this.uoftTechniques];
    const deck = all.filter(t => this.bookmarked.has(t.title_romaji));
    // Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    this.studyDeck = deck;
    this.deckIndex = 0;
    this.cardFlipped = false;
    this.studyMode = true;
    document.body.style.overflow = 'hidden';
  }

  exitStudy(): void {
    this.studyMode = false;
    document.body.style.overflow = '';
  }

  flipCard(): void {
    if (this.didSwipe) { this.didSwipe = false; return; }
    this.cardFlipped = !this.cardFlipped;
  }

  nextCard(): void {
    if (this.deckIndex < this.studyDeck.length - 1) {
      this.deckIndex++;
      this.cardFlipped = false;
      this.studyVideoPlaying = false;
    }
  }

  prevCard(): void {
    if (this.deckIndex > 0) {
      this.deckIndex--;
      this.cardFlipped = false;
      this.studyVideoPlaying = false;
    }
  }

  onTouchStart(e: TouchEvent): void {
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
    this.didSwipe = false;
  }

  onTouchEnd(e: TouchEvent): void {
    const dx = e.changedTouches[0].clientX - this.touchStartX;
    const dy = Math.abs(e.changedTouches[0].clientY - this.touchStartY);
    if (Math.abs(dx) > 50 && dy < 80) {
      this.didSwipe = true;
      if (dx < 0) this.nextCard();
      else this.prevCard();
    }
  }
}
