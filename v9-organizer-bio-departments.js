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
     *     @version 9.8.15
     * 
     * */








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
             fullName: getContentValues('<t4 type="content" name="Name of Faculty or Staff Member" output="normal" modifiers="striptags,htmlentities" />'),
             lastName: getContentValues('<t4 type="content" name="Last Name" output="normal" modifiers="striptags,htmlentities" />'),
             firstName: getContentValues('<t4 type="content" name="First Name" output="normal" modifiers="striptags,htmlentities" />'),
             degrees: getContentValues('<t4 type="content" name="Degree(s)" output="normal" modifiers="striptags,htmlentities" />'),
             positionTitle: getContentValues('<t4 type="content" name="Position Title(s)" output="normal" modifiers="striptags,htmlentities" />'),
             officePhone: getContentValues('<t4 type="content" name="Phone" output="normal" modifiers="striptags,htmlentities" />'),
             emailAddress: getContentValues('<t4 type="content" name="Email Address" output="normal" modifiers="striptags,htmlentities,encode_emails" />'),
             bldgRoom: getContentValues('<t4 type="content" name="Building/Room Number" output="normal" modifiers="striptags,htmlentities" />'),
             departments: getContentValues('<t4 type="content" name="Name" output="normal" modifiers="striptags,htmlentities" />'),
             summaryBio: getContentValues('<t4 type="content" name="Summary Biography" output="normal" modifiers="medialibrary,nav_sections" />'),
             primaryImage: getContentValues('<t4 type="content" name="Photo" output="normal" formatter="image/*" />'),
             primaryImagePath: getContentValues('<t4 type="content" name="Photo" output="normal" formatter="path/*" />'),
             rolloverImage: getContentValues('<t4 type="content" name="Rollover Photo" output="normal" formatter="image/*" />'),
             rolloverImagePath: getContentValues('<t4 type="content" name="Rollover Photo" output="normal" formatter="path/*" />'),
             fullTextLink: getContentValues('<t4 type="content" name="Name" output="fulltext" use-element="true" filename-element="Name" modifiers="striptags,htmlentities" />'),
             contentId: getContentValues('<t4 type="meta" meta="content_id" />')
 
         };
 


         
         /***
          *  default html initializations
          * 
          * */
         let endingHTML = '</article>';
         let openRow = '<div class="row g-0 noGap">';
         let closeRow = '</div>';
         let openImageWrapper = '<div class="col-12 col-lg-4">';
         let closeImageWrapper = '</div>';
         let openBodyWrapper = '<div class="col-12 col-lg-8">';
         let closeBodyWrapper = '</div>';
         let openCardHeader = '<div class="departBioHeader card-header border-0 radius-0 bg-transparent">';
         let closeCardHeader = '</div>'
         let openBody = '<div class="departBioSummary card-body">';
         let closeBody = '</div>';
         let openFooter = '<div class="departBioFooter col-12 card-footer border-0 border-top radius-0 bg-transparent">';
         let closeFooter = '</div>';
         let listOfIcons = '<ul class="list-group list-group-horizontal hidden visually-hidden">No icons provided</ul>';
         let imageString = '<span class="bioImage visually-hidden hidden"></span>'
         let beginningHTML = '<article class="departmentBioWrapper card shadow-sm border-0 radius-0 mb-3" id="departmentBio' + departmentBioDict.contentId.content + '" aria-label="' + departmentBioDict.contentName.content + '">';

         


        /***
         *  modify wrapper's aria label
         * 
         * */
        function modifyWrapper(ariaLabel) {

            beginningHTML = '<article class="departmentBioWrapper card shadow-sm border-0 radius-0 mb-3" id="departmentBio' + departmentBioDict.contentId.content + '" aria-label="' + ariaLabel + '">';
        }




        /***
         *  process and prioritize label options
         * 
         * */
        if (departmentBioDict.firstName.content && departmentBioDict.lastName.content) {
        
            let ariaString = '' + departmentBioDict.firstName.content + ' ' + departmentBioDict.lastName.content + '';

            modifyWrapper(ariaString.trim());

        } else if (departmentBioDict.fullName.content) {

            let ariaString = '' + departmentBioDict.fullName.content + '';

            modifyWrapper(ariaString.trim());
        }




        /***
          *  set for fulltext link
          * 
          * */
        let titleLink = (departmentBioDict.fullTextLink.content && departmentBioDict.fullName.content)
                        ? '<h3 class="card-title border-0 bg-transparent"><a href="' + departmentBioDict.fullTextLink.content + '" class="card-link" title="See the full profile of: ' + departmentBioDict.fullName.content + '">' + departmentBioDict.fullName.content + '</a></h3>'
                        : (departmentBioDict.fullTextLink.content && !departmentBioDict.fullName.content)
                        ? '<h3 class="card-title border-0 bg-transparent"><a href="' + departmentBioDict.fullTextLink.content + '" class="card-link" title="See the full profile of: ' + departmentBioDict.contentName.content + '">' + departmentBioDict.contentName.content + '</a></h3>'
                        : '<h3 class="card-title border-0 bg-transparent">' + departmentBioDict.contentName.content + '</h3>';




        /***
          *  parse for email
          * 
          * */
        let emailAddressString =    (departmentBioDict.emailAddress.content && departmentBioDict.firstName.content && departmentBioDict.lastName.content)
                                    ? '<p class="emailAddress card-text"><span class="fas fa-envelope"></span> <a class="emailAddress card-link" href="mailto:' + departmentBioDict.emailAddress.content + '?subject=From your Faculty Profile" title="Email ' + departmentBioDict.firstName.content + ' ' + departmentBioDict.lastName.content + '">Email ' + departmentBioDict.firstName.content + '</a></p>'
                                    : (departmentBioDict.emailAddress.content && departmentBioDict.fullName.content)
                                    ? '<p class="emailAddress card-text"><span class="fas fa-envelope"></span> <a class="emailAddress card-link" href="mailto:' + departmentBioDict.emailAddress.content + '?subject=From your Faculty Profile" title="Email ' + departmentBioDict.fullName.content + '">Email ' + departmentBioDict.fullName.content + '</a></p>'
                                    : '<span class="emailAddress visually-hidden hidden">No email entered</span>';




        /***
          *  parse for email
          * 
          * */
        let phoneString =   (departmentBioDict.officePhone.content)
                            ? '<p class="officePhone card-text"><span class="fas fa-phone-alt"></span> <a class="officePhone card-link" href="tel:' + departmentBioDict.officePhone.content + '" title="Call ' + departmentBioDict.fullName.content + '">' + departmentBioDict.officePhone.content + '</a></p>'
                            : '<span class="officePhone visually-hidden hidden">No phone entered</span>';




        /***
         *  parse degrees
         * 
         * */
        let degreeString = (departmentBioDict.degrees.content)
                        ? '<p class="degree card-text"><em>' + departmentBioDict.degrees.content + '</em></p>'
                        : '<span class="degree visually-hidden hidden">No degree entered</span>';




        /***
         *  parse titles
         * 
         * */
        let positionTitleString =   (departmentBioDict.positionTitle.content)
                                    ? '<p class="title card-text">' + departmentBioDict.positionTitle.content + '</p>'
                                    : '<span class="title visually-hidden hidden">No title entered</span>';




        /***
         *  parse titles
         * 
         * */
        let bldgRoomString =    (departmentBioDict.bldgRoom.content)
                                ? '<p class="location card-text"><strong>Building/Room: </strong>' + departmentBioDict.bldgRoom.content + '</p>'
                                : '<span class="location visually-hidden hidden">No location entered</span>';




        /***
         *  parse titles
         * 
         * */
        let summaryBioString =    (departmentBioDict.summaryBio.content)
                                ? '<div class="summaryBio"><p class="summaryBio card-text">' + departmentBioDict.summaryBio.content + '</p></div>'
                                : '<span class="summaryBio visually-hidden hidden">No summary entered</span>';


 
 
 

 
 
 
 
         /***
          *  define subtitle
          * 
          * */
        //  let subtitleString = (departmentBioDict.subjectDescription.content && departmentBioDict.college.content && departmentBioDict.academicLevel.content) ?
        //      '<p class="card-subtitle">' + subjectString + ' | ' + collegeString + ' | ' + academicLevelString + '</p>' :
        //      (departmentBioDict.subjectDescription.content && departmentBioDict.college.content && !departmentBioDict.academicLevel.content) ?
        //      '<p class="card-subtitle">' + subjectString + ' | ' + collegeString + '</p>' :
        //      (departmentBioDict.subjectDescription.content && !departmentBioDict.college.content && departmentBioDict.academicLevel.content) ?
        //      '<p class="card-subtitle">' + subjectString + ' | ' + academicLevelString + '</p>' :
        //      (!departmentBioDict.subjectDescription.content && departmentBioDict.college.content && departmentBioDict.academicLevel.content) ?
        //      '<p class="card-subtitle">' + collegeString + ' | ' + academicLevelString + '</p>' :
        //      (!departmentBioDict.subjectDescription.content && !departmentBioDict.college.content && departmentBioDict.academicLevel.content) ?
        //      '<p class="card-subtitle">' + academicLevelString + '</p>' :
        //      (!departmentBioDict.subjectDescription.content && departmentBioDict.college.content && !departmentBioDict.academicLevel.content) ?
        //      '<p class="card-subtitle">' + collegeString + '</p>' :
        //      (departmentBioDict.subjectDescription.content && !departmentBioDict.college.content && !departmentBioDict.academicLevel.content) ?
        //      '<p class="card-subtitle">' + subjectString + '</p>' :
        //      '<span class="card-subtitle visually-hidden hidden">No valid subtitle provided</span>';
 






        /***
         *  Parse for image
         * 
         * */
        if (departmentBioDict.primaryImagePath.content) {

            let imageID = content.get('Photo').getID();
            let mediaInfo = getMediaInfo(imageID);
            let media = readMedia(imageID);
            let info = new ImageInfo;
            info.setInput(media);

            imageString =   (info.check())
                            ? '<figure class="figure"><img src="' + departmentBioDict.primaryImagePath.content + '" class="deptBioImage figure-img card-img" aria-label="' + mediaInfo.getName() + '" alt="' + mediaInfo.getDescription() + '" width="' + info.getWidth() + '" height="' + info.getHeight() + '" loading="auto" /></figure><figcaption class="figure-caption visually-hidden hidden">' + mediaInfo.getName() + '</figcaption>'
                            : '<span class="deptBioImage visually-hidden hidden">Invalid Image ID</span>';
        }






  
         /***
          *  write document once
          * 
          * */
         writeDocument(
             [
                 beginningHTML,
                 openRow,
                 openImageWrapper,
                 imageString,
                 closeImageWrapper,
                 openBodyWrapper,
                 openCardHeader,
                 titleLink,
                 closeCardHeader,
                 openBody,
                 degreeString,
                 positionTitleString,
                 emailAddressString,
                 phoneString,
                 bldgRoomString,
                 closeBody,
                 closeBodyWrapper,
                 closeRow,
                 openFooter,
                 summaryBioString,
                 closeFooter,
                 endingHTML
             ]
         );
 
 
 
 
     } catch (err) {
         document.write(err.message);
     }
