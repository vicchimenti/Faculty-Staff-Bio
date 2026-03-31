/**
 * @file text-json-ld.js
 * @version 3.2.2
 * @created 2026-03-10
 * @modified 2026-03-24
 * @fileoverview Generates Person JSON-LD for Seattle University
 *               faculty and staff profile pages in the directory at
 *               seattleu.edu/directory/. Outputs a standalone structured
 *               data block alongside existing Funnelback microdata meta
 *               tags without replacing them.
 *
 *               Designed for fulltext content items. Uses the T4 fulltext
 *               API to gate output so that only the item whose content ID
 *               matches the current fulltext page context emits a script
 *               block. All other bio items in the same section are silent.
 *
 * @author
 * Victor Chimenti  |  Seattle University WebOps
 *
 * @copyright
 * © 2026 Seattle University. All rights reserved.
 *
 * @requires com.terminalfour.publish.utils.BrokerUtils
 * @requires com.terminalfour.publish.utils.TreeTraversalUtils
 * @requires com.terminalfour.spring.ApplicationContextProvider
 * @requires com.terminalfour.content.IContentManager
 * @requires com.terminalfour.media.IMediaManager
 * @requires com.terminalfour.version.Version
 * @requires Content Type: Faculty/Staff Bio - ID: 203
 * @requires Navigation Object: JSON-LD Meta Tags - ID 1128
 * @requires MediaManager: degree-dictionary.json - ID 10331836
 * @requires MediaManager: institution-dictionary.json - ID 10331835
 * @requires MediaManager: cip-url-dictionary.json - ID 10014460
 * @t4layout text/json-ld
 *
 * @description
 * Wraps a Schema.org Person entity inside a ProfilePage using JSON-LD.
 * All existing Funnelback microdata meta tags are preserved and unaffected.
 *
 * Fulltext gating:
 *   isFullTextPage()     — confirms this is a fulltext publish context
 *   getFulltextInfo()    — retrieves the thread-local fulltext content info
 *   getContentID match   — ensures only the current item's JSON-LD is emitted
 *
 * Person fields mapped from T4 content item:
 *   name           ← Full Name
 *   jobTitle       ← Primary Title
 *   description    ← Description
 *   image          ← Photo (relative path → full HTTPS URL)
 *   email          ← Email Address
 *   telephone      ← Phone
 *   url            ← Name of Faculty or Staff Member fulltext path
 *                    prepended with https://www.seattleu.edu
 *   knowsAbout     ← Areas of Expertise (pipe-delimited → string array)
 *   hasCredential  ← Credentials (pipe-delimited → EducationalOccupationalCredential array)
 *   worksFor       ← Staff College + Staff Department (conditional nesting)
 *   affiliation    ← Static @id reference to CollegeOrUniversity entity
 *   sameAs         ← All social + academic profile URL fields (combined array)
 *   subjectOf      ← Curriculum Vitae (full HTTPS URL → CreativeWork object)
 *
 * ProfilePage fields:
 *   dateModified   ← item-level last_modified meta tag (date only)
 *
 * hasCredential parsing:
 *   Credentials field is pipe-delimited: "Degree, Field, Institution | Degree, Field, Institution"
 *   Each pipe-separated item becomes one EducationalOccupationalCredential object.
 *   Degree abbreviation   → degree-dictionary.json  (ISCED level, credential category)
 *   Field of study        → cip-url-dictionary.json (CIP 2020 code, fuzzy match on field portion)
 *   Institution name      → institution-dictionary.json (ROR @id, Wikidata, Wikipedia sameAs)
 *   Unmatched components pass through as plain strings without structured enrichment.
 *
 * worksFor nesting logic:
 *   Both college and department present → college wraps department as
 *     subOrganization (college URL included from static lookup)
 *   College only → college object with URL, no nesting
 *   Department only → department object, no URL
 *   Neither → worksFor omitted entirely
 *
 * Deferred:
 *   dateModified   ← Full UTC ISO 8601 datetime pending ProfilePage
 *                    meta-content file conversion from HTML to JS
 *                    programmable layout
 */

/* eslint-disable no-undef, no-unused-vars */
/* global dbStatement, publishCache, section, content, language, isPreview, document, com */

