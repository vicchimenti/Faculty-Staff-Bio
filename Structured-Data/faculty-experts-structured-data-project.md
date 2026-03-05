# Faculty & Staff Experts Structured Data
## Project Summary, Current State & Next Steps
**Seattle University — MarCom Web Team**
*Last Updated: March 4, 2026*

---

## 1. Project Overview

This project extends Seattle University's existing structured data program to faculty and staff profile pages at `seattleu.edu/directory/`. The goal is to implement `Person` JSON-LD schema that elevates SU's brand by promoting faculty as world-class experts — increasing visibility in Google AI Overviews, strengthening Knowledge Graph entity recognition, and building a national audience for faculty expertise through machine-readable structured data.

This work builds directly on the architecture and philosophy established in the Program Pages SEO project, applying the same gold-standard, taxonomy-driven approach to people rather than programs.

### Primary Goals

- **Expert discovery:** Make SU faculty findable by journalists, researchers, and AI systems searching for authoritative voices on complex topics
- **AI Overviews visibility:** Surface individual faculty in Google's AI-generated search results
- **Brand elevation:** Position Seattle University as a leader in faculty expertise transparency, building on the directory's existing advantage over peer institutions
- **Freshness signaling:** Leverage `dateModified` on `ProfilePage` for Google IndexNow and recency signals
- **Knowledge Graph entity recognition:** Create named entity links between faculty, departments, colleges, and the institution

---

## 2. Current State of Faculty Profiles

### What Already Exists

Seattle University's Faculty & Staff Directory is already ahead of peer institutions. Key existing strengths:

- **Rich meta tags** in page `<head>` supporting Funnelback internal search
- **Custom `profile:` meta properties** including `areas-of-expertise`, `staff-department`, `college-school`, `email`, `title`, and `affiliation`
- **Open Graph and Twitter Card** metadata fully implemented
- **`@type="ProfilePage"` microdata** with `dateModified` already present
- **`@type="Person"` microdata** tags for `name`, `image`, and `description`
- **Areas of Expertise taxonomy** — pipe-delimited plain text, editor-governed, currently the highest-boosted field in directory keyword search
- **Social profile URLs** stored as full HTTPS links (not handles), covering TikTok, Instagram, X, YouTube, LinkedIn, Instagram, and Facebook
- **"Relevant Sites"** field for personal/professional websites

### What Is Not Yet Present

- No `Person` JSON-LD structured data (greenfield — ideal starting point)
- No `ProfilePage` JSON-LD wrapper
- No `hasCredential` / `EducationalOccupationalCredential` structured data for education
- No dedicated academic profile fields (Google Scholar, ORCID, ResearchGate)
- No CIP-coded field of study taxonomy for education credentials

---

## 3. Architectural Decisions Made

### Schema Structure

| Element | Decision |
|---|---|
| Top-level type | `ProfilePage` with `dateModified` |
| Main entity | `Person` via `mainEntity` property |
| Existing microdata | Preserved for Funnelback — JSON-LD added alongside, not replacing |
| `dateModified` source | Existing `name="revised"` meta tag |
| `affiliation` | Points to `https://www.seattleu.edu/#organization` — same `@id` as program schema |

### Person Schema Field Mapping

| Schema Property | T4 Source Field |
|---|---|
| `name` | Plain name field (first + last, no credentials) |
| `jobTitle` | Title/rank field |
| `description` | Biography summary / short description |
| `image` | Profile photo URL |
| `email` | Email field |
| `telephone` | Phone field (where present) |
| `url` | Canonical URL (current credential-bearing slug for now) |
| `dateModified` | `name="revised"` meta tag value |
| `knowsAbout` | Areas of Expertise — pipe-delimited → parsed array |
| `worksFor` | Conditional college → department nesting (same logic as program schema provider) |
| `affiliation` | `@id` reference to `CollegeOrUniversity` node |
| `sameAs` | Existing social URLs + new academic profile URLs |
| `hasCredential` | New Education fields → `EducationalOccupationalCredential` objects |

### `worksFor` Nesting Logic

Mirrors the program schema's `provider.department` conditional structure:
- **Faculty:** college → department (both fields present)
- **Staff:** department only (no college field)
- **Neither present:** `worksFor` omitted

### `knowsAbout` — The Strategic Centerpiece

The Areas of Expertise taxonomy is the most important field for the expert discovery and AI visibility goals. Each pipe-delimited term is parsed into an individual array item, making every expertise term a discrete, machine-readable signal. This is what enables AI systems to match "who is an expert on cross-border M&A" to a specific faculty member.

---

## 4. New T4 Fields Being Added

### Academic & Professional Profiles *(new section in profile content type)*

Three optional URL fields, full HTTPS required, stored exactly as copied from the browser:

