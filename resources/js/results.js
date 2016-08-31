/**
 * results.js
 * All JavaScript related to the results.html
 * 
 * TO DO:
 * Pagination:
 *  - 3 column = 9 per page
 *  - 2 column = 4 per page
 *  - 1 column = 1 per page
 *
 * API Calls:
 *  Create API calls where mentioned below to send/receive/update assets
 *
 * Filtering results from API
 *  Write code to filter results from API according to the defined filters
 */

/** Global Variables */
var resultsContainer = $("#results"), resultLayout = 3, perPage = 9, filterType="", filterCuisine="", filterCost=5, apiResult = [];

/**
 * Parse provided JSON, filtering out requsted results. Returning the filtered results to be displayed.
 * @param {json} data
 * @return {json} filter
 */
function filter(data) {
  //TO DO
  var destringify = JSON.parse(data);
  var tmp, types, genres;
  var response = [];
  var typeFilter, cuisineFilter;
  
  for (var i = 0; i < destringify.length; i++) {
    
    /** Check if type is correct */
    $.each(destringify[i].types, function(j,v){
      if(destringify[i].types[j].name === filterType || filterType.length <= 0){
        typeFilter = true;
        return(false);
      }
    });
    
    /** Check if cusisine is correct */
    $.each(destringify[i].genres, function(j,v){
      if(destringify[i].genres[j].name === filterCuisine || filterCuisine.length <= 0){
        cuisineFilter = true;
        return(false);
      }
    });
    
    /** IF passes filters push to temp array to rebuild result */
    if(typeFilter){
      if(cuisineFilter){
        if(destringify[i].cost === filterCost || filterCost > 4){
          response.push(destringify[i]);
        }
      } 
    }
  }
  
  tmp = '[';
  /** Loop through records */
  $.each(response, function(i, v) {
    tmp += '{';
    tmp += '"id": ' + response[i].id + ', ';
    tmp += '"name": "' + response[i].name + '", ';
    if(!response[i].street_name){
      tmp += '"street_name": null, ';
    } else {
      tmp += '"street_name": "' + response[i].street_name + '", ';
    }
    if(!response[i].zip_code){
      tmp += '"zip_code": null, ';
    } else {
      tmp += '"zip_code": "' + response[i].zip_code + '", ';
    }
    if(!response[i].web_site){
      tmp += '"web_site": null, ';
    } else {
      tmp += '"web_site": "' + response[i].web_site + '", ';
    }
    if(!response[i].phone_number){
      tmp += '"phone_number": null, ';
    } else {
      tmp += '"phone_number": "' + response[i].phone_number + '", ';
    }
    tmp += '"cost": "' + response[i].cost + '",';
    tmp += '"created_at": "' + response[i].created_at + '",';
    tmp += '"updated_at": "' + response[i].updated_at + '",';
    tmp += '"types": [{';
    
    types = "";
    
    /** Loop through types */
    $.each(response[i].types, function(j, v) {
      types += '"id": ' + response[i].types[j].id + ',';
      types += '"name": "' + response[i].types[j].name + '",';
      if(response[i].types[j].description){
        types += '"description": null,';
      } else {
        types += '"description": "' + response[i].types[j].description + '",';
      }
      types += '"created_at": "' + response[i].types[j].created_at + '",';
      types += '"updated_at": "' + response[i].types[j].updated_at + '",';
    });
    
    /** Remove the trailing comma created in the for loop */
    types = types.substring(0, types.length - 1);
    
    /** Append types to tmp */
    tmp += types;
    tmp += '}],';
    
    /** Format string properly if genres exist for record */
    if(response[i].genres.length > 0) {
      tmp += '"genres": [{';
    } else {
      tmp += '"genres": [';
    }
    
    /** Loop through genres */
    genres = "";
    $.each(response[i].genres, function(k, v) {
      genres += '"id": ' + response[i].genres[k].id + ',';
      genres += '"name": "' + response[i].genres[k].name + '",';
      if(!response[i].genres[k].description){
        genres += '"description": null,';
      } else {
        genres += '"description": "' + response[i].genres[k].description + '",';
      }
      genres += '"created_at": "' + response[i].genres[k].created_at + '",';
      genres += '"updated_at": "' + response[i].genres[k].updated_at + '",';
    });
    
    /** Remove the trailing comma created in the for loop */
    genres = genres.substring(0, genres.length - 1);
    
    /** Append types to tmp */
    tmp += genres;
    if(response[i].genres.length > 0) {
      tmp += '}],';
    } else {
      tmp += '],';
    }
    
    tmp += '"restaurant_likes": [';
    /** Loop through likes */
    tmp += ']';
    tmp += '},';
  });
  
  /** Only remove the last character in string if it is longer than 1 **/
  if(tmp.length > 1){
    /** Remove the trailing comma created in the for loop */
    tmp = tmp.substring(0, tmp.length - 1);
  }
  
  tmp += ']';
  displayResults(tmp);
}

