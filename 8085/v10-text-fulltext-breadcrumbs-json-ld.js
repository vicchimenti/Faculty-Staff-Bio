/**
 * @file v10-text-fulltext-breadcrumbs-json-ld.js
 * @version 1.0.1
 * @created 2026-03-10
 * @modified 2026-03-10
 * @fileoverview Generates BreadcrumbList JSON-LD for Seattle University
 *               faculty and staff profile pages in the directory at
 *               seattleu.edu/directory/.
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
 * @requires com.terminalfour.version.Version
 * @requires Content Type: Faculty/Staff Bio - ID: 8085
 * @requires Navigation Object: Breadcrumbs for Structured Data - ID: 1129
 * @t4layout v10/text/fulltext/breadcrumbs/json-ld
 *
 * @description
 * Parses HTML anchor tags from the T4 Breadcrumb navigation object into a
 * Schema.org BreadcrumbList JSON-LD block. Automatically prepends the full
 * domain (https://www.seattleu.edu) to any relative links.
 *
 * Fulltext gating:
 *   isFullTextPage()     — confirms this is a fulltext publish context
 *   getFulltextInfo()    — retrieves the thread-local fulltext content info
 *   getContentID match   — ensures only the current item's JSON-LD is emitted
 *
 * In preview mode, diagnostic messages appear as HTML comments.
 */

/* eslint-disable no-undef, no-unused-vars */
/* global dbStatement, publishCache, section, content, language, isPreview, document, com */

try {

    // ========================================================================
    // Import T4 and Java classes
    // ========================================================================

    var FulltextBreadcrumbImports = JavaImporter(
        java.lang.Thread,
        com.terminalfour.publish.utils.BrokerUtils,
        com.terminalfour.publish.utils.TreeTraversalUtils,
        com.terminalfour.spring.ApplicationContextProvider,
        com.terminalfour.content.IContentManager,
        com.terminalfour.version.Version
    );

    with (FulltextBreadcrumbImports) {

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
             * @returns {string} The resolved tag value, or empty string on error.
             */
            function processTags(t4Tag) {
                try {
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
                } catch (tagErr) {
                    isPreview && document.write("<!-- processTags() error: " + tagErr + " -->");
                    return "";
                }
            }

            /**
             * Converts relative URLs to absolute URLs by prepending the
             * Seattle University domain to any href beginning with "/".
             *
             * @param {string} href - The href value to process.
             * @returns {string} The full URL with domain prepended if relative.
             */
            function makeFullUrl(href) {
                if (href.charAt(0) === "/") {
                    return "https://www.seattleu.edu" + href;
                }
                return href;
            }

            // ================================================================
            // Step 1: Retrieve and sanitize raw breadcrumb navigation markup
            // ================================================================

            var rawNav = processTags('<t4 type="navigation" name="Breadcrumbs for Structured Data" id="1129" />')
                .replace(/\r?\n|\r/g, "")
                .trim();

            isPreview && document.write("<!-- Raw Breadcrumb Nav (first 300 chars): " + rawNav.substring(0, 300) + " -->");

            // ================================================================
            // Step 2: Extract anchors from the navigation HTML
            // ================================================================

            var linkRegex = /<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>/gi;
            var breadcrumbData = [];
            var match;

            while ((match = linkRegex.exec(rawNav)) !== null) {
                breadcrumbData.push({
                    name: match[2].replace(/<[^>]*>/g, "").trim(),
                    item: makeFullUrl(match[1].trim())
                });
            }

            // ================================================================
            // Step 3: Validate and build JSON-LD structure
            // ================================================================

            if (breadcrumbData.length > 0) {

                var listItems = breadcrumbData.map(function (crumb, index) {
                    return {
                        "@type":    "ListItem",
                        "position": index + 1,
                        "name":     crumb.name,
                        "item":     crumb.item
                    };
                });

                var breadcrumbJSONLD = {
                    "@context":        "https://schema.org",
                    "@type":           "BreadcrumbList",
                    "itemListElement": listItems
                };

                // ============================================================
                // Step 4: Output JSON-LD script block
                // ============================================================

                document.write(
                    '<script type="application/ld+json" id="breadcrumb-jsonld">' +
                        JSON.stringify(breadcrumbJSONLD, null, 2) +
                    '<\/script>'
                );

            } else {
                isPreview && document.write("<!-- Breadcrumb JSON-LD: no valid anchor data found -->");
            }

        }
        // Non-fulltext pages and non-matching items are intentionally silent

    }

} catch (err) {
    isPreview && document.write("<!-- Breadcrumb JSON-LD error: " + err + " -->");
}
