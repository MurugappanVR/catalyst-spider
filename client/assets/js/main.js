(function(w,d,s,r,k,h,m){
	if(w.performance && w.performance.timing && w.performance.navigation) {
		w[r] = w[r] || function(){(w[r].q = w[r].q || []).push(arguments)};
		h=d.createElement('script');h.async=true;h.setAttribute('src',s+k);
		d.getElementsByTagName('head')[0].appendChild(h);
		(m = window.onerror),(window.onerror = function (b, c, d, f, g) {
		m && m(b, c, d, f, g),g || (g = new Error(b)),(w[r].q = w[r].q || []).push(["captureException",g]);})
	}
})(window,document,'//static.site24x7rum.com/beacon/site24x7rum-min.js?appKey=','s247r','b2ee8223540479644195eb6b305fc9ee');

(function ($)
  { "use strict"
  

  $("#header").load("header.html",function(){
    /* 3. slick Nav */
    // mobile_menu
    var menu = $('ul#navigation');
    if(menu.length){
      menu.slicknav({
        prependTo: ".mobile_menu",
        closedSymbol: '+',
        openedSymbol:'-'
      });
    };

    var performAnimation = function performAnimation() {
      var animation = bodymovin.loadAnimation({
        container: document.getElementById('feedback_1'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'assets/img/illustrations/animated/Feedback_2.json'
      });
      animation = bodymovin.loadAnimation({
        container: document.getElementById('feedback_2'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'assets/img/illustrations/animated/Feedback_3.json'
      });
      animation = bodymovin.loadAnimation({
        container: document.getElementById('feedback_3'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'assets/img/illustrations/animated/Feedback_1.json'
      });
    };
    var loadProductPricing = function(pid,elementId){
      $("#ecommerce-scrape-message").removeClass("display-hidden");
      $.ajax({
        url: "/server/spider_as_a_service_function/pricing/amazon",
        type: 'GET',
        data: { 
          'id': pid
        },
        success: function(value) {
          var data = value.list;
          console.log(data);
          var productDetails = "<img src='"+value.thumnail_url+"' height=100 width=100></img><div><a href='"+value.url+"' target='_blank' style='color:blue'>"+value.title+"</a></div>"
          $(elementId+'-details').append(productDetails);
          
          var len = data.length;
          var txt = "";
          $(elementId).find("tr:gt(0)").remove();
          if(len > 0){
              for(var i=0;i<len;i++){
                txt += "<tr><td>"+data[i].date+"</td><td>"+data[i].price+"</td></tr>";
              }
              if(txt != ""){
                console.log(JSON.stringify($(elementId)));
                  $(elementId).append(txt).removeClass("display-hidden");
              }
          }

          //opening ecommerce url in a new tab
          $(".clickable-row").click(function() {
            console.log("inside");
            window.open($(this).data("href"),'_blank');
          });
        }
      });
    }
    if (window.location.pathname.indexOf("index") > -1) {
      performAnimation();
    }
    else if (window.location.pathname.indexOf("services") > -1) {
      var urlParams = new URLSearchParams(window.location.search);
      var type = urlParams.get('type');
      console.log("type is"+type);
      var subtype = urlParams.get('subtype');
      $('#no-type').hide();
      $('#ecommerce').hide();
      $('#social-media').hide();
      $('#web-page').hide();
      $('#bot-detector').hide();
      if(type){
        if(type=='ecommerce'){
          $('#ecommerce').show();
          $('#ecommerce > .main').hide();
          $('#ecommerce > .scrape').hide();
          $('#ecommerce > .pricinghistory').hide();
          if(subtype){
            if(subtype=='scraping'){
              $('#ecommerce > .scrape').show();  
            }else{
              $('#ecommerce > .pricinghistory').show();
              //$(ecommerce-pricing-raw)
              loadProductPricing('B08N5WG761','#ecommerce-pricing-table-1');
              //loadProductPricing('B08L5VZKWT','#ecommerce-pricing-table-2');  
              loadProductPricing('B08K3GW17S','#ecommerce-pricing-table-2');  
            }
          }else{
            $('#ecommerce > .main').show();
          }
        }else if(type=='social-media'){
          $('#social-media').show();
        }else if(type=='webpage'){
          $('#web-page').show();
        }else{
          $('#bot-detector').show();
        }
      }else{
        $('#no-type').show();
      }
    }
  });
  $("#footer").load("footer.html",function(){
    // try {
    //   $('#whatsappDiv').floatingWhatsApp({
    //     phone: '123456789',
    //     popupMessage: 'Hello, how can we help you?',
    //     headerTitle: 'Welcome to Zoho Catalyst Spider!',
    //     message: "Hi Zoho Catalyst Spider, I'd like to contact you",
    //     position: 'right',
    //     zIndex: 100000,
    //     showPopup: true,
    //     showOnIE: false,
    //     headerTitle: 'Welcome!' // buttonImage: '<img src="burger.svg" />'
    //   });
    // } catch (e) {}
  });

//ecommerce scrape btn click handler
var ecommerceScrappedData = {}
$("#ecommerce-scrape-submit").click(function(){
  var country = $('#ecommerce-scrape-country').find(":selected").val();
  var rating = $('#ecommerce-scrape-rating').find(":selected").val();
  var search = $('#ecommerce-scrape-search').val();
  var ratingLower=3;
  if(rating==4){
    ratingLower=4;
  }else if(rating==5){
    ratingLower=5;
  }
  if(!search){
    alert('enter all values');
  }else{
    $("#ecommerce-scrape-message").removeClass("display-hidden");
    $.ajax({
      url: "/server/spider_as_a_service_function/list/amazon",
      type: 'GET',
      data: { 
        'keyword': search, 
        'country': country, 
        'ratingLower': ratingLower,
        'ratingUpper': 5,
        'limit':20
      },
      success: function(data) {
        ecommerceScrappedData = data; 
        var len = data.length;
        var txt = "";
        $("#ecommerce-scrape-table").find("tr:gt(0)").remove();
        $("#ecommerce-scrape-note").removeClass("display-hidden");
        $("#ecommerce-scrape-raw").removeClass("display-hidden");
        if(len > 0){
            for(var i=0;i<len;i++){
              txt += "<tr class='clickable-row' style='cursor:pointer' data-href="+data[i].url+"><td><img src='"+data[i].thumbnail+"' height=100 width=100></img></td><td>"+data[i].title+"</td><td>"+data[i].asin+"</td><td>"+data[i].price.current_price+data[i].price.currency+"</td><td>"+data[i].reviews.rating+"</td><td>"+data[i].reviews.total_reviews+"</td></tr>";
            }
            if(txt != ""){
                $("#ecommerce-scrape-table").append(txt).removeClass("display-hidden");
            }
        }

        //opening ecommerce url in a new tab
        $(".clickable-row").click(function() {
          console.log("inside");
          window.open($(this).data("href"),'_blank');
        });
      }
    });
  }
}); 

//ecommerce-scrape download raw json
$("#ecommerce-scrape-download").click(function(){
  console.log(ecommerceScrappedData);
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ecommerceScrappedData));
  var dlAnchorElem = document.getElementById('ecommerce-scrape-download-anchor');
  dlAnchorElem.setAttribute("href",dataStr);
  dlAnchorElem.setAttribute("download","raw.json");
  dlAnchorElem.click();

  var json = ecommerceScrappedData;
  var fields = Object.keys(json[0])
  var replacer = function(key, value) { return value === null ? '' : value } 
  var csv = json.map(function(row){
    return fields.map(function(fieldName){
      return JSON.stringify(row[fieldName], replacer)
    }).join(',')
  })
  csv.unshift(fields.join(',')) // add header column
  csv = csv.join('\r\n');
  console.log(csv)


});

//ecommerce-scrape download raw csv
$("#ecommerce-scrape-download-csv").click(function(){
  console.log(ecommerceScrappedData);
  

  var json = ecommerceScrappedData;
  var fields = Object.keys(json[0])
  var replacer = function(key, value) { return value === null ? '' : value } 
  var csv = json.map(function(row){
    return fields.map(function(fieldName){
      return JSON.stringify(row[fieldName], replacer)
    }).join(',')
  })
  csv.unshift(fields.join(',')) // add header column
  csv = csv.join('\r\n');
  console.log(csv)
  var dataStr = "data:text/csv;charset=utf-8," + encodeURI(csv);
  var dlAnchorElem = document.getElementById('ecommerce-scrape-download-anchor');
  dlAnchorElem.setAttribute("href",dataStr);
  dlAnchorElem.setAttribute("download","raw.csv");
  dlAnchorElem.click();


});

//social media scrape data
$("#social-media-scrape-submit").click(function(){
  var search = $('#social-media-scrape-search').val();
  var type = "hash";
  if(search.startsWith('@')){
    type = "user";
  }
  if(!search){
    alert('enter all values');
  }else{
    //$("#ecommerce-scrape-message").removeClass("display-hidden");
    $.ajax({
      url: "/server/spider_as_a_service_function/scrape/ig",
      type: 'GET',
      data: { 
        'query': search.substring(1), 
        'type': type
      },
      success: function(data) {
        console.log(data);

        //if(type=='user'){
          var txt = "";
          txt="<a href='"+data.pic+"' target='_blank' style='color:blue'>Display Image</a><div><a href='"+data.link+"' target='_blank' style='color:blue'>"+data.name+"</a></div>"
          $("#social-media-scrape-user").append(txt);
          var len = data.lastPosts.length;
          txt = "";
          $("#social-media-scrape-user-table").find("tr:gt(0)").remove();
          if(len > 0){
              for(var i=0;i<len;i++){
                txt += "<tr class='clickable-row' style='cursor:pointer' data-href=https://www.instagram.com/p/"+data.lastPosts[i].shortcode+"><td width='10%'><a href='"+data.lastPosts[i].thumbnail+"' target='_blank' style='color:blue'>thumbnail_link</a></td><td width='60%'>"+data.lastPosts[i].caption+"</td><td width='15%'>"+data.lastPosts[i].likes+"</td><td width='15%'>"+data.lastPosts[i].comments+"</td></tr>";
              }
              if(txt != ""){
                  $("#social-media-scrape-user-table").append(txt).removeClass("display-hidden");
              }
          }

        //opening ecommerce url in a new tab
        $(".clickable-row").click(function() {
          console.log("inside");
          window.open($(this).data("href"),'_blank');
        });
      }
    });
  }
});

//web page scrape data
$("#web-page-scrape-submit").click(function(){
  var search = $('#web-page-scrape-search').val();
  var url = $('#web-page-scrape-url').val();
  
  if(!search || !url){
    alert('enter all values');
  }else{
    //$("#ecommerce-scrape-message").removeClass("display-hidden");
    $.ajax({
      url: "/server/spider_as_a_service_function/get/wc",
      type: 'GET',
      data: { 
        'querySelector': search, 
        'url': url
      },
      success: function(data) {
        console.log(data);
        //var txt = "";
        //txt="<a href='"+data.pic+"' target='_blank' style='color:blue'>Display Image</a><div><a href='"+data.link+"' target='_blank' style='color:blue'>"+data.name+"</a></div>"
        $("#web-page-scrape-result").text(data);
        //if(type=='user'){
          // var txt = "";
          // txt="<a href='"+data.pic+"' target='_blank' style='color:blue'>Display Image</a><div><a href='"+data.link+"' target='_blank' style='color:blue'>"+data.name+"</a></div>"
          // $("#social-media-scrape-user").append(txt);
          // var len = data.lastPosts.length;
          // txt = "";
          // $("#social-media-scrape-user-table").find("tr:gt(0)").remove();
          // if(len > 0){
          //     for(var i=0;i<len;i++){
          //       txt += "<tr class='clickable-row' style='cursor:pointer' data-href=https://www.instagram.com/p/"+data.lastPosts[i].shortcode+"><td width='10%'><a href='"+data.lastPosts[i].thumbnail+"' target='_blank' style='color:blue'>thumbnail_link</a></td><td width='60%'>"+data.lastPosts[i].caption+"</td><td width='15%'>"+data.lastPosts[i].likes+"</td><td width='15%'>"+data.lastPosts[i].comments+"</td></tr>";
          //     }
          //     if(txt != ""){
          //         $("#social-media-scrape-user-table").append(txt).removeClass("display-hidden");
          //     }
          // }

        //opening ecommerce url in a new tab
        $(".clickable-row").click(function() {
          console.log("inside");
          window.open($(this).data("href"),'_blank');
        });
      }
    });
  }
});

//bot detector
$("#bot-detector-scrape-submit").click(function(){
  var search = $('#bot-detector-scrape-search').val();
  
  if(!search){
    alert('enter all values');
  }else{
    //$("#ecommerce-scrape-message").removeClass("display-hidden");
    $.ajax({
      url: "/server/spider_as_a_service_function/isbot",
      type: 'GET',
      data: { 
        'ua': search
      },
      success: function(data) {
        console.log(typeof data);
        //$("#bot-detector-scrape-result").append(data);
        if(data){
          $("#bot-detector-scrape-result").text(search + " is a bot");
        }else{
          $("#bot-detector-scrape-result").text(search + " is not a bot");
        }
        
        
      }
    });
  }
});

/* 1. sticky And Scroll UP */
    $(window).on('scroll', function () {
      var scroll = $(window).scrollTop();
      if (scroll < 400) {
        $(".header-sticky").removeClass("sticky-bar");
        $('#back-top').fadeOut(500);
      } else {
        $(".header-sticky").addClass("sticky-bar");
        $('#back-top').fadeIn(500);
      }
    });

//2. Scroll Up
    $('#back-top a').on("click", function () {
      $('body,html').animate({
        scrollTop: 0
      }, 800);
      return false;
    });

/* 4. MainSlider-1 */
    // h1-hero-active
    function mainSlider() {
      var BasicSlider = $('.slider-active');
      BasicSlider.slick({
        autoplay: true,
        autoplaySpeed: 2500,
        dots: false,
        fade: true,
        infinite: true,
        arrows: true, 
        prevArrow: '<button type="button" class="slick-prev"><i class="ti-angle-left"></i></button>',
        nextArrow: '<button type="button" class="slick-next"><i class="ti-angle-right"></i></button>',
        responsive: [{
            breakpoint: 1024,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              infinite: true,
            }
          },
          {
            breakpoint: 991,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              arrows: false
            }
          },
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              arrows: false
            }
          }
        ]
      });
      BasicSlider.on('init', function (e, slick) {
        var $firstAnimatingElements = $('.single-slider:first-child').find('[data-animation]');
        doAnimations($firstAnimatingElements);
      });
      BasicSlider.on('beforeChange', function (e, slick, currentSlide, nextSlide) {
        var $animatingElements = $('.single-slider[data-slick-index="' + nextSlide + '"]').find('[data-animation]');
        doAnimations($animatingElements);
      });
      
      function doAnimations(elements) {
        var animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        elements.each(function () {
          var $this = $(this);
          var $animationDelay = $this.data('delay');
          var $animationType = 'animated ' + $this.data('animation');
          $this.css({
            'animation-delay': $animationDelay,
            '-webkit-animation-delay': $animationDelay
          });
          $this.addClass($animationType).one(animationEndEvents, function () {
            $this.removeClass($animationType);
          });
        });
      }
    }
    mainSlider();


    
