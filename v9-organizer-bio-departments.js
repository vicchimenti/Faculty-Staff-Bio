    /***
     *     @author  Victor Chimenti, MSCS
     *     @file    v9-organizer-bio-departments.js
     *                  v9/organizer/bio/departments
     *                  id:203
     *
     *     This Faculty and Staff Bio content type layout works with the Department Organizer.
     *
     *     Document will write once when the page loads
     * 
     *      not ready for primetime 20220218
     *
     *     @version 9.1
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
             }
         } catch (error) {
             return {
                 isError: true,
                 message: error.message
             }
         }
     }
 
 
 
 
     /***
      *      Returns an array of list items
      */
     function assignList(arrayOfValues) {
 
         let listValues = '';
 
         for (let i = 0; i < arrayOfValues.length; i++) {
 
             listValues += '<li class="list-group-item deptBioli">' + arrayOfValues[i].trim() + '</li>';
         }
 
         return listValues;
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
     function mediaTag(itemId) {
 
         let mediaPath = BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, '<t4 type="media" formatter="path/*" id="' + itemId + '" />');
         let mediaInfo = getMediaInfo(itemId);
         let media = readMedia(itemId);
         let info = new ImageInfo;
         info.setInput(media);
 
         let mediaHTML =    (info.check())
                            ? '<figure class="figure"><img src="' + mediaPath + '" class="deptBioImage figure-img card-fluid" aria-label="' + mediaInfo.getName() + '" alt="' + mediaInfo.getDescription() + '" width="' + info.getWidth() + '" height="' + info.getHeight() + '" loading="auto" /></figure><figcaption class="figure-caption visually-hidden hidden">' + mediaInfo.getName() + '</figcaption>'
                            : '<span class="deptBioImage visually-hidden hidden">Invalid Image ID</span>';
 
         return mediaHTML;
     }
 
 
 
 
     /***
      *      Returns a formatted html img tag
      */
     function getTarget(itemId) {
 
         let mediaInfo = getMediaInfo(itemId);
         let media = readMedia(itemId);
         let info = new ImageInfo;
         info.setInput(media);
 
         let target = (info.check()) ? '' + mediaInfo.getName() + '' : null;
 
         return target;
     }
 
 
 
 
     /***
      *      Returns an array of list items
      */
     function formatTargets(arrayOfValues) {
 
         let listValues = '';
 
         for (let i = 0; i < arrayOfValues.length; i++) {
 
             if (arrayOfValues[i]) {
                 let cleanValue = arrayOfValues[i].replace(/\s/g, '-');
                 listValues += '' + cleanValue.trim() + ' ';
             }
         }
 
         return listValues;
     }
 
 
 
 
     /***
      *      Returns a formatted html img tag
      */
     function wrapperTargets(idList) {
 
         let mediaIdArray = idList.split(',');
         let targetArray = [];
 
         for (mediaId in mediaIdArray) {
 
             targetArray[mediaId] = getTarget(mediaIdArray[mediaId].trim());
         }
 
         let targets = formatTargets(targetArray);
 
         return targets;
     }
 
 
 
 
     /***
      *      Write the document
      */
     function writeDocument(array) {
 
         for (let i = 0; i < array.length; i++) {
 
             document.write(array[i]);
         }
     }
 
 
 
 
 
 
 
 
     /***
      *  Main
      */
     try {
 
 
         /***
          *      Dictionary of content
          * */
         let departmentBioDict = {
 
             contentName: getContentValues('<t4 type="content" name="Name" output="normal" modifiers="striptags,htmlentities" />'),


             primaryImage: getContentValues('<t4 type="content" name="Photo" output="normal" formatter="image/*" />'),
             primaryImagePath: getContentValues('<t4 type="content" name="Photo" output="normal" formatter="path/*" />'),
             rolloverImage: getContentValues('<t4 type="content" name="Photo" output="normal" formatter="image/*" />'),
             rolloverImagePath: getContentValues('<t4 type="content" name="Rollover Photo" output="normal" formatter="path/*" />'),

             
             articleTitle: getContentValues('<t4 type="content" name="Article Title" output="normal" modifiers="striptags,htmlentities" />'),
             courseName: getContentValues('<t4 type="content" name="Course Name" output="normal" modifiers="striptags,htmlentities" />'),
             college: getContentValues('<t4 type="content" name="College" output="normal" modifiers="striptags,htmlentities" />'),
             academicLevel: getContentValues('<t4 type="content" name="Section Academic Level" output="normal" modifiers="striptags,htmlentities" />'),
             primarySectionName: getContentValues('<t4 type="content" name="Primary Section Name" output="normal" modifiers="striptags,htmlentities" />'),
             subjectDescription: getContentValues('<t4 type="content" name="Subject" output="normal" modifiers="striptags,htmlentities" />'),
             icons: getContentValues('<t4 type="content" name="Icon ID" output="normal" modifiers="striptags,htmlentities" />'),
             summaryDescription: getContentValues('<t4 type="content" name="Plaintext Description" output="normal" modifiers="striptags,htmlentities" />'),
             courseDescription: getContentValues('<t4 type="content" name="Description" output="normal" modifiers="medialibrary,nav_sections,htmlentities" />'),
             fullTextLink: getContentValues('<t4 type="content" name="Article Title" output="fulltext" use-element="true" filename-element="Article Title" modifiers="striptags,htmlentities" />'),
             contentId: getContentValues('<t4 type="meta" meta="content_id" />')
 
         };
 


         
         /***
          *  default html initializations
          * 
          * */
         let endingHTML = '</article>';
         let openCardHeader = '<div class="departBioHeader card-header border-0 radius-0 bg-transparent">';
         let closeCardHeader = '</div>'
         let openBodyWrapper = '<div class="departBioSummary card-body">';
         let closeBodyWrapper = '</div>';
         let openFooterWrapper = '<div class="departBioFooter card-footer border-0 radius-0 bg-transparent">';
         let closeFooterWrapper = '</div>';
         let listOfIcons = '<ul class="list-group list-group-horizontal hidden visually-hidden">No icons provided</ul>';
         let beginningHTML = '<article class="departmentBioWrapper card shadow-sm border-0 radius-0 mb-3" id="departmentBio' + departmentBioDict.contentId.content + '" aria-label="' + departmentBioDict.articleTitle.content + '">';
 
 

        /***
          *  bs5 horizontal card
          * 
          * */
        //  <div class="card mb-3" style="max-width: 540px;">
        //     <div class="row g-0">
        //         <div class="col-md-4">
        //         <img src="..." class="img-fluid rounded-start" alt="...">
        //         </div>
        //         <div class="col-md-8">
        //         <div class="card-body">
        //             <h5 class="card-title">Card title</h5>
        //             <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
        //             <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
        //         </div>
        //         </div>
        //     </div>
        // </div>


   
        /***
          *  bs5 card image overlay
          * 
          * */
        // <div class="card bg-dark text-white">
        //     <img src="..." class="card-img" alt="...">
        //     <div class="card-img-overlay">
        //         <h5 class="card-title">Card title</h5>
        //         <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
        //         <p class="card-text">Last updated 3 mins ago</p>
        //     </div>
        // </div>





             
         /***
          *  check for fulltext content
          * 
          * */
         let titleLink = (departmentBioDict.articleTitle.content && departmentBioDict.courseName.content) ?
             '<h3 class="card-title border-0"><a href="' + departmentBioDict.fullTextLink.content + '" class="card-link" title="See the full course details: ' + departmentBioDict.articleTitle.content + '">' + departmentBioDict.courseName.content + ' : ' + departmentBioDict.articleTitle.content + '</a></h3>' :
             (departmentBioDict.articleTitle.content && !departmentBioDict.courseName.content) ?
             '<h3 class="card-title border-0"><a href="' + departmentBioDict.fullTextLink.content + '" class="card-link" title="See the full course details: ' + departmentBioDict.articleTitle.content + '">' + departmentBioDict.articleTitle.content + '</a></h3>' :
             '<h3 class="card-title border-0">' + departmentBioDict.contentName.content + '</h3>';
 
 
 

         /***
          *   Truncation
          *   check for summaryDescription
          *   find string length and truncate
          * 
          * */
         let maxLength = 200;
         let plainString = (departmentBioDict.summaryDescription.content) ? '' + departmentBioDict.summaryDescription.content +  '' : null;
         let actualLength = (plainString) ? plainString.length : null;
         let summarySubstring = (plainString && actualLength && actualLength > maxLength)
                                ? plainString.substring(0, maxLength)
                                : (plainString && actualLength && actualLength <= maxLength)
                                ? plainString.substring(0, actualLength)
                                : null;
                                
                                


        /***
          *  format summary
          * 
          * */
         let summaryString =    (summarySubstring && departmentBioDict.articleTitle.content)
                                ? '<p class="card-text shortSummary">' + summarySubstring + '... <a href="' + departmentBioDict.fullTextLink.content + '" class="card-link" title="See the full course description: ' + departmentBioDict.articleTitle.content + '">Read More</a></p>'
                                : '<span class="card-text shortSummary visually-hidden hidden">No valid summary provided</span>';

 
 
 
         /***
          *  check for subject Description
          * 
          * */
         let subjectString = (departmentBioDict.subjectDescription.content) ?
             '<span class="card-text subject"><em>' + departmentBioDict.subjectDescription.content + '</em></span>' :
             '<span class="card-text subject visually-hidden hidden">No valid subject provided</span>';
 
 
 
 
         /***
          *  check for subject college
          * 
          * */
         let collegeString = (departmentBioDict.college.content) ?
             '<span class="card-text college">' + departmentBioDict.college.content + '</span>' :
             '<span class="card-text college visually-hidden hidden">No valid subject provided</span>';
 
 
 
 
         /***
          *  check for subject level
          * 
          * */
         let academicLevelString = (departmentBioDict.academicLevel.content) ?
             '<span class="card-text academicLevel">' + departmentBioDict.academicLevel.content + '</span>' :
             '<span class="card-text academicLevel visually-hidden hidden">No valid subject provided</span>';
 
 
 
 
         /***
          *  define subtitle
          * 
          * */
         let subtitleString = (departmentBioDict.subjectDescription.content && departmentBioDict.college.content && departmentBioDict.academicLevel.content) ?
             '<p class="card-subtitle">' + subjectString + ' | ' + collegeString + ' | ' + academicLevelString + '</p>' :
             (departmentBioDict.subjectDescription.content && departmentBioDict.college.content && !departmentBioDict.academicLevel.content) ?
             '<p class="card-subtitle">' + subjectString + ' | ' + collegeString + '</p>' :
             (departmentBioDict.subjectDescription.content && !departmentBioDict.college.content && departmentBioDict.academicLevel.content) ?
             '<p class="card-subtitle">' + subjectString + ' | ' + academicLevelString + '</p>' :
             (!departmentBioDict.subjectDescription.content && departmentBioDict.college.content && departmentBioDict.academicLevel.content) ?
             '<p class="card-subtitle">' + collegeString + ' | ' + academicLevelString + '</p>' :
             (!departmentBioDict.subjectDescription.content && !departmentBioDict.college.content && departmentBioDict.academicLevel.content) ?
             '<p class="card-subtitle">' + academicLevelString + '</p>' :
             (!departmentBioDict.subjectDescription.content && departmentBioDict.college.content && !departmentBioDict.academicLevel.content) ?
             '<p class="card-subtitle">' + collegeString + '</p>' :
             (departmentBioDict.subjectDescription.content && !departmentBioDict.college.content && !departmentBioDict.academicLevel.content) ?
             '<p class="card-subtitle">' + subjectString + '</p>' :
             '<span class="card-subtitle visually-hidden hidden">No valid subtitle provided</span>';
 
 
 
 
         /***
          *  Parse and format icons
          * 
          * */
         if (departmentBioDict.icons.content) {
 
             let iconArray = departmentBioDict.icons.content.split(',');
             let iconPathArray = [];
 
             for (icon in iconArray) {
 
                 iconPathArray[icon] = mediaTag(iconArray[icon].trim());
             }
 
             let iconValues = assignList(iconPathArray);
             listOfIcons = '<ul class="iconDashboard list-group list-group-horizontal">' + iconValues + '</ul>';
         }
 
 
 
  
         /***
          *  Parse for media item titles and add to wrapper classes for isotope search engine
          * 
          * */
         if (departmentBioDict.icons.content) {
             let mediaTitles = wrapperTargets(departmentBioDict.icons.content);
             beginningHTML = '<article class="departmentBioWrapper card shadow border-0 radius-0 ' + mediaTitles + 'mb-3" id="departmentBio' + departmentBioDict.contentId.content + '" aria-label="' + departmentBioDict.articleTitle.content + '">';
         }









        /***
         *  Parse for image
         * 
         * */
        if (majorDict.frontPageImage.content) {

            let imageID = content.get('Main Image').getID();
            let mediaInfo = getMediaInfo(imageID);
            let media = readMedia(imageID);
            let info = new ImageInfo;
            info.setInput(media);

            let imageDefaultAlt = majorDict.frontPageImageCaption.content ? majorDict.frontPageImageCaption.content : majorDict.articleTitle.content;

            imageString = (info.check()) ?
                '<img src="' + majorDict.frontPageImage.content + '" class="deptBioImage figure-img card-img" aria-label="' + mediaInfo.getName() + '" alt="' + mediaInfo.getDescription() + '" width="' + info.getWidth() + '" height="' + info.getHeight() + '" loading="auto" />' :
                '<img src="' + majorDict.frontPageImage.content + '" class="deptBioImage figure-img card-img" alt="' + imageDefaultAlt + '" loading="auto" />';

            openImageWrapper = '<figure class="figure">';


            let mediaHTML =    (info.check())
            ? '<figure class="figure"><img src="' + mediaPath + '" class="deptBioImage figure-img card-fluid" aria-label="' + mediaInfo.getName() + '" alt="' + mediaInfo.getDescription() + '" width="' + info.getWidth() + '" height="' + info.getHeight() + '" loading="auto" /></figure><figcaption class="figure-caption visually-hidden hidden">' + mediaInfo.getName() + '</figcaption>'
            : '<span class="deptBioImage visually-hidden hidden">Invalid Image ID</span>';
        }




        /***
         *  modify headline if special topic present
         * 
         * */
            function modifyWrapper(htmlClass) {

            beginningHTML = '<article class="newsroomMajorFeedItem newsroomBlurb card border-0 ' + htmlClass + '" id="major' + majorDict.contentId.content + '" aria-label="' + majorDict.headline.content + '">';
        }




        /***
         *  modify dateline if special topic present
         * 
         * */
        function modifyDateline(specialTopic) {

            dateline = '<p class="newsroomArticlePublishedDate">' + majorDict.publishedDate.content + hyphen + '<span class="newsroomArticleSpecialCategory">' + specialTopic + '</span></p>';
        }




        /***
         *  process and prioritize special topics
         * 
         * */
        if (majorDict.catTags.content.includes(suLawInTheNews)) {

            modifyWrapper(suLawInTheNews);
            modifyDateline(suLawInTheNews);

        } else if (majorDict.catTags.content.includes(announcements)) {

            modifyWrapper(announcements);
            modifyDateline(announcements);

        } else if (majorDict.catTags.content.includes(events)) {

            modifyWrapper(events);
            modifyDateline(events);

        }





 
 
 
  
         /***
          *  write document once
          * 
          * */
         writeDocument(
             [
                 beginningHTML,
                 openCardHeader,
                 titleLink,
                 subtitleString,
                 closeCardHeader,
                 openBodyWrapper,
                 summaryString,
                 closeBodyWrapper,
                 endingHTML
             ]
         );
 
 
 
 
     } catch (err) {
         document.write(err.message);
     }





