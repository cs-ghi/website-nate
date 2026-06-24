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

## 4. Phase 2: In-Session Flashcard System

Once the core directory is built, Phase 2 will introduce the active study tool.

### 4.1. Flashcard Deck Builder
*   Users will build their deck via **Option A**: clicking a checkbox/bookmark icon on individual technique cards in the main view.
*   A floating action button (FAB) or sticky footer will appear at the bottom of the screen: *"Study X Selected Techniques"*.

### 4.2. Study Mode UX (Touch Optimized)
*   Tapping the "Study" button triggers a full-screen, distraction-free overlay within the same browser tab.
*   **The Card Front:** Displays a prompt. This could be randomized (e.g., showing the video and asking for the name, or showing the English name and asking for the Japanese name).
*   **Gestures:**
    *   **Tap:** Flips the card over to reveal the answer, detailed notes, and the official link.
    *   **Swipe Left:** Move to the next card.
    *   **Swipe Right:** Move to the previous card.
*   **Session End:** Closing the overlay or refreshing the page clears the selected deck, acting as a true "in-session" temporary tool.

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


