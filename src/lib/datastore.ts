import { supabase, isSupabaseEnabled } from "./supabase";
import { EventType } from "@/pages/Events";
import { Member } from "@/pages/Team";

// ─── Slug helper — hoisted so it can be used anywhere in this file ────────────
const toSlug = (str: string) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// ─── Cache version — bump this any time you change the default data ────────────
const CACHE_VERSION = "v5_respect_cards";

// On startup: clear any old-format caches that don't match the current version
const storedCacheVersion = localStorage.getItem("ignitia_cache_version");
if (storedCacheVersion !== CACHE_VERSION) {
  localStorage.removeItem("ignitia_events");
  localStorage.removeItem("ignitia_sponsors");
  localStorage.removeItem("ignitia_team");
  localStorage.removeItem("ignitia_gallery");
  localStorage.removeItem("ignitia_team_sections");
  localStorage.removeItem("ignitia_sponsor_categories");
  localStorage.setItem("ignitia_cache_version", CACHE_VERSION);
}

// ─── Default backups ──────────────────────────────────────────────────────────

const defaultEventsBackups: EventType[] = [
  {
    id: "ignisys",
    icon: "Zap",
    title: "IGNISYS",
    category: "TECHNICAL",
    prize: "₹30,000",
    teamSize: "1-4",
    teamSizeLabel: "TEAM SIZE",
    duration: "24 Hours",
    day: "Aug 1 & 2",
    entryFee: "Free",
    theme: "orange",
    rulebookUrl: "https://drive.google.com/file/d/1x0szLJB-k8JGOt1MozE0S5vgDmxHTci2/preview",
    registrationUrl: "https://ignisys-ignitia.devfolio.co/",
    isWide: true,
    arrowTop: true,
    isTopEvent: true,
    watermark: "01",
    description: "\"Build it, break it, ship it — real problems, real pressure, real glory.\"",
    overview: "A hybrid hackathon where teams solve real-world problem statements through innovation and collaboration. Online prelims followed by an offline finale before a jury panel.",
    rules: [
      "The hackathon is a 24-hour non-stop building and innovation event.",
      "Teams must consist of a minimum of 1 and a maximum of 4 participants.",
      "Registration is completely free and open to students from any department of any registered college or university.",
      "Inter-college and cross-branch teams are permitted.",
      "A student cannot be a part of more than one team.",
      "Internet usage for research is allowed, but direct plagiarism or copied solutions will result in immediate disqualification."
    ],
    criteria: [
      "Innovation & Originality: How creative and unique is the solution?",
      "Technical Execution: Quality of the code structure, functional prototype, and complexity.",
      "Presentation: Pitch effectively to the jury (7-minute presentation + 3-minute Q&A)."
    ],
    contacts: [
      { name: "Rony Roy", phone: "6297403940" },
      { name: "Daliya Paul", phone: "9748753104" }
    ]
  },
  {
    id: "blind-coding",
    icon: "Code",
    title: "Blind Coding",
    category: "TECHNICAL",
    prize: "₹1,500",
    teamSize: "Solo",
    teamSizeLabel: "FORMAT",
    duration: "Offline",
    day: "Aug 1",
    entryFee: "central registration",
    theme: "purple",
    rulebookUrl: "https://drive.google.com/file/d/1Wm5bkO3E1O1Cjxj4V99rU0eLSNkVCwOb/preview",
    registrationUrl: "https://forms.gle/Qx8e4z2EFhR9o5Gj6",
    watermark: "02",
    description: "\"Code what you can't see — logic is your only lens.\"",
    overview: "A unique individual coding challenge where participants write code without seeing their screen. Tests memory, logic, and structural coding ability under pressure.",
    rules: [
      "This is a strictly individual event — no collaboration is allowed.",
      "The participant's monitor will be turned off or covered during the coding phase.",
      "Participants must write their code based purely on memory and logic.",
      "Internet usage, notes, and external references are strictly prohibited."
    ],
    criteria: [
      "Code correctness and successful execution.",
      "Code efficiency and optimal algorithm choice.",
      "Time taken to complete the challenge."
    ]
  },
  {
    id: "bgmi",
    icon: "Gamepad2",
    title: "BGMI Tournament",
    category: "GAMING",
    prize: "₹5,000",
    teamSize: "4",
    teamSizeLabel: "SQUAD",
    duration: "Online",
    day: "Jul 20 - Aug 2",
    entryFee: "₹100 / team",
    theme: "purple",
    rulebookUrl: "https://drive.google.com/file/d/1lA4htUFm8YPsYaI1Y2LmznmZ9i1W0Kph/preview",
    registrationUrl: "https://forms.gle/pA4p4hHSQnAaJuEf7",
    isWide: true,
    watermark: "03",
    description: "\"Survive, dominate, conquer — the battleground awaits your squad.\"",
    overview: "An intense 4-player squad BGMI tournament featuring multiple rounds of elimination matches culminating in a grand finale for the top squads.",
    rules: [
      "Teams must consist of exactly 4 players.",
      "All players must be registered students.",
      "The use of emulators is strictly prohibited.",
      "All matches will be played on the official tournament server."
    ],
    criteria: [
      "Teams are ranked based on total points — kill points plus placement points.",
      "The squad with the highest total score after all rounds wins."
    ]
  },
  {
    id: "efootball",
    icon: "Gamepad2",
    title: "eFootball",
    category: "GAMING",
    prize: "₹2,000",
    teamSize: "Solo",
    teamSizeLabel: "FORMAT",
    duration: "Offline",
    day: "Aug 1 & 2",
    entryFee: "central registration",
    theme: "purple",
    rulebookUrl: "https://drive.google.com/file/d/1qP0vC3Mh1cPQHH7fvBk3qjN0_y2g0MeP/preview",
    registrationUrl: "https://forms.gle/cQ8pTgYf5S7zVwNA9",
    watermark: "04",
    description: "\"One player, one dream — dominate the virtual pitch.\"",
    overview: "A solo eFootball competition played on PS5 consoles. Participants compete in a bracket format, with the best player taking home the prize.",
    rules: [
      "This is a solo competition — no teams allowed.",
      "Matches will be played on PS5 consoles provided by the organizers.",
      "Participants must follow fair play principles.",
      "Match duration and settings will be announced at the event."
    ],
    criteria: [
      "Standard football match scoring — highest goals win.",
      "In case of a tie, penalty shootout will determine the winner."
    ]
  },
  {
    id: "guess-who",
    icon: "HelpCircle",
    title: "Guess Who",
    category: "NON-TECH",
    prize: "Recognitions",
    teamSize: "Solo",
    teamSizeLabel: "FORMAT",
    duration: "Offline",
    day: "Aug 1",
    entryFee: "central registration",
    theme: "yellow",
    rulebookUrl: "https://drive.google.com/file/d/1YSYJbqhVZ7wjMJgJjKqMQrS_j3GR76rl/preview",
    registrationUrl: "https://forms.gle/ygHrQS7rNjHhpBMMA",
    watermark: "05",
    description: "\"Eyes, smiles, and accessories — Bollywood in a blink.\"",
    overview: "A fast-paced Bollywood celebrity guessing game using zoomed-in visuals of eyes, smiles, hairstyles, and accessories. Quick thinking wins here!",
    rules: [
      "This is an individual event; no teams, collaboration, or discussion is allowed.",
      "Participants must raise their hand or follow the host's instructions, as only the first valid answer will be considered.",
      "No use of mobile phones or internet access is permitted."
    ],
    criteria: [
      "Correct answers earn points.",
      "The participant with the highest score wins.",
      "In the event of a tie, a tie-breaker round will be conducted."
    ]
  },
  {
    id: "quizophonia",
    icon: "Brain",
    title: "Quizophonia",
    category: "NON-TECH",
    prize: "₹1,100",
    teamSize: "1 - 2",
    teamSizeLabel: "TEAM / SOLO",
    duration: "Offline",
    day: "Aug 1",
    entryFee: "₹50 / person",
    theme: "blue",
    rulebookUrl: "https://drive.google.com/file/d/1-h3tIhTGEJRQPEHFksjzG500BSpr6wab/preview",
    registrationUrl: "https://forms.gle/uMaviLsz1iBkQ3G47",
    isWide: true,
    leftPoolLayout: true,
    watermark: "06",
    description: "\"From reel to rocket science — know a little of everything, win it all.\"",
    overview: "A dynamic multi-domain quiz spanning Music, Cinema, Technology, Space, Olympics, Food, Online Trends, and more — open to solo participants and 2-member teams.",
    rules: [
      "Teams can consist of a maximum of 2 members, but individual participation is also allowed.",
      "Participants must carry a valid identity card.",
      "The use of electronic devices like phones, tablets, or smartwatches is strictly prohibited during the quiz."
    ],
    criteria: [
      "Questions will be evaluated based on accuracy and response time.",
      "Teams or participants with the highest scores in the preliminary rounds will qualify for the next round.",
      "A tie-breaker round will be conducted in case of a tie."
    ]
  },
  {
    id: "pixel-prophecy",
    icon: "Palette",
    title: "Pixel Prophecy",
    category: "NON-TECH",
    prize: "Recognitions",
    teamSize: "Solo",
    teamSizeLabel: "FORMAT",
    duration: "Offline (50 mins - 1.5 hrs)",
    day: "Aug 2",
    entryFee: "central registration",
    theme: "pink",
    rulebookUrl: "https://drive.google.com/file/d/1ssMOPgn2USMshSZ7Byw7_b3mpMOQuQW2/preview",
    registrationUrl: "https://forms.gle/8uAevZEg7TrJMnbFA",
    watermark: "07",
    description: "\"One celebrity, infinite frames — design their world in pixels.\"",
    overview: "A celebrity-inspired poster design challenge. Participants draw a celebrity at random and transform their persona into a visually compelling work of art.",
    rules: [
      "This is strictly an individual competition with no pre-designed templates or external work permitted.",
      "Participants must bring their own charged devices (laptop/iPad/tablet) and designing tools.",
      "The rulebook specifies an event duration of 50 minutes, but also notes a total time limit of 1 hour and 30 minutes for submission."
    ],
    criteria: [
      "Shortlisting will be based on creativity and originality.",
      "Judges will look for visual appeal, design quality, and concept storytelling.",
      "The accurate representation of the assigned celebrity's aura is a key evaluation metric."
    ]
  },
  {
    id: "cineverse",
    icon: "Palette",
    title: "Cineverse",
    category: "NON-TECH",
    prize: "₹3,000",
    teamSize: "Any Size",
    teamSizeLabel: "FORMAT",
    duration: "Offline Finals",
    day: "Aug 2",
    entryFee: "₹120 / team",
    theme: "orange",
    rulebookUrl: "https://drive.google.com/file/d/1cgB9s2y6E7ivKWrTNvh7DYowvz7QxoAU/preview",
    registrationUrl: "https://forms.gle/uk5wkzEHTi75Ac359",
    watermark: "08",
    description: "\"Lights, camera, 5 minutes — tell a story the world needs to see.\"",
    overview: "A filmmaking competition celebrating cinematic storytelling. Create an original short film and compete for recognition among fellow aspiring creators.",
    rules: [
      "Teams can consist of any number of members with a flat ₹120 registration fee per team.",
      "The film's duration must be strictly between 4 and 5 minutes.",
      "All participants are required to join the event lobby at least 15 minutes before it starts.",
      "Late submissions will not be considered."
    ],
    criteria: [
      "Shortlisting and evaluation will be based on the film's story, concept, and creativity.",
      "Judges will also score the acting performance and overall presentation/impact."
    ]
  },
  {
    id: "circuit-crawl",
    icon: "Zap",
    title: "Circuit Crawl",
    category: "ROBOTICS",
    prize: "Recognitions",
    teamSize: "Min 5",
    teamSizeLabel: "FORMAT",
    duration: "Offline",
    day: "Aug 1 & 2",
    entryFee: "central registration",
    theme: "purple",
    rulebookUrl: "https://drive.google.com/file/d/1WV0U7e-uMVoG4X5nUR5wMHY_aB06ZwLf/preview",
    registrationUrl: "https://forms.gle/f2hkHxVqczkKmH927",
    watermark: "09",
    description: "\"Navigate every twist without missing a beat — precision is the engine.\"",
    overview: "A robot navigation challenge through twists, turns, and obstacles — testing engineering accuracy, reliability, and strategic race design.",
    rules: [
      "Each team must have a minimum of 5 members.",
      "The robot must be strictly autonomous with no Wi-Fi or Bluetooth communication allowed.",
      "Robot dimensions are restricted to 25 x 25 x 25 cm, and weight must not exceed 1 kg.",
      "Two physical touches are allowed per round; subsequent touches result in a 10-second penalty each."
    ],
    criteria: [
      "Participants are shortlisted in Round 1 based on the completion time of a basic track.",
      "The winner is the team finishing the complex track of Round 2 in the shortest time.",
      "Time bonuses are awarded for checkpoint indications, line inversion indications, and stopping at the end of the track."
    ]
  },
  {
    id: "evadex",
    icon: "Swords",
    title: "Evade-X",
    category: "ROBOTICS",
    prize: "Recognitions",
    teamSize: "2 - 4",
    teamSizeLabel: "FORMAT",
    duration: "Offline",
    day: "Aug 1 & 2",
    entryFee: "central registration",
    theme: "purple",
    rulebookUrl: "https://drive.google.com/file/d/19qHWLouS6_GdrPjQ9205eXye4osJx2T9/preview",
    registrationUrl: "https://forms.gle/t43HNV1NcbjPrnPBA",
    watermark: "10",
    description: "\"Engineer the fastest machine — obstacles are just opportunities in disguise.\"",
    overview: "An obstacle-track robotics challenge where speed, precision, and engineering intelligence determine the victor.",
    rules: [
      "Teams must consist of 2 to 4 participants with a registration fee of ₹120 per team.",
      "Robots must not exceed 25 x 25 x 25 cm dimensions or 3.0 kg in weight (with a 10% tolerance allowed for both).",
      "The machine must be electrically powered with a maximum operating voltage of 16.8 volts; Lego kits and IC engines are prohibited.",
      "Only one driver is permitted per bot during a single event."
    ],
    criteria: [
      "The robot that successfully completes the specified task and track in the least amount of time will be declared the winner."
    ]
  },
  {
    id: "ai-argumentarium",
    icon: "Brain",
    title: "The AI Argumentarium",
    category: "NON-TECH",
    prize: "Recognitions",
    teamSize: "Solo",
    teamSizeLabel: "FORMAT",
    duration: "Offline",
    day: "Aug 2",
    entryFee: "central registration",
    theme: "yellow",
    rulebookUrl: "https://drive.google.com/file/d/1xODG1S779xIJxol8Jbk3Q8wOxFwdI91t/preview",
    registrationUrl: "https://forms.gle/rJ5bxnGSUyPXw6kr5",
    isWide: true,
    leftPoolLayout: true,
    watermark: "11",
    description: "\"The sharpest argument wins — let reason, not rhetoric, rule the floor.\"",
    overview: "An intellectually engaging debate competition celebrating critical thinking, persuasion, and the art of constructing well-reasoned arguments.",
    rules: [
      "The speaking order alternates between FOR and AGAINST the motion.",
      "Preliminary rounds consist of a 2-minute main speech and a 1-minute rebuttal, while final rounds extend the main speech to 3 minutes.",
      "Prelims motion is released 48 hours prior, and Finals motion is tentatively released 1 hour prior to commencement.",
      "Overreliance on AI-generated content or plagiarism is prohibited and may result in disqualification."
    ],
    criteria: [
      "Marking and qualification will be assessed based on individual performances.",
      "The top 30% of speakers from each stance (FOR and AGAINST) will qualify for the Finals based on their individual scores."
    ]
  },
  {
    id: "cultural-program",
    icon: "Sparkles",
    title: "Cultural Program",
    category: "NON-TECH",
    prize: "TBD",
    teamSize: "TBA",
    teamSizeLabel: "FORMAT",
    duration: "TBA",
    day: "TBA",
    entryFee: "TBD",
    theme: "pink",
    rulebookUrl: "",
    watermark: "12",
    description: "\"Take the stage — your talent is the only ticket you need.\"",
    overview: "A stage for performers to showcase their artistic talents in a celebration of youth, energy, and creativity.",
    rules: ["Rulebook coming soon."],
    criteria: ["Criteria to be announced."]
  }
];