{/* <script>
<article class="staffBioBoxWrapper organizerFacStaffBio hspace" id="id<t4 type='meta' meta='content_id' />" aria-label="<t4 type='content' name='Name of Faculty or Staff Member' output='normal' modifiers='striptags,htmlentities' />" >
  
  <div class="staffBioBox standardContent">
    <t4 type="content" name="Extended Biography" output="selective-output" modifiers="medialibrary,nav_sections" process-format="true" format="<a href='<t4 type=&quot;content&quot; name=&quot;Name&quot; output=&quot;fulltext&quot; use-element=&quot;true&quot; filename-element=&quot;Name&quot; modifiers=&quot;htmlentities&quot; enable-dedit=&quot;false&quot; />' onmouseover='SwapBioImage(this)' onmouseout='SwapBioImage(this)'>" />
    <img src="<t4 type='content' name='Photo' output='normal' formatter='path/*' />" class="staffBioPhoto1" alt="Photo of <t4 type='content' name='Name of Faculty or Staff Member' output='normal' />" />
    <t4 type="content" name="Rollover Photo" output="selective-output" process-format="true" format="<img src=&quot;<t4 type=&quot;content&quot; name=&quot;Rollover Photo&quot; output=&quot;normal&quot; formatter=&quot;path/*&quot; />&quot; class=&quot;staffBioPhoto2&quot; alt=&quot;Alternate Photo of <t4 type='content' name='Name of Faculty or Staff Member' output='normal' />&quot; style=&quot;display: none;&quot; />" />
    <t4 type="content" name="Extended Biography" output="selective-output" modifiers="medialibrary,nav_sections" process-format="true" format="</a>" />
    <h3>
      <t4 type="content" name="Extended Biography" output="selective-output" modifiers="medialibrary,nav_sections" process-format="true" format="<a href='<t4 type=&quot;content&quot; name=&quot;Name&quot; output=&quot;fulltext&quot; use-element=&quot;true&quot; filename-element=&quot;Name&quot; modifiers=&quot;htmlentities&quot; enable-dedit=&quot;false&quot; />'>" />
      <span id="label<t4 type='meta' meta='content_id' />"><t4 type='content' name='Name of Faculty or Staff Member' output='normal' modifiers='htmlentities' /></span>
      <t4 type="content" name="Extended Biography" output="selective-output" modifiers="medialibrary,nav_sections" process-format="true" format="</a>" />
    </h3>
    <div class="staffBioInfo">
      <t4 type="content" name="Degree(s)" output="selective-output" modifiers="striptags,htmlentities,nl2br" format="<p class=&quot;Degree&quot;>$value</p>" />
      <t4 type="content" name="Position Title(s)" output="selective-output" modifiers="striptags,htmlentities,nl2br" format="<p class=&quot;Title&quot;>$value</p>" />
      <t4 type="content" name="Email Address" output="selective-output" modifiers="striptags,htmlentities" format="<p class=&quot;Email&quot;><strong>Email: </strong><a href=&quot;mailto:$value&quot;>$value</a></p>" />
      <t4 type="content" name="Phone" output="selective-output" modifiers="striptags,htmlentities" format="<p class=&quot;Phone&quot;><strong>Phone:</strong> $value</p>" />
      <t4 type="content" name="Building/Room Number" output="selective-output" modifiers="striptags,htmlentities" format="<p class=&quot;Location&quot;><strong>Building/Room:</strong> $value</p>" />
    </div>
    <t4 type="content" name="Summary Biography" output="selective-output" modifiers="medialibrary,nav_sections" format="<div class=&quot;Summary&quot;>$value</div>" />
  </div>
  <div class="clearfix"></div>
  <div class="hiddenFields hidden visually-hidden">
    <t4 type="content" name="First Name" output="selective-output" modifiers="striptags,htmlentities" format="<span class=&quot;firstName hidden visually-hidden&quot;>$value</span><br>" />
    <t4 type="content" name="Last Name" output="selective-output" modifiers="striptags,htmlentities" format="<span class=&quot;lastName hidden visually-hidden&quot;>$value</span><br>" />
    <t4 type="content" name="Departments" output="selective-output" modifiers="striptags,htmlentities" format="<span class=&quot;departments hidden visually-hidden&quot;>$value</span><br>" />
  </div>
  <div class="clearfix"></div>
</article>

{/* <!-- v9/organizer/bio/departments --> */}
// </script> */}
