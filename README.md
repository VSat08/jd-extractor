# JD Extractor  (Native Browser Side Panel Edition v1.0.0)

**A high-performance, Apple-designed React browser extension side panel that extracts clean job descriptions from any job portal — 100% private, zero API keys, no LLM cost, formatted for AI chatbots.**

Works on LinkedIn (including 2-pane search results), Workday, Indeed, Greenhouse, Lever, Ashby, Naukri, Glassdoor, Citi, Deloitte, and any custom career website.

---

## 🌟 Key Highlights (v1.0.0)

1. **LinkedIn 2-Pane Search Results Isolation**:
   - On `linkedin.com/jobs/search-results/?currentJobId=...`, accurately targets the **right-hand details rail** (`.scaffold-layout__detail`, `.jobs-box__html-content`, `#job-details`, `.show-more-less-html__markup`).
   - Automatically excludes the left search list, notification toasts, and bottom chat popups from extraction.
   - Real-Time Async Settling & MutationObserver: Clicking any job card on the left list immediately updates the Side Panel as soon as LinkedIn renders the right rail.

2. **Apple HIG Shimmer Skeleton Loading**:
   - Zero layout shifts (CLS) when switching jobs or tabs.
   - Shimmering translucent Apple squircle geometry mirroring the Job Card, Preview Box, AI Prompt tabs, and Action Buttons.

3. **Apple Human Interface Design (Cupertino Aesthetic)**:
   - Structured metadata card with Apple SF Symbol badges:
     - **Company Row**: Apple Blue `BuildingIcon` + company name (e.g. `Deloitte`, `Citi`, `Persistent Systems`).
     - **Location Badge**: System Gray pill with `LocationPinIcon` (e.g. `Pune Division, Maharashtra, India`).
     - **Workplace/Type Badge**: Neutral badge with `BriefcaseIcon` (e.g. `Hybrid · Full-time`).
     - **Date Posted Badge**: Neutral badge with `CalendarIcon` (e.g. `1 week ago`).
     - **Salary Badge**: Accent badge with `BankNoteIcon` (when available).
   - Clean, minimalist section headers without decorative clutter.
   - Dynamic sliding pill segmented control matching macOS System Settings and iOS 18.

4. **Native Browser Side Panel (Copilot-Style Persistence)**:
   - Docks into Microsoft Edge's and Google Chrome's **native browser side rail** (just like Copilot).
   - **Stays open continuously across all tabs**: Switch between LinkedIn, Workday, Citi, Deloitte, and your resume tab — the side panel stays open without closing!
   - **Zero page overlap**: The browser automatically docks the webpage side-by-side with the side panel. Never blocks your page or buttons.
   - **Auto Tab-Switch Extraction**: As you switch tabs, the side panel detects the tab change (`chrome.tabs.onActivated`) and automatically extracts each job instantly.
   - **Non-Job Tab Detection**: On non-job tabs (like your Resume PDF or New Tab), it displays an Apple-styled card: *"No Job Posting Detected"* with a quick button to view and copy your saved history clips.

5. **4 Tailored AI Prompt Modes**:
   - **Resume** (`scope` icon): Analyzes missing ATS keywords and suggests resume bullet points.
   - **Letter** (`envelope` icon): Drafts an authentic, tailored cover letter.
   - **Questions** (`bubble.left` icon): Predicts top 10 role-specific technical & behavioral interview questions.
   - **Skills** (`chart.bar` icon): Breaks down must-have skills, bonus skills, and toolsets.

---

## 📦 How to Load & Use in Microsoft Edge / Chrome

1. Open **`edge://extensions`** (or `chrome://extensions`).
2. Enable **Developer Mode** (toggle on the top right or left sidebar).
3. Click **Load unpacked** and select this project folder (`d:\AI\JD Extractor`).
4. Switch to any job posting (e.g. LinkedIn, Workday, Indeed, Citi) and open the Side Panel (`Ctrl + Shift + J` or click the toolbar icon).
5. As you click different jobs or switch tabs, the extension automatically extracts the clean job description!

---

## 📄 License
MIT — Free to use, modify, and distribute.