/**
 * Parse provided JSON, prnt results to screen.
 * @param {json} results
 */
function displayResults(results) {
  var newResult, restaurantLink, restaurantName, restaurantImage, restaurantActions, resIMG, result, i, j, k, imgType, resultLayoutCSS, heightBuffer;

  /** Validate results and sort by most liked */
  if (typeof results === 'string') {
    results = JSON.parse(results);
  }
  results.sort(function(a, b) {
    if ((a.likes - a.dislikes) > (b.likes - b.dislikes)) {
      return -1;
    }
    if ((a.likes - a.dislikes) < (b.likes - b.dislikes)) {
      return 1;
    }
    return 0;
  });
  
  /** Clear results so we can repopulate it further down */
  resultsContainer.html("");
  
  /** Handle an empty result **/
  if(results.length <= 0){
    var NaNResults = '<div class="row"><div class="col span-3-of-3 center">We don\'t seem to have what you are looking for right now.<br />Don\'t give up! The right match is out there somewhere.</div></div>';
    resultsContainer.append(NaNResults);
    $("#resultsContainer").fadeIn("slow");
    return;
  }
  
  /** Loop through each result & print it to the page */
  for (i = 0; i < results.length; i++) {
    
    /** Set result to the current record */
    result = results[i];
    
    /** Determine which image to show */
    if (result.image) {
      resIMG = result.image;
    } else {
      var cuisineName = "";
      if(result.genres[0]){
        cuisineName = result.genres[0].name;
      }
      resIMG = "http://lous.work/dynIMG/foodHarmony/?font=Lato-Regular&cuisine="+cuisineName;
    }
    
    /** Determine grid layout for resuilt */
    if(resultLayout > 1){
      resultLayoutCSS = "span-1-of-" + resultLayout;
    } else {
      resultLayoutCSS = "span-3-of-3";
    }
    
    /** Build the HTML for the result */
    restaurantActions = '<div class="restaurantActions">';
    restaurantActions += '<span class="pull-right"><button id="dislike' + result.id + '" class="btn btn-default" title="It wasn\'t for me."><i class="fa fa-ban"></i></button>&nbsp;<sub id="dislikes' + result.id + '">' + result.dislikes + '</sub></span>';
    restaurantActions += '<span class="pull-right"><button id="like' + result.id + '" class="btn btn-default" title="I loved it!"><i class="fa fa-heart"></i></button>&nbsp;<sub id="likes' + result.id + '">' + result.likes + '</sub></span>';
    restaurantActions += '</div>';
    restaurantImage = '<div class="restaurantImage" title="' + result.name + '\r\nClick for more information..."><img src="' + resIMG + '"></div>';
    restaurantName = '<div class="restaurantName">' + result.name + '</div>';
    restaurantLink = '<div id="info' + result.id + '" class="restaurantLink" title="' + result.name + '\r\nClick for more information...">' + restaurantName + restaurantImage + '</div>';
    newResult = '<div class="result col ' + resultLayoutCSS + '">' + restaurantLink + restaurantActions + '</div>';
    
    /** Print this result to the page */
    resultsContainer.append(newResult);

    /** Generate event handlers for like, dislike, and info actions */
    (function(info) {
      $("button#like" + info.id).click(function() {
        addLike(info.id);
      });
      $("button#dislike" + info.id).click(function() {
        addDislike(info.id);
      });
      $("#info" + info.id).click(function() {
        /**
        * Feature: Include all asset information in popInfo()
        * Pro(s): Less API Calls
        * Con(s): Possible performance hit, Out of date information
        */
        popInfo(info);
      });
    })(result);

    /**
     * After last record is processed:
     * - FadeIn results ( Makes the initial page load more visually appealing )
     * - Fix images so they are all the same height
     * - Add CSS to allow images to keep their aspect ratio
     */
    if (i === parseInt(results.length - 1)) {
      heightBuffer = 0.7;
      $("#resultsContainer").fadeIn("slow");
      var maxHeight = parseInt($("#results .result img").css("width")) + "px";
      if(parseInt($("#results .result img").css("width")) >= parseInt($( window ).height() * heightBuffer)){
        maxHeight = parseInt($( window ).height() * heightBuffer) + "px";
      }
      $("#results img").css({
        "width": "auto",
        "max-width": "100%",
        "max-height": maxHeight,
        "height": maxHeight
      });
    }
  }
}

