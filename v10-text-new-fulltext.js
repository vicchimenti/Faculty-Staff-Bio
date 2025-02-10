/**
* @file v10/text/new-fulltext.js
* @version 1.3.1
* @fileoverview Faculty and Staff Bio Profile Layout
* @desc Profile layout for Faculty and Staff Bio content type
* @author Victor Chimenti
* @copyright 2025 Seattle University
* @requires com.terminalfour.publish.utils.BrokerUtils
* @requires com.terminalfour.media.IMediaManager
* @requires com.terminalfour.spring.ApplicationContextProvider
* @requires com.terminalfour.media.utils.ImageInfo
* @requires Navigation Object (id:1028) - Bio breadcrumb
* @requires Navigation Object (id:995) - Bio Link to Home
* @since 1.0.0
* @lastModified 2025-02-10
* 
* @example
* // The profile layout includes:
* // - Hero section with photo and basic info
* // - Contact information aside
* // - School affiliation aside
* // - Biography, Education, Courses, and Publications sections
*/

/***
*      Import T4 Utilities
*/
importClass(com.terminalfour.spring.ApplicationContextProvider);
importClass(com.terminalfour.publish.utils.BrokerUtils);

/***
*      Extract values from T4 element tags
*      and confirm valid existing content item field
*/
function getContentValues(tag) {
    try {
        let _tag = BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, tag).trim();
        return {
            isError: false,
            content: _tag == '' ? null : _tag
        };
    } catch (error) {
        return {
            isError: true,
            message: error.message
        };
    }
 }
 
 /***
 *      Extract values from T4 navigation tags
 *      and confirm valid existing nav item
 */
 function getNavValues(tag) {
    try {
        let _tag = BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, tag);
        return {
            isError: false,
            content: _tag == '' ? null : _tag
        };
    } catch (error) {
        return {
            isError: true,
            message: error.message
        };
    }
 }
  
 /***
 *      Process query by replacing spaces with URL encoding
 */
 function processQuery(query) {
    let regex = /\s/g;
    let replacement = "%20";
    return query.replace(regex, replacement);
 }
 
 /***
 *      Build directory query links
 */
 function processLinks(linkTag) {
    let queryItem = processQuery(linkTag);
    return `<li><a href="/directory/?typeOfStaff=${queryItem}" data-t4-ajax-link="true" title="${linkTag}">${linkTag}</a></li>`;
 }
 
 /***
 *      Process staff type tags into directory links
 */
 function processStaffType(tags) {
    if (!tags) return '';
    let tagList = tags.split('|');
    return tagList.map(tag => processLinks(tag.trim())).join('');
 }
 
 /***
 *      Dictionary of content
 */
 let contentDict = {
    // Profile Info
    photo: getContentValues('<t4 type="content" name="Photo" output="normal" formatter="v10/image/pxl-crop" cdn="true" pxl-filter-id="67" />'),
    photoAlt: getContentValues('<t4 type="content" name="Photo" output="normal" formatter="text/alt" />'),
    name: getContentValues('<t4 type="content" name="Name of Faculty or Staff Member" output="normal" modifiers="striptags,htmlentities" />'),
    staffType: getContentValues('<t4 type="content" name="Type of Staff" output="normal" display_field="value" delimiter="|" />'),
    position: getContentValues('<t4 type="content" name="Position Title(s)" output="normal" modifiers="nl2br" />'),
    description: getContentValues('<t4 type="content" name="Description" output="normal" modifiers="striptags,htmlentities" />'),
 
    // Contact Info
    phone: getContentValues('<t4 type="content" name="Phone" output="normal" />'),
    email: getContentValues('<t4 type="content" name="Email Address" output="normal" modifiers="striptags,htmlentities,encode_emails" />'),
    personalWebsite: getContentValues('<t4 type="content" name="Personal Website" output="normal" />'),
 
    // Social Media
    tiktok: getContentValues('<t4 type="content" name="TikTok URL" output="normal" />'),
    threads: getContentValues('<t4 type="content" name="Threads URL" output="normal" />'),
    twitter: getContentValues('<t4 type="content" name="Twitter/X URL" output="normal" />'),
    youtube: getContentValues('<t4 type="content" name="YouTube URL" output="normal" />'),
    linkedin: getContentValues('<t4 type="content" name="LinkedIn URL" output="normal" />'),
    instagram: getContentValues('<t4 type="content" name="Instagram URL" output="normal" />'),
    facebook: getContentValues('<t4 type="content" name="Facebook URL" output="normal" />'),
 
    // Affiliations
    primaryDeptLinkText: getContentValues('<t4 type="content" name="Primary Department" output="linktext" modifiers="nav_sections" />'),
    primaryDeptURL: getContentValues('<t4 type="content" name="Primary Department" output="linkurl" modifiers="nav_sections" />'),
    secondaryDeptLinkText: getContentValues('<t4 type="content" name="Secondary Department" output="linktext" modifiers="nav_sections" />'),
    secondaryDeptURL: getContentValues('<t4 type="content" name="Secondary Department" output="linkurl" modifiers="nav_sections" />'),
    homeCollegeLinkText: getContentValues('<t4 type="content" name="Home College" output="linktext" modifiers="nav_sections" />'),
    HomeCollegeURL: getContentValues('<t4 type="content" name="Home College" output="linkurl" modifiers="nav_sections" />'),
    pronouns: getContentValues('<t4 type="content" name="Pronouns" output="normal" modifiers="striptags,htmlentities" />'),
    expertise: getContentValues('<t4 type="content" name="Areas of Expertise" output="normal" modifiers="striptags,htmlentities" />'),
 
    // Additional Content
    extendedBio: getContentValues('<t4 type="content" name="Extended Biography" output="normal" modifiers="medialibrary,nav_sections" />'),
    education: getContentValues('<t4 type="content" name="Education" output="normal" modifiers="medialibrary,nav_sections" />'),
    coursesTaught: getContentValues('<t4 type="content" name="Courses Taught" output="normal" modifiers="medialibrary,nav_sections" />'),
    publications: getContentValues('<t4 type="content" name="Publications" output="normal" modifiers="medialibrary,nav_sections" />'),

    // Meta Tags
    itemId: getContentValues('<t4 type="meta" meta="content_id" />')
 };
 
 /***
 *      Dictionary of nav items
 */
 let navDict = {
    biosBreadcrumb: getNavValues('<t4 type="navigation" name="Bios breadcrum v10" id="1028" />'),
    bioHomeLink: getNavValues('<t4 type="navigation" name="Faculty and Staff Bio Link to Home" id="995" />'),
    relatedNewsFeed: getNavValues('<t4 type="navigation" name="Profile related news" id="994" />'),
    newsroomLink: getNavValues('<t4 type="navigation" name="Newsroom Link" id="993" />')
 };

 try {
    // Test for valid item
    if (!contentDict.name || !contentDict.itemId || !contentDict.photo.content) {
        throw new Error("Required content is missing");
    }

    const hiddenSpan = '<span hidden class="d-none visually-hidden hidden"></span>';

    // Build full content with template literal
    let fullContent = `
        <div class="hero--basic" id="bio${contentDict.itemId.content}">
            <div class="grid-container">
                <div class="grid-x grid-margin-x">
                    <div class="cell medium-4">
                        ${(contentDict.photo.content && contentDict.photoAlt.content) ?
                            `<figure class="aspect-ratio-frame" style="--aspect-ratio: 422/360">
                                <img loading="eager" href="${content.photo.content}" alt="${content.photoAlt.content}" ></figure>` :
                        (contentDict.photo.content) ?
                            `<figure class="aspect-ratio-frame" style="--aspect-ratio: 422/360">
                                <img loading="eager" href="${content.photo.content}" alt="" ></figure>` : hiddenSpan
                        }
                    </div>
                    <div class="cell auto">
                        <div class="hero--basic__text hero--profile__text text-margin-reset">
                            ${contentDict.name.content ? 
                                `<h1 class="h2">${contentDict.name.content}</h1>` : 
                                hiddenSpan
                            }
                            ${contentDict.staffType.content ?
                                `<div class="tags tags__links">
                                    <h2 class="tags__heading show-for-sr">Profile Type:</h2>
                                    <ul>${processStaffType(contentDict.staffType.content)}</ul>
                                </div>` :
                                hiddenSpan
                            }
                            ${contentDict.position.content ?
                                `<div class="wysiwyg">
                                    <p>${contentDict.position.content}</p>
                                </div>` :
                                hiddenSpan
                            }
                            ${navDict.biosBreadcrumb.content || ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid-container global-spacing--10x">
            <div class="grid-x grid-margin-x">
                <div class="cell medium-4">
                    
                    <!-- Contact Section -->
                    ${(contentDict.phone.content || contentDict.email.content || contentDict.personalWebsite.content) ?
                        `<aside class="callout text-margin-reset">
                            ${(contentDict.phone.content || contentDict.email.content) ?
                                `<div class="eyebrow" id="contact-title">Contact Information</div>
                                <ul class="icon-list" id="contact-list">
                                    ${contentDict.phone.content ?
                                        `<li>
                                            <span class="icon-list__icon fas fa-phone" aria-hidden="true"></span>
                                            <span class="icon-list__content">
                                                <a href="tel:${contentDict.phone.content}">${contentDict.phone.content}</a>
                                            </span>
                                        </li>` : ''
                                    }
                                    ${contentDict.email.content ?
                                        `<li>
                                            <span class="icon-list__icon fas fa-envelope" aria-hidden="true"></span>
                                            <span class="icon-list__content">
                                                <a href="mailto:${contentDict.email.content}">${contentDict.email.content}</a>
                                            </span>
                                        </li>` : ''
                                    }
                                </ul>` : ''
                            }

                            ${contentDict.personalWebsite.content ?
                                `<div class="eyebrow" id="relevant-sites-title">Relevant Sites</div>
                                <ul id="relevant-sites-list">
                                    <li>
                                        <a href="${contentDict.personalWebsite.content}">
                                            ${contentDict.personalWebsite.content}
                                        </a>
                                    </li>
                                </ul>` : ''
                            }
                        </aside>` : 
                        hiddenSpan
                    }

                    <!-- Social Media Section -->
                    ${(contentDict.tiktok.content || contentDict.threads.content || contentDict.twitter.content ||
                      contentDict.youtube.content || contentDict.linkedin.content || contentDict.instagram.content ||
                      contentDict.facebook.content) ?
                        `<div class="eyebrow" id="social-media-title">Connect</div>
                        <ul class="icon-list social-media global-spacing--4x btn-row" id="social-media-list">
                            ${contentDict.tiktok.content ?
                                `<li>
                                    <a href="${contentDict.tiktok.content}" target="_blank" aria-label="Tiktok opens in a new window">
                                        <span class="show-for-sr">Tiktok</span>
                                        <span class="fa-brands fa-tiktok" aria-hidden="true"></span>
                                    </a>
                                </li>` : ''
                            }
                            ${contentDict.threads.content ?
                                `<li>
                                    <a href="${contentDict.threads.content}" target="_blank" aria-label="Threads opens in a new window">
                                        <span class="show-for-sr">Threads</span>
                                        <span class="fa-brands fa-square-threads" aria-hidden="true"></span>
                                    </a>
                                </li>` : ''
                            }
                            ${contentDict.twitter.content ?
                                `<li>
                                    <a href="${contentDict.twitter.content}" target="_blank" aria-label="Twitter opens in a new window">
                                        <span class="show-for-sr">Twitter</span>
                                        <span class="fa-brands fa-square-x-twitter" aria-hidden="true"></span>
                                    </a>
                                </li>` : ''
                            }
                            ${contentDict.youtube.content ?
                                `<li>
                                    <a href="${contentDict.youtube.content}" target="_blank" aria-label="YouTube opens in a new window">
                                        <span class="show-for-sr">YouTube</span>
                                        <span class="fa-brands fa-square-youtube" aria-hidden="true"></span>
                                    </a>
                                </li>` : ''
                            }
                            ${contentDict.linkedin.content ?
                                `<li>
                                    <a href="${contentDict.linkedin.content}" target="_blank" aria-label="LinkedIn opens in a new window">
                                        <span class="show-for-sr">LinkedIn</span>
                                        <span class="fa-brands fa-linkedin" aria-hidden="true"></span>
                                    </a>
                                </li>` : ''
                            }
                            ${contentDict.instagram.content ?
                                `<li>
                                    <a href="${contentDict.instagram.content}" target="_blank" aria-label="Instagram opens in a new window">
                                        <span class="show-for-sr">Instagram</span>
                                        <span class="fa-brands fa-square-instagram" aria-hidden="true"></span>
                                    </a>
                                </li>` : ''
                            }
                            ${contentDict.facebook.content ?
                                `<li>
                                    <a href="${contentDict.facebook.content}" target="_blank" aria-label="Facebook opens in a new window">
                                        <span class="show-for-sr">Facebook</span>
                                        <span class="fa-brands fa-square-facebook" aria-hidden="true"></span>
                                    </a>
                                </li>` : ''
                            }
                        </ul>` :
                        hiddenSpan
                    }

                    <!-- Affiliation Section -->
                    ${(contentDict.primaryDeptURL.content || contentDict.HomeCollegeURL.content ||
                      contentDict.pronouns.content || contentDict.expertise.content || contentDict.secondaryDeptURL.content) ?
                        `<aside class="school-affiliation text-margin-reset global-spacing--1x">
                            <dl>
                                ${contentDict.primaryDeptLinkText.content ?
                                    `<dt>Office/Department</dt>
                                    <dd>
                                        <ul>
                                            <li><a href="${contentDict.primaryDeptURL.content}">${contentDict.primaryDeptLinkText.content}</a></li>
                                            ${contentDict.secondaryDeptLinkText.content ?
                                                `<li><a href="${contentDict.secondaryDeptURL.content}">${contentDict.secondaryDeptLinkText.content}</a></li>` : ''
                                            }
                                        </ul>
                                    </dd>` : ''
                                }
                                ${contentDict.homeCollegeLinkText.content ?
                                    `<dt>School/College</dt>
                                    <dd>
                                        <ul>
                                            <li><a href="${contentDict.HomeCollegeURL.content}">${contentDict.homeCollegeLinkText.content}</a></li>
                                        </ul>
                                    </dd>` : ''
                                }                                
                                ${contentDict.pronouns.content ?
                                    `<dt>Pronouns</dt>
                                    <dd>
                                        <ul>
                                            <li>${contentDict.pronouns.content}</li>
                                        </ul>
                                    </dd>` : ''
                                }
                                ${contentDict.expertise.content ?
                                    `<dt>Areas of Expertise</dt>
                                    <dd>
                                        <div class="wysiwyg">
                                            ${contentDict.expertise.content}
                                        </div>
                                    </dd>` : ''
                                }
                            </dl>
                        </aside>` :
                        hiddenSpan
                    }
                </div>

                <!-- Main Content Section -->
                <div class="cell medium-8">
                    ${contentDict.description.content ?
                        `<p class="intro-text">${contentDict.description.content}</p>` : ''
                    }
                    
                    <!-- Accordion Sections -->
                    ${[
                        {name: 'biography', title: 'Biography', content: contentDict.extendedBio.content},
                        {name: 'education', title: 'Education', content: contentDict.education.content},
                        {name: 'courses-taught', title: 'Courses Taught', content: contentDict.coursesTaught.content},
                        {name: 'publications', title: 'Publications', content: contentDict.publications.content}
                    ].map((section, index) => section.content ?
                        `<div class="profile--section profile--section__${section.name} global-spacing--5x">
                            <div class="more-less">
                                <div class="global-spacing--1x">
                                    <button type="button" class="more-less__toggle"
                                        data-button-open-text=""
                                        data-button-close-text=""
                                        data-button-enable-at="0"
                                        data-button-disable-at="-1"
                                        data-button-open-class="more-less-open"
                                        data-button-open-class-element=".more-less"
                                        aria-live="polite"
                                        aria-label="Expand to see the full text"
                                        id="expand-to-see-the-full-text--button-toggle-${index + 1}"
                                        data-toggle-type="accordion"
                                        aria-expanded="true">
                                        <span>Compare</span>
                                    </button>
                                </div>
                                <div class="more-less__content">
                                    <div class="more-less__item">
                                        <h2 class="h3">${section.title}</h2>
                                        <div class="wysiwyg">${section.content}</div>
                                    </div>
                                </div>
                            </div>
                        </div>` : ''
                    ).join('')}
                </div>
            </div>
        </div>

        <!-- Related News & Stories Section -->
        ${(navDict.relatedNewsFeed.content) ?
            `<section class="related-news-stories-section global-padding--15x bg--dark bg--blue bg--gradient">
                <div class="grid-container oho-animate-sequence">
                    <div class="grid-x grid-margin-x">
                        <div class="cell large-9">
                            <div class="section-heading--basic text-margin-reset">
                                <h2 class="oho-animate fade-in">Similar News &amp; Stories</h2>
                                <div class="section-heading__link global-spacing--2x oho-animate fade-in">
                                <a href="${navDict.newsroomLink.content}">Related News &amp; Stories</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ul class="grid-x grid-margin-x global-spacing--6x">
                        ${navDict.relatedNewsFeed.content}
                    </ul>
                </div>
            </section>`: hiddenSpan
        }
    `;

    // Write full content to document
    document.write(fullContent);

} catch (err) {
    document.write(err.message);
}