try {

    // ========================================================================
    // Import T4 and Java classes
    // ========================================================================

    var FulltextJsonLdImports = JavaImporter(
        java.lang.Thread,
        java.util.Scanner,
        com.terminalfour.publish.utils.BrokerUtils,
        com.terminalfour.publish.utils.TreeTraversalUtils,
        com.terminalfour.spring.ApplicationContextProvider,
        com.terminalfour.content.IContentManager,
        com.terminalfour.media.IMediaManager,
        com.terminalfour.version.Version
    );

    with (FulltextJsonLdImports) {

        // ====================================================================
        // Fulltext gating helpers
        // ====================================================================

        var isFullText = function () {
            return BrokerUtils.isFullTextPage(publishCache);
        };

        var getFulltextInfo = function () {
            if (isFullText()) {
                return publishCache.getGenericProp('full-text-' + Thread.currentThread().getId());
            }
            return false;
        };

        // ====================================================================
        // Gate: only the matching fulltext item proceeds
        // ====================================================================

        var fullTextInfo = getFulltextInfo();

        if (isFullText() && fullTextInfo && fullTextInfo.getContentID() == content.getID()) {

            // ================================================================
            // T4 Utilities
            // ================================================================

            /**
             * Processes a T4 tag string and returns the resolved value.
             *
             * @param {string} t4Tag - The T4 tag markup to evaluate.
             * @returns {string} The resolved tag value from the content item.
             */
            function processTags(t4Tag) {
                myContent = content || null;
                return String(
                    BrokerUtils.processT4Tags(
                        dbStatement,
                        publishCache,
                        section,
                        myContent,
                        language,
                        isPreview,
                        t4Tag
                    )
                );
            }

            /**
             * Decodes common HTML entities returned by T4 tag processing.
             *
             * @param {string} str - The string containing HTML entities.
             * @returns {string} The decoded string, or the original if falsy.
             */
            function decodeHtmlEntities(str) {
                if (!str) return str;
                return str
                    .replace(/&rsquo;/g, "'")
                    .replace(/&lsquo;/g, "'")
                    .replace(/&rdquo;/g, '"')
                    .replace(/&ldquo;/g, '"')
                    .replace(/&mdash;/g, "—")
                    .replace(/&ndash;/g, "–")
                    .replace(/&amp;/g, "&")
                    .replace(/&nbsp;/g, " ")
                    .replace(/&hellip;/g, "…");
            }

            /**
             * Sanitizes a plain text string for JSON-LD output.
             * Decodes HTML entities, strips line breaks and tabs, collapses
             * multiple spaces, and trims leading/trailing whitespace.
             *
             * @param {string} str - Raw string from T4.
             * @returns {string} Sanitized string, or empty string if falsy.
             */
            function sanitizeText(str) {
                if (!str) return "";
                var clean = decodeHtmlEntities(str);
                clean = clean
                    .replace(/\r\n/g, " ")
                    .replace(/\r/g,   " ")
                    .replace(/\n/g,   " ")
                    .replace(/\t/g,   " ")
                    .replace(/\s{2,}/g, " ")
                    .trim();
                return clean;
            }

            /**
             * Reads a MediaManager JSON file by media ID and returns the
             * parsed object. Returns an empty object on any failure.
             *
             * @param {number} mediaID - T4 MediaManager media item ID.
             * @returns {Object} Parsed JSON object or empty object on error.
             */
            function readMediaJson(mediaID) {
                try {
                    var mediaManager = ApplicationContextProvider.getBean(IMediaManager);
                    var mediaObj     = mediaManager.get(mediaID, language);
                    var stream       = mediaObj.getMedia();
                    var scanner      = new Scanner(stream).useDelimiter("\\A");
                    var text         = "";
                    while (scanner.hasNext()) { text += scanner.next(); }
                    return JSON.parse(text);
                } catch (e) {
                    isPreview && document.write("<!-- MediaManager load error [" + mediaID + "]: " + e + " -->");
                    return {};
                }
            }

            // ================================================================
            // College URL lookup — mirrors program layout static table
            // ================================================================

            var collegeUrls = {
                "Albers School of Business & Economics": "https://www.seattleu.edu/business/",
                "College of Arts & Sciences":            "https://www.seattleu.edu/arts-sciences/",
                "College of Education":                  "https://www.seattleu.edu/education/",
                "College of Nursing & Health Sciences":  "https://www.seattleu.edu/nursing-health-sciences/",
                "College of Science & Engineering":      "https://www.seattleu.edu/science-engineering/",
                "Cornish College of the Arts":           "https://www.cornish.edu/",
                "School of Law":                         "https://law.seattleu.edu/"
            };

            // ================================================================
            // Load MediaManager dictionaries
            // ================================================================

            var degreeDict      = readMediaJson(10331836);
            var institutionDict = readMediaJson(10331835);
            var cipDict         = readMediaJson(10014460);

            // ================================================================
            // Step 1: Gather field data from T4 content item
            // ================================================================

            var list = {};

            // Core identity fields
            list["fullName"]      = processTags('<t4 type="content" name="Full Name" output="normal" modifiers="striptags,htmlentities" />');
            list["primaryTitle"]  = processTags('<t4 type="content" name="Primary Title" output="normal" modifiers="striptags,htmlentities" />');
            list["description"]   = processTags('<t4 type="content" name="Description" output="normal" modifiers="striptags,htmlentities" />');
            list["photo"]         = processTags('<t4 type="content" name="Photo" output="selective-output" process-format="true" format="https://www.seattleu.edu<t4 type=&quot;content&quot; name=&quot;Photo&quot; output=&quot;normal&quot; formatter=&quot;path/*&quot; />" />');
            list["cv"]            = processTags('<t4 type="content" name="Curriculum Vitae" output="selective-output" process-format="true" format="https://www.seattleu.edu<t4 type=&quot;content&quot; name=&quot;Curriculum Vitae&quot; output=&quot;normal&quot; formatter=&quot;path/*&quot; />" />');
            list["email"]         = processTags('<t4 type="content" name="Email Address" output="normal" modifiers="striptags,htmlentities" />');
            list["phone"]         = processTags('<t4 type="content" name="Phone" output="normal" modifiers="striptags,htmlentities" />');
            list["url"]           = "https://www.seattleu.edu" + processTags('<t4 type="content" name="Name of Faculty or Staff Member" output="fulltext" use-element="true" filename-element="Name of Faculty or Staff Member" modifiers="striptags,htmlentities" />');
            list["lastModified"]  = processTags('<t4 type="meta" meta="last_modified" format="yyyy-MM-dd" />');

            // Expertise, credentials, and organizational fields
            list["expertise"]     = processTags('<t4 type="content" name="Areas of Expertise" output="normal" modifiers="striptags,htmlentities" />');
            list["credentials"]   = processTags('<t4 type="content" name="Credentials" output="normal" modifiers="striptags,htmlentities" />');
            list["college"]       = processTags('<t4 type="content" name="Staff College" output="normal" display_field="name" delimiter="|" />');
            list["department"]    = processTags('<t4 type="content" name="Staff Department" output="normal" display_field="name" delimiter="|" />');

            // Academic profile URLs (feed into sameAs)
            list["linkedIn"]      = processTags('<t4 type="content" name="LinkedIn URL" output="normal" modifiers="striptags,htmlentities" />');
            list["researchGate"]  = processTags('<t4 type="content" name="Research Gate URL" output="normal" modifiers="striptags,htmlentities" />');
            list["orcid"]         = processTags('<t4 type="content" name="ORCID URL" output="normal" modifiers="striptags,htmlentities" />');
            list["googleScholar"] = processTags('<t4 type="content" name="Google Scholar URL" output="normal" modifiers="striptags,htmlentities" />');

            // Social URLs (feed into sameAs)
            list["twitter"]       = processTags('<t4 type="content" name="Twitter/X URL" output="normal" modifiers="striptags,htmlentities" />');
            list["facebook"]      = processTags('<t4 type="content" name="Facebook URL" output="normal" modifiers="striptags,htmlentities" />');
            list["instagram"]     = processTags('<t4 type="content" name="Instagram URL" output="normal" modifiers="striptags,htmlentities" />');
            list["youtube"]       = processTags('<t4 type="content" name="YouTube URL" output="normal" modifiers="striptags,htmlentities" />');
            list["tiktok"]        = processTags('<t4 type="content" name="TikTok URL" output="normal" modifiers="striptags,htmlentities" />');
            list["threads"]       = processTags('<t4 type="content" name="Threads URL" output="normal" modifiers="striptags,htmlentities" />');
            list["personalSite"]  = processTags('<t4 type="content" name="Personal Website" output="normal" modifiers="striptags,htmlentities" />');

            // ================================================================
            // Step 2: Bail early if Full Name is missing
            // ================================================================

            var fullName = sanitizeText(list["fullName"]);

            if (!fullName) {
                isPreview && document.write("<!-- Bio JSON-LD skipped: Full Name is missing -->");
            } else {

                // ============================================================
                // Step 3: Build knowsAbout array from pipe-delimited expertise
                // ============================================================

                var knowsAbout = list["expertise"]
                    .split("|")
                    .map(function (s) { return sanitizeText(s); })
                    .filter(function (s) { return s !== ""; });

                // ============================================================
                // Step 4: Build sameAs array — academic profiles then socials
                // ============================================================

                var sameAsRaw = [
                    list["linkedIn"],
                    list["researchGate"],
                    list["orcid"],
                    list["googleScholar"],
                    list["twitter"],
                    list["facebook"],
                    list["instagram"],
                    list["youtube"],
                    list["tiktok"],
                    list["threads"],
                    list["personalSite"]
                ]
                .map(function (s) { return sanitizeText(s); })
                .filter(function (s) { return s !== ""; });

                // Deduplicate — preserve first occurrence order
                var sameAsSeen = {};
                var sameAs = sameAsRaw.filter(function (s) {
                    if (sameAsSeen[s]) return false;
                    sameAsSeen[s] = true;
                    return true;
                });

                // ============================================================
                // Step 5: Build worksFor with conditional college/dept nesting
                // ============================================================

                var collegeName    = list["college"].split("|")[0].trim();
                var departmentName = list["department"].split("|")[0].trim();
                var collegeUrl     = collegeName ? (collegeUrls[collegeName] || null) : null;

                var worksFor = null;

                if (collegeName && departmentName) {
                    worksFor = { "@type": "EducationalOrganization", "name": collegeName };
                    if (collegeUrl) worksFor["url"] = collegeUrl;
                    worksFor["subOrganization"] = { "@type": "EducationalOrganization", "name": departmentName };
                } else if (collegeName) {
                    worksFor = { "@type": "EducationalOrganization", "name": collegeName };
                    if (collegeUrl) worksFor["url"] = collegeUrl;
                } else if (departmentName) {
                    worksFor = { "@type": "EducationalOrganization", "name": departmentName };
                }

                // ============================================================
                // Step 6: Build hasCredential array from pipe-delimited field
                //
                // Input format: "Degree, Field, Institution | Degree, Field, Institution"
                //
                // Each pipe-separated credential is parsed into:
                //   - Degree abbreviation  → degreeDict  (ISCED level, category)
                //   - Field of study       → cipDict     (CIP 2020 code, fuzzy match)
                //   - Institution name     → institutionDict (ROR, Wikidata, Wikipedia)
                //
                // Unmatched components pass through as plain strings.
                // A credential with no recognizable degree token is skipped entirely.
                // ============================================================

                /**
                 * Attempts a fuzzy CIP code lookup by matching the field of
                 * study string against the field portion of cipDict keys.
                 * Keys follow the format "Program Name, Degree" — we strip
                 * the degree suffix and compare the field portion.
                 *
                 * @param {string} fieldOfStudy - Plain field string from credential.
                 * @returns {string|null} CIP code string or null if no match found.
                 */
                function findCipCode(fieldOfStudy) {
                    if (!fieldOfStudy) return null;
                    var field = fieldOfStudy.toLowerCase().trim();
                    var keys  = Object.keys(cipDict);
                    for (var i = 0; i < keys.length; i++) {
                        var key      = keys[i];
                        var keyParts = key.split(",");
                        // Strip degree suffix — everything before the last comma token
                        var keyField = keyParts.slice(0, keyParts.length - 1)
                                               .join(",").trim().toLowerCase();
                        if (!keyField) continue;
                        if (keyField === field ||
                            keyField.indexOf(field) !== -1 ||
                            field.indexOf(keyField) !== -1) {
                            return cipDict[key] ? (cipDict[key].cip || null) : null;
                        }
                    }
                    return null;
                }

                /**
                 * Parses the pipe-delimited Credentials field and builds an
                 * array of EducationalOccupationalCredential schema objects.
                 *
                 * @param {string} credentialString - Raw pipe-delimited credentials.
                 * @returns {Array} Array of credential schema objects (may be empty).
                 */
                function buildHasCredential(credentialString) {
                    var results = [];
                    if (!credentialString || credentialString.trim() === "") return results;

                    var credentials = credentialString.split("|");

                    for (var i = 0; i < credentials.length; i++) {
                        var raw = sanitizeText(credentials[i]);
                        if (!raw) continue;

                        var parts = raw.split(",").map(function (p) { return p.trim(); })
                                       .filter(function (p) { return p !== ""; });
                        if (parts.length === 0) continue;

                        // ── Degree variant normalization ──────────────────
                        // Maps compound or non-standard abbreviations to the
                        // canonical key present in degree-dictionary.json.
                        // Add entries here as new variants surface in data.
                        var degreeNormMap = {
                            "MSCS": "MS", "MSEE": "MS", "MSME": "MS",
                            "MSCE": "MS", "MSIS": "MS", "MSBA": "MBA",
                            "MSPA": "MPA", "MSPH": "MPH", "MSSW": "MSW",
                            "MSHA": "MS", "MSTE": "MS",
                            "BSCS": "BS", "BSEE": "BS", "BSME": "BS",
                            "BSCE": "BS", "BSPH": "BS", "BSHS": "BS",
                            "BSND": "BS", "BSRT": "BS", "BSRS": "BS",
                            "BSMT": "BS", "BSHA": "BS", "BSOT": "BS",
                            "BSPT": "BS", "BSAT": "BS",
                            "Ph.D": "PhD", "Ph.D.": "PhD", "PHD": "PhD",
                            "Ed.D": "EdD", "Ed.D.": "EdD", "EDD": "EdD",
                            "J.D": "JD",  "J.D.": "JD",
                            "M.S": "MS",  "M.S.": "MS",
                            "M.A": "MA",  "M.A.": "MA",
                            "B.S": "BS",  "B.S.": "BS",
                            "B.A": "BA",  "B.A.": "BA",
                            "M.F.A": "MFA", "M.F.A.": "MFA",
                            "M.B.A": "MBA", "M.B.A.": "MBA",
                            "M.Ed": "MEd", "M.Ed.": "MEd",
                            "M.S.N": "MSN", "M.S.N.": "MSN",
                            "M.S.W": "MSW", "M.S.W.": "MSW",
                            "B.F.A": "BFA", "B.F.A.": "BFA",
                            "B.S.N": "BSN", "B.S.N.": "BSN"
                        };

                        // ── Find degree token ─────────────────────────────
                        var degreeAbbrev = null;
                        var degreeInfo   = null;
                        var degreeIdx    = -1;

                        for (var d = 0; d < parts.length; d++) {
                            var rawToken       = parts[d];
                            var normalizedToken = degreeNormMap[rawToken] || rawToken;
                            if (degreeDict[normalizedToken]) {
                                degreeAbbrev  = normalizedToken;
                                degreeInfo    = degreeDict[normalizedToken];
                                degreeIdx     = d;
                                parts[d]      = normalizedToken; // replace in-place for clean name output
                                break;
                            }
                        }

                        // Skip credential if no recognizable degree token found
                        if (!degreeInfo) continue;

                        // ── Find institution ──────────────────────────────
                        var institutionName = null;
                        var institutionData = null;
                        var institutionIdx  = -1;

                        for (var inst = 0; inst < parts.length; inst++) {
                            if (inst === degreeIdx) continue;
                            if (institutionDict[parts[inst]]) {
                                institutionName = parts[inst];
                                institutionData = institutionDict[parts[inst]];
                                institutionIdx  = inst;
                                break;
                            }
                        }

                        // ── Field of study — remaining parts ──────────────
                        var fieldParts = [];
                        for (var f = 0; f < parts.length; f++) {
                            if (f !== degreeIdx && f !== institutionIdx) {
                                fieldParts.push(parts[f]);
                            }
                        }
                        var fieldOfStudy = fieldParts.join(", ").trim();

                        // ── Assemble credential object ────────────────────
                        var credential = {
                            "@type":             "EducationalOccupationalCredential",
                            "name":              raw,
                            "credentialCategory": degreeInfo.credential_category || "degree"
                        };

                        if (degreeInfo.isced_level) {
                            credential["educationalLevel"] = "ISCED 2011 Level " + degreeInfo.isced_level;
                        }

                        // CIP identifier — fuzzy match on field of study
                        var cipCode = findCipCode(fieldOfStudy);
                        if (cipCode) {
                            credential["identifier"] = {
                                "@type":      "PropertyValue",
                                "propertyID": "CIP 2020",
                                "value":      cipCode
                            };
                        }

                        // recognizedBy — institution from dictionary
                        if (institutionData) {
                            var recognizedBy = {
                                "@type": "CollegeOrUniversity",
                                "name":  institutionName
                            };
                            if (institutionData.ror)     recognizedBy["@id"] = institutionData.ror;
                            if (institutionData.website) recognizedBy["url"] = institutionData.website;

                            var instSameAs = [];
                            if (institutionData.wikidata) {
                                instSameAs.push("https://www.wikidata.org/wiki/" + institutionData.wikidata);
                            }
                            if (institutionData.wikipedia) {
                                instSameAs.push(institutionData.wikipedia);
                            }
                            if (instSameAs.length > 0) recognizedBy["sameAs"] = instSameAs;

                            credential["recognizedBy"] = recognizedBy;

                        } else if (institutionName) {
                            // Named in credential but not in dictionary — name only
                            credential["recognizedBy"] = {
                                "@type": "CollegeOrUniversity",
                                "name":  institutionName
                            };
                        }

                        results.push(credential);
                    }

                    return results;
                }

                var hasCredential = buildHasCredential(list["credentials"]);

                // ============================================================
                // Step 7: Assemble Person entity — no nulls
                // ============================================================

                var person = {
                    "@type": "Person",
                    "name":  fullName
                };

                var jobTitle    = sanitizeText(list["primaryTitle"]);
                var description = sanitizeText(list["description"]);
                var email       = sanitizeText(list["email"]);
                var telephone   = sanitizeText(list["phone"]);
                var profileUrl  = sanitizeText(list["url"]);

                if (list["photo"])                 person["image"]         = list["photo"];
                if (jobTitle)                      person["jobTitle"]      = jobTitle;
                if (description)                   person["description"]   = description;
                if (email)                         person["email"]         = email;
                if (telephone)                     person["telephone"]     = telephone;
                if (profileUrl)                    person["url"]           = profileUrl;
                if (knowsAbout.length > 0)         person["knowsAbout"]    = knowsAbout;
                if (hasCredential.length > 0)      person["hasCredential"] = hasCredential;
                if (worksFor)                      person["worksFor"]      = worksFor;

                person["affiliation"] = {
                    "@type": "CollegeOrUniversity",
                    "@id":   "https://www.seattleu.edu/#organization"
                };

                if (sameAs.length > 0) person["sameAs"] = sameAs;

                if (list["cv"]) person["subjectOf"] = {
                    "@type": "CreativeWork",
                    "name":  "Curriculum Vitae",
                    "url":   list["cv"]
                };

                // ============================================================
                // Step 8: Assemble ProfilePage wrapper
                // ============================================================

                var jsonLD = {
                    "@context": "https://schema.org",
                    "@type":    "ProfilePage"
                };

                var dateModified = sanitizeText(list["lastModified"]);
                if (dateModified) jsonLD["dateModified"] = dateModified;

                jsonLD["mainEntity"] = person;

                // ============================================================
                // Step 9: Output JSON-LD script block
                // ============================================================

                document.write(
                    '<script type="application/ld+json" id="person-jsonld">' +
                        JSON.stringify(jsonLD, null, 2) +
                    '<\/script>'
                );

            }

        }

    }

} catch (err) {
    isPreview && document.write("<!-- Bio JSON-LD error: " + err + " -->");
}
