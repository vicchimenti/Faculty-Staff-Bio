/***
 *      Import T4 Utilities
 */
importClass(com.terminalfour.spring.ApplicationContextProvider);
importClass(com.terminalfour.publish.utils.BrokerUtils);




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
 *        Returns a formatted string from a list
 */
function assignList(tags) {

    let arrayofTags = tags.split(',');
    let listValues = '';
    let openList = '<strong>Will Mentor: </strong>';
    let closeList = '<br>';

    for (let tag = 0; tag < arrayofTags.length; tag++) {

        if (tag === 0  || tag === (arrayofTags.length-1)) {

            listValues +=  '' + arrayofTags[tag].trim() + '';

        } else {

            listValues +=  '' + arrayofTags[tag].trim() + ', ';
        }  
    }

    return (openList + listValues + closeList);
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
 */
function imageTag(itemId) {

    let mediaPath = BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, '<t4 type="media" formatter="path/*" id="' + itemId + '" />');
    let mediaInfo = getMediaInfo(itemId);
    let media = readMedia(itemId);
    let info = new ImageInfo();
    info.setInput(media);

    //    Until the alt descriptions are updated, use the name

    let imageHTML = (info.check()) ?
        '<figure class="aspect-ratio-frame"><img src="' + mediaPath + '" aria-label="' + mediaInfo.getName() + '" alt="' + mediaInfo.getName() + '" width="' + info.getWidth() + '" height="' + info.getHeight() + '" loading="auto" /></figure>' :
        '<figure class="d-none hidden visually-hidden"><span class="class="visually-hidden hidden">Invalid Image ID</span></figure>';

    return imageHTML;
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



/***
*      Dictionary of content
* */
let mentorDict = {

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

};




/***
*  Name String
* 
* */
let nameString = (mentorDict.firstName.content && mentorDict.lastName.content) ?
    '<h1 class="h2">' + mentorDict.firstName.content + ' ' + mentorDict.lastName.content + '</h1>' :
    '<span class="d-none hidden visually-hidden">No valid name entered</span>';




/***
*  Job Title
* 
* */
let jobTitleString = (mentorDict.jobTitle.content) ?
    '<strong>Job Title: </strong>' + mentorDict.jobTitle.content + '<br>' :
    '<span class="jobTitle d-none hidden visually-hidden">No job title entered</span>';




/***
*  Company
* 
* */
let companyString = (mentorDict.company.content) ?
'<strong>Company: </strong>' + mentorDict.company.content + '<br>' :
'<span class="company d-none hidden visually-hidden">No company entered</span>';




/***
*  Industry
* 
* */
let industryString = (mentorDict.industry.content) ?
    '<strong>Industry: </strong>' + mentorDict.industry.content + '<br>' :
    '<span class="industry d-none hidden visually-hidden">No industry entered</span>';




/***
*  Mentor Since
* 
* */
let mentorSinceString = (mentorDict.mentorSince.content) ?
'<strong>Mentor Since: </strong>' + mentorDict.mentorSince.content + '<br>' :
'<span class="mentorSince d-none hidden visually-hidden">No mentor time entered</span>';




/***
*  Student Type
* 
* */
let studentTypeString = (mentorDict.studentType.content) ?
    '<strong>Will Mentor: </strong>' + mentorDict.studentType.content + '<br>' :
    (mentorDict.willMentor.content) ? assignList(mentorDict.willMentor.content) :
    '<span class="studentType d-none hidden visually-hidden">No student type entered</span>';




/***
*  LinkedIn Profile
* 
* */
let linkedInString = (mentorDict.linkedIn.content) ?
    '<a href="' + mentorDict.linkedIn.content + '" target="_blank" title="LinkedIn Profile"><span class="fab fa-linkedin" aria-hidden="true"></span> Profile</a>' :
    '<span class="linkedIn d-none hidden visually-hidden">No LinkedIn profile entered</span>';




/***
    *  Job Description
    * 
    * */
let jobDescriptionString = (mentorDict.jobDescription.content) ?
'<h3>Job Description</h3><p>' + mentorDict.jobDescription.content + '</p>' :
'<span class="jobDescription d-none hidden visually-hidden">No job description entered</span>';




/***
*  Company Description
* 
* */
let companyDescriptionString = (mentorDict.companyDescription.content) ?
'<h3>Company Description</h3><p>' + mentorDict.companyDescription.content + '</p>' :
'<span class="companyDescription d-none hidden visually-hidden">No company description entered</span>';




/***
*  Employment History
* 
* */
let employmentHistoryString = (mentorDict.employmentHistory.content) ?
'<h3>Employment History</h3><p>' + mentorDict.employmentHistory.content + '</p>' :
'<span class="employmentHistory d-none hidden visually-hidden">No employment history entered</span>';




/***
*  Education
* 
* */
let educationString = (mentorDict.education.content) ?
    '<h3>Education</h3><p>' + mentorDict.education.content + '</p>' :
    '<span class="education d-none hidden visually-hidden">No education entered</span>';




/***
*  Civic Involvement
* 
* */
let civicInvolvementString = (mentorDict.civicInvolvement.content) ?
    '<h3>Civic Involvement</h3><p>' + mentorDict.civicInvolvement.content + '</p>' :
    '<span class="civicInvolvement d-none hidden visually-hidden">No civic involvement entered</span>';




/***
*  Mentoring Objectives
* 
* */
let objectivesString = (mentorDict.objectives.content) ?
    '<h3>Mentoring Objectives & Scope</h3><p>' + mentorDict.objectives.content + '</p>' :
    '<span class="objectives d-none hidden visually-hidden">No objectives entered</span>';




/***
*  Your Meetings
* 
* */
let yourMeetingsString = (mentorDict.yourMeetings.content) ?
    '<h3>When and where do you hold meetings with your students?</h3><p>' + mentorDict.yourMeetings.content + '</p>' :
    (mentorDict.whenAndWhere.content) ?
    '<h3>When and where do you hold meetings with your students?</h3><p>' + mentorDict.whenAndWhere.content + '</p>' :
    '<span class="yourMeetings d-none hidden visually-hidden">No meetings info entered</span>';




/***
*  Additional Information
* 
* */
let additionalInfoString = (mentorDict.additionalInfo.content) ?
    '<h3>Additional Information</h3><p>' + mentorDict.additionalInfo.content + '</p>' :
    '<span class="additionalInfo d-none hidden visually-hidden">No objectives entered</span>';




/***
*  Process Image
* 
* */
let imageString = (mentorDict.imageId.content) ?
    imageTag(mentorDict.imageId.content) :
    (mentorDict.photo.content) ?
    '' + mentorDict.photo.content + '' :
    '<span class="articleImage d-none hidden visually-hidden">No valid image provided</span>';




/***
*  write document once
* 
* */
writeDocument(
    [
        beginningHTML,
        openImageWrapper,
        imageString,
        closeImageWrapper,
        openSummaryWrapper,
        nameString,
        openSummary,
        jobTitleString,
        companyString,
        industryString,
        mentorSinceString,
        studentTypeString,
        linkedInString,
        closeSummary,
        closeSummaryWrapper,
        endingHTML,
        openArticle,
        background,
        jobDescriptionString,
        companyDescriptionString,
        employmentHistoryString,
        educationString,
        civicInvolvementString,
        objectivesString,
        yourMeetingsString,
        additionalInfoString,
        closeArticle,
        endingHTML
    ]
);




} catch (err) {
document.write(err.message);
}
