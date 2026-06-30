interface TimelineEntry {
  year: string;
  console: string;
  caseFormat: string;
  detail: string;
  imgSrc: string;
  imgAlt: string;
}

const PS_TIMELINE: TimelineEntry[] = [
  {
    year: "1994",
    console: "PlayStation 1",
    caseFormat: "Long Box / Jewel Case",
    imgSrc:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/44/Crash_Bandicoot_Cover.png/250px-Crash_Bandicoot_Cover.png",
    imgAlt: "Crash Bandicoot PS1 case",
    detail:
      'Early PS1 releases in Japan and North America came in a tall cardboard "long box" similar to a PC game case. Sony later standardized on a compact black jewel case (142 x 125 mm) with a distinctive black tray, which became the recognizable PS1 format for most of the library.',
  },
  {
    year: "2000",
    console: "PlayStation 2",
    caseFormat: "DVD Amaray Case",
    imgSrc:
      "https://upload.wikimedia.org/wikipedia/en/thumb/f/f8/Shadow_of_the_Colossus_%282005%29_cover.jpg/250px-Shadow_of_the_Colossus_%282005%29_cover.jpg",
    imgAlt: "Shadow of the Colossus PS2 case",
    detail:
      "PS2 used the standard DVD keep-case (190 x 135 mm, 14 mm spine), identical to movie DVD packaging. It was the first time PlayStation shared a format with another medium, keeping replacement cases cheap and universally available.",
  },
  {
    year: "2006",
    console: "PlayStation 3",
    caseFormat: "Blu-ray Case",
    imgSrc:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/46/Video_Game_Cover_-_The_Last_of_Us.jpg/250px-Video_Game_Cover_-_The_Last_of_Us.jpg",
    imgAlt: "The Last of Us PS3 case",
    detail:
      'The Blu-ray case (171 x 135 mm, 14 mm spine) is shorter than the PS2 DVD case but the same width. PS3 cases were transparent with a solid black header strip at the top bearing the "PlayStation 3" logo in white. This became the Blu-ray standard Sony carried into PS4 and PS5.',
  },
  {
    year: "2013",
    console: "PlayStation 4",
    caseFormat: "Blu-ray Case (PS4 branding)",
    imgSrc:
      "https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/God_of_War_4_cover.jpg/250px-God_of_War_4_cover.jpg",
    imgAlt: "God of War PS4 case",
    detail:
      'Same Blu-ray case dimensions as PS3 (171 x 135 mm, 14 mm spine). The black header changed to a vivid blue gradient with bolder "PlayStation 4" typography, immediately distinguishing the generation on retail shelves.',
  },
  {
    year: "2020",
    console: "PlayStation 5",
    caseFormat: "Blu-ray Case (PS5 branding)",
    imgSrc:
      "https://upload.wikimedia.org/wikipedia/en/thumb/0/0f/SpiderMan2PS5BoxArt.jpeg/250px-SpiderMan2PS5BoxArt.jpeg",
    imgAlt: "Marvel's Spider-Man 2 PS5 case",
    detail:
      "PS5 uses the same Blu-ray case as PS3 and PS4 (171 x 135 mm, 14 mm spine). The header shifted from PS4's blue gradient to a white panel with the PS5 logo and a thin blue accent line, a minimal look that contrasted sharply with the colorful PS4 era.",
  },
];