const defaultSponsorsBackups = [
  { name: "Crelynex", logo: "/sponsors/CrelyneX.jpg", category: "gold" },
  { name: "Microsoft Student Society UEMK", logo: "/sponsors/MSS.jpeg", category: "gold" },
  { name: "Robo Mellotikos", logo: "/sponsors/robo_mellontikos.jpeg", category: "silver" },
  { name: "GDG UEMK", logo: "/sponsors/GDG.jpeg", category: "silver" },
  { name: "GFG UEMK", logo: "/sponsors/Gfg.jpg", category: "silver" },
  { name: "Diversion", logo: "/sponsors/Diversion.png", category: "silver" },
  { name: "UGG UEMK", logo: "/sponsors/UGG.jpg", category: "bronze" },
  { name: "DS UEMK", logo: "/sponsors/Dsu.png", category: "bronze" },
  { name: "Rangrez", logo: "/sponsors/Rangrez.jpeg", category: "bronze" },
  { name: "Innofusion", logo: "/sponsors/Innofusion_updated.jpg", category: "bronze" },
  { name: "Microsoft Student Society UEMK", logo: "/sponsors/MSS.jpeg", category: "hosting" },
  { name: "Crelynex", logo: "/sponsors/CrelyneX.jpg", category: "hosting" },
  { name: "Devfolio", logo: "/sponsors/Devfolio_Logo-Colored.png", category: "community" },
  { name: "Unstop", logo: "/sponsors/unstop.png", category: "community" },
  { name: "Hack2skills", logo: "/sponsors/hack2skill.jpeg", category: "community" },
  { name: "Go Daddy", logo: "/sponsors/GoDaddy.jpg", category: "community" },
  { name: "Oratoria", logo: "/sponsors/Oratoria.jpg", category: "ongoing" },
  { name: "Technologia", logo: "/sponsors/technologia.jpeg", category: "ongoing" },
  { name: "Symphony", logo: "/sponsors/Symphony.jpg", category: "ongoing" },
  { name: "Pragya", logo: "/sponsors/Pragya.jpg", category: "ongoing" },
  { name: "Driveblaze", logo: "/sponsors/Driveblaze.jpg", category: "ongoing" },
];

