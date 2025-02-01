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



/***
*      Dictionary of content
* */
let relatedNewsDict = {

    newsFeed: getContentValues('<t4 type="navigation" name="Profile related news" id="994" />'),
    newsroomLink: getContentValues('<t4 type="navigation" name="Link to News & Stories" id="991" />')

};




/***
*  Open News Wrapper
* 
* */
let  openNewsWrapper = (relatedNewsDict.newsFeed.content && relatedNewsDict.newsroomLink.content) ?
  '<section class="related-news-stories-section global-padding--15x bg--dark bg--blue bg--gradient">' +
  '<div class="grid-container oho-animate-sequence">' +
  '<div class="grid-x grid-margin-x">' +
  '<div class="cell large-9">' +
  '<div class="section-heading--basic text-margin-reset">' +
  '<h2 class="oho-animate fade-in">Similar News &amp; Stories</h2>' :
  '<span hidden class="newsWrapper d-none visually-hidden"></span>';




/***
*  News Link
* 
* */
let newsLink = (relatedNewsDict.newsroomLink.content) ?
  '<div class="section-heading__link global-spacing--2x oho-animate fade-in">' + 
  '<a href="' + relatedNewsDict.newsroomLink.content + '">Related News &amp; Stories</a></div>' :
  '<span hidden class="newsLink d-none visually-hidden"></span>';




/***
*  News Feed
* 
* */
let  = (relatedNewsDict.newsFeed.content) ?
  '<ul class="grid-x grid-margin-x global-spacing--6x">' + relatedNewsDict.newsFeed.content + '</ul>' :
  '<span hidden class="newsFeed d-none visually-hidden"></span>';













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
