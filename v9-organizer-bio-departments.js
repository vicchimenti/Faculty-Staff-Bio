    /***
     *     @author  Victor Chimenti, MSCS
     *     @file    v9-organizer-bio-departments.js
     *                  v9/organizer/bio/departments
     *                  id:203
     *
     *     This layout works with the Department Organizer.
     *
     *     Document will write once when the page loads
     * 
     *     @version 9.12.22
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

            if (arrayOfValues[i]) {

                listValues += '<li class="list-group-item d-inline deptBioli">' + arrayOfValues[i].trim() + '</li>';
            }
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
 
         let mediaHTML =
            (info.check())
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
     *  modify card body
     * 
     * */
     function modifyBody() {

        return '<div class="departBioSummary card-body">';
    }




    /***
     *  modify card body
     * 
     * */
     function modifyFooter() {

        return '<div class="departBioFooter card-footer border-0 bg-transparent">';
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
             college: getContentValues('<t4 type="content" name="College" output="normal" modifiers="striptags,htmlentities" />'),
             description: getContentValues('<t4 type="content" name="Description" output="normal" modifiers="striptags,htmlentities" />'),
             officePhone: getContentValues('<t4 type="content" name="Phone" output="normal" modifiers="striptags,htmlentities" />'),
             emailAddress: getContentValues('<t4 type="content" name="Email Address" output="normal" modifiers="striptags,htmlentities,encode_emails" />'),
             bldgRoom: getContentValues('<t4 type="content" name="Building/Room Number" output="normal" modifiers="striptags,htmlentities" />'),
             departments: getContentValues('<t4 type="content" name="Name" output="normal" modifiers="striptags,htmlentities" />'),
             summaryBio: getContentValues('<t4 type="content" name="Summary Biography" output="normal" modifiers="medialibrary,nav_sections" />'),
             primaryImage: getContentValues('<t4 type="content" name="Photo" output="normal" formatter="image/*" />'),
             primaryImagePath: getContentValues('<t4 type="content" name="Photo" output="normal" formatter="path/*" />'),
             rolloverImage: getContentValues('<t4 type="content" name="Rollover Photo" output="normal" formatter="image/*" />'),
             rolloverImagePath: getContentValues('<t4 type="content" name="Rollover Photo" output="normal" formatter="path/*" />'),
             webPage: getContentValues('<t4 type="content" name="Personal Website" output="normal" modifiers="striptags,htmlentities" />'),
             cvPath: getContentValues('<t4 type="content" name="Curriculum Vitae" output="normal" formatter="path/*" />'),
             cvApp:getContentValues('<t4 type="content" name="Curriculum Vitae" output="normal" formatter="application/*" />'),
             fullTextLink: getContentValues('<t4 type="content" name="Name" output="fulltext" use-element="true" filename-element="Name" modifiers="striptags,htmlentities" />'),
             contentId: getContentValues('<t4 type="meta" meta="content_id" />')
 
         };
 


         
         /***
          *  default html initializations
          * 
          * */
         let endingHTML = '</div></article>';
         let openRow = '<div class="row g-0 noGap">';
         let closeRow = '</div>';
         let openImageWrapper = '<div class="imageWrapper col-12 col-sm-3">';
         let closeImageWrapper = '</div>';
         let openBodyWrapper = '<div class="bodyWrapper col-12 col-sm-9">';
         let closeBodyWrapper = '</div>';
         let openCardHeader = '<div class="departBioHeader card-header border-0 radius-0 bg-transparent">';
         let closeCardHeader = '</div>'
         let closeBody = '</div>';
         let closeFooter = '</div>';
         let imageString = '<span class="bioImage visually-hidden hidden"></span>'
         let beginningHTML = '<article class="departmentBioWrapper col" id="departmentBio' + departmentBioDict.contentId.content + '" aria-label="' + departmentBioDict.contentName.content + '"><div class="card h-100 shadow-lg border-0">';




        /***
         *  modify wrapper's aria label
         * 
         * */
         function modifyWrapper(ariaLabel) {

            beginningHTML = '<article class="departmentBioWrapper col" id="departmentBio' + departmentBioDict.contentId.content + '" aria-label="' + ariaLabel + '"><div class="card h-100 shadow-lg border-0">';
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
         *  determine card-body
         * 
         * */
         let openBody =
            (departmentBioDict.description.content)
            ? modifyBody()
            : '<div class="departBioSummary card-body visually-hidden hidden">';




        /***
         *  determine card-footer
         * 
         * */
         let openFooter = 
            (departmentBioDict.webPage.content || departmentBioDict.cvPath.content)
            ? modifyFooter()
            :'<div class="departBioFooter card-footer border-0 bg-transparent visually-hidden hidden">';
     



        /***
          *  set for fulltext link
          * 
          * */
         let titleLink =
            (departmentBioDict.fullTextLink.content && departmentBioDict.fullName.content)
            ? '<h3 class="card-title border-0 bg-transparent"><a href="' + departmentBioDict.fullTextLink.content + '" class="card-link" title="See the full profile of: ' + departmentBioDict.fullName.content + '">' + departmentBioDict.fullName.content + '</a></h3>'
            : (departmentBioDict.fullTextLink.content && !departmentBioDict.fullName.content)
            ? '<h3 class="card-title border-0 bg-transparent"><a href="' + departmentBioDict.fullTextLink.content + '" class="card-link" title="See the full profile of: ' + departmentBioDict.contentName.content + '">' + departmentBioDict.contentName.content + '</a></h3>'
            : '<h3 class="card-title border-0 bg-transparent">' + departmentBioDict.contentName.content + '</h3>';




        /***
         *  parse summary
         * 
         * */
         let summaryBioString =
            (departmentBioDict.description.content)
            ? '<div class="summaryBio"><p class="summaryBio card-text">' + departmentBioDict.description.content + '</p></div>'
            : '<span class="summaryBio visually-hidden hidden">No summary entered</span>';




        /***
          *  parse for email
          * 
          * */
        let emailAddressString =
            (departmentBioDict.emailAddress.content && departmentBioDict.firstName.content && departmentBioDict.fullName.content)
            ? '<span class="emailAddress card-text"><i class="fas fa-envelope"></i> <a class="emailAddress card-link" href="mailto:' + departmentBioDict.emailAddress.content + '?subject=From your Faculty Profile" title="Email ' + departmentBioDict.fullName.content + '">Email ' + departmentBioDict.firstName.content + '</a></span>'
            : (departmentBioDict.emailAddress.content && departmentBioDict.fullName.content)
            ? '<span class="emailAddress card-text"><i class="fas fa-envelope"></i> <a class="emailAddress card-link" href="mailto:' + departmentBioDict.emailAddress.content + '?subject=From your Faculty Profile" title="Email ' + departmentBioDict.fullName.content + '">Email ' + departmentBioDict.fullName.content + '</a></span>'
            : '<span class="emailAddress visually-hidden hidden">No email entered</span>';




        /***
          *  parse for phone
          * 
          * */
        let phoneString =
            (departmentBioDict.officePhone.content && departmentBioDict.fullName.content)
            ? '<span class="officePhone card-text"><i class="fas fa-phone-alt"></i> <a class="officePhone card-link" href="tel:' + departmentBioDict.officePhone.content + '" title="Call ' + departmentBioDict.fullName.content + '">' + departmentBioDict.officePhone.content + '</a></span>'
            : '<span class="officePhone visually-hidden hidden">No phone entered</span>';




        /***
         *  parse titles
         * 
         * */
        let bldgRoomString =
            (departmentBioDict.bldgRoom.content)
            ? '<span class="location card-text"><i class="fas fa-university"></i> ' + departmentBioDict.bldgRoom.content + '</span>'
            : '<span class="location visually-hidden hidden">No location entered</span>';




        /***
         *  format contact string
         * 
         * */
         let contactArray = [bldgRoomString, emailAddressString, phoneString];
         let contactList = assignList(contactArray);
         let contactString = '<ul class="contactList">' + contactList + '</ul>';




        /***
         *  parse college
         * 
         * */
        let collegeSub =
            (departmentBioDict.college.content)
            ? '<span class="college card-text">' + departmentBioDict.college.content + '</span>'
            : '<span class="college visually-hidden hidden">No location entered</span>';



 
        /***
         *  parse degrees and display only the first degree
         * 
         * */
        //  let arrayOfDegrees =
        //     (departmentBioDict.degrees.content)
        //     ? departmentBioDict.degrees.content.split(',')
        //     : null;
        //  let degreeSub =
        //     (arrayOfDegrees)
        //     ? '<span class="degree card-text">' + arrayOfDegrees[0] + '</span>'
        //     : '<span class="degree visually-hidden hidden">No degree entered</span>';




        /***
         *  parse titles and display only the first title
         * 
         * */
         let arrayOfTitles =
            (departmentBioDict.positionTitle.content)
            ? departmentBioDict.positionTitle.content.split('\n')
            : null;
         let positionTitleSub =
            (arrayOfTitles)
            ? '<span class="title card-text">' + arrayOfTitles[0] + '</span>'
            : '<span class="title visually-hidden hidden">No title entered</span>'; 

 
 
 
 
         /***
          *  define subtitle
          * 
          * */
         let subtitleString =
            (departmentBioDict.positionTitle.content && departmentBioDict.college.content)
            ? '<p class="card-subtitle">' + positionTitleSub + ' | ' + collegeSub + '</p>'
            : (!departmentBioDict.positionTitle.content && departmentBioDict.college.content)
            ? '<p class="card-subtitle">' + collegeSub + '</p>'
            : (departmentBioDict.positionTitle.content && !departmentBioDict.college.content)
            ? '<p class="card-subtitle">' + positionTitleSub + '</p>'  
            : '<span class="card-subtitle">No subtitle fields entered</span>';

 


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

            imageString =
                (info.check())
                ? '<figure class="figure"><img src="' + departmentBioDict.primaryImagePath.content + '" class="deptBioImage figure-img card-img" aria-label="' + mediaInfo.getName() + '" alt="' + mediaInfo.getDescription() + '" width="' + info.getWidth() + '" height="' + info.getHeight() + '" loading="auto" /></figure><figcaption class="figure-caption visually-hidden hidden">' + mediaInfo.getName() + '</figcaption>'
                : '<span class="deptBioImage visually-hidden hidden">Invalid Image ID</span>';
        }




        /***
          *  parse for personal website
          * 
          * */
        //  let webstring =
        //     (departmentBioDict.webPage.content && departmentBioDict.fullName.content && departmentBioDict.firstName.content && departmentBioDict.lastName.content)
        //     ? '<span class="webPage card-text"><i class="fas fa-link"></i> <a class="webPage card-link" href="' + departmentBioDict.webPage.content + '" title="Visit the personal website of ' + departmentBioDict.fullName.content + '">' + departmentBioDict.firstName.content + ' ' + departmentBioDict.lastName.content + '</a></span>'
        //     : '<span class="webPage visually-hidden hidden">No website entered</span>';




        /***
          *  parse for personal website
          * 
          * */
        //  let cvString =
        //     (departmentBioDict.cvPath.content && departmentBioDict.fullName.content && departmentBioDict.firstName.content && departmentBioDict.lastName.content)
        //     ? '<span class="cvPath card-text"><i class="fas fa-file-pdf"></i> <a class="cvPath card-link" href="' + departmentBioDict.cvPath.content + '" title="Read the curriculum vitae of ' + departmentBioDict.fullName.content + '">Curriculum Vitae</a></span>'
        //     : '<span class="cvPath visually-hidden hidden">No curriculum vitae provided</span>';




        /***
         *  format footer
         * 
         * */
        //  let footerArray = [bldgRoomString, emailAddressString, phoneString, webstring, cvString];
        //  let footerList = assignList(footerArray);
        //  let footerUl = '<ul class="footerList">' + footerList + '</ul>';




        /***
          *  define footer string
          * 
          * */
        //  let footerString =
        //     (departmentBioDict.bldgRoom.content || departmentBioDict.emailAddress.content || departmentBioDict.officePhone.content || departmentBioDict.webPage.content || departmentBioDict.cvPath.content)
        //     ? '<footer class="deptBioFooter">' + footerUl + '</footer>'
        //     : '<footer class="deptBioFooter visually-hidden hidden">No footer provided</footer>';



  
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
                 subtitleString,
                 contactString,
                 closeCardHeader,
                 openBody,
                 summaryBioString,
                 closeBody,
                //  openFooter,
                //  footerString,
                //  closeFooter,
                 closeBodyWrapper,
                 closeRow,
                 endingHTML
             ]
         );
 
 
 
 
     } catch (err) {
         document.write(err.message);
     }
