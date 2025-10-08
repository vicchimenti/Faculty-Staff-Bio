# Seattle University
## AI Overviews Project – Bio Profiles Optimization Plan
*Last Updated: October 8, 2025*

---

### 1. Project Overview
Seattle University’s Faculty & Staff Directory is the central hub for our academic and professional community.  
While the directory and individual bios already provide robust internal search functionality, our next goal is to **expand visibility nationally** — positioning Seattle University faculty as recognized experts across disciplines, accessible not only on our site but in AI Overviews, news aggregators, and expert databases.

This document builds upon the **Program Pages SEO Plan (2025-10-07)** and outlines how the same foundation of semantic structure, accessibility, and schema precision will elevate our *Bio Profile Pages*.

---

### 2. Current Foundation

#### a. Directory Overview
- Central directory located at: [https://www.seattleu.edu/directory/](https://www.seattleu.edu/directory/)
- Approximately 2,000+ profiles across faculty, staff, and leadership.
- Searchable by **name, title, department, college, and area of expertise**.
- Meta tags currently include `og:`, `twitter:`, and custom `profile:` properties (e.g., `profile:first-name`, `profile:staff-department`, `profile:areas-of-expertise`).

#### b. Individual Bio Pages
Example: [Jacqueline B. Helfgott, PhD](https://www.seattleu.edu/directory/profiles/jacqueline-b-helfgott-phd.php)  
Current structure:
- Comprehensive meta descriptions and canonical tags.
- Schema-friendly meta pattern already exposing key attributes.
- Accessible layout built in TerminalFour using custom Handlebars templates.

#### c. Accessibility Alignment
Recent updates include:
- **Descriptive H1 remediation**: The visible name remains the H1, but new *screen reader–only* content adds contextual detail (staff type, title, department, college, and expertise).  
- Ensures compliance with **WCAG 2.1 (Heading is Descriptive)** while preserving visual design.
- Reinforces semantic context for search crawlers and AI parsers.

---

### 3. New Enhancements for AI Overviews

#### a. Accessible & Semantic Heading Structure
**Visible H1:** Name only (e.g., “Jane Scholar, PhD”)  
**Screen Reader Addendum (sr-only):**
