/**
 * @file v10-text-fulltext-json-ld.js
 * @version 4.0.1
 * @created 2026-03-09
 * @modified 2026-03-31
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
 *               Field reads are delegated to the T4 native HTML processor
 *               via getLayout() → JSON.parse(). This keeps Rhino responsible
 *               only for assembly logic, reducing per-item JS engine overhead
 *               at publish time.
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
 * @requires java.io.StringWriter
 * @requires com.terminalfour.utils.T4StreamWriter
 * @requires com.terminalfour.publish.ContentPublisher
 * @requires Content Type: Faculty/Staff Bio - ID: 203
 * @requires Navigation Object: JSON-LD Meta Tags - ID 1128
 * @requires MediaManager: degree-dictionary.json - ID 10331836
 * @requires MediaManager: institution-dictionary.json - ID 10331835
 * @requires MediaManager: cip-url-dictionary.json - ID 10014460
 * @t4layout v10/text/fulltext/json-ld
 *
 * @description
 * Wraps a Schema.org Person entity inside a ProfilePage using JSON-LD.
 * All existing Funnelback microdata meta tags are preserved and unaffected.
 *
 * Architecture:
 *   Field reads  → v10/text/fulltext/json-ld-content (HTML, native T4 processor)
 *   Assembly     → this file (JS, Rhino)
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
 *   Dictionary loads are gated — only executed when credentials field is non-empty.
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
        java.io.StringWriter,
        com.terminalfour.publish.utils.BrokerUtils,
        com.terminalfour.publish.utils.TreeTraversalUtils,
        com.terminalfour.spring.ApplicationContextProvider,
        com.terminalfour.content.IContentManager,
        com.terminalfour.media.IMediaManager,
        com.terminalfour.version.Version,
        com.terminalfour.utils.T4StreamWriter,
        com.terminalfour.publish.ContentPublisher
    );

    with (FulltextJsonLdImports) {

        // ====================================================================
        // getLayout() infrastructure — from v10-text-fulltext-meta.js
        // ====================================================================

        var contentLayout = 'v10/text/fulltext/json-ld/content';

        var isFullText = function () {
            return BrokerUtils.isFullTextPage(publishCache);
        };

        var getFulltextInfo = function () {
            if (isFullText()) {
                return publishCache.getGenericProp('fulltext-' + Thread.currentThread().getId());
            }
            return false;
        };

        var getCachedSectionFromId = function (sectionID) {
            if (typeof sectionID === 'undefined') {
                return section;
            } else if (section.getID() == sectionID) {
                return section;
            }
            sectionID = Number(sectionID);
            if (sectionID === 0) {
                throw 'Passed Incorrect Section ID to getCachedSectionFromId';
            }
            return TreeTraversalUtils.findSection(
                publishCache.getChannel(),
                section,
                sectionID,
                language
            );
        };

        var getContentManager = function () {
            return ApplicationContextProvider.getBean(IContentManager);
        };

        var getCachedContentFromId = function (contentID, contentVersion) {
            if (typeof contentID === 'undefined' && typeof contentVersion === 'undefined') {
                return content;
            } else if (Number(contentID) <= 0 && typeof contentVersion !== 'undefined' && content !== null) {
                contentID = content.getID();
            } else {
                contentID = Number(contentID);
            }
            if (content === null && contentID === 0) {
                throw 'Passed Incorrect Content ID to getCachedContentFromId';
            }
            var contentManager = getContentManager();
            if (typeof contentVersion !== 'undefined') {
                return contentManager.get(contentID, language, Version(contentVersion));
            } else {
                return contentManager.get(contentID, language);
            }
        };

        var getContentTypeFromId = function (contentID) {
            if (typeof contentID === 'undefined' || (Number(contentID) <= 0 && content !== null)) {
                return content.getContentTypeID();
            }
            contentID = Number(contentID);
            if (content !== null && contentID === 0) {
                throw 'Passed Incorrect Content ID to getContentTypeFromId';
            }
            return getContentManager().getContentType(contentID);
        };

        var processT4Tags = function (t4tag, contentID, sectionID) {
            var cachedContent = content || null;
            var cachedSection = section;
            if (typeof sectionID !== 'undefined' && sectionID !== null && Number(sectionID) > 0) {
                cachedSection = getCachedSectionFromId(sectionID);
            }
            if (contentID === null && sectionID !== null) {
                cachedContent = null;
            } else if (typeof contentID !== 'undefined' && Number(contentID) > 0) {
                cachedContent = getCachedContentFromId(contentID);
                if (cachedContent === null) {
                    throw 'Could not get cachedContent';
                }
            }
            if (cachedSection === null) {
                throw 'Could not get cachedSection';
            }
            return String(BrokerUtils.processT4Tags(
                dbStatement, publishCache, cachedSection, cachedContent, language, isPreview, t4tag
            ));
        };

        var getLayout = function (contentLayout, contentID, sectionID) {
            if (typeof contentLayout === 'undefined' || contentLayout === '') {
                throw 'getLayout: contentLayout is required';
            }
            var cachedSection = section;
            var cachedContent = content;
            if (typeof contentID !== 'undefined' && Number(contentID) > 0) {
                if (typeof sectionID !== 'undefined' && Number(sectionID) > 0) {
                    cachedSection = getCachedSectionFromId(sectionID);
                }
                cachedContent = getCachedContentFromId(contentID);
                if (cachedSection === null || cachedContent === null) {
                    throw 'getLayout: could not resolve content or section';
                }
            }
            var tid    = getContentTypeFromId();
            var format = publishCache.getTemplateFormatting(dbStatement, tid, contentLayout);
            var formatString   = format.getFormatting();
            var processorType  = format.getProcessor().getProcessorType();
            if (String(processorType) !== 't4tag') {
                var sw  = new StringWriter();
                var t4w = new T4StreamWriter(sw);
                new ContentPublisher().write(
                    t4w, dbStatement, publishCache,
                    cachedSection, cachedContent,
                    contentLayout, isPreview
                );
                return sw.toString();
            } else {
                return processT4Tags(formatString, contentID, sectionID);
            }
        };

        // ====================================================================
        // Gate: only the matching fulltext item proceeds
        // ====================================================================

        var fullTextInfo = getFulltextInfo();

        if (isFullText() && fullTextInfo && fullTextInfo.getContentID() == content.getID()) {

            // ================================================================
            // Fetch and parse field data from HTML content file
            // ================================================================

            var rawFields = getLayout(contentLayout)
                .replace(/\r\n|\r|\n/g, ' ')
                .replace(/\t/g, ' ');

            var fields = JSON.parse(rawFields);

            // ================================================================
            // Bail early if Full Name is missing
            // ================================================================

            if (!fields.fullName) {
                isPreview && document.write('<!-- Bio JSON-LD skipped: Full Name is missing -->');
            } else {

                // ============================================================
                // College URL lookup — mirrors program layout static table
                // ============================================================

                var collegeUrls = {
                    "Albers School of Business & Economics": "https://www.seattleu.edu/business/",
                    "College of Arts & Sciences":            "https://www.seattleu.edu/arts-sciences/",
                    "College of Education":                  "https://www.seattleu.edu/education/",
                    "College of Nursing & Health Sciences":  "https://www.seattleu.edu/nursing-health-sciences/",
                    "College of Science & Engineering":      "https://www.seattleu.edu/science-engineering/",
                    "Cornish College of the Arts":           "https://www.cornish.edu/",
                    "School of Law":                         "https://law.seattleu.edu/"
                };

                // ============================================================
                // Step 1: Build knowsAbout array
                // ============================================================

                var knowsAbout = fields.expertise
                    ? fields.expertise.split('|')
                        .map(function (s) { return s.trim(); })
                        .filter(function (s) { return s !== ''; })
                    : [];

                // ============================================================
                // Step 2: Build sameAs array with deduplication
                // ============================================================

                var sameAsSeen = {};
                var sameAs = [
                    fields.linkedIn,
                    fields.researchGate,
                    fields.orcid,
                    fields.googleScholar,
                    fields.twitter,
                    fields.facebook,
                    fields.instagram,
                    fields.youtube,
                    fields.tiktok,
                    fields.threads,
                    fields.personalSite
                ]
                .map(function (s) { return s ? s.trim() : ''; })
                .filter(function (s) {
                    if (!s) return false;
                    if (sameAsSeen[s]) return false;
                    sameAsSeen[s] = true;
                    return true;
                });

                // ============================================================
                // Step 3: Build worksFor with conditional nesting
                // ============================================================

                var collegeName    = fields.college    ? fields.college.split('|')[0].trim()    : '';
                var departmentName = fields.department ? fields.department.split('|')[0].trim() : '';
                var collegeUrl     = collegeName ? (collegeUrls[collegeName] || null) : null;

                var worksFor = null;

                if (collegeName && departmentName) {
                    worksFor = { '@type': 'EducationalOrganization', 'name': collegeName };
                    if (collegeUrl) worksFor['url'] = collegeUrl;
                    worksFor['subOrganization'] = { '@type': 'EducationalOrganization', 'name': departmentName };
                } else if (collegeName) {
                    worksFor = { '@type': 'EducationalOrganization', 'name': collegeName };
                    if (collegeUrl) worksFor['url'] = collegeUrl;
                } else if (departmentName) {
                    worksFor = { '@type': 'EducationalOrganization', 'name': departmentName };
                }

                // ============================================================
                // Step 4: Build hasCredential array
                // Dictionary loads gated — only when credentials field is populated
                // ============================================================

                var hasCredential = [];

                if (fields.credentials) {

                    var degreeDict      = {};
                    var institutionDict = {};
                    var cipDict         = {};

                    try {
                        var mediaManager = ApplicationContextProvider.getBean(IMediaManager);

                        var readMediaJson = function (mediaID) {
                            try {
                                var mediaObj = mediaManager.get(mediaID, language);
                                var stream   = mediaObj.getMedia();
                                var scanner  = new Scanner(stream).useDelimiter('\\A');
                                var text     = '';
                                while (scanner.hasNext()) { text += scanner.next(); }
                                return JSON.parse(text);
                            } catch (e) {
                                isPreview && document.write('<!-- MediaManager load error [' + mediaID + ']: ' + e + ' -->');
                                return {};
                            }
                        };

                        degreeDict      = readMediaJson(10331836);
                        institutionDict = readMediaJson(10331835);
                        cipDict         = readMediaJson(10014460);

                    } catch (dictErr) {
                        isPreview && document.write('<!-- Dictionary init error: ' + dictErr + ' -->');
                    }

                    // --------------------------------------------------------
                    // findCipCode — fuzzy match field of study against cipDict
                    // --------------------------------------------------------

                    function findCipCode(fieldOfStudy) {
                        if (!fieldOfStudy) return null;
                        var field = fieldOfStudy.toLowerCase().trim();
                        var keys  = Object.keys(cipDict);
                        for (var i = 0; i < keys.length; i++) {
                            var key      = keys[i];
                            var keyParts = key.split(',');
                            var keyField = keyParts.slice(0, keyParts.length - 1)
                                                   .join(',').trim().toLowerCase();
                            if (!keyField) continue;
                            if (keyField === field ||
                                keyField.indexOf(field) !== -1 ||
                                field.indexOf(keyField) !== -1) {
                                return cipDict[key] ? (cipDict[key].cip || null) : null;
                            }
                        }
                        return null;
                    }

                    // --------------------------------------------------------
                    // buildHasCredential — parse pipe-delimited credentials
                    // --------------------------------------------------------

                    var degreeNormMap = {
                        'MSCS': 'MS',  'MSEE': 'MS',  'MSME': 'MS',
                        'MSCE': 'MS',  'MSIS': 'MS',  'MSBA': 'MBA',
                        'MSPA': 'MPA', 'MSPH': 'MPH', 'MSSW': 'MSW',
                        'MSHA': 'MS',  'MSTE': 'MS',
                        'BSCS': 'BS',  'BSEE': 'BS',  'BSME': 'BS',
                        'BSCE': 'BS',  'BSPH': 'BS',  'BSHS': 'BS',
                        'BSND': 'BS',  'BSRT': 'BS',  'BSRS': 'BS',
                        'BSMT': 'BS',  'BSHA': 'BS',  'BSOT': 'BS',
                        'BSPT': 'BS',  'BSAT': 'BS',
                        'Ph.D': 'PhD', 'Ph.D.': 'PhD', 'PHD': 'PhD',
                        'Ed.D': 'EdD', 'Ed.D.': 'EdD', 'EDD': 'EdD',
                        'J.D':  'JD',  'J.D.':  'JD',
                        'M.S':  'MS',  'M.S.':  'MS',
                        'M.A':  'MA',  'M.A.':  'MA',
                        'B.S':  'BS',  'B.S.':  'BS',
                        'B.A':  'BA',  'B.A.':  'BA',
                        'M.F.A': 'MFA', 'M.F.A.': 'MFA',
                        'M.B.A': 'MBA', 'M.B.A.': 'MBA',
                        'M.Ed':  'MEd', 'M.Ed.':  'MEd',
                        'M.S.N': 'MSN', 'M.S.N.': 'MSN',
                        'M.S.W': 'MSW', 'M.S.W.': 'MSW',
                        'B.F.A': 'BFA', 'B.F.A.': 'BFA',
                        'B.S.N': 'BSN', 'B.S.N.': 'BSN'
                    };

                    var credentialStrings = fields.credentials.split('|');

                    for (var i = 0; i < credentialStrings.length; i++) {
                        var raw = credentialStrings[i].trim();
                        if (!raw) continue;

                        var parts = raw.split(',')
                            .map(function (p) { return p.trim(); })
                            .filter(function (p) { return p !== ''; });
                        if (parts.length === 0) continue;

                        // Find degree token
                        var degreeAbbrev = null;
                        var degreeInfo   = null;
                        var degreeIdx    = -1;

                        for (var d = 0; d < parts.length; d++) {
                            var rawToken        = parts[d];
                            var normalizedToken = degreeNormMap[rawToken] || rawToken;
                            if (degreeDict[normalizedToken]) {
                                degreeAbbrev = normalizedToken;
                                degreeInfo   = degreeDict[normalizedToken];
                                degreeIdx    = d;
                                parts[d]     = normalizedToken;
                                break;
                            }
                        }

                        if (!degreeInfo) continue;

                        // Find institution token
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

                        // Field of study — remaining parts
                        var fieldParts = [];
                        for (var f = 0; f < parts.length; f++) {
                            if (f !== degreeIdx && f !== institutionIdx) {
                                fieldParts.push(parts[f]);
                            }
                        }
                        var fieldOfStudy = fieldParts.join(', ').trim();

                        // Assemble credential object
                        var credential = {
                            '@type':              'EducationalOccupationalCredential',
                            'name':               raw,
                            'credentialCategory': degreeInfo.credential_category || 'degree'
                        };

                        if (degreeInfo.isced_level) {
                            credential['educationalLevel'] = 'ISCED 2011 Level ' + degreeInfo.isced_level;
                        }

                        var cipCode = findCipCode(fieldOfStudy);
                        if (cipCode) {
                            credential['identifier'] = {
                                '@type':      'PropertyValue',
                                'propertyID': 'CIP 2020',
                                'value':      cipCode
                            };
                        }

                        if (institutionData) {
                            var recognizedBy = {
                                '@type': 'CollegeOrUniversity',
                                'name':  institutionName
                            };
                            if (institutionData.ror)     recognizedBy['@id'] = institutionData.ror;
                            if (institutionData.website) recognizedBy['url'] = institutionData.website;

                            var instSameAs = [];
                            if (institutionData.wikidata) {
                                instSameAs.push('https://www.wikidata.org/wiki/' + institutionData.wikidata);
                            }
                            if (institutionData.wikipedia) {
                                instSameAs.push(institutionData.wikipedia);
                            }
                            if (instSameAs.length > 0) recognizedBy['sameAs'] = instSameAs;

                            credential['recognizedBy'] = recognizedBy;

                        } else if (institutionName) {
                            credential['recognizedBy'] = {
                                '@type': 'CollegeOrUniversity',
                                'name':  institutionName
                            };
                        }

                        hasCredential.push(credential);
                    }
                }

                // ============================================================
                // Step 5: Assemble Person entity — no nulls
                // ============================================================

                var person = {
                    '@type': 'Person',
                    'name':  fields.fullName
                };

                if (fields.photo)       person['image']       = 'https://www.seattleu.edu' + fields.photo;
                if (fields.primaryTitle) person['jobTitle']   = fields.primaryTitle;
                if (fields.description)  person['description'] = fields.description;
                if (fields.email)        person['email']       = fields.email;
                if (fields.phone)        person['telephone']   = fields.phone;
                if (fields.url)          person['url']         = 'https://www.seattleu.edu' + fields.url;

                if (knowsAbout.length > 0)    person['knowsAbout']    = knowsAbout;
                if (hasCredential.length > 0) person['hasCredential'] = hasCredential;
                if (worksFor)                 person['worksFor']      = worksFor;

                person['affiliation'] = {
                    '@type': 'CollegeOrUniversity',
                    '@id':   'https://www.seattleu.edu/#organization'
                };

                if (sameAs.length > 0) person['sameAs'] = sameAs;

                if (fields.cv) person['subjectOf'] = {
                    '@type': 'CreativeWork',
                    'name':  'Curriculum Vitae',
                    'url':   'https://www.seattleu.edu' + fields.cv
                };

                // ============================================================
                // Step 6: Assemble ProfilePage wrapper
                // ============================================================

                var jsonLD = {
                    '@context': 'https://schema.org',
                    '@type':    'ProfilePage'
                };

                if (fields.lastModified) jsonLD['dateModified'] = fields.lastModified;

                jsonLD['mainEntity'] = person;

                // ============================================================
                // Step 7: Output JSON-LD script block
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
    isPreview && document.write('<!-- Bio JSON-LD error: ' + err + ' -->');
}
