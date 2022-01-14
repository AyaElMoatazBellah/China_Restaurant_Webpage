$(function () { // Same as document.addEventListener("DOMContentLoaded"...

  // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });
  // In Firefox and Safari, the click event doesn't retain the focus
  // on the clicked button. Therefore, the blur event will not fire on
  // user clicking somewhere else in the page and the blur event handler
  // which is set up above will not be called.
  // Refer to issue #28 in the repo.
  // Solution: force focus on the element that the click event fired on
  $("#navbarToggle").click(function (event) {
    $(event.target).focus();
  });
});

/*********************** Dynamically loading the Menu categories view ***************************/
 ( function (global){
    //Div choise -> dc
	var dc = {};
	//this string contians the content for the page we want
	var homeHTML = "snippets/Home-Content.html"
	// here where we get course JSON file which have all the categories name 
	var allCategoriesURL = "https://davids-restaurant.herokuapp.com/categories.json";
	var categoriesTitleHtml ="snippets/Categories title.html";
	var categoryHtml = "snippets/Categories-snippets.html";
	var menuItemsUrl =
    "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
    var menuItemsTitleHtml = "snippets/menu-items-title.html";
    var menuItemHtml = "snippets/menu-item.html";

    //To change active li background color
    var changeBGColor = function()
    {
    	$("#nav-list li").click(function() {
        $(this).siblings('li').removeClass('active');
        $(this).addClass('active');
    });
    }

	// Function for inserting innerhtml for 'select'
	var inserthtml = function(selector , html){
		var targetElement = document.querySelector(selector);
		targetElement.innerHTML = html;
	};
	// Function for Showing Load Icon inside Content Div
	var showingloading = function(selector){
		var html = "<div class='text-center'>";
		html += "<img src='images/ajax-loader.gif'></div>"
		inserthtml(selector,html);		
	};
	//Return substitute of '{{propname}}'
	//with propvalue in given 'string' 
    // 'g' ->  means to replace every single word in propname with propvalue
    //     we seperate it because as we have an array we going to loop over it
    // with the number of meals  we have and we will  make a copy of this 
    // code and paste it in the html and this what called snippet
    // {{ }} -> called a mustach (property name)
	var insertProperty = function (string, propName, propValue) {
        var propToReplace = "{{" + propName + "}}";
        string = string
          .replace(new RegExp(propToReplace, "g"), propValue);
        return string;
    }

    //On page load (befor images or css)
	document.addEventListener("DOMContentLoaded" , function(event){
		showingloading("#main-content");
		jumbotronSlideshow();
		$ajaxUtils.sendGetRequest(
			homeHTML,
			function (responseText){
				document.querySelector("#main-content")
				.innerHTML = responseText;
			},
			false);
			});
	//Allocate the jumbotron slide show dynamically 
	function jumbotronSlideshow()
	{
		let timeout;
		var slide_index = 0 ;
		ShowSlides();
		setInterval(ShowSlides, 2000);
		function ShowSlides()
		{
			
		    var slides = document.getElementsByClassName("mySlides");
            var dots = document.getElementsByClassName("dot");
            /**for (var i=0 ; i < slides.length ; i++)
            {
            	$(slides[i]).css("display","none");
            	$(dots[i]).removeClass('active');
            }*/
            slide_index++;
            if(slide_index > slides.length)(slide_index=1);
            $(".jumbotron div").siblings('div').css("display","none");
            $(slides[slide_index-1]).css("display","block");
            $(".dots span").siblings('span').removeClass('active')
            $(dots[slide_index-1]).addClass('active');
         
		}
	}
//Load The Menu Categories View
dc.loadMenuCategories = function () {
	changeBGColor();
	showingloading("#main-content");
	$ajaxUtils.sendGetRequest(
		allCategoriesURL,
		buildAndShowCategoriesHTML);
};
//Builds HTML for the categories page based 
//on the data from the server
function buildAndShowCategoriesHTML (categories){
	$ajaxUtils.sendGetRequest(
		categoriesTitleHtml,
		function (categoriesTitleHtml){
        // Retrieve single category snippet
        $ajaxUtils.sendGetRequest(
        	categoryHtml,
        	function (categoryHtml){
        		var categoriesViewHtml = 
        		buildCategoriesViewHtml(categories,
        			categoriesTitleHtml,categoryHtml);
        		inserthtml("#main-content" , categoriesViewHtml);
        	},
        	false);
		},
		false);
}
// Using categories data and snippets html 
// build categories view html to be inserted into page 
function buildCategoriesViewHtml(Categories,
	                             categoriesTitleHtml,
	                             categoryHtml){
	var finalhtml = categoriesTitleHtml;
	finalhtml += "<section class='row'>";
	//Loop over Categories 
	for(var i = 0 ; i < Categories.length ;i++){
		var html = categoryHtml;
		var name = ""+Categories[i].name;
		var shortname = Categories[i].short_name;
		
		html = insertProperty(html , "name" , name);
		html = insertProperty(html , "short_name" , shortname);
		finalhtml += html;
	}

	finalhtml += "</section>"
	return finalhtml;
}
/***********************End***************************/
/***********************Dynamically loading the single category view***************************/
//Load Menu Items view
//'CategoryShort' is a short_name for a category sent from fn call in Categories snippet
dc.loadMenuItems = function (categoryShort) {
	showingloading("#main-content");
	$ajaxUtils.sendGetRequest(
		menuItemsUrl + categoryShort,
		buildAndShowMenuItemsHTML);
};
//Builds Htnl for single category page based o the data from the server
 function buildAndShowMenuItemsHTML(categoryMenuItem){
 	//Load Title snippet of menu items 
 	$ajaxUtils.sendGetRequest(
 		menuItemsTitleHtml,
 		function (menuItemsTitleHtml){
 			//Retrieve single menu item snippet
 			$ajaxUtils.sendGetRequest(
 				menuItemHtml,
 				function (menuItemHtml){
 			        var menuItemsViewHtml =
 			        buildMenuItemsViewHtml(categoryMenuItem,
 				                   menuItemsTitleHtml,
 				                   menuItemHtml);
 			        inserthtml("#main-content" , menuItemsViewHtml);
 		        },
 		        false);
 		},
 		false);
 }
/// false - >> means we don't need to process them json we need them to be a simple string
//Using category and menu items data and snippets html 
//build menu items view html to be inserted into page 
 function buildMenuItemsViewHtml(categoryMenuItem,
 	                             menuItemsTitleHtml,
 	                             menuItemHtml){
 	menuItemsTitleHtml = insertProperty(menuItemsTitleHtml,
 		     "name" , categoryMenuItem.category.name);
 	menuItemsTitleHtml = insertProperty(menuItemsTitleHtml,
 		     "special_instructions" , categoryMenuItem.category.special_instructions);
 	var finalhtml = menuItemsTitleHtml;
 	finalhtml += "<section class='row'>";

    //Loop over the Categories
 	var menuitems=categoryMenuItem.menu_items;
 	var catshortName = categoryMenuItem.category.short_name;
 	for (var i = 0 ; i < menuitems.length ;i++)
 	{
 		var html = menuItemHtml;
 		html = insertProperty(html ,"short_name",menuitems[i].short_name);
 	 	html = insertProperty(html ,"catShortName",catshortName);
 		html = insertItemPrice(html ,"price_small",menuitems[i].price_small);
 		html = insertItemPrice(html ,"price_large",menuitems[i].price_large);
 		html = insertItemPortionName(html ,"small_portion_name",menuitems[i].small_portion_name);
        html = insertItemPortionName(html ,"large_portion_name",menuitems[i].large_portion_name);
 		html = insertProperty(html ,"description",menuitems[i].description);
 		html = insertProperty(html ,"name",menuitems[i].name);
 	    // Here we want to make it clear to make  the proper view 
 	    if(i % 2 != 0){
 	    	html += "<div class='clearfix visible-md-block visible-lg-block'></div>"
 	    }
 	    finalhtml += html;
 	}
 	finalhtml += "</section>";
 	return finalhtml;
 }
 
 // Appends $ to the price if it exsists
 function insertItemPrice(html,pricePropName,PriceValue){
 	if(!PriceValue){
 		return insertProperty(html , pricePropName , "");
 	}
 	PriceValue = "$" + PriceValue.toFixed(2);
 	html = insertProperty(html , pricePropName , PriceValue);
 	return html;
 }
  // Appends () to put the portion inside them if exsists
 function insertItemPortionName(html,portionPropName,PortionValue){
 	if(!PortionValue){
 		return insertProperty(html , portionPropName , "");
 	}
 	PortionValue = "(" + PortionValue + ")";
 	html = insertProperty(html , portionPropName , PortionValue);
 	return html;
 }

/***********************End***************************/
/******************* About Page loading ********************/

dc.loadAboutPage = function () {
	changeBGColor();
	var AboutPageHtml ="snippets/About.html";
	$("#main-content").load("snippets/About.html");
};

/******************** end **********************************/
//in order to be exposed for global
global.$dc = dc ;
})(window);
