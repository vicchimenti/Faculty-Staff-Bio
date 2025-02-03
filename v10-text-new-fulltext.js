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