(function($) {



  closePopup = function(id) {
    'use strict';
    $('#'+ id).modal('hide');
  };

  var table ;

  bindDataTable = function(id){ 
   // $('#'+ id).DataTable().clear().destroy();  
   // $('#'+ id).DataTable().clear().draw();
    //  $('#'+ id).DataTable(); 
  }

  clearDataTable = function(){
    
    // if(table){
    //   //clear datatable
    // table.clear().draw();

    // //destroy datatable
    // table.destroy();
    // }
    
  }

  // test = function(){    
  //   $('#order-listing').DataTable({
      
  //     "iDisplayLength": 10,
  //     "language": {
  //       search: ""
  //     }
  //   });
  //   $('#order-listing').each(function() {
  //     var datatable = $(this);
  //     // SEARCH - Add the placeholder for Search and Turn this into in-line form control
  //     var search_input = datatable.closest('.dataTables_wrapper').find('div[id$=_filter] input');
  //     search_input.attr('placeholder', 'Search');
  //     search_input.removeClass('form-control-sm');
  //     // LENGTH - Inline-Form control
  //     var length_sel = datatable.closest('.dataTables_wrapper').find('div[id$=_length] select');
  //     length_sel.removeClass('form-control-sm');
  //   });
  // }
  showSuccessToast = function(msg) {
    'use strict';
    resetToastPosition();
    $.toast({
      heading: 'Success',
      text: msg,
      showHideTransition: 'slide',
      icon: 'success',
      loaderBg: '#f96868',
      position: 'top-right'
    })
  };
  showInfoToast = function(msg) {
    'use strict';
    resetToastPosition();
    $.toast({
      heading: 'Info',
      text: msg,
      showHideTransition: 'slide',
      icon: 'info',
      loaderBg: '#46c35f',
      position: 'top-right'
    })
  };
  showWarningToast = function(msg) {
    'use strict';
    resetToastPosition();
    $.toast({
      heading: 'Warning',
      text: msg,
      showHideTransition: 'slide',
      icon: 'warning',
      loaderBg: '#57c7d4',
      position: 'top-right'
    })
  };
  showDangerToast = function(msg) {
    'use strict';
    resetToastPosition();
    $.toast({
      heading: 'Danger',
      text: msg,
      showHideTransition: 'slide',
      icon: 'error',
      loaderBg: '#f2a654',
      position: 'top-right'
    })
  };
  showToastPosition = function(position) {
    'use strict';
    resetToastPosition();
    $.toast({
      heading: 'Positioning',
      text: 'Specify the custom position object or use one of the predefined ones',
      position: String(position),
      icon: 'info',
      stack: false,
      loaderBg: '#f96868'
    })
  }
  showToastInCustomPosition = function() {
    'use strict';
    resetToastPosition();
    $.toast({
      heading: 'Custom positioning',
      text: 'Specify the custom position object or use one of the predefined ones',
      icon: 'info',
      position: {
        left: 120,
        top: 120
      },
      stack: false,
      loaderBg: '#f96868'
    })
  }
  resetToastPosition = function() {
    $('.jq-toast-wrap').removeClass('bottom-left bottom-right top-left top-right mid-center'); // to remove previous position class
    $(".jq-toast-wrap").css({
      "top": "",
      "left": "",
      "bottom": "",
      "right": ""
    }); //to remove previous position style
  }


  // serch 
  showSeach = function() {
    var value = '';
    $('.Cinema').select2({
      width: '100%',
      height:'44px !important',
        sortField: 'text',
        
    });
    $('.Cinema').change(function(){
      value = $(this).val();
      $('#cinema_id').val(value);
      $('#setcinema_id').val(value);
      $('.Cinema').val(value);
    // $('.Cinema').select2().trigger('change');
    console.log($('.Cinema').select2());
    console.log($('#cinema_id').val());
      
    })
    
    
  };
  
})(jQuery);