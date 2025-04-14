function bindCategoryCarousel(){
     $("#category-carousel").owlCarousel({
        autoplay: true,
        autoplayhovepause: true,
        autoplaytimeout: 100,
        items:7,
        nav: true,
        loop:true,
        dots:true,
        
        responsive:{
            0 : {
                items:1,
                dots:false,
            },
            400 : {
                items:1,
                dots:false
            },
            485:{
                items:1,
                dots:false
            },
            728:{
                items: 2,
                dots:false
            },
            960:{
                items: 4,
                dots:true
            },
            1200:{
                items: 5,
                dots:true
            },
            1400:{
                items: 7,
                dots:true
            }
        }
    });  
}

function bindPopularCarousel(){   
   $("#popular-carousel").owlCarousel({
       autoplay: true,
       autoplayhovepause: true,
       autoplaytimeout: 100,
       items:5,
       nav: true,
       loop:true,
       dots:true,
       
       
       responsive:{
           0 : {
               items:1,
               dots:false
           },
           485:{
               items:1,
               dots:false
           },
           728:{
               items: 2,
               dots:true
           },
           960:{
               items: 3,
               dots:true
           },
           1200:{
               items: 4,
               dots:true
           },
           1400:{
               items: 5,
               dots:true
           }
       }
   });
   
}

function bindPaidPopularCarousel(){       
    $("#paid-popular-carousel").owlCarousel({
        autoplay: true,
        autoplayhovepause: true,
        autoplaytimeout: 100,
        items:5,
        nav: true,
        loop:true,
        dots:true,
        
        
        responsive:{
            0 : {
                items:1,
                dots:false
            },
            485:{
                items:1,
                dots:false
            },
            728:{
                items: 2,
                dots:true
            },
            960:{
                items: 3,
                dots:true
            },
            1200:{
                items: 4,
                dots:true
            },
            1400:{
                items: 5,
                dots:true
            }
        }
    });
    
 }

function bindOffersCarousel(){   
   $("#offers-carousel").owlCarousel({
    autoplay: true,
    autoplayhovepause: true,
    autoplaytimeout: 100,
    items:5,
    nav: true,
    loop:true,
    dots:true,
    
    
    responsive:{
        0 : {
            items:1,
            dots:false
        },
        485:{
            items:1,
            dots:false
        },
        728:{
            items: 1,
            dots:true
        },
        960:{
            items: 3,
            dots:true
        },
        1200:{
            items: 3,
            dots:true
        }
    }
    });
 }
 
function incrementCartCount(){
    let element = $("#count");
    let count = element.text();
    count = parseInt(count) + 1;
    element.text(count);
    console.log('mayur');
}

function decrementCartCount(){
    let element = $("#count");
    let count = element.text();    
    if(count != "0"){
        count = parseInt(count) - 1;
        element.text(count);
    }    
}

function resetCartCount(){
    let element = $("#count");
    element.text("0");
}

function showSuccess(msg){
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      }
    toastr.success(msg)
}

function showInfo(msg){
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      }
    toastr.info(msg)
}

function showWarning(msg){
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      }
    toastr.warning(msg)
}

function showError(msg){
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      }
    toastr.error(msg)
}