const defaultTeamBackups: (Member & { section: "leads" | "organizers" | "core" | "domain" })[] = [
  {
    name: "Snehashish Das",
    role: "Lead Organizer",
    initials: "SD",
    linkedin: "#",
    instagram: "#",
    department: "Leadership",
    bio: "Visionary leader driving IGNITIA '26 towards innovation and excellence.",
    expertise: ["Event Strategy", "Team Management", "Vision Setting"],
    section: "leads"
  },
  {
    name: "Priyanshu Mitra",
    role: "Co-lead Organizer",
    initials: "PM",
    linkedin: "#",
    instagram: "#",
    department: "Leadership",
    bio: "Steering global event structures and core alignments for IGNITIA '26.",
    expertise: ["Operations", "Strategic Planning", "Public Relations"],
    section: "leads"
  },
  {
    name: "Aranya Rath",
    role: "Organizer",
    initials: "AR",
    linkedin: "#",
    instagram: "#",
    department: "Event Operations",
    bio: "Orchestrating seamless event experiences with meticulous planning and creative execution.",
    expertise: ["Event Coordination", "Logistics", "Creative Planning"],
    section: "organizers"
  },
  {
    name: "Soumalika Chakraborty",
    role: "Organizer",
    initials: "SC",
    linkedin: "#",
    instagram: "#",
    department: "Event Operations",
    bio: "Bringing ideas to life through strategic planning and innovative execution.",
    expertise: ["Stakeholder Management", "Resource Planning", "Timeline Management"],
    section: "organizers"
  },
  {
    name: "Anamika Mallick",
    role: "Core",
    initials: "AM",
    linkedin: "#",
    instagram: "#",
    department: "Core Operations",
    bio: "Driving core operational excellence and team coordination.",
    expertise: ["Coordination", "Process Management", "Leadership"],
    section: "core"
  },
  {
    name: "Anjanika Paul",
    role: "Core",
    initials: "AP",
    linkedin: "#",
    instagram: "#",
    department: "Core Operations",
    bio: "Strategic planning and process optimization.",
    expertise: ["Strategy", "Process Optimization", "Planning"],
    section: "core"
  },
  {
    name: "Soham Ray",
    role: "Core",
    initials: "SR",
    linkedin: "#",
    instagram: "#",
    department: "Core Operations",
    bio: "Converting ideas into actionable plans and execution.",
    expertise: ["Execution", "Implementation", "Timeline Management"],
    section: "core"
  },
  {
    name: "Subhamita Adhikari",
    role: "Core",
    initials: "SA",
    linkedin: "#",
    instagram: "#",
    department: "Core Operations",
    bio: "Ensuring seamless communication and task execution.",
    expertise: ["Communication", "Task Management", "Documentation"],
    section: "core"
  },
];

