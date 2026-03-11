/**
 * @file text-json-ld-bio.js
 * @version 2.1.0
 * @created 2026-03-09
 * @modified 2026-03-09
 * @fileoverview Generates Person JSON-LD for Seattle University
 *               faculty and staff profile pages in the directory at
 *               seattleu.edu/directory/. Outputs a standalone structured
 *               data block alongside existing Funnelback microdata meta
 *               tags without replacing them.
 *
 * @author
 * Victor Chimenti  |  Seattle University WebOps
 *
 * @copyright
 * © 2026 Seattle University. All rights reserved.
 *
 * @requires com.terminalfour.publish.utils.BrokerUtils
 * @requires Content Type: Faculty/Staff Bio - ID: 8085
 *
 * @description
 * Wraps a Schema.org Person entity inside a ProfilePage using JSON-LD.
 * All existing Funnelback microdata meta tags are preserved and unaffected.
 *
 * Person fields mapped from T4 content item:
 *   name           ← Full Name
 *   jobTitle       ← Primary Title
 *   description    ← Description
 *   email          ← Email Address
 *   telephone      ← Phone
 *   url            ← Name of Faculty or Staff Member fulltext path
 *                    (same source as twitter:url meta tag)
 *                    prepended with https://www.seattleu.edu
 *   knowsAbout     ← Areas of Expertise (pipe-delimited → string array)
 *   worksFor       ← Staff College + Staff Department (conditional nesting)
 *   affiliation    ← Static @id reference to CollegeOrUniversity entity
 *   sameAs         ← All social + academic profile URL fields (combined array)
 *   subjectOf      ← Curriculum Vitae (full HTTPS URL → CreativeWork object)
 *
 * ProfilePage fields:
 *   dateModified   ← item-level last_modified meta tag (date only)
 *
 * worksFor nesting logic:
 *   Both college and department present → college wraps department as
 *     subOrganization (college URL included from static lookup)
 *   College only → college object with URL, no nesting
 *   Department only → department object, no URL
 *   Neither → worksFor omitted entirely
 *
 * Deferred:
 *   image          ← Photo (relative path → full HTTPS URL)
 *   dateModified   ← Full UTC ISO 8601 datetime pending ProfilePage
 *                    meta-content file conversion from HTML to JS
 *                    programmable layout
 */

/* eslint-disable no-undef, no-unused-vars */
/* global dbStatement, publishCache, section, content, language, isPreview, document, com */

try {

    // ========================================================================
    // T4 Utilities
    // ========================================================================

    /**
     * Processes a T4 tag string and returns the resolved value as a string.
     *
     * @param {string} t4Tag - The T4 tag markup to evaluate.
     * @returns {string} The resolved tag value from the content item.
     */
    function processTags(t4Tag) {
        myContent = content || null;
        return String(
            com.terminalfour.publish.utils.BrokerUtils.processT4Tags(
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
     * Handles smart quotes, dashes, ampersands, non-breaking spaces,
     * and ellipses.
     *
     * @param {string} str - The string containing HTML entities.
     * @returns {string} The decoded string, or the original value if falsy.
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

    // ========================================================================
    // College URL lookup — mirrors program layout static table
    // ========================================================================

    var collegeUrls = {
        "Albers School of Business & Economics": "https://www.seattleu.edu/business/",
        "College of Arts & Sciences":            "https://www.seattleu.edu/arts-sciences/",
        "College of Education":                  "https://www.seattleu.edu/education/",
        "College of Nursing & Health Sciences":  "https://www.seattleu.edu/nursing-health-sciences/",
        "College of Science & Engineering":      "https://www.seattleu.edu/science-engineering/",
        "Cornish College of the Arts":           "https://www.cornish.edu/",
        "School of Law":                         "https://law.seattleu.edu/"
    };

    // ========================================================================
    // Step 1: Gather field data from T4 content item
    // ========================================================================

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
    list["lastModified"]  = processTags('<t4 type="meta" meta="last_modified" format="yyyy/MM/dd" />');

    // Expertise and organizational fields
    list["expertise"]     = processTags('<t4 type="content" name="Areas of Expertise" output="normal" modifiers="striptags,htmlentities" />');
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

    // ========================================================================
    // Step 2: Bail early if Full Name is missing
    // ========================================================================

    var fullName = sanitizeText(list["fullName"]);

    if (!fullName) {
        isPreview && document.write("<!-- Bio JSON-LD skipped: Full Name is missing -->");
    } else {

        // ====================================================================
        // Step 3: Build knowsAbout array from pipe-delimited expertise field
        // ====================================================================

        var knowsAbout = list["expertise"]
            .split("|")
            .map(function (s) { return sanitizeText(s); })
            .filter(function (s) { return s !== ""; });

        // ====================================================================
        // Step 4: Build sameAs array — academic profiles then social URLs
        // ====================================================================

        var sameAs = [
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

        // ====================================================================
        // Step 5: Build worksFor with conditional college → department nesting
        // ====================================================================

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

        // ====================================================================
        // Step 6: Assemble Person entity — conditional assignment, no nulls
        // ====================================================================

        var person = {
            "@type": "Person",
            "name":  fullName
        };

        var jobTitle    = sanitizeText(list["primaryTitle"]);
        var description = sanitizeText(list["description"]);
        var email       = sanitizeText(list["email"]);
        var telephone   = sanitizeText(list["phone"]);
        var profileUrl  = sanitizeText(list["url"]);

        if (list["photo"])             person["image"]       = list["photo"];
        if (jobTitle)                  person["jobTitle"]    = jobTitle;
        if (description)               person["description"] = description;
        if (email)                     person["email"]       = email;
        if (telephone)                 person["telephone"]   = telephone;
        if (profileUrl)                person["url"]         = profileUrl;
        if (knowsAbout.length > 0)     person["knowsAbout"]  = knowsAbout;
        if (worksFor)                  person["worksFor"]    = worksFor;

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

        // ====================================================================
        // Step 7: Assemble ProfilePage wrapper
        // ====================================================================

        var jsonLD = {
            "@context":   "https://schema.org",
            "@type":      "ProfilePage",
            "mainEntity": person
        };

        var dateModified = sanitizeText(list["lastModified"]);
        if (dateModified) jsonLD["dateModified"] = dateModified;

        // ====================================================================
        // Step 8: Output JSON-LD script block
        // ====================================================================

        document.write(
            '<script type="application/ld+json" id="person-jsonld">' +
                JSON.stringify(jsonLD, null, 2) +
            '<\/script>'
        );

    }

} catch (err) {
    isPreview && document.write("<!-- Bio JSON-LD error: " + err + " -->");
}