/**
 * Increment like counter, decrement dislike counter if needed, and make an API call to update for everyone else
 * @param {number} resId
 */
function addLike(resId) {
  if ($("#like" + resId).hasClass("btn-selected")) {
    /** Do nothing, asset is already liked */
    return;
  } else {
    /**
     * Check if user has previously disliked the restaurant
     * If so remove a dislike from the count
     */
    if ($("#dislike" + resId).hasClass("btn-selected")) {
      var currentDislikeCount = parseInt($("#dislikes" + resId).html());
      currentDislikeCount -= 1;
      $("#dislikes" + resId).html(currentDislikeCount);
    }
    
    /**
     * Increase like counter
     * Update like counter for asset
     * Update CSS to show asset is liked
     */
    var currentLikeCount = parseInt($("#likes" + resId).html());
    currentLikeCount += 1;
    $("#likes" + resId).html(currentLikeCount);
    $("#like" + resId).removeClass("btn-default").addClass("btn-selected");
    $("#dislike" + resId).removeClass("btn-selected").addClass("btn-default");
    
    /**
     * API Call:
     * PUT increment like counter for asset & decrement dislike counter for asset if needed
     */
    //TO DO
  }
}

/**
 * Increment like counter, decrement dislike counter if needed, and make an API call to update for everyone else
 * @param {number} resId
 */
function addDislike(resId) {
  if ($("#dislike" + resId).hasClass("btn-selected")) {
    /** Do nothing, asset is already disliked */
    return;
  } else {
    /**
     * Check if user has previously liked the restaurant
     * If so remove a like from the count
     */
    if ($("#like" + resId).hasClass("btn-selected")) {
      var currentLikeCount = parseInt($("#likes" + resId).html());
      currentLikeCount -= 1;
      $("#likes" + resId).html(currentLikeCount);
    }
    
    /**
     * Increase dislike counter
     * Update dislike counter for asset
     * Update CSS to show asset is disliked
     */
    var currentDislikeCount = parseInt($("#dislikes" + resId).html());
    currentDislikeCount += 1;
    $("#dislikes" + resId).html(currentDislikeCount);
    $("#dislike" + resId).removeClass("btn-default").addClass("btn-selected");
    $("#like" + resId).removeClass("btn-selected").addClass("btn-default");
    
    /**
     * API Call:
     * PUT increment dislike counter for asset & decrement like counter for asset if needed
     */
    //TO DO
  }
}