// ─── Gallery default backups — intentionally empty.
// Real gallery images are uploaded by the admin via the dashboard.
// This prevents placeholder images from being seeded into the production database.
const defaultGalleryBackups: any[] = [];

// ─── Image Uploader Helper ────────────────────────────────────────────────────
export const uploadImageFile = async (file: File, folder: string): Promise<string> => {
  const convertToBase64 = (f: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(f);
    });
  };

  if (isSupabaseEnabled && supabase) {
    try {
      const cleanName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      const filePath = `${folder}/${cleanName}`;

      const { error } = await supabase.storage
        .from("ignitia")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from("ignitia")
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (e) {
      console.warn("Supabase Storage upload failed. Using Base64 fallback...", e);
      return await convertToBase64(file);
    }
  } else {
    return await convertToBase64(file);
  }
};

// Helper functions to map camelCase key objects to snake_case column names and vice versa
const camelToSnake = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
const snakeToCamel = (str: string) => str.replace(/(_\w)/g, match => match[1].toUpperCase());

const toSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(v => toSnakeCase(v));
  } else if (obj !== null && obj !== undefined && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = camelToSnake(key);
      result[snakeKey] = toSnakeCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
};

const toCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(v => toCamelCase(v));
  } else if (obj !== null && obj !== undefined && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = snakeToCamel(key);
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
};

