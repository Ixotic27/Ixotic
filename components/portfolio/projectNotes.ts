// Concise notes checked against the repository descriptions and READMEs in design/.
// Fork entries describe their upstream repository without claiming original authorship.
export type ProjectNote = { overview: string; highlights?: string[]; source?: string };

export const projectNotes: Record<string, ProjectNote> = {
  "The-Leetcode-City": {
    overview: "LeetCode profiles become buildings in an interactive pixel-art city. Building size and details reflect a developer's coding activity.",
    highlights: ["Explore the city in free-flight mode", "Profile pages, achievements, comparisons, and share cards"],
    source: "Repository README",
  },
  TraceWeave: {
    overview: "A workspace for importing device logs, reviewing source mappings, and exporting normalized records while retaining original bytes.",
    highlights: ["Detects structural changes and replays records after a mapping correction", "Runs locally without an account; a hosted workspace is also documented"],
    source: "Repository README",
  },
  "Smart-Assignment-Checker-SAC-A-Multi-Layer-Plagiarism-Detection-System": {
    overview: "A JavaFX assignment checker that compares submitted PDFs with an answer sheet using selectable strictness levels.",
    highlights: ["Reads typed PDFs and uses a local OCR service for scanned pages", "Checks duplicate embedded images and exports batch grading results"],
    source: "Repository README",
  },
  "paimana-intelligence-platform": {
    overview: "An evaluator prototype for exploring infrastructure project risk from four monthly PAIMANA report snapshots.",
    highlights: ["Project history, cost and schedule comparisons, review scores, and regional context", "The README distinguishes its rules-based review index from the separate model experiment"],
    source: "Repository README",
  },
  "Smart-Hospital-Appointment-Real-Time-Queue-Management-System": {
    overview: "A JavaFX desktop application for hospital appointments and patient queues, with JDBC database access.",
    highlights: ["Appointment scheduling and double-booking prevention", "Models, controllers, services, and DAO layers are documented in the repository"],
    source: "Repository README",
  },
  "busted-fake-news-detector": {
    overview: "A fake-news detection project described in the existing portfolio as an exploration of text classification and misinformation signals.",
    source: "Existing portfolio copy; repository README unavailable",
  },
  "disaster-relief-system": {
    overview: "A repository titled Disaster Relief Resource Allocation System. The current README supplies only the project title.",
    source: "Repository README",
  },
  "gssoc-tracker": {
    overview: "The upstream GSSoC Tracker offers a personal view of contribution pull requests, points, labels, and rank.",
    highlights: ["Contributor and mentor tracking are described in the upstream README", "This account hosts a fork of the project"],
    source: "Fork's README",
  },
  commitpulse: {
    overview: "The upstream CommitPulse turns GitHub contribution data into an isometric SVG display for a profile README.",
    highlights: ["Contribution towers are rendered from activity data", "This account hosts a fork of the project"],
    source: "Fork's README",
  },
  iloveAgents: {
    overview: "The upstream community project collects ready-to-use AI agents and lets visitors run them with their own provider keys.",
    highlights: ["Agent library and sequential workflow builder are described in the README", "This account hosts a fork of the project"],
    source: "Fork's README",
  },
  Ixotic27: {
    overview: "A GitHub profile repository with an introduction, technology badges, social links, and contribution graphics.",
    source: "Repository README",
  },
  Web: { overview: "A web repository whose README contains the text ‘Team Codev’. No further project description is provided there.", source: "Repository README" },
  "Eco-Scan": { overview: "This TypeScript repository links to a project site. GitHub does not currently provide a description or README for the shelf to summarize.", source: "Repository metadata" },
  Python: { overview: "A repository listed with Jupyter Notebook as its primary language. GitHub does not currently provide a description or README for the shelf to summarize.", source: "Repository metadata" },
  Bit_Manipulation: {
    overview: "Java examples of bit operations used in algorithms and low-level programming.",
    highlights: ["Getting, setting, clearing, and updating individual bits", "Clearing ranges and checking parity"],
    source: "Repository README",
  },
  "Interactive-Student-Management-System": {
    overview: "A student-record interface built with HTML, CSS, and JavaScript.",
    highlights: ["Add, edit, delete, and view student details", "The README describes form validation"],
    source: "Repository README",
  },
  Spiral_Array: { overview: "A Java repository described as traversing a two-dimensional array in clockwise spiral order.", source: "Repository description" },
  Staircase_Searching: { overview: "A Java example of staircase search in a sorted two-dimensional array, with O(n + m) time complexity as stated in the README.", source: "Repository README" },
  Max_Sub_Array: { overview: "A repository named Max Sub Array. GitHub does not currently provide a description, language, or README for the shelf to summarize.", source: "Repository metadata" },
  "Student-Management-System": { overview: "A simple student-management system in C, according to its repository description.", source: "Repository description" },
  "Snake-Water-Gun-Game": {
    overview: "A console game in C where the player chooses snake, water, or gun against a randomized computer move.",
    highlights: ["The README explains the three winning matchups", "Player and computer scores are tracked"],
    source: "Repository README",
  },
  Ixotic: { overview: "A personal profile repository with a short introduction, social links, and technology badges.", source: "Repository README" },
  "Random-Number-Gen": { overview: "A first C project that generates random numbers with rand(), using loops and conditionals.", source: "Repository README" },
};