/**
 * Pull GET data, set filter variables, update default selections for filter menu
 */
function loadFilters(){
  var queryStart = window.location.search.indexOf("?") + 1,
      queryEnd   = window.location.search.indexOf("#") + 1 || window.location.search.length + 1,
      query      = window.location.search.slice(queryStart, queryEnd - 1),
      pairs      = query.replace(/\+/g, " ").split("&"),
      params     = {}, i, n, v, nv;
  
  /** Checking if there is no GET data to parse */
  if (query === window.location.search || query === "") {
    return;
  }
  
  for(i = 0; i < pairs.length; i++){
    nv = pairs[i].split("=");
    n = decodeURIComponent(nv[0]);
    v = decodeURIComponent(nv[1]);
    //var filterType,filterCuisine,filterCost;
    switch (n){
      case 'type':
        if(v.length >= 1){
          filterType = v;
          $("#restaurantTypeSearch").val(v);
        } else {
          filterType = "";
        }
        break;
      case 'food':
        if(v.length >= 1){
          filterCuisine = v;
          $("#foodTypeSearch").val(v);
        } else {
          filterCuisine = "";
        }
        break;
      case 'cost':
        if(v.length >= 1){
          filterCost = v;
          $("#costLevelSearch").val(v);
        } else {
          filterCost = 5;
        }
        break;
      default:
        console.warn("Unexpected parameter was found in URI.");
    }
    /*
    console.log("Setting filterType = " + filterType);
    console.log("Setting filterCuisine = " + filterCuisine);
    console.log("Setting filterCost = " + filterCost);
    */
  }
}

/**
 * Set filter variables & reload results
 */
function setFilters(){
  resultLayout = $("#resultLayoutType").val();
  filterType = $("#restaurantTypeSearch").val();
  filterCuisine = $("#foodTypeSearch").val();
  filterCost = $("#costLevelSearch").val();
  /*
  console.log("Setting resultLayout " + resultLayout);
  console.log("Setting filterType " + filterType);
  console.log("Setting filterCuisine " + filterCuisine);
  console.log("Setting filterCost " + filterCost);
  */
  
  /** Setting results per page */
  switch(resultLayout){
    case 1:
      perPage = 1;
      break;
    case 2:
      perPage = 2;
      break;
    default:
      perPage = 9;
  }
  
  filter(apiResult);
}

/**
 * Show other information about the asset
 * @param {array} result
 */
function popInfo(result) {
  
  /** Hide Overflow of html, visual improvement when modal is open */
  $("html").css("overflow", "hidden");
  
  /**
   * Feature: Make modal width responsive
   * Pro(s): Looks better on all screen/window sizes
   * Con(s): More work
   */
  var modalWidth = "1200px";
  
  $("#infoRestaurantName").html(result.name);
  $("#infoRestaurantAddress").html(result.street_address + ", Pittsburgh " + result.zip_code);
  
  /** Display Modal with other info about asset */
  $("#modal").dialog({
    autoOpen: true,
    width: modalWidth,
    modal: true,
    title: "More Information",
    buttons: {
      Close: function() {
        $(this).dialog("close");
        /** Setting overflow of html back to normal */
        $('html').css("overflow", "visible");
      }
    },
    open: function(event, ui) {
      $(this).parent().focus();
    }
  });
}

/**
 * Run the following after the page renders.
 */
$().ready(function() {
  /** Define elements that will use jQuery UI tooltips */
  $('#resultsContainer').tooltip();
  $('#modal > .row').tooltip();
  /**
   * API Call
   * GET results from API
   * result apiResult
   */
  $.get(apiEndpointBase + "/restaurants", function(response, status){
    if (status === "success") {
      apiResult = JSON.stringify(response);
      /** Set filters */
      loadFilters();
      /** Send API Result through the filters */
      filter(apiResult);
    }
  });
  
  /** Create event listener for the Apply Filters button */
  $("#applyFiltersButton").click(function(){setFilters();});
});
