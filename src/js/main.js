$(function(){
    $(".page").removeClass("preload");

    svg4everybody();

    // filter checkbox toggle
    $('input[data-select-all]').click (function () {
        $select = $(this).data('select-all');
        $(':checkbox[name='+$select+']').prop('checked', this.checked);
    });
    $('input[type=checkbox]').click(function(){
        $name = $(this).attr('name');
        $('input[data-select-all='+$name+']').prop('checked', false );
    });

    // width for compare items wrap
    var compareWidth = 0;
    $('.compare_item').each(function(){
        compareWidth += parseInt($(this).outerWidth(), 10);
    });
    $('.compare_items-inner').css('width', compareWidth);

    // input range slider
    $("#range-slider").ionRangeSlider({
        type: "double",
        min: 10,
        max: 3500,
        from: 10,
        to: 3500,
        postfix: " кВА",
    });

    // contacts block toggle
    $('.contacts-toggle-btn').click(function(){
        $(this).toggleClass('open');
        $('.contacts-block').toggle();
    });

    $('.menu-btn').click(function(){
        $(this).toggleClass('open');

        if( isBreakpoint('xs') ){
            $('#nav').toggleClass('open');
            $('.overlay').toggle();
            $('body').toggleClass('drawer-open');
        }
        else{
            $('#header.fixed').toggleClass('open');
        }
    });
    $('.overlay').click(function(){
        $(this).hide();
        $('.menu-btn').removeClass('open');
        $('#nav').removeClass('open');
        $('body').removeClass('drawer-open');
    });

    // Tabs toggle
    $('ul.tabs_nav').each(function(){
        var $active, $content, $links = $(this).find('a');

        $active = $($links.filter('[href="'+location.hash+'"]')[0] || $links[0]);
        $active.parent('li').addClass('active');

        $content = $($active[0].hash);

        $content.addClass('active');

        $links.not($active).each(function () {
            $(this.hash).hide();
        });

        $(this).on('click', 'a', function(e){
            $active.parent('li').removeClass('active');
            $content.hide();

            $active = $(this);
            $content = $(this.hash);

            $active.parent('li').addClass('active');
            $content.show();

            e.preventDefault();
        });
    });


    if( !isBreakpoint('xs') ){
        
        // equal heights
        $('.advantage_item').equalHeights();
        $('.product-details_list').equalHeights();

        // header fixed
        $(window).scroll(function(){
            if( $(window).scrollTop() > 150) {
                $('#header').addClass("fixed");
                $('.page-corner').addClass("shown");
            }
            else{
                $('.page-corner').removeClass("shown");
                $('#header').removeClass("fixed");
            }
        });
    }

    // Fancybox
    // ============================================
    $(".fancybox").fancybox({
        padding: 0,
        margin: 0,
        openEffect  : 'elastic',
        helpers : {
            overlay: {
                locked: false
            }
        }
    });

    // Main Slider
    // ============================================
    $('.main-slider').owlCarousel({
        loop: false,
        items: 1,
        margin: 0,
        nav: false,
        dots: true,
        onInitialized: function(){
            $('.main-slider').css({'height':'auto', 'visibility': 'visible'});
        },
    });

    // Product thumbs slider
    // ============================================
    $('.thumb-slider').owlCarousel({
        loop: true,
        items: 4,
        margin: 0,
        nav: true,
        dots: false,
        navText: ['',''],
        responsive: {
            0:{
                items: 2,
                dots: true,
                nav: false,
            },
            768:{
                items: 3,
                dots: false,
                nav: true,
            },
            992:{
                items: 4,
            }
        },
        onInitialized: function(){
            $('.thumb-slider').css({'height':'auto', 'visibility': 'visible'});
        },
    });

    // Product thumbs slider
    // ============================================
    $('.partners-slider').owlCarousel({
        loop: true,
        margin: 30,
        nav: true,
        dots: false,
        navText: ['',''],
        responsive: {
            0:{
                items: 2,
                dots: true,
                nav: false,
            },
            768:{
                items: 4,
                dots: false,
                nav: true,
            },
            992:{
                items: 6,
            }
        },
        onInitialized: function(){
            $('.partners-slider').css({'height':'auto', 'visibility': 'visible'});
        },
    });

    // Product thumbs slider
    // ============================================
    $('.clients-slider').owlCarousel({
        loop: true,
        margin: 20,
        nav: true,
        dots: false,
        navText: ['',''],
        responsive: {
            0:{
                items: 1,
                dots: true,
                nav: false,
            },
            768:{
                items: 3,
                dots: false,
                nav: true,
            },
            992:{
                items: 4,
            }
        },
        onInitialized: function(){
            $('.clients-slider').css({'height':'auto', 'visibility': 'visible'});
        },
    });




});

function fixHeader(){

}

function isBreakpoint( alias ) {
    return $('.device-' + alias).is(':visible');
}


/*!
 * Simple jQuery Equal Heights
 *
 * Copyright (c) 2013 Matt Banks
 * Dual licensed under the MIT and GPL licenses.
 * Uses the same license as jQuery, see:
 * http://docs.jquery.com/License
 *
 * @version 1.5.1
 */
(function($) {

    $.fn.equalHeights = function() {
        var maxHeight = 0,
            $this = $(this);

        $this.each( function() {
            var height = $(this).innerHeight();

            if ( height > maxHeight ) { maxHeight = height; }
        });

        return $this.css('height', maxHeight);
    };

    // auto-initialize plugin
    $('[data-equal]').each(function(){
        var $this = $(this),
            target = $this.data('equal');
        $this.find(target).equalHeights();
    });

})(jQuery);