| Field Label | Schema Target | Notes |
|---|---|---|
| Google Scholar Profile | `sameAs` | Highest-value entity disambiguation signal |
| ORCID | `sameAs` | Stable academic identity; full URL format |
| ResearchGate | `sameAs` | Strong for research-active faculty |

Rendered conditionally in the sidebar under a bold "Academic & Professional Profiles" heading. Empty fields produce no output.

### Education Credentials *(new repeating field group)*

Replaces free-form HTML Education field for schema purposes. HTML field retained for display.

| Field Label | Type | Schema Target | Notes |
|---|---|---|---|
| Credential Type | Taxonomy | `credentialCategory` | PhD, EdD, MEd, JD, MS, MA, MBA, MFA, BSN, RN, DNP, LLM, SJD, BFA, BS, BA, etc. |
| Field of Study | Taxonomy (CIP2020Title) | Part of `name` | Controlled vocabulary from CIP 2020 federal dataset |
| Institution | Plain text | `recognizedBy` → `Organization` | Free text to accommodate international institutions |

**Year intentionally omitted** — privacy decision, not required for schema validity. Credential type + field of study + institution provides full entity signal.

---

## 5. Field of Study Taxonomy Strategy

### Data Source

The CIP 2020 (Classification of Instructional Programs) federal dataset from NCES provides the authoritative taxonomy for fields of study. The full CIP2020–SOC2018 crosswalk Excel file is already in project assets.

### Implementation Approach

- **V1 seed data:** Build initial taxonomy from SU's existing 156 program CIP codes — covering the fields most likely to appear in faculty credentials
- **Gap identification:** Parse existing HTML Education fields across faculty profiles to surface any fields of study not covered by SU's program list
- **Expansion:** Add additional CIP2020Title entries as editors encounter them during data entry

This approach starts small and governed rather than importing all ~2,400 CIP codes on day one.

### Schema Output

Each education credential becomes an `EducationalOccupationalCredential` object:

```json
{
  "@type": "EducationalOccupationalCredential",
  "name": "PhD in Finance, University of Washington",
  "credentialCategory": "PhD",
  "recognizedBy": {
    "@type": "Organization",
    "name": "University of Washington"
  }
}
```

---

## 6. Decisions Deferred

| Decision | Status | Rationale |
|---|---|---|
| Clean plain-name URL slugs | Deferred to Law School & Cornish builds (2026) | 2,700 individual redirects required; T4 lacks wildcard redirect support; political capital better spent elsewhere |
| `Courses Taught` schema | Deferred | HTML field retained for display only; `Course` schema maintenance burden outweighs benefit at this stage |
| Full 2,400-entry CIP taxonomy | Deferred | Start with SU program seed list; expand on demand |
| `DefinedTerm` objects for `knowsAbout` | Future consideration | Plain string array is valid and sufficient for v1; `DefinedTerm` with `inDefinedTermSet` is a future enhancement |

---

## 7. Next Steps

### Immediate (This Week)

1. **Build new T4 fields** in test environment:
   - Academic & Professional Profiles section (Google Scholar, ORCID, ResearchGate)
   - Education credential field group (Credential Type taxonomy, Field of Study taxonomy, Institution plain text)
2. **Parse existing HTML Education fields** — export current faculty Education values, identify unique entries, map to CIP2020 titles, flag gaps
3. **Build v1 Field of Study taxonomy** — seed from SU's 156 program CIP codes, supplement with parsed Education field data

### Design Phase (Next Session)

4. **Map complete JSON-LD structure** — sketch full `ProfilePage` + `Person` schema with all fields before writing code
5. **Design `hasCredential` repeating structure** — determine how T4 handles multiple degree entries and how the layout iterates them
6. **Review `sameAs` array assembly** — confirm how social URLs and academic profile URLs are combined and filtered

### Build Phase

7. **Develop T4 programmable layout** — following same pattern as `program-7357-text-json-ld.js`
8. **Implement preview diagnostics** — consistent with existing error handling approach
9. **QA and validation** — Schema Markup Validator, Google Search Console monitoring

### Future Phases

- Clean URL implementation on Law School and Cornish College new builds
- `DefinedTerm` enhancement for `knowsAbout` taxonomy terms
- Potential `Course` schema if Courses Taught field is restructured
- Institution `sameAs` linking for `recognizedBy` objects (connecting faculty credentials to known university entities)

---

## 8. Files & Assets

| Asset | Location | Notes |
|---|---|---|
| CIP2020–SOC2018 Crosswalk | Project knowledge | Source for Field of Study taxonomy |
| programs_cip_url.json | Project knowledge | SU program → CIP code mapping; v1 seed for Field of Study taxonomy |
| program-7357-text-json-ld.js | Project knowledge | Reference implementation for T4 programmable layout pattern |
| Faculty directory | `seattleu.edu/directory/` | Live reference |

---

*This document reflects architectural decisions made March 4, 2026. No code has been written yet for this project phase.*
