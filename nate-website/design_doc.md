# Product & UX Design Document: Comprehensive Judo Study Hub

## 1. Overview & Objectives
A responsive, web application designed to be the ultimate companion for Judokas studying for grading, from White Belt up to Black Belt (Dan grades). The tool is designed to be highly functional on a smartphone while on the dojo mat, and equally useful on a laptop for deep studying at home. 

## 2. Comprehensive Judo Syllabus Scope
To ensure a Judoka is fully prepared for any grading (specifically targeting the **Judo Canada / Judo Ontario syllabus**), the platform must categorize and filter far beyond just throws and locks. 

The application will encompass the following main categories and sub-categories:

*   **Tachi-waza (Standing Techniques)**
    *   *Nage-waza (Throws):* Te-waza (Hand), Koshi-waza (Hip), Ashi-waza (Foot/Leg), Ma-sutemi-waza (Rear sacrifice), Yoko-sutemi-waza (Side sacrifice).
*   **Ne-waza (Ground Techniques)**
    *   *Katame-waza (Grappling):* Osaekomi-waza (Pins/Hold-downs), Shime-waza (Chokes/Strangles), Kansetsu-waza (Joint locks).
*   **Kiso (Fundamentals & Basics)**
    *   *Ukemi:* Breakfalls (Mae, Ushiro, Yoko, Mae-mawari).
    *   *Kumikata:* Gripping strategies and standard grips.
    *   *Taisabaki:* Body movement/footwork.
*   **Kata (Forms)**
    *   Structured sets required for higher belts (e.g., Nage-no-Kata for Black Belt, Katame-no-Kata).
*   **Knowledge, Principles & Ethics ("The Moral Stuff")**
    *   *Maxims:* Seiryoku Zenyo (Maximum Efficiency), Jita Kyoei (Mutual Welfare and Benefit).
    *   *Terminology & Etiquette:* Reigi (Bowing/Respect), Dojo rules.
    *   *History:* Jigoro Kano, Kodokan history.
    *   *Refereeing/Competition:* Scoring (Ippon, Waza-ari) and Penalties (Shido, Hansoku-make).

## 3. Core Features (Phase 1)

### 3.1. Syllabus/System Selector
*   **UI Element:** A dropdown at the top of the page.
*   **Functionality:** Defaults to **"Judo Canada Syllabus"**. 
*   **Future-proofing:** The UI will display this prominently to allow for future expansion (e.g., USJA, British Judo), with other systems perhaps greyed out and labeled "Coming Soon".

### 3.2. Tri-lingual Universal Search
*   The search bar will act as an omni-search. Users can type in:
    *   **English:** e.g., "Major Outer Reaping"
    *   **Romaji (Japanese in English letters):** e.g., "Osoto Gari"
    *   **Kanji (Japanese characters):** e.g., "大外刈"
*   The search engine will query all three data fields simultaneously.

### 3.3. Advanced Filtering System
*   **Belt Filter:** White, Yellow, Orange, Green, Blue, Brown, Black (1st Dan +). *(Note: Judo Canada also has half-belts for juniors, but standard senior Kyu grades will be the primary filter).*
*   **Category Filter:** Using the comprehensive hierarchy defined in Section 2 (Fundamentals, Standing, Ground, Kata, Knowledge).

### 3.4. Technique Cards & Media Handling
*   **Media Strategy:** 
    *   **Images:** Hosted externally (via URLs) to keep the repository lightweight.
    *   **Videos:** Embedded YouTube players.
*   **Card Layout (Mobile-Optimized):**
    *   Prominent YouTube play button thumbnail.
    *   Clear title displaying Romaji, Kanji, and English.
    *   Badges for Belt Level (colored appropriately) and Technique Category.
    *   An "Official Link" icon taking them to the Kodokan or Judo Canada official reference.
    *   A custom checkbox or bookmark icon: *"Add to Flashcard Deck"*.

### 3.5. Mobile UX (Dojo Mode)
*   **Touch Targets:** All buttons (play video, view details, select for flashcards) must be large enough for sweaty fingers on a mat.
*   **Dark Mode Support:** Highly recommended to save battery and reduce glare under bright dojo lights.
*   **Layout:** Single-column scrolling list on mobile, expanding to a dense multi-column masonry/grid layout on desktop.

---

## 4. Phase 2: Flashcard System (built)

The code is in `src/app/components/judo/flashcards/`. The session rules are plain functions in `study-session.ts`, with unit tests.

### 4.1. Choosing cards
*   **Study what is shown:** the directory filters (syllabus, belt, category, search) already pick a set, and the deck bar offers to study it.
*   **Build a deck:** the bookmark on each card toggles it in the deck, and "Add N to deck" takes everything the filters show. The deck is saved in the browser (`localStorage`) and survives reloads. A technique is one deck entry however each syllabus spells it.
*   A sticky deck bar at the bottom opens a setup sheet (a bottom sheet on phones): deck or shown cards, which card fronts, and the mode. The sheet remembers the last choices.

### 4.2. What is on a card
*   The front is one of **Video**, **Japanese** (romaji), **English** or **Kanji**. Several can be chosen, and each card picks one at random. The back always shows everything: names, belt, video, description, key points.
*   The video front gives nothing away. It starts after the title card (the Kodokan videos open with the technique's name), loops before the end screen, is muted, crops YouTube's title bar, and covers the name caption printed in the corner.
*   Cards without a video fall back to the Japanese name. Techniques that share a video list each other as right answers.

### 4.3. Session
*   **Graded:** one pass, then a score and the list of misses. "Review missed" runs a round of just those.
*   **Until mastered:** a missed card comes back three cards later. A right one goes to the back of the queue until it has been answered right N times (N from 1 to 10, default 1). A miss does not reset the count.
*   **Controls:** tap or Space shows the answer. Then Got it (→, l, swipe right) or Missed (←, h, swipe left). Z undoes the last answer, Esc exits.

---

## 5. Conceptual Data Structure (Vague Technical Guidance)
While you will handle the specific implementation (e.g., JSON vs. Typescript classes), ensure your data models account for:
*   `title_en`, `title_romaji`, `title_kanji`
*   `belt_requirement` (Enum/ID mapping to Judo Canada ranks)
*   `category` and `sub_category` (e.g., "Ne-waza" -> "Shime-waza")
*   `media_type` (Image, YouTube embed link)
*   `is_kata` (Boolean)
*   `is_theory` (Boolean - to flag history/ethics entries which may not have videos)

This structure ensures that as you build the application, the foundation is solid enough to support every single requirement for a Judoka preparing for their Black Belt test in Canada.


