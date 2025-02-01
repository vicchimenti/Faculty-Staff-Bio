/**
 * @file v10/relatedNews/layout.js
 * @inheritdoc Faculty and Staff Bio (v10/text/new-fulltext id:203)
 * @version 1.0.1
 * @desc Tagged News Story Layout for the Faculty and Staff Bio content type fulltext
 * 
 */

/***
 *      Import T4 Utilities
 */
importClass(com.terminalfour.spring.ApplicationContextProvider);
importClass(com.terminalfour.publish.utils.BrokerUtils);

/**
 *     Import media libraries<section class="related-news-stories-section global-padding--15x bg--dark bg--blue bg--gradient">
  <div class="grid-container oho-animate-sequence">
    <div class="grid-x grid-margin-x">
      <div class="cell large-9">
        <div class="section-heading--basic text-margin-reset">
          <h2 class="oho-animate fade-in">Similar News &amp; Stories</h2>
          <div class="section-heading__link global-spacing--2x oho-animate fade-in">
            <a href="<t4 type=&quot;navigation&quot; name=&quot;Link to News & Stories&quot; id=&quot;991&quot; />">Related News &amp; Stories</a>
          </div>
        </div>
      </div>
    </div>
    <ul class="grid-x grid-margin-x global-spacing--6x">
      <t4 type="navigation" name="Profile related news" id="994" />
    </ul>
  </div>
</section>
 */


/***
*  Set defaults
* 
* */
let beginningHTML = '<div class="hero--basic"><div class="grid-container"><div class="grid-x grid-margin-x">';
let endingHTML = '</div></div></div>';
let openImageWrapper = '<div class="cell medium-4 global-spacing--5x">';
let closeImageWrapper = '</div>';
let openSummaryWrapper = '<div class="cell auto global-spacing--5x"><div class="hero--basic__text hero--profile__text text-margin-reset">';
let closeSummaryWrapper = '</div></div>';
let openSummary = '<div class="wysiwyg"><p>';
let closeSummary = '</p></div>';
let openArticle = '<div class="grid-container global-spacing--10x"><div class="grid-x grid-margin-x"><div class="cell medium-8">';
let closeArticle = '</div></div></div>';
let background = '<h2>Background</h2>';




/***
 *      Extract values from T4 element tags
 *      and confirm valid existing content item field
 */
function getContentValues(tag) {

    try {
        let _tag = BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, tag).trim();

        return {
            isError: false,
            content: _tag != '' ? _tag : null 
        };

    } catch (error) {

        return {
            isError: true,
            message: error.message
        };
    }
}























/***
 *      Write the document
 */
function writeDocument(array) {

    for (let i = 0; i < array.length; i++) {

        document.write(array[i]);
    }
}




try {


<t4 type="navigation" name="Profile related news" id="994" />
<t4 type="navigation" name="Link to News & Stories" id="991" />
/***
*      Dictionary of content
* */
let relatedNewsDict = {

    contentName: getContentValues('<t4 type="content" name="Name" output="normal" modifiers="striptags,htmlentities" />'),
    firstName: getContentValues('<t4 type="content" name="First Name" output="normal" modifiers="striptags,htmlentities" />'),
    lastName: getContentValues('<t4 type="content" name="Last Name" output="normal" modifiers="striptags,htmlentities" />'),
    fullName:getContentValues('<t4 type="content" name="Full Name" output="normal" modifiers="striptags,htmlentities" />'),
    jobTitle: getContentValues('<t4 type="content" name="Job Title" output="normal" modifiers="striptags,htmlentities" />'),
    company: getContentValues('<t4 type="content" name="Company" output="normal" modifiers="striptags,htmlentities" />'),
    industry: getContentValues('<t4 type="content" name="Industry" output="normal" modifiers="striptags,htmlentities" />'),
    mentorSince: getContentValues('<t4 type="content" name="Mentor Since" output="normal" modifiers="striptags,htmlentities" />'),
    linkedIn: getContentValues('<t4 type="content" name="LinkedIn Profile Link" output="normal" modifiers="striptags,htmlentities" />'),
    jobDescription: getContentValues('<t4 type="content" name="Job Description" output="normal" modifiers="medialibrary,nav_sections" />'),
    companyDescription: getContentValues('<t4 type="content" name="Company Description" output="normal" modifiers="medialibrary,nav_sections" />'),
    employmentHistory: getContentValues('<t4 type="content" name="Employment History" output="normal" modifiers="medialibrary,nav_sections" />'),
    education: getContentValues('<t4 type="content" name="Education" output="normal" modifiers="medialibrary,nav_sections" />'),
    civicInvolvement: getContentValues('<t4 type="content" name="Civic Involvement" output="normal" modifiers="medialibrary,nav_sections" />'),
    objectives: getContentValues('<t4 type="content" name="Mentoring Objectives and Scope" output="normal" modifiers="medialibrary,nav_sections" />'),
    additionalInfo: getContentValues('<t4 type="content" name="Additional Information" output="normal" modifiers="medialibrary,nav_sections" />'),
    yourMeetings: getContentValues('<t4 type="content" name="Your Meetings" output="normal" modifiers="medialibrary,nav_sections" />'),
    whenAndWhere: getContentValues('<t4 type="content" name="When and where do you hold meetings with your " output="normal" modifiers="medialibrary,nav_sections" />'),
    studentType: getContentValues('<t4 type="content" name="Student Type" output="normal" modifiers="striptags,htmlentities" />'),
    willMentor: getContentValues('<t4 type="content" name="Will Mentor" output="normal" display_field="value" />'),
    imageId: getContentValues('<t4 type="content" name="Image ID" output="normal" modifiers="striptags,htmlentities" />'),
    photo: getContentValues('<t4 type="content" name="Photo" output="image" alt="name" />'),
    anchor: getContentValues('<t4 type="meta" meta="html_anchor" />'),
    contentId: getContentValues('<t4 type="meta" meta="content_id" />')


    <t4 type=&quot;navigation&quot; name=&quot;Link to News & Stories&quot; id=&quot;991&quot; />">Related News &amp; Stories</a>
          </div>


          <t4 type="navigation" name="Profile related news" id="994" />
};









/***
*  Job Title
* 
* */
let jobTitleString = (mentorDict.jobTitle.content) ?
    '<strong>Job Title: </strong>' + mentorDict.jobTitle.content + '<br>' :
    '<span class="jobTitle d-none hidden visually-hidden">No job title entered</span>';






/***
*  write document once
* 
* */
writeDocument(
    [

    ]
);




} catch (err) {
document.write(err.message);
}
