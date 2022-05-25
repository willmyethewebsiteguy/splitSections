/*==========
  Version 3.2
  Split Sections Code For Squarespace 7.1 & 7.0
   Copyright Will Myers 
========== */
$(function(){
  "use strict";
  if ($('[data-wm-plugin="split-sections"]').length) {
    // my callback function 
    // which relies on CSS being loaded function
    function CSSDone() {
      $('body').addClass('wm-split-loaded');
      window.dispatchEvent(new Event('wmSplitCSSLoaded'));
    };

    // load me some stylesheet 
    let url = "https://cdn.jsdelivr.net/gh/willmyethewebsiteguy/splitSections@3.2.006/styles.css",
        head = document.getElementsByTagName('head')[0],
        link = document.createElement('link');

    link.type = "text/css"; 
    link.rel = "stylesheet";
    link.href = url;
    link.id = 'wm-split-css'

    link.onload = function () {
      CSSDone();
    };   
    head.appendChild(link);

    /*Add 7.0 Code & CSS*/
    if ($('main.Index').length){
      $('body').addClass('sqs-seven-oh');
     
    } 

    /*Build Split Object*/
    $('[data-wm-plugin="split-sections"]').each(function(i){
      let index = i + 1,
          splitSection,
          splitCount = 2,
          splitWidths = [],
          $parentSectionId,
          stickySectionNum,
          sectionBackgroundColor,
          stickySection,
          border = 0,
          mobileReverse = false;

      if ($(this).attr('data-border')) {
        border = parseInt($(this).attr('data-border'));
      }

      if ($(this).attr('data-mobile-reverse') == "true") {
        mobileReverse = true;
      }

      if ($(this).attr('data-split-count')) {
        splitCount = parseInt($(this).attr('data-split-count'));
      }

      /*Squarespace 7.1 Code*/
      if ($('.sqs-seven-one').length){
        $parentSectionId = $(this).closest('section.page-section');

        /*Squarespace 7.0 Code*/
      } else if($('.sqs-seven-oh').length) {
        $parentSectionId = $(this).closest('section.Index-page'); 
      }

      // Add Classes & Group Num to First section
      $parentSectionId.addClass('wm-split-section wm-split-1').attr('data-wm-split-group', index);

      // Add Classes & Group Num to Remaining Sections
      let j;
      for (j = 1; j < splitCount; j++){
        let count = j + 1;
        let nextSection = $('[data-wm-split-group="' + index + '"]').last().next();
        $(nextSection).addClass('wm-split-section wm-split-' + count).attr('data-wm-split-group', index);
      }

      //Hide Code Block
      $(this).closest('.sqs-block-code').addClass('remove-height');

      //Wrap in Div
      $('[data-wm-split-group=' + index + ']').wrapAll('<div class="wm-split-sections" id="split-group-' + index + '"></div>');
      splitSection = '#split-group-' + index;

      
      /*If Widths are Declared, Set Them*/
      if ($(this).attr('data-split-widths')){
        let widthData = $(this).attr('data-split-widths');
        splitWidths = widthData.split(',');
      } else {
        let evenWidth = (100 / splitCount) + '%';
        for (let e = 0; e < splitCount; e++){
          splitWidths.push(evenWidth);
        }
      }

      if (mobileReverse) {
        let r;

        function setReverse() {
          for (r = 0; r < splitWidths.length; r++){
            let i = splitWidths.length - r - 1;
            $('#split-group-' + index).find('.wm-split-section').eq(i).css({
              'order': (r + 1)
            })
          }
        }
        function removeReverse() {
          for (r = 0; r < splitWidths.length; r++){
            $('#split-group-' + index).find('.wm-split-section').eq(r).css({
              'order': (r + 1)
            })
          }
        }
        function checkWidth() {
          if (window.matchMedia('(max-width: 799px)').matches) {
            setReverse();
          } else {
            removeReverse();
          }
        }
        window.addEventListener('resize', checkWidth);
        checkWidth();
      }
      
      let w;
      for (w = 0; w < splitWidths.length; w++){
        $('#split-group-' + index).find('.wm-split-section').eq(w).css({
          'width': `calc(${splitWidths[w]} - ${border}px)`,
        });
        $('#split-group-' + index)[0].style.setProperty("--gap", `${border}px`);
      }

      //If sticky section is declared, make it stick
      if ($(this).attr('data-sticky-section')){
        stickySectionNum = parseInt($(this).attr('data-sticky-section'));
        stickySectionNum = stickySectionNum - 1;
        stickySection = $('#split-group-' + index).find('.wm-split-section').eq(stickySectionNum);
        $(stickySection).addClass('split-sticky');
        sectionBackgroundColor = $(stickySection).find('.section-background').css('background-color');
        $(splitSection).css({'background-color': sectionBackgroundColor});
        // Get background color
        
        //if in 7.1 and Header has Scroll-Back
        if ($('body').hasClass('tweak-fixed-header-style-scroll-back')){
          function checkScrollBack(){
            if ($('#header .header-announcement-bar-wrapper').css('transform') === "matrix(1, 0, 0, 1, 0, 0)") {
              $('body').removeClass('scroll-back-up');
              $('body').addClass('scroll-back-down');             
            } else {
              $('body').removeClass('scroll-back-down');
              $('body').addClass('scroll-back-up');
            }
          }
          checkScrollBack();
          window.addEventListener('scroll', checkScrollBack);
        }
      }

      if ($(this).attr('data-background')) {
        $('#split-group-' + index).css({'background-color': $(this).attr('data-background')})
      }

      /*If First Section*/
      if($('#split-group-1:first-child').length & $('#header').length){
        let targetNode = document.getElementById('header');
        let config = { attributes: true, childList: false, subtree: false };

        // Callback function to execute when mutations are observed
        let callback = function(mutationsList, observer) {
          // Use traditional 'for loops' for IE 11
          for(const mutation of mutationsList) {
            if (mutation.type === 'attributes') {
              setTimeout(function(){
                let headerHeight = $('#header')[0].getBoundingClientRect().height + 'px';
                $(':root').css({'--wm-header-bottom': headerHeight})
              }, 100);
            }
          }
        };
        let observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
      }
      $('body').addClass('wm-split-sections-added');
    });

    /*Adjust Padding on First Section*/
    function adjustHeaderBottom(){
      let header = document.querySelector('#header'),
          headerBottom = header.getBoundingClientRect().bottom > 0 ? header.getBoundingClientRect().bottom - 1 + "px" : 0 + "px";

      $('.wm-split-section.split-sticky').each(function(){
        $(this)[0].style.setProperty('--wm-header-bottom', headerBottom);
      },150);
    }

    if(window.self !== window.top){
      $('[data-test="frameToolbarEdit"]', parent.document).on('click', function(){
        $('.wm-split-section').unwrap();
      })
    }

    function loadImages() {
      let images = document.querySelectorAll('.wm-split-section .summary-v2-block img, .wm-split-section .section-background img');
      images.forEach(img => {
        let imgData = img.dataset,
            focalPoint = imgData.imageFocalPoint,
            parentRation = imgData.parentRatio;

        if (focalPoint) {
          let x = focalPoint.split(',')[0] * 100,
              y = focalPoint.split(',')[1] * 100;
          img.style.setProperty('--position', `${x}% ${y}%`)
        }
      });
    }
    loadImages();

    if (document.querySelector('#header')) {
      adjustHeaderBottom();
      window.addEventListener("resize", adjustHeaderBottom);
      $('#header')[0].addEventListener("transition", adjustHeaderBottom);
      $('#header')[0].addEventListener("transitionend", adjustHeaderBottom);
    }
    
    window.dispatchEvent(new Event('resize'));
  }
});
$('body').addClass('wm-split-sections-completed');
