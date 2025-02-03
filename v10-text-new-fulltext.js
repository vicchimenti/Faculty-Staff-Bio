/**
* @file v10/text/new-fulltext.js
* @version 1.1.25
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
* @lastModified 2025-02-01
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
importClass(com.terminalfour.media.IMediaManager);
importClass(com.terminalfour.spring.ApplicationContextProvider);
importClass(com.terminalfour.publish.utils.BrokerUtils);
importClass(com.terminalfour.media.utils.ImageInfo);

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
 *      Returns a media object
 */
 function getMediaInfo(mediaID) {
    let mediaManager = ApplicationContextProvider.getBean(IMediaManager);
    let media = mediaManager.get(mediaID, language);
    return media;
 }
 
 /***
 *      Returns a media stream object
 */
 function readMedia(mediaID) {
    let mediaObj = getMediaInfo(mediaID);
    let oMediaStream = mediaObj.getMedia();
    return oMediaStream;
 }
 
 /***
 *      Returns a formatted html img tag
 *      for profile photo with required attributes
 */
 function getProfilePhoto() {
    let imageW1 = ' 422w, ';
    let imageW2 = ' 844w';
    let itemId = content.get('Photo').getID();
    let mediaInfo = getMediaInfo(itemId);
    let media = readMedia(itemId);
    let info = new ImageInfo();
    info.setInput(media);
    
    let mediaHTML = (info.check()) ? 
        `<figure class="aspect-ratio-frame" style="--aspect-ratio: 422/360">
            <img loading="eager" 
                 src="${mediaInfo.getUrlPath()}"
                 alt="${mediaInfo.getAltText()}"
                 width="${info.getWidth()}"
                 height="${info.getHeight()}">
        </figure>` : '';
 
    return mediaHTML;
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
    return `<li><a href="/office-directory/?typeOfOffice=${queryItem}" data-t4-ajax-link="true" title="${linkTag}">${linkTag}</a></li>`;
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
    photo: getContentValues('<t4 type="content" name="Photo" output="normal" />'),
    photoAlt: getContentValues('<t4 type="content" name="Photo" output="normal" formatter="text/alt" />'),
    name: getContentValues('<t4 type="content" name="Name of Faculty or Staff Member" output="normal" modifiers="striptags,htmlentities" />'),
    staffType: getContentValues('<t4 type="content" name="Type of Staff" output="normal" display_field="value" delimiter="|" />'),
    position: getContentValues('<t4 type="content" name="Position Title(s)" output="normal" modifiers="nl2br" />'),
    description: getContentValues('<t4 type="content" name="Description" output="normal" modifiers="striptags,htmlentities" />'),
 
    // Contact Info
    phone: getContentValues('<t4 type="content" name="Phone" output="normal" />'),
    email: getContentValues('<t4 type="content" name="Email Address" output="normal" />'),
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
    primaryDept: getContentValues('<t4 type="content" name="Primary Department" output="normal" modifiers="nav_sections" />'),
    secondaryDept: getContentValues('<t4 type="content" name="Secondary Department" output="normal" modifiers="nav_sections" />'),
    homeCollege: getContentValues('<t4 type="content" name="Home College" output="normal" modifiers="nav_sections" />'),
    pronouns: getContentValues('<t4 type="content" name="Pronouns" output="normal" modifiers="striptags,htmlentities" />'),
    expertise: getContentValues('<t4 type="content" name="Areas of Expertise" output="normal" modifiers="striptags,htmlentities" />'),
 
    // Additional Content
    extendedBio: getContentValues('<t4 type="content" name="Extended Biography" output="normal" modifiers="medialibrary,nav_sections" />'),
    education: getContentValues('<t4 type="content" name="Education" output="normal" modifiers="medialibrary,nav_sections" />'),
    coursesTaught: getContentValues('<t4 type="content" name="Courses Taught" output="normal" modifiers="medialibrary,nav_sections" />'),
    publications: getContentValues('<t4 type="content" name="Publications" output="normal" modifiers="medialibrary,nav_sections" />')
 };
 
 /***
 *      Dictionary of nav items
 */
 let navDict = {
    biosBreadcrumb: getNavValues('<t4 type="navigation" name="Bios breadcrum v10" id="1028" />'),
    bioHomeLink: getNavValues('<t4 type="navigation" name="Faculty and Staff Bio Link to Home" id="995" />')
 };