const NINTENDO_TIMELINE: TimelineEntry[] = [
  {
    year: "1985",
    console: "NES / Famicom",
    caseFormat: "Cardboard Box (cartridge)",
    imgSrc:
      "https://upload.wikimedia.org/wikipedia/en/0/03/Super_Mario_Bros._box.png",
    imgAlt: "Super Mario Bros NES box",
    detail:
      "NES cartridges came in printed cardboard boxes featuring a black bar at the top with the Nintendo logo. No standardized plastic case existed; the original box was the only packaging, making complete-in-box copies prized by collectors.",
  },
  {
    year: "1996",
    console: "Nintendo 64",
    caseFormat: "Cardboard Box (cartridge)",
    imgSrc:
      "https://upload.wikimedia.org/wikipedia/en/thumb/e/e9/Super_Mario_64.png/250px-Super_Mario_64.png",
    imgAlt: "Super Mario 64 N64 box",
    detail:
      "Like the NES, N64 games came in printed cardboard boxes. Nintendo used color-coded cartridges across the library (gray for most titles, with regional and special variants) rather than a standardized case, giving the library a varied look.",
  },
  {
    year: "2001",
    console: "GameCube",
    caseFormat: "miniDVD Keep Case",
    imgSrc:
      "https://upload.wikimedia.org/wikipedia/en/thumb/7/75/Super_Smash_Bros_Melee_box_art.png/250px-Super_Smash_Bros_Melee_box_art.png",
    imgAlt: "Super Smash Bros Melee GameCube case",
    detail:
      "Nintendo's first disc-based console used a proprietary miniDVD in a compact, rectangular keep case (roughly 149 x 131 mm, 16 mm spine). Noticeably smaller than any DVD case, the GameCube format immediately stood out on retail shelves.",
  },
  {
    year: "2006",
    console: "Wii",
    caseFormat: "DVD-sized Keep Case",
    imgSrc:
      "https://upload.wikimedia.org/wikipedia/en/thumb/7/76/SuperMarioGalaxy.jpg/250px-SuperMarioGalaxy.jpg",
    imgAlt: "Super Mario Galaxy Wii case",
    detail:
      "Wii used the same DVD keep-case format as PS2 (190 x 135 mm, 14 mm spine) but in white with a red header strip showing the Wii and Nintendo logos. The consistent white look gave the Wii library a cohesive shelf presence across thousands of titles.",
  },
  {
    year: "2012",
    console: "Wii U",
    caseFormat: "Blu-ray-sized Keep Case",
    imgSrc:
      "https://upload.wikimedia.org/wikipedia/en/thumb/b/bb/Splatoon.jpg/250px-Splatoon.jpg",
    imgAlt: "Splatoon Wii U case",
    detail:
      "Wii U adopted a Blu-ray-sized case (171 x 135 mm, 14 mm spine) with a blue-and-white header showing the Wii U logo. The smaller footprint than Wii matched the move from DVD-format discs to Nintendo's proprietary optical media.",
  },
  {
    year: "2017",
    console: "Nintendo Switch",
    caseFormat: "Small Cartridge Case",
    imgSrc:
      "https://upload.wikimedia.org/wikipedia/en/thumb/c/c6/The_Legend_of_Zelda_Breath_of_the_Wild.jpg/250px-The_Legend_of_Zelda_Breath_of_the_Wild.jpg",
    imgAlt: "Zelda Breath of the Wild Switch case",
    detail:
      "The Switch returned to cartridges in a small, tall plastic case (102 x 168 mm, 11 mm spine). The red spine bearing the Nintendo Switch logo was a completely new visual format, far smaller than any prior Nintendo disc case.",
  },
  {
    year: "2025",
    console: "Nintendo Switch 2",
    caseFormat: "Small Cartridge Case (updated branding)",
    imgSrc:
      "https://upload.wikimedia.org/wikipedia/en/thumb/6/65/Mario_Kart_World_Cover_Artwork.png/250px-Mario_Kart_World_Cover_Artwork.png",
    imgAlt: "Mario Kart World Switch 2 case",
    detail:
      'Switch 2 uses the same cartridge case dimensions as the original Switch. The updated header and spine carry the Nintendo Switch 2 logo with a prominent "2," linking the two generations while clearly marking the new platform.',
  },
];

function TimelineSection({
  brand,
  accent,
  entries,
}: {
  brand: string;
  accent: string;
  entries: TimelineEntry[];
}) {
  return (
    <div className="hist-brand-section">
      <h2 className="hist-brand-heading" style={{ color: accent }}>
        {brand}
      </h2>
      <div className="hist-timeline">
        {entries.map((e) => (
          <div className="hist-entry" key={e.year}>
            <div className="hist-year-col">
              <div className="hist-year-badge" style={{ background: accent }}>
                {e.year}
              </div>
              <div className="hist-connector" />
            </div>
            <div className="hist-card">
              <div className="hist-card-inner">
                <div className="hist-card-thumb">
                  <img
                    src={e.imgSrc}
                    alt={e.imgAlt}
                    className="hist-case-img"
                    loading="lazy"
                    onError={(ev) => {
                      (ev.target as HTMLImageElement).style.visibility =
                        "hidden";
                    }}
                  />
                </div>
                <div className="hist-card-body">
                  <div className="hist-card-title">{e.console}</div>
                  <div className="hist-card-format" style={{ color: accent }}>
                    {e.caseFormat}
                  </div>
                  <p className="hist-card-detail">{e.detail}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HistoryView() {
  return (
    <div className="history-view">
      <TimelineSection
        brand="PlayStation"
        accent="#003087"
        entries={PS_TIMELINE}
      />
      <TimelineSection
        brand="Nintendo"
        accent="#e4000f"
        entries={NINTENDO_TIMELINE}
      />
    </div>
  );
}
