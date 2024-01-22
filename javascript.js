/*==========
  Version 3
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

    // load the stylesheet 
    if(!document.querySelector('#wm-split-css')) {
      let url = "https://cdn.jsdelivr.net/gh/willmyethewebsiteguy/splitSections@3/styles.min.css",
          head = document.getElementsByTagName('head')[0],
          link = document.createElement('link');

      link.type = "text/css"; 
      link.rel = "stylesheet";
      link.href = url;
      link.id = 'wm-split-css'

      link.onload = function () {
        CSSDone();
      };   
      head.prepend(link);
    }
    /*Add 7.0 Code & CSS*/
    if ($('main.Index').length){
      $('body').addClass('sqs-seven-oh');
    } 

    /*Build Split Object*/
    $('[data-wm-plugin="split-sections"]').each(function(i){
      if($(this).closest('.wm-split-sections').length) {
        return;
      }
      
      let index = i + 1,
          splitSection,
          splitCount = 2,
          splitWidths = [],
          $parentSectionId,
          stickySectionNum,
          sectionBackgroundColor,
          stickySection,
          border = 0,
          mobileReverse = false,
          mobileBreakpoint = 799,
          vanillaEl = $(this)[0];

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
      $(`[data-wm-split-group="${index}"]`).wrapAll(`<div class="wm-split-sections" data-breakpoint="${mobileBreakpoint}px" id="split-group-${index}"></div>`);
      splitSection = '#split-group-' + index;
      

      //Get Mobile Breakpoint CSS Values
      let splitContainer = vanillaEl.closest('.wm-split-sections'),
          styles = window.getComputedStyle(splitContainer),
          breakpoint = styles.getPropertyValue('--mobile-breakpoint');
      breakpoint = parseInt(breakpoint);
      
      if (breakpoint) {
        mobileBreakpoint = breakpoint;
      }
      
      function checkBreakpoint() {
        if (window.innerWidth <= mobileBreakpoint && !splitContainer.classList.contains('mobile-breakpoint')) {
          splitContainer.classList.add('mobile-breakpoint');
        } 
        if (window.innerWidth > mobileBreakpoint) {
          splitContainer.classList.remove('mobile-breakpoint');
        }
      }
      window.addEventListener('resize', checkBreakpoint)
      checkBreakpoint()
      
      
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
          if (window.matchMedia(`(max-width: ${mobileBreakpoint}px)`).matches) {
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
        $('#split-group-' + index).find('.wm-split-section').eq(w)[0].style.setProperty('--width', (parseFloat(splitWidths[w]).toFixed(5) / 100));
        $('#split-group-' + index)[0].style.setProperty("--gap", `${border}px`);
      }
      
      if ($(this).attr('data-max-width') == 'maintain'){
        $('#split-group-' + index).addClass('maintain-max-width')
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
      }

      if ($(this).attr('data-background')) {
        $('#split-group-' + index).css({'background-color': $(this).attr('data-background')})
      }

      $('body').addClass('wm-split-sections-added');
    });

    /*Emit Custom Events*/
    function emitEvent(type, detail = {}, elem = document) {
      // Make sure there's an event type
      if (!type) return;

      // Create a new event
      let event = new CustomEvent(type, {
        bubbles: true,
        cancelable: true,
        detail: detail,
      });

      // Dispatch the event
      return elem.dispatchEvent(event);
    }
    emitEvent('wmSplitSections:loaded')
    

    /*Adjust Padding on First Section*/
    function adjustHeaderBottom(){
      let header = document.querySelector('#header'),
          headerBottom = header.getBoundingClientRect().bottom > 0 ? header.getBoundingClientRect().bottom - 1 + "px" : 0 + "px",
          headerHeight = header.getBoundingClientRect().height + "px";

      $('.wm-split-sections').each(function(){
        $(this)[0].style.setProperty('--wm-header-bottom', headerBottom);
        $(this)[0].style.setProperty('--wm-header-height', headerHeight);
      },150);
    }

    if(window.self !== window.top){
      if (!$('main.Index').length){
        let body = document.querySelector('body');
        const observer = new MutationObserver(() => {
          if (body.classList.contains('sqs-edit-mode-active')) {
            $('.wm-split-section').each(function(){
              $(this)[0].style.width = '';
              $(this)[0].style.order = '';
            });
            $('.wm-split-section').unwrap('.wm-split-sections');
            $('.wm-split-sections').remove();
            observer.disconnect();
          }
        });
        
        observer.observe(body, { 
          attributes: true,
          attributeFilter: ['class']
        });
      }
    }

    function loadImages() {
      let images = document.querySelectorAll('.wm-split-section .summary-v2-block img, .wm-split-section .section-background img, .wm-split-section .sqs-block-gallery .content-fit img');
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
    window.addEventListener('load', function() {
      window.setTimeout(function() {
        function loadAllImages() {
          var images = document.querySelectorAll('.wm-split-section img[data-src]' );
          for (var i = 0; i < images.length; i++) {
            ImageLoader.load(images[i], {load: true});
          }
        }
        loadAllImages();
        window.dispatchEvent(new Event('resize'));
      }, 200)
    })
  }
  $('body').addClass('wm-split-sections-completed');
});
