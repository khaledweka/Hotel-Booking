'use strict';
/**
 * @ngdoc overview
 * @name laravelAdminApp
 * @description
 * @author https://github.com/minhquan4080
 * # laravelAdminApp
 *
 * Widgets controllers of the application.
 */

/**
* Default Widgets controller
*/
laravelAdminApp.controller("WidgetsController", function($scope, $rootScope, $timeout, $routeParams, $route, $location) {
	$scope.template = {
                name: 'widgets.html',
                url: 'views/pages/widgets/widgets.html'};
    var params = $location.path().split('/')
    codeawesome.activeMenu(params[1])
    switch(params[2])
    {
    	case 'main_slider':
    			$scope.subtemplate = {
                name: 'widgets.main_slider.html',
                url: 'views/pages/widgets/widgets.main_slider.html'};
                $scope.breacum_active = 'Main slider'
    	        break;

        case 'gallery':
                $scope.subtemplate = {
                name: 'widgets.gallery.html',
                url: 'views/pages/widgets/widgets.gallery.html'};
                $scope.breacum_active = 'Gallery'
                break;

        case 'hotel_facilties':
                $scope.subtemplate = {
                name: 'widgets.hotel_facilties.html',
                url: 'views/pages/widgets/widgets.hotel_facilties.html'};
                $scope.breacum_active = 'Hotel facilties'
                break;

    }
                 

});


/**
* Main slider widget controller
*/
laravelAdminApp.controller("MainSliderWidgetController", function($scope, $rootScope, $timeout ,WidgetsServices ) {
    $scope.heading_title = 'Banner Setting'
    folder = 'main_slider'
    $modal = $('.image_manager_modal')
    var resultHTML = '', rowId = 1;
    var rowHTML =  function(row, column1, column2, column3)
    {
        var html =              '<tr class="rowitem" id="row'+row+'">'+
                                '<td>'+row+'</th>'+
                                '<td><input value="'+column1+'" type="text" name="text" class="form-control" placeholder="Text" ></td>'+
                                '<td><input value="'+column2+'" type="text" name="link" class="form-control" placeholder="Link" ></td>'+
                                '<td>'+
                                '<a onclick="angular.element(this).scope().showModal(this)" id="thumb-image0" data-toggle="image" class="img-thumbnail" data-original-title="" title="">'+
                                '<img style="width:100px;height:100px;cursor: pointer;" src="'+column3+'" alt="" title="" data-placeholder="../storage/app/default/images/image_not_found.jpg">'+
                                '<input value="'+column3+'" style="display:none" type="text" name="image" >'+
                                '</a>'+                                  
                                '</td>'+
                                '<td>'+
                                '<button type="button" onclick="angular.element(this).scope().removeRow(this)" data-toggle="tooltip" title="" class="btn btn-danger" data-original-title="Remove"><i class="fa fa-minus-circle"></i></button>'+
                                '</td>'+
                                '</tr>';
       return html; 
    }  
    $scope.showModal = function(input)
    {
        $modal.modal('show')
        $viewImage = input
    }
    $scope.removeRow = function(input)
    {
        $(input).parent().parent().remove();
    }
    $scope.addRow = function(input)
    {
        $(rowHTML(rowId, '', '', '../storage/app/default/images/image_not_found.jpg')).insertAfter( $(".rowitem").last());
        rowId++;
    }
    $scope.submit = function()
    {
        $scope.refresh = 1
        var form_string = $("#form" ).serialize();
        WidgetsServices.setMainSlider(form_string).success(function(res){
            if(res.status == 'OK')
            {
                    $scope.refresh = 0
                    $scope.success = 1
                    $timeout(function() {
                       $scope.success = 0
                    }, 2000);
            }
            scrollToTop(); 
        });
    }
    WidgetsServices.getMainSlider().success(function(res){
        if(res.status == 'OK')
        {
            var rows = res.data;
            $.each(rows, function(key, value){
                $(rowHTML(rowId, value.text, value.link, value.image)).insertAfter( $(".rowitem").last());
                rowId++;
            });
        }
    });
});

