/***
 *     @author Victor Chimenti, MSCS
 *     @file bio-output-gridfeed.js
 *     @see Seattle University
 *
 *     This new content type layout is a smart layout for news items that must obey
 *     a masonry grid layout. In this iteration this layout will be dedicated
 *     to the faculty-staff bio content type.
 *
 *     This content layout will be the organizer layout and will link to the
 *     full text layout to reveal the full article.
 *
 *     Document will write once when the page loads
 *
 *     @version 2.5
 */




 try {

    /***
     *  Assign local variables from the content type's fields
     * 
     * */
    var profileTitle = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Name of Faculty or Staff Member' output='normal' display_field='value' />");
    var frontPageImage = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Photo' output='normal' formatter='path/*' />");
    var profileSummary = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Summary Biography' output='normal' display_field='value' />");
    var profileFullBody = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Extended Biography' output='normal' display_field='value' />");
    var fullTextLink = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Name' output='fulltext' use-element='true' filename-element='Name' modifiers='striptags,htmlentities' />");
    var titles = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Position Title(s)' output='normal' display_field='name' />");
    var phone = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Phone' output='normal' display_field='name' />");
    var emailAddress = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Email Address' output='normal' display_field='name' />");
    var roomNumber = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Building/Room Number' output='normal' display_field='name' />");
    var degrees = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='content' name='Degree(s)' output='normal' display_field='name' />");
    var anchorTag = com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, "<t4 type='meta' meta='html_anchor' />");

    
 

    /***
     *  Declare/Assign local variables with base formatting
     * 
     * */
    var cardText = "<span class='card-text summary'><p>" + profileSummary + "</p></span>";
    var titleLink = "";
    var listItems = "";
    var listOfDegrees = "";
    var listOfTitles = "";
    var thumbNailString = "";
    var titleOne = "";
    var degreeOne = "";
    var contactPhone = "";
    var contactEmail = "";
    var anchorWrap = '<div class="hidden">' + anchorTag + '</div>';
    var beginningHTML = '<div class="gridFeedItem card shadow col-xs-12 col-sm-10 col-md-8 col-lg-6 col-xl-4" title="' + profileTitle + '" id="id<t4 type=\'meta\' meta=\'content_id\' data-position-default="ZoneA" data-position-selected="ZoneA" />">';
    var endingHTML = '</div>';




    /***
     *  parse the list of degrees, add <li> tags
     * 
     * */
    if (degrees != "") {
        var arrayOfDegrees = degrees.split('\n');
        listItems = "";
        for (let i = 0; i < arrayOfDegrees.length; i++) {
            listItems += '<li class="tag">' + arrayOfDegrees[i] + '</li>';
        }
        listOfDegrees = '<div class="tags"><ul class="profileDegrees">' + listItems + '</ul></div>';
        degreeOne = arrayOfDegrees[0];
    }




    /***
     *  parse the list of titles, add <li> tags
     * 
     * */
    if (titles != "") {
        var arrayOfTitles = titles.split('\n');
        listItems = "";
        for (let i = 0; i < arrayOfTitles.length; i++) {
            listItems += '<li class="tag">' + arrayOfTitles[i] + '</li>';
        }
        listOfTitles = '<div class="tags"><ul class="profileTitles">' + listItems + '</ul></div>';
        titleOne = arrayOfTitles[0];
    }




    /***
     *  determine if the article contains full text content
     * 
     * */
    if (profileFullBody == "") {
        titleLink = '<h3 class="card-title">' + profileTitle + '</h3>';
    } else {
        titleLink = '<h3 class="card-title"><a href="' + fullTextLink + '">' + profileTitle + '</a></h3>';
    }




    /***
     *  verify Main image and photo credits
     * 
     * */
    if (frontPageImage == "") {
        thumbNailString = '<span class="hidden">No Image Provided</span>';

    } else {
        thumbNailString = '<span class="cardImageWrapper"><img src="' + frontPageImage + '" class="card-img-top" alt="' + profileTitle + '" /></span>';
    }




    /***
     *  verify Phone
     * 
     * */
    if (phone == "") {
        contactPhone = '<span class="hidden">No Phone Provided</span>';

    } else {
        contactPhone = '<p class="contactInfo phone">Phone: ' + phone + '</p>';
    }




    /***
     *  verify email
     * 
     * */
    if (emailAddress == "") {
        contactEmail = '<span class="hidden">No Phone Provided</span>';

    } else {
        contactEmail = '<p class="contactInfo">Email: ' + emailAddress + '</p>';
    }



    
    /***
     *  Write the document once
     * 
     * */
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, beginningHTML));
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, thumbNailString));
    document.write('<div class="card-body">');
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, anchorWrap));
    document.write(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, content, language, isPreview, titleLink));
    document.write('<div class="card-subtitle mb-2 text-muted">' + titleOne + '</div>');
    document.write('<div class="card-text">' + degreeOne + '</div>');
    document.write('</div>'); // close card-body
    document.write('<div class="card-footer">');
    document.write(contactPhone);
    document.write(contactEmail);
    document.write('</div>'); // close card-footer
    document.write(endingHTML);




} catch (err) {
    document.write(err.message);
}