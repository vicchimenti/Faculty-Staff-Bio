<div id="search-results" class="page page--full-width" data-t4-ajax-group="courseSearch" role="main">
  <article class="listing-page">
    <section class="su-listing">
      <?php if (!empty($results)) : ?>
        <?php foreach ($results as $item) : ?>
          <article class="listing--item profile--item global-padding--5x">
            <div class="grid-container">
              <div class="grid-x grid-margin-x">
                <div class="cell medium-3 medium-offset-1">
                  <?php if ($item['photo'] !== '') : ?>
                    <figure class="aspect-ratio-frame oho-animate oho-animate-single fade-in-big" style="--aspect-ratio: 30/26">
                      <img loading="lazy" src="<?php echo $item['photo']; ?>" alt="<?php echo $item['name']; ?>">
                    </figure>
                  <?php endif; ?>
                </div>
                <div class="cell small-6 medium-5 text-margin-reset">
                  <h3 class="funderline"><a href="<?php echo $item['url']; ?>"><?php echo $item['name']; ?></a></h3>
                    <div class="global-spacing--1x">
                      <?php if ($item['positionTitles'] !== '') : ?>
                        <p><?php echo $item['positionTitles']; ?></p>
                      <?php endif; ?>
                    </div>
                  <div class="global-spacing--2x tags tags__links">
                    <?php if ($item['staffDepartment'] !== '') : ?>
                      <h4 class="tags__heading show-for-sr">Department:</h4>
                      <ul>
                        <?php tags_list($item['staffDepartment'], $faculty_staff_home, 'staffDepartment', '|'); ?>
                      </ul>
                      <?php endif; ?>
                  </div>
                  
                  <?php if ($item['primaryDepartment'] !== '') : ?>
                    <div class="eyebrow global-spacing--3x">Office or Department</div>
                    <div class="global-spacing--1x">
					  <?php echo $item['primaryDepartment']; ?>
                      <?php if ($item['secondaryDepartment']): ?>
                         <br><?php echo $item['secondaryDepartment']; ?>
                      <?php endif; ?>
                     </div>
                  <?php else: ?>
                    <div class="eyebrow global-spacing--3x">&nbsp;</div>
                    <div class="global-spacing--1x"></div>
                  <?php endif; ?>
                </div>
              <?php if ($item['phone'] !== '' || $item['email'] !== '') : ?>
                <div class="cell small-6 medium-3 text-margin-reset">
                  <div class="eyebrow">Contact Information</div>
                  <div class="global-spacing--2x">
                    <ul class="icon-list">
                      <?php if ($item['phone'] !== '') : ?>
                        <li>
                          <span class="icon-list__icon fas fa-phone" aria-hidden="true"></span>
                          <span class="icon-list__content"><a href='tel:<?php echo $item['phone']; ?>'><?php echo $item['phone']; ?></a></span>
                        </li>
                      <?php endif; ?>
                      <?php if ($item['email'] !== '') : ?>
                        <li>
                          <span class="icon-list__icon fas fa-envelope" aria-hidden="true"></span>
                          <span class="icon-list__content">
                            <a href='mailto:<?php echo $item['email']; ?>'><?php echo $item['email']; ?></a>
                          </span>
                        </li>
                      <?php endif; ?>
                    </ul>
                  </div>
                </div>
              <?php endif; ?>
              </div>
            </div>
          </article>
        <?php endforeach; ?>
          <div class="pagination-box">
            <?php if (isset($paginationArray)) : ?>
              <div class="pagination-pages">
                <nav aria-label="pagination" class="pagination" data-t4-ajax-link="normal" data-t4-scroll="true">
                  <?php foreach ($paginationArray as $paginationItem) : ?>
                    <?php if ($paginationItem['current']) : ?>
                      <span class="currentpage"><a href=""><?php echo $paginationItem['text']; ?></a></span>
                    <?php else : ?>
                      <a href="<?php echo $paginationItem['href']; ?>" class="<?php echo $paginationItem['class']; ?>">
                        <?php echo $paginationItem['text']; ?>
                      </a>
                    <?php endif; ?>
                  <?php endforeach; ?>
                </nav>
              </div>
            <?php endif; ?>
          </div>
      <?php else : ?>
        <p style="text-align: center; padding-top: 30px; font-weight: bold;">No Results Found</p>
      <?php endif; ?>
    </section>
  </article>
</div>
