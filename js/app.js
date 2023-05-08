$(function(){


    var Notekeeper = {};

    (function(app){


        var $item = $('#item'),
            $detail = $('#detail'),
            $ul = $('#detailsList'),
            li = '<li><a href="#pgDetailsDetail?item=LINK">ID</a></li>',
            detailsHdr = '<li data-role="list-divider">Your Songs</li>',
            noDetails = '<li id="noDetails">You have no songs</li>';

        app.init=function(){
            app.bindings();
            app.checkForStorage();
        }; 

        app.bindings=function(){

            $('#btnAddItem').on('touchend', function(e){
                e.preventDefault();

                app.addItem(
                    $('#item').val(),
                    $('#detail').val()
                );
            });
            $(document).on('touchend', '#detailsList a', function(e){
				e.preventDefault();
				var href = $(this)[0].href.match(/\?.*$/)[0];
				var item = href.replace(/^\?item=/,'');
				app.loadDetail(item);
			});
			$(document).on('touchend', '#btnDelete', function(e){
				e.preventDefault();
				var key = $(this).data('href');
				app.deleteItem(key);
			});
        };

        app.loadDetail = function(item){

			var details = app.getItems(),

				detail = details[item],
				page = ['<div data-role="page">',
							'<div data-role="header" data-add-back-btn="true">',
								'<h1>Notekeeper</h1>',
								'<a id="btnDelete" href="" data-href="ID" data-role="button" class="ui-btn-right">Delete</a>',
							'</div>',
							'<div role="main" class="ui-content"><h3>ITEM</h3><p>DETAIL</p></div>',
						'</div>'].join('');
			var newPage = $(page);

			newPage.html(function(index,old){
				return old
						.replace(/ID/g,item)
						.replace(/ITEM/g,item
						.replace(/-/g,' '))
						.replace(/DETAIL/g,detail);
			}).appendTo($.mobile.pageContainer);
			$.mobile.changePage(newPage);
		};

        app.addItem = function(item, detail){
            var details = localStorage['Notekeeper'],
                detailsObj;
            if(details == undefined || details == ''){
                detailsObj = {};
            } else {
                detailsObj = JSON.parse(details)
            }
            detailsObj[item.replace(/ /g,'-')] = detail;
            localStorage['Notekeeper'] = JSON.stringify(detailsObj);

            $detail.val('');
            $item.val('');

        };

        app.getItems = function(){
            var details = localStorage['Notekeeper'];

            if(details) return JSON.parse(details);
            return [];
        };

        app.displayItems = function(){

            var detailsObj = app.getItems(),

            html = '',
            n;

            for (n in detailsObj){
                html += li.replace(/ID/g,n.replace(/-/g, '')).replace(/LINK/g,n);
            }
            $ul.html(detailsHdr + html).listview('refresh');
        };
        
        app.deleteItems = function(key){

			var detailsObj = app.getItems();

			delete details[key];

			localStorage['Notekeeper'] = JSON.stringify(detailsObj);

			$.mobile.changePage('notekeeper.html');

			app.checkForStorage();
		};

        app.checkForStorage = function(){
            var details = app.getItems();

            if (!$.isEmptyObject(details)){

                app.displayItems();
            } else{

                $ul.html(detailsHdr + noDetails).listview('refresh');
            }
        };

        app.init();
        
    })(Notekeeper);
});