// ─── Default Sponsor Categories and Team Sections Backups ──────────────────────
const defaultSponsorCategories = [
  { key: "gold", title: "Gold Sponsors", accent: "from-amber-500 to-yellow-400" },
  { key: "silver", title: "Silver Sponsors", accent: "from-slate-400 to-slate-500" },
  { key: "bronze", title: "Bronze Sponsors", accent: "from-orange-600 to-orange-800" },
  { key: "hosting", title: "Hosting Partner", accent: "from-blue-500 to-orange-400" },
  { key: "community", title: "Community Partner", accent: "from-violet-500 to-purple-400" },
  { key: "ongoing", title: "Ongoing Sponsors", accent: "from-pink-500 to-rose-400" }
];

const defaultTeamSections = [
  { key: "leads", title: "Lead Organizers", theme: "red", colorHsl: "15 100% 55%" },
  { key: "organizers", title: "Organizers", theme: "orange", colorHsl: "32 100% 50%" },
  { key: "core", title: "Cores", theme: "blue", colorHsl: "210 100% 60%" },
  { key: "domain", title: "Domain Leads", theme: "purple", colorHsl: "275 80% 60%" }
];

export const getSponsorCategories = async (): Promise<{ key: string; title: string; accent?: string; priority?: number }[]> => {
  if (isSupabaseEnabled && supabase) {
    try {
      const { data, error } = await supabase
        .from("sponsor_categories")
        .select("*")
        .order("priority", { ascending: true });
      if (!error && data && data.length > 0) {
        localStorage.setItem("ignitia_sponsor_categories", JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn("Supabase error reading sponsor_categories, using cache fallback...", e);
    }
  }
  const cached = localStorage.getItem("ignitia_sponsor_categories");
  const parsed = cached ? JSON.parse(cached) : defaultSponsorCategories;
  return parsed.sort((a: any, b: any) => (a.priority ?? 0) - (b.priority ?? 0));
};

export const saveSponsorCategory = async (cat: { key: string; title: string; accent?: string; priority?: number }) => {
  const categories = await getSponsorCategories();
  const idx = categories.findIndex(c => c.key === cat.key);
  if (idx !== -1) categories[idx] = cat;
  else categories.push(cat);

  categories.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
  localStorage.setItem("ignitia_sponsor_categories", JSON.stringify(categories));

  if (isSupabaseEnabled && supabase) {
    try {
      const { error } = await supabase.from("sponsor_categories").upsert(cat);
      if (error) throw error;
    } catch (e) {
      console.warn("Supabase error saving sponsor_category:", e);
    }
  }
};

export const deleteSponsorCategory = async (key: string) => {
  const categories = await getSponsorCategories();
  const filtered = categories.filter(c => c.key !== key);
  localStorage.setItem("ignitia_sponsor_categories", JSON.stringify(filtered));

  if (isSupabaseEnabled && supabase) {
    try {
      const { error } = await supabase.from("sponsor_categories").delete().eq("key", key);
      if (error) throw error;
    } catch (e) {
      console.warn("Supabase error deleting sponsor_category:", e);
    }
  }
};

export const getTeamSections = async (): Promise<{ key: string; title: string; theme?: string; colorHsl?: string; priority?: number }[]> => {
  if (isSupabaseEnabled && supabase) {
    try {
      const { data, error } = await supabase
        .from("team_sections")
        .select("*")
        .order("priority", { ascending: true });
      if (!error && data && data.length > 0) {
        const mapped = data.map((d: any) => ({
          key: d.key,
          title: d.title,
          theme: d.theme,
          colorHsl: d.color_hsl || d.colorHsl,
          priority: d.priority ?? 0,
        }));
        localStorage.setItem("ignitia_team_sections", JSON.stringify(mapped));
        return mapped;
      }
    } catch (e) {
      console.warn("Supabase error reading team_sections, using cache fallback...", e);
    }
  }
  const cached = localStorage.getItem("ignitia_team_sections");
  const parsed = cached ? JSON.parse(cached) : defaultTeamSections;
  return parsed.sort((a: any, b: any) => (a.priority ?? 0) - (b.priority ?? 0));
};

export const saveTeamSection = async (sec: { key: string; title: string; theme?: string; colorHsl?: string; priority?: number }) => {
  const sections = await getTeamSections();
  const idx = sections.findIndex(s => s.key === sec.key);
  if (idx !== -1) sections[idx] = sec;
  else sections.push(sec);

  sections.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
  localStorage.setItem("ignitia_team_sections", JSON.stringify(sections));

  if (isSupabaseEnabled && supabase) {
    try {
      const payload = {
        key: sec.key,
        title: sec.title,
        theme: sec.theme,
        color_hsl: sec.colorHsl,
        priority: sec.priority ?? 0,
      };
      const { error } = await supabase.from("team_sections").upsert(payload);
      if (error) throw error;
    } catch (e) {
      console.warn("Supabase error saving team_section:", e);
    }
  }
};

export const deleteTeamSection = async (key: string) => {
  const sections = await getTeamSections();
  const filtered = sections.filter(s => s.key !== key);
  localStorage.setItem("ignitia_team_sections", JSON.stringify(filtered));

  if (isSupabaseEnabled && supabase) {
    try {
      const { error } = await supabase.from("team_sections").delete().eq("key", key);
      if (error) throw error;
    } catch (e) {
      console.warn("Supabase error deleting team_section:", e);
    }
  }
};

// ─── Events Datastore ──────────────────────────────────────────────────────────
export const getEvents = async (): Promise<EventType[]> => {
  if (isSupabaseEnabled && supabase) {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*");

      if (error) throw error;

      if (data && data.length > 0) {
        const camelData = toCamelCase(data);
        localStorage.setItem("ignitia_events", JSON.stringify(camelData));
        return camelData as EventType[];
      }
    } catch (e) {
      console.warn("Supabase error reading events. Checking cache...", e);
    }
  }
  const cached = localStorage.getItem("ignitia_events");
  if (cached) {
    const parsed: EventType[] = JSON.parse(cached);
    if (parsed.length >= defaultEventsBackups.length) {
      return parsed;
    }
    localStorage.removeItem("ignitia_events");
  }
  return defaultEventsBackups;
};

export const saveEvent = async (event: EventType): Promise<void> => {
  if (isSupabaseEnabled && supabase) {
    const { error } = await supabase
      .from("events")
      .upsert(toSnakeCase(event));
    if (error) throw error;
    await getEvents();
  } else {
    const list = await getEvents();
    const idx = list.findIndex((e) => e.id === event.id);
    if (idx !== -1) list[idx] = event;
    else list.push(event);
    localStorage.setItem("ignitia_events", JSON.stringify(list));
  }
};

export const deleteEvent = async (id: string): Promise<void> => {
  if (isSupabaseEnabled && supabase) {
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id);
    if (error) throw error;
    await getEvents();
  } else {
    const list = await getEvents();
    const filtered = list.filter((e) => e.id !== id);
    localStorage.setItem("ignitia_events", JSON.stringify(filtered));
  }
};

// ─── Sponsors Datastore ────────────────────────────────────────────────────────
export const getSponsors = async () => {
  if (isSupabaseEnabled && supabase) {
    try {
      const { data, error } = await supabase
        .from("sponsors")
        .select("*");
      if (error) throw error;
      if (data && data.length > 0) {
        localStorage.setItem("ignitia_sponsors", JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn("Supabase error reading sponsors. Checking cache...", e);
    }
  }
  const cached = localStorage.getItem("ignitia_sponsors");
  return cached ? JSON.parse(cached) : defaultSponsorsBackups;
};

export const saveSponsor = async (sponsor: { id?: string; name: string; logo: string; category: string }): Promise<void> => {
  const id = sponsor.id || toSlug(`${sponsor.category}-${sponsor.name}`);
  const data = { id, name: sponsor.name, logo: sponsor.logo, category: sponsor.category };
  if (isSupabaseEnabled && supabase) {
    const { error } = await supabase
      .from("sponsors")
      .upsert(data);
    if (error) throw error;
    await getSponsors();
  } else {
    const list = await getSponsors();
    const idx = list.findIndex((s: any) => s.id === id);
    if (idx !== -1) list[idx] = data;
    else list.push(data);
    localStorage.setItem("ignitia_sponsors", JSON.stringify(list));
  }
};

export const updateSponsorCategory = async (id: string, category: string): Promise<void> => {
  if (isSupabaseEnabled && supabase) {
    const { error } = await supabase
      .from("sponsors")
      .update({ category })
      .eq("id", id);
    if (error) throw error;
    await getSponsors();
  } else {
    const list = await getSponsors();
    const idx = list.findIndex((s: any) => s.id === id || (s.name === id && !s.id));
    if (idx !== -1) {
      list[idx].category = category;
      localStorage.setItem("ignitia_sponsors", JSON.stringify(list));
    }
  }
};

export const deleteSponsor = async (id: string): Promise<void> => {
  if (isSupabaseEnabled && supabase) {
    const { error } = await supabase
      .from("sponsors")
      .delete()
      .eq("id", id);
    if (error) throw error;
    await getSponsors();
  } else {
    const list = await getSponsors();
    const filtered = list.filter((s: any) => s.id !== id && s.name !== id);
    localStorage.setItem("ignitia_sponsors", JSON.stringify(filtered));
  }
};

// ─── Team Datastore ────────────────────────────────────────────────────────────
export const getTeam = async (): Promise<(Member & { section: string; id?: string })[]> => {
  if (isSupabaseEnabled && supabase) {
    try {
      const { data, error } = await supabase
        .from("team")
        .select("*");
      if (error) throw error;
      if (data && data.length > 0) {
        const mapped = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          role: d.role,
          initials: d.initials,
          linkedin: d.linkedin,
          instagram: d.instagram,
          department: d.department,
          bio: d.bio,
          expertise: d.expertise,
          photoUrl: d.photo_url,
          section: d.section,
        }));
        localStorage.setItem("ignitia_team", JSON.stringify(mapped));
        return mapped;
      }
    } catch (e) {
      console.warn("Supabase error reading team. Checking cache...", e);
    }
  }
  const cached = localStorage.getItem("ignitia_team");
  return cached ? JSON.parse(cached) : defaultTeamBackups;
};

export const saveTeamMember = async (member: Member & { section: string; id?: string }): Promise<void> => {
  const id = member.id || toSlug(member.name);
  const data = {
    id,
    name: member.name,
    role: member.role || "",
    initials: member.initials || "",
    linkedin: member.linkedin || "",
    instagram: member.instagram || "",
    department: member.department || "",
    bio: member.bio || "",
    expertise: member.expertise || [],
    photo_url: member.photoUrl || "",
    section: member.section,
  };
  if (isSupabaseEnabled && supabase) {
    const { error } = await supabase
      .from("team")
      .upsert(data);
    if (error) throw error;
    await getTeam();
  } else {
    const list = await getTeam();
    const idx = list.findIndex((m: any) => m.id === id);
    const item = {
      id,
      name: member.name,
      role: member.role,
      initials: member.initials,
      linkedin: member.linkedin,
      instagram: member.instagram,
      department: member.department || "",
      bio: member.bio || "",
      expertise: member.expertise || [],
      photoUrl: member.photoUrl || "",
      section: member.section,
    };
    if (idx !== -1) list[idx] = item;
    else list.push(item);
    localStorage.setItem("ignitia_team", JSON.stringify(list));
  }
};

export const deleteTeamMember = async (id: string): Promise<void> => {
  if (isSupabaseEnabled && supabase) {
    const { error } = await supabase
      .from("team")
      .delete()
      .eq("id", id);
    if (error) throw error;
    await getTeam();
  } else {
    const list = await getTeam();
    const filtered = list.filter((m: any) => m.id !== id && m.name !== id);
    localStorage.setItem("ignitia_team", JSON.stringify(filtered));
  }
};

// ─── Gallery Datastore ──────────────────────────────────────────────────────────
export const getGallery = async (): Promise<any[]> => {
  if (isSupabaseEnabled && supabase) {
    try {
      const { data, error } = await supabase
        .from("gallery")
        .select("*");
      if (error) throw error;
      if (data && data.length > 0) {
        localStorage.setItem("ignitia_gallery", JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn("Supabase error reading gallery. Checking cache...", e);
    }
  }
  const cached = localStorage.getItem("ignitia_gallery");
  return cached ? JSON.parse(cached) : defaultGalleryBackups;
};

export const saveGalleryItem = async (item: { id?: string; title: string; category: string; src: string; public_id?: string }): Promise<void> => {
  const id = item.id || toSlug(item.title);
  const data = { id, title: item.title, category: item.category, src: item.src, public_id: item.public_id || "" };
  if (isSupabaseEnabled && supabase) {
    const { error } = await supabase
      .from("gallery")
      .upsert(data);

    if (error) {
      // Graceful schema fallback: if the public_id column hasn't been created yet in the database,
      // save the metadata without public_id to keep the app functional.
      if (error.message?.includes("public_id") || error.code === "42703") {
        console.warn("Supabase 'public_id' column missing on 'gallery' table. Saving without public_id.");
        const { public_id, ...fallbackData } = data;
        const { error: retryError } = await supabase
          .from("gallery")
          .upsert(fallbackData);
        if (retryError) throw retryError;
      } else {
        throw error;
      }
    }
    await getGallery();
  } else {
    const list = await getGallery();
    const idx = list.findIndex((g: any) => g.id === id);
    const itm = { id, ...data };
    if (idx !== -1) list[idx] = itm;
    else list.push(itm);
    localStorage.setItem("ignitia_gallery", JSON.stringify(list));
  }
};

export const deleteGalleryItem = async (id: string): Promise<void> => {
  try {
    const list = await getGallery();
    const item = list.find((g: any) => g.id === id || g.title === id);
    if (item?.public_id) {
      const { deleteGalleryImage } = await import("./cloudinary");
      await deleteGalleryImage(item.public_id);
    }
  } catch (e) {
    console.warn("Failed to delete Cloudinary asset:", e);
  }

  if (isSupabaseEnabled && supabase) {
    const { error } = await supabase
      .from("gallery")
      .delete()
      .eq("id", id);
    if (error) throw error;
    await getGallery();
  } else {
    const list = await getGallery();
    const filtered = list.filter((g: any) => g.id !== id && g.title !== id);
    localStorage.setItem("ignitia_gallery", JSON.stringify(filtered));
  }
};

// ─── DB Seeder Tool ────────────────────────────────────────────────────────────

export const seedInitialData = async (): Promise<void> => {
  if (isSupabaseEnabled && supabase) {
    // Delete all rows in each table
    await supabase.from("events").delete().neq("id", "_none_");
    await supabase.from("sponsors").delete().neq("id", "_none_");
    await supabase.from("team").delete().neq("id", "_none_");
    await supabase.from("gallery").delete().neq("id", "_none_");

    // Seed events
    for (const event of defaultEventsBackups) {
      const { error } = await supabase.from("events").insert(toSnakeCase(event));
      if (error) console.error("Error seeding event:", error);
    }

    // Seed sponsors
    for (const sponsor of defaultSponsorsBackups) {
      const id = toSlug(`${sponsor.category}-${sponsor.name}`);
      const { error } = await supabase.from("sponsors").insert({ ...sponsor, id });
      if (error) console.error("Error seeding sponsor:", error);
    }

    // Seed team
    for (const m of defaultTeamBackups) {
      const id = toSlug(m.name);
      const { error } = await supabase.from("team").insert({
        id,
        name: m.name,
        role: m.role || "",
        initials: m.initials || "",
        linkedin: m.linkedin || "",
        instagram: m.instagram || "",
        department: m.department || "",
        bio: m.bio || "",
        expertise: m.expertise || [],
        photo_url: m.photoUrl || "",
        section: m.section,
      });
      if (error) console.error("Error seeding team member:", error);
    }

    // Seed gallery
    for (const item of defaultGalleryBackups) {
      const id = toSlug(item.title);
      const { error } = await supabase.from("gallery").insert({ ...item, id });
      if (error) console.error("Error seeding gallery item:", error);
    }

    // ── Step 3: Refresh local caches ───────────────────────────────────────────
    await getEvents();
    await getSponsors();
    await getTeam();
    await getGallery();
  } else {
    // Offline / localStorage mode — just overwrite the keys (no duplicates possible)
    localStorage.setItem("ignitia_events", JSON.stringify(defaultEventsBackups));
    localStorage.setItem("ignitia_sponsors", JSON.stringify(defaultSponsorsBackups.map((s) => ({
      ...s, id: toSlug(`${s.category}-${s.name}`)
    }))));
    localStorage.setItem("ignitia_team", JSON.stringify(defaultTeamBackups.map((m) => ({
      ...m, id: toSlug(m.name)
    }))));
    localStorage.setItem("ignitia_gallery", JSON.stringify(defaultGalleryBackups.map((g) => ({
      ...g, id: toSlug(g.title)
    }))));
  }
};

