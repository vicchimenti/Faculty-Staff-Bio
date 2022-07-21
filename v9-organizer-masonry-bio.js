    /***
     *     @author  Victor Chimenti, MSCS
     *     @file    v9-organizer-masonry-bio-departments.js
     *                  v9/organizer/grid/bio
     *                  id:203
     *
     *     This layout works with the Grid Organizer.
     *
     *     Document will write once when the page loads
     * 
     *     @version 10.2.8
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
             };
         } catch (error) {
             return {
                 isError: true,
                 message: error.message
             };
         }
     }
 
 
 
 
     /***
      *      Returns an array of list items
      */
     function assignList(arrayOfValues) {
 
         let listValues = '';
 
         for (let i = 0; i < arrayOfValues.length; i++) {

            if (arrayOfValues[i]) {

                listValues += '<li class="list-group-item d-inline deptBioli p-0 pe-md-4">' + arrayOfValues[i].trim() + '</li>';
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
      *      Write the document
      */
     function writeDocument(array) {
 
         for (let i = 0; i < array.length; i++) {
 
             document.write(array[i]);
         }
     }




    /***
      *      Initialize Popovers
      */
    //  let popover = new bootstrap.Popover(document.querySelector('.popover-dismiss'), {
    //     trigger: 'focus'
    //   });
 
 
 
 
 
 
 
 
     /***
      *  Main
      */
     try {
 
 
         /***
          *      Dictionary of content
          * */
         let gridBioDict = {
 
             contentName: getContentValues('<t4 type="content" name="Name" output="normal" modifiers="striptags,htmlentities" />'),
             fullName: getContentValues('<t4 type="content" name="Name of Faculty or Staff Member" output="normal" modifiers="striptags,htmlentities" />'),
             lastName: getContentValues('<t4 type="content" name="Last Name" output="normal" modifiers="striptags,htmlentities" />'),
             firstName: getContentValues('<t4 type="content" name="First Name" output="normal" modifiers="striptags,htmlentities" />'),
             pronouns: getContentValues('<t4 type="content" name="Pronouns" output="normal" modifiers="striptags,htmlentities" />'),
             positionTitle: getContentValues('<t4 type="content" name="Position Title(s)" output="normal" modifiers="striptags,htmlentities" />'),
             college: getContentValues('<t4 type="content" name="College" output="normal" modifiers="striptags,htmlentities" />'),
             description: getContentValues('<t4 type="content" name="Description" output="normal" modifiers="striptags,htmlentities" />'),
             officePhone: getContentValues('<t4 type="content" name="Phone" output="normal" modifiers="striptags,htmlentities" />'),
             emailAddress: getContentValues('<t4 type="content" name="Email Address" output="normal" modifiers="striptags,htmlentities,encode_emails" />'),
             bldgRoom: getContentValues('<t4 type="content" name="Building/Room Number" output="normal" modifiers="striptags,htmlentities" />'),
             departments: getContentValues('<t4 type="content" name="Name" output="normal" modifiers="striptags,htmlentities" />'),
             primaryImagePath: getContentValues('<t4 type="content" name="Photo" output="normal" formatter="path/*" />'),
             fullTextLink: getContentValues('<t4 type="content" name="Name" output="fulltext" use-element="true" filename-element="Name" modifiers="striptags,htmlentities" />'),
             contentId: getContentValues('<t4 type="meta" meta="content_id" />')
 
         };
 


         
         /***
          *  default html initializations
          * 
          * */
         let endingHTML = '</article>';
         let openBody = '<div class="departBioSummary card-body">';
         let closeBody = '</div>';
         let openFooter = '<div class="card-footer">';
         let closeFooter = '</div>';
         let imageString = '<span class="bioImage visually-hidden hidden"></span>';
         let beginningHTML = '<article class="gridBioWrapper card shadow-lg border-2" id="departmentBio' + gridBioDict.contentId.content + '" aria-label="' + gridBioDict.contentName.content + '">';




        /***
         *  modify wrapper's aria label
         * 
         * */
         function modifyWrapper(ariaLabel) {

            beginningHTML = '<article class="gridBioWrapper card shadow-lg border-2" id="departmentBio' + gridBioDict.contentId.content + '" aria-label="' + ariaLabel + '">';
        }




        /***
         *  process and prioritize label options
         * 
         * */
        if (gridBioDict.firstName.content && gridBioDict.lastName.content) {
        
            let ariaString = '' + gridBioDict.firstName.content + ' ' + gridBioDict.lastName.content + '';

            modifyWrapper(ariaString.trim());

        } else if (gridBioDict.fullName.content) {

            let ariaString = '' + gridBioDict.fullName.content + '';

            modifyWrapper(ariaString.trim());
        }
     



        /***
          *  set for fulltext link
          * 
          * */
         let titleLink =
            (gridBioDict.fullTextLink.content && gridBioDict.firstName.content && gridBioDict.lastName.content)
            ? '<h3 class="card-title border-0 bg-transparent"><a href="' + gridBioDict.fullTextLink.content + '" class="card-link" title="See the full profile of: ' + gridBioDict.firstName.content + '">' + gridBioDict.firstName.content + ' ' + gridBioDict.lastName.content + '</a></h3>'
            : (gridBioDict.fullTextLink.content && gridBioDict.fullName.content)
            ? '<h3 class="card-title border-0 bg-transparent"><a href="' + gridBioDict.fullTextLink.content + '" class="card-link" title="See the full profile of: ' + gridBioDict.fullName.content + '">' + gridBioDict.fullName.content + '</a></h3>'
            : (gridBioDict.fullTextLink.content && !gridBioDict.fullName.content)
            ? '<h3 class="card-title border-0 bg-transparent"><a href="' + gridBioDict.fullTextLink.content + '" class="card-link" title="See the full profile of: ' + gridBioDict.contentName.content + '">' + gridBioDict.contentName.content + '</a></h3>'
            : '<h3 class="card-title border-0 bg-transparent">' + gridBioDict.contentName.content + '</h3>';









        /***
         *  parse titles and display only the first title
         * 
         * */
         let arrayOfTitles = (gridBioDict.positionTitle.content) ?
            gridBioDict.positionTitle.content.split('\n') :
            null;

         let positionTitleSub = (arrayOfTitles) ?
            '<span class="title card-text">' + arrayOfTitles[0] + '</span>' :
            '<span class="title visually-hidden hidden">No title entered</span>'; 

 
 
 
 
         /***
          *  define subtitle
          * 
          * */
          let subtitleString = (gridBioDict.positionTitle.content) ?
            '<p class="card-subtitle">' + positionTitleSub + '</p>' :
            '<span class="card-subtitle">No subtitle fields entered</span>';




        /***
          *  define popover link
          * 
          * */
         let popoverTitleString = (arrayOfTitles) ?
            '<span class="title card-text">' + arrayOfTitles[0] + '</span>' :
            null; 
         let popoverLink = (popoverTitleString) ?
            '<a tabindex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus" title="'+ arrayOfTitles[0] +'" data-bs-content="some amazing content, very engaging. Right?">'+ arrayOfTitles[0] +'</a>' :         
            '<span class="card-subtitle">No valid popover</span>';



         /***
          *  define popover content
          * 
          * */
        //   let popOverString = (gridBioDict.positionTitle.content && subtitleString) ?
        //   '<div class="popover" role="tooltip"><div class="popover-arrow"></div><h4 class="popover-header"></h4><div class="popover-body"></div></div>'
        //   '<p class="card-subtitle">' + positionTitleSub + '</p>' :
        //   '<span class="card-subtitle">No subtitle fields entered</span>';            

 


        /***
         *  Parse for image
         * 
         * */
        if (gridBioDict.primaryImagePath.content) {

            let imageID = content.get('Photo').getID();
            let mediaInfo = getMediaInfo(imageID);
            let media = readMedia(imageID);
            let info = new ImageInfo;
            info.setInput(media);

            imageString = (info.check()) ?
                '<figure class="figure p-0 m-0"><img src="' + gridBioDict.primaryImagePath.content + '" class="deptBioImage figure-img card-img-top p-0 m-0" aria-label="' + mediaInfo.getName() + '" alt="' + mediaInfo.getDescription() + '" width="' + info.getWidth() + '" height="' + info.getHeight() + '" loading="auto" /></figure><figcaption class="figure-caption visually-hidden hidden">' + mediaInfo.getName() + '</figcaption>' :
                '<span class="deptBioImage visually-hidden hidden">Invalid Image ID</span>';
        }



  
         /***
          *  write document once
          * 
          * */
         writeDocument(
             [
                beginningHTML,
                imageString,
                openBody,
                titleLink,
                closeBody,
                openFooter,
                subtitleString,
                // popoverLink,
                closeFooter,
                endingHTML
             ]
         );
 
 
 
 
     } catch (err) {
         document.write(err.message);
     }