/**
* Gallery widget controller
*/
laravelAdminApp.controller("GalleryWidgetController", function($scope, $rootScope, $timeout ,WidgetsServices, DTOptionsBuilder, DTColumnBuilder , DTColumnDefBuilder ) {
    var galleryId, galleryImg, galleryTitle;
    $modal = $('.image_manager_modal')
    folder = 'gallery'
    var curentPage = 1 , limit = 5 , pagination = '?limit=' + limit +'&page=' + curentPage;
    getAllGalleryByPanigation(pagination);
    var rowHTML =  function(row, column1, column2, column3)
    {
        var html =              '<tr class="rowitem rowitem2 " id="row'+row+'">'+
                                '<td><input value="'+column1+'" type="text" name="text" class="form-control" placeholder="Title" ></td>'+
                                '<td style="width: 130px">'+
                                '<a onclick="angular.element(this).scope().showModal(this)" id="thumb-image0" data-toggle="image" class="img-thumbnail" data-original-title="" title="">'+
                                '<img style="width:100px;height:100px;cursor: pointer;" src="'+column3+'" alt="" title="" data-placeholder="../storage/app/default/images/image_not_found.jpg">'+
                                '<input value="'+column3+'" style="display:none" type="text" name="image" >'+
                                '</a>'+                                  
                                '</td>'+
                                '<td style="width: 50px">'+
                                '<button type="button" onclick="angular.element(this).scope().removeRow(this)" data-toggle="tooltip" title="" class="btn btn-danger" data-original-title="Remove"><i class="fa fa-minus-circle"></i></button>'+
                                '</td>'+
                                '</tr>';
       return html; 
    }
    $scope.createNewGallery = function()
    {
        $(rowHTML(0, '', '', '../storage/app/default/images/image_not_found.jpg')).insertAfter( $(".rowitem").last());
        checkIssetRow();
    }
    $scope.removeRow = function(input)
    {
        $(input).parent().parent().remove();
        checkIssetRow();
        var datatype = $('.save').attr('datatype');
        switch(datatype)
        {
            case "edit":
                $('.start').removeAttr('disabled');
                $('.save').attr('datatype', 'new');
                break;
        }
    }
    $scope.showModal = function(input)
    {
        $modal.modal('show')
        $viewImage = input
    }
    $scope.saveNewGallery = function()
    {
        $scope.refresh = 1
        var form_string = $("#form" ).serialize();
        var datatype = $('.save').attr('datatype');
        switch(datatype)
        {
            case "new":
                WidgetsServices.addGallery(form_string).success(function(res){
                    if(res.status == 'OK')
                    {
                        $scope.refresh = 0
                        $scope.success = 1
                        $(".rowitem2").remove()
                        $timeout(function() {
                            $scope.success = 0
                            $('.save').attr('disabled', '');
                            $('.start').removeAttr('disabled');
                            getAllGalleryByPanigation(pagination);
                        }, 2000);  
                    }
                    scrollToTop(); 
                });
                break;
            case "edit":
                form_string = form_string + '&id=' + galleryId;
                WidgetsServices.editGallery(form_string).success(function(res){
                    if(res.status == 'OK')
                    {
                        $scope.refresh = 0
                        $scope.success = 1
                        $(".rowitem2").remove()
                        $timeout(function() {
                            $scope.success = 0
                            $('.start').removeAttr('disabled');
                            $('.save').attr('disabled', '');
                            $('.save').attr('datatype', 'new');
                            getAllGalleryByPanigation(pagination);
                        }, 2000); 
                        
                    }
                    scrollToTop(); 
                });
                break;    
        }
        
    }

    $scope.editGallery = function(input)
    {
        var datatype = $('.save').attr('datatype');
        if(datatype == 'new')
        {
            galleryId = parseInt( $(input).attr('id').split('-')[1] );
            galleryImg = $(input).find('img').attr('src');
            galleryTitle = $(input).attr('gallery-title');
            $(rowHTML(0, galleryTitle, '', galleryImg )).insertAfter( $(".rowitem").last());
            checkIssetRow();
            $('.save').attr('datatype', 'edit');
            $('.start').attr('disabled', '');
            scrollToTop();
        }else
        {
            event.preventDefault();
        }
        
    }

    $scope.goToPage = function(input)
    {   
        event.preventDefault();
        var p = $(input).attr('data');
        pagination = '?limit=' + limit +'&page=' + p;
        getAllGalleryByPanigation(pagination);
        scrollToTop(); 
    }
    $scope.nextOrPrev =  function(input)
    {
        event.preventDefault();
        var p = $(input).attr('data').split('=');
        pagination = '?limit=' + limit +'&page=' + parseInt(p[1]);
        getAllGalleryByPanigation(pagination);
        scrollToTop(); 
    }
    
    // Functions of gallery widget controller
    function getAllGalleryByPanigation(pagination)
    {
        WidgetsServices.getAllGallery(pagination).success(function(res){
            if(res.data.length > 0)
            {
                $scope.gallerys = res.data;
                if(res.prev_page_url != null ){ $scope.prev_page_url = res.prev_page_url }
                if(res.next_page_url != null ){ $scope.next_page_url = res.next_page_url }
                $scope.last_page     = res.last_page;
                $scope.current_page  = res.current_page;
                $scope.total         = Math.ceil(res.total / limit );
            }
        });
    }
    function checkIssetRow()
    {
        var countItem = $('.rowitem').length;
        if(countItem > 1)
        {
            $('.save').removeAttr('disabled')
        }else
        {
            $('.save').attr('disabled', '')
        }
    }
});

/**
* Hotel facilties widget controller
*/
laravelAdminApp.controller("HotelFaciltiesWidgetController", function($scope, $rootScope, $timeout ,WidgetsServices ) {
    var resultHTML = '', rowId = 1;
    $modal = $('.image_manager_modal')
    folder = 'facilties'
    $scope.createNewFaciltie = 0;
    var curentPage = 1 , limit = 5 , pagination = '?limit=' + limit +'&page=' + curentPage;
    getAllHotelFaciltiesByPanigation(pagination)
    $scope.background = {
        background : ''
    }
    getBackgroundHotelFacilties()
    $scope.createNewFacilties = function()
    {
        $scope.form = {
        name : '',
        icon : '../storage/app/default/images/image_not_found.jpg',
        image : '../storage/app/default/images/image_not_found.jpg',
        big_heading : '',
        small_heading : '',
        description : '',
        start : '19:00',
        end : '22:00',
        charge : 15,
        status : 0
    }
        $('#submit').attr('datatype', 'save');
        $scope.createNewFaciltie = 1;
        $scope.error   = 0;
        $scope.success = 0
        scrollToTop();
        console.clear();
    }
    $scope.cancelNewFacilties = function()
    {
        $('#submit').attr('datatype', 'save');
        $('.edit, .start').removeAttr('disabled');
        $scope.createNewFaciltie = 0;
        $scope.error   = 0;
        $scope.success = 0
        scrollToTop();
    }

    $scope.showModal = function(input)
    {
        $modal.modal('show')
        $viewImage = input
    }

    $scope.submitFacilties = function()
    {
        var datatype = $('#submit').attr('datatype');
        var form_string = $("#form" ).serialize();
        $scope.refresh = 1
        switch(datatype)
        {
            case 'save':
                WidgetsServices.addHotelFacilties(form_string).success(function(res){
                    if(res.status == 'OK')
                    {
                        $scope.refresh = 0
                        $scope.success = 1
                        $timeout(function() {
                            $scope.success = 0
                            getAllHotelFaciltiesByPanigation(pagination)
                            $scope.createNewFaciltie = 0;
                        }, 2000); 
                    }else
                    {
                        $scope.refresh = 0
                        $scope.error   = 1
                        
                    }
                    scrollToTop();
                });
            break;

            case 'edit':
                var hotel_faciltie_id = $scope.form.id;
                WidgetsServices.editHotelFacilties(form_string, hotel_faciltie_id).success(function(res){
                    if(res.status == 'OK')
                    {
                        $scope.refresh = 0
                        $scope.success = 1
                        $timeout(function() {
                            $scope.success = 0
                            $scope.error = 0
                            getAllHotelFaciltiesByPanigation(pagination)
                         
                        }, 2000); 
                        
                    }else
                    {
                        $scope.refresh = 0
                        $scope.error   = 1
                        $scope.success = 0
                        
                    }
                    scrollToTop();
                });
            break;
        }
        
    }

    $scope.editHotelFacilties = function(input)
    {
        $('.edit, .start').attr('disabled', '');
        var hotelFaciltiesKey = parseInt( $(input).attr('id').split('-')[1] );
        $scope.$apply(function() {
            var hotel_faciltie = $scope.hotel_facilties[hotelFaciltiesKey];
            $scope.form = hotel_faciltie;
            $scope.createNewFaciltie = 1;
            $timeout(function() {
                $('#submit').attr('datatype', 'edit');
                if($scope.form.status == 1)
                {
                    $('input[type=checkbox]').iCheck('check');
                }else
                {
                    $('input[type=checkbox]').iCheck('uncheck');
                }
            }, 0);   
        });
        scrollToTop();
    }

    

    $scope.goToPage = function(input)
    {   
        event.preventDefault();
        var p = $(input).attr('data');
        pagination = '?limit=' + limit +'&page=' + p;
        getAllHotelFaciltiesByPanigation(pagination);
        scrollToTop(); 
    }
    $scope.nextOrPrev =  function(input)
    {
        event.preventDefault();
        var p = $(input).attr('data').split('=');
        pagination = '?limit=' + limit +'&page=' + parseInt(p[1]);
        getAllHotelFaciltiesByPanigation(pagination);
        scrollToTop(); 
    }

    $scope.submitBackground = function()
    {
        var form_string = $("#background" ).serialize();
        WidgetsServices.addBackgroundHotelFacilties(form_string).success(function(res){
            if(res.status == 'OK')
            {
                $scope.error1 = 0
                $scope.success1 = 1
                $timeout(function() {
                    $scope.success1 = 0
                    $scope.error1 = 0
                }, 2000); 
            }else
            {
                $scope.success1 = 0
                $scope.error1 = 1
            }
        })
    }

    // Function get all hotel facilties
    function getAllHotelFaciltiesByPanigation(pagination)
    {
        WidgetsServices.getAllHotelFacilties(pagination).success(function(res){
            if(res.data.length > 0)
            {
                $scope.hotel_facilties = res.data;
                if(res.prev_page_url != null ){ $scope.prev_page_url = res.prev_page_url }
                if(res.next_page_url != null ){ $scope.next_page_url = res.next_page_url }
                $scope.last_page     = res.last_page;
                $scope.current_page  = res.current_page;
                $scope.total         = Math.ceil(res.total / limit );
                console.clear();
            }
        })
    }

    // Function get background hotel facilties
    function getBackgroundHotelFacilties()
    {
        WidgetsServices.getBackgroundHotelFacilties().success(function(res){
            if(res.status == 'OK')
            {
                $scope.background = {
                    background : res.data.background
                }
                console.clear();
            }
        })
    }
    
});



