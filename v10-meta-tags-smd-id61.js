/*
    PL to handle metadata between normal sections, fulltext and sections that contain fulltext content

    Used due to:
    - fulltext needing different meta, and standard T4 meta tags can only be used for one or the other
    - needing to get the og:image:alt tag - this can't be created through standard T4 tags
    
*/
try {

    var MetaDataImports = JavaImporter(java.lang.Thread, com.terminalfour.publish.utils.BrokerUtils);

    with (MetaDataImports) {

        //Defining main functions
        function processTags(t4Tag) {
            myContent = content || null;
            return String(com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, section, myContent, language, isPreview, t4Tag));
        }

        var output    = '', 
        isFullText = BrokerUtils.isFullTextPage(publishCache);

        var imageAlt;
      

      	if (isFullText) {
          	// For Fulltext content... TBC at later phase of project
          
        } else {
          	// check for an og:image:alt - this pulls in text/og-image-alt from the current section, a layout used for hero content types
          	imageAlt = processTags('<t4 type="navigation" name="Return og:image:alt" id="972" />');
        
          	output += '<t4 type="meta" property="description" id="18" />\n';
            output += '<t4 type="meta" property="keywords" id="19" />\n';
            output += '<meta name="twitter:card" content="summary_large_image">\n';
            output += '<meta name="twitter:site" content="@seattleu">\n';
            output += '<meta name="twitter:creator" content="@seattleu">\n';
            output += '<t4 type="meta" name="twitter:title" id="45" />\n';
            output += '<meta name="twitter:url" content="https://www.seattleu.edu<t4 type="navigation" name="Return Current Section Path" id="976" />">\n';
            output += '<t4 type="meta" name="twitter:description" id="49" />\n';
            output += '<t4 type="meta" name="twitter:image" id="50" />\n';
            output += '<meta property="og:type" content="website">\n';
            output += '<meta property="og:site_name" content="Seattle University">\n';
            output += '<t4 type="meta" property="og:title" id="48" />\n';
          	output += '<meta property="og:url" content="https://www.seattleu.edu<t4 type="navigation" name="Return Current Section Path" id="976" />">\n';  
            output += '<t4 type="meta" property="og:description" id="47" />\n';
          	output += '<t4 type="meta" property="og:image" id="27" />\n';
          	if (imageAlt && imageAlt !== '') {
              	output += imageAlt + '\n';
          	}

        }
        
		// Write output...
        document.write(processTags(output));
     
    }
} catch (e) {
    if (e instanceof SyntaxError) {
        document.write(e.message);
    }
}