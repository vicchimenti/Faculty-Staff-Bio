/**
 * @file v10/relatedNews/layout.js
 * @inheritdoc Faculty and Staff Bio (v10/text/new-fulltext id:203)
 * @version 1.1.0
 * @desc Tagged News Story Layout for the Faculty and Staff Bio content type fulltext
 */

/***
 *      Import T4 Utilities
 */
importClass(com.terminalfour.publish.utils.BrokerUtils);

/**
 * Extract values from T4 element tags and confirm valid existing content item field
 * @param {string} tag - T4 tag to process
 * @returns {Object} Object containing processed content or error
 */
function getContentValues(tag) {
    try {
        let _tag = BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, tag);
        return {
            isError: false,
            content: _tag != '' ? _tag : null 
        };
    } catch (error) {
        return {
            isError: true,
            message: `Error processing tag: ${tag}, Error: ${error.message}`
        };
    }
}

/**
 * Write the document
 * @param {string} content - HTML string to write
 */
function writeDocument(content) {
    document.write(content);
}

try {
    // Dictionary of content
    let relatedNewsDict = {
        newsFeed: getContentValues('<t4 type="navigation" name="Profile related news" id="994" />'),
        newsroomLink: getContentValues('<t4 type="navigation" name="Link to News & Stories" id="991" />')
    };

    // Validate dictionary values
    if (relatedNewsDict.newsFeed.isError || relatedNewsDict.newsroomLink.isError) {
        throw new Error('Error loading navigation content');
    }

    const hiddenSpan = '<span hidden class="d-none visually-hidden"></span>';

    // Concatenate all content into a single string
    let fullContent = '';

    if (relatedNewsDict.newsFeed.content && relatedNewsDict.newsroomLink.content) {
        fullContent = `
            <section class="related-news-stories-section global-padding--15x bg--dark bg--blue bg--gradient">
                <div class="grid-container oho-animate-sequence">
                    <div class="grid-x grid-margin-x">
                        <div class="cell large-9">
                            <div class="section-heading--basic text-margin-reset">
                                <h2 class="oho-animate fade-in">Similar News &amp; Stories</h2>
                                ${relatedNewsDict.newsroomLink.content ? 
                                    `<div class="section-heading__link global-spacing--2x oho-animate fade-in">
                                        <a href="${relatedNewsDict.newsroomLink.content}">Related News &amp; Stories</a>
                                    </div>` : 
                                    hiddenSpan}
                            </div>
                        </div>
                    </div>
                    ${relatedNewsDict.newsFeed.content ? 
                        `<ul class="grid-x grid-margin-x global-spacing--6x">
                            ${relatedNewsDict.newsFeed.content}
                        </ul>` : 
                        hiddenSpan}
                </div>
            </section>`;
    } else {
        fullContent = hiddenSpan;
    }

    // Single document write
    writeDocument(fullContent);

} catch (err) {
    document.write(`Error: ${err.message}`);
}