/* 4. Testimonial Active*/
    var testimonial = $('.h1-testimonial-active');
    if(testimonial.length){
    testimonial.slick({
        dots: true,
        infinite: true,
        speed: 1000,
        autoplay:true,
        loop:true,
        arrows: false,
        prevArrow: '<button type="button" class="slick-prev"><i class="ti-arrow-top-left"></i></button>',
        nextArrow: '<button type="button" class="slick-next"><i class="ti-arrow-top-right"></i></button>',
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              infinite: true,
              arrow:false
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              arrows:false
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              arrows:false,
            }
          }
        ]
      });
    }

/* 6. Nice Selectorp  */
  var nice_Select = $('select');
    if(nice_Select.length){
      nice_Select.niceSelect();
    }

//7. home Blog
  $('.blog-active').slick({
      dots: false,
      infinite: true,
      autoplay: true,
      speed: 400,
      arrows: true,
      prevArrow: '<button type="button" class="slick-prev"><i class="ti-arrow-top-left"></i></button>',
      nextArrow: '<button type="button" class="slick-next"><i class="ti-arrow-top-right"></i></button>',
      slidesToShow: 3,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: true,
            dots: false,
          }
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: true,
            dots: false,
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false
          }
        },
      ]
    });

 /* 5. Gallery Active */
    var client_list = $('.location-active');
    if(client_list.length){
      client_list.owlCarousel({
        slidesToShow: 3,
        slidesToScroll: 1,
        loop: true,
        autoplay:true,
        speed: 3000,
        smartSpeed:2000,
        nav:true,
        navText:['<i class="ti-angle-left"></i>','<i class="ti-angle-right"></i>'],
        dots: false,
        margin: 0,

        autoplayHoverPause: true,
        responsive : {
          0 : {
            nav: false,
            items: 1,
          },
          576: {
            nav: false,
            items: 2,
          },
          768 : {
            nav: true,
            items: 2,
          },
          992 : {
            nav: true,
            items: 3,
          }
        }
      });
    }


    
/* 8. data-background */
    $("[data-background]").each(function () {
      $(this).css("background-image", "url(" + $(this).attr("data-background") + ")")
      });


/* 9. WOW active */
    new WOW().init();

// 10. ---- Mailchimp js --------//  
    // function mailChimp() {
    //   $('#mc_embed_signup').find('form').ajaxChimp();
    // }
    // mailChimp();


// 11 Pop Up Img
    var popUp = $('.single_gallery_part, .img-pop-up');
      if(popUp.length){
        popUp.magnificPopup({
          type: 'image',
          gallery:{
            enabled:true
          }
        });
      }
// 12 Pop Up Video
    var popUp = $('.popup-video');
    if(popUp.length){
      popUp.magnificPopup({
        type: 'iframe'
      });
    }

/* 13. counterUp*/
    $('.counter').counterUp({
      delay: 10,
      time: 3000
    });


})(jQuery);
