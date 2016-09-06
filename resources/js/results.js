/**
 * results.js
 * All JavaScript related to the results.html
 * 
 * TO DO:
 *
 * API Calls:
 *  Create API calls where mentioned below to send/receive/update assets
 *
 * Feature: Make modal width responsive
 * Pro(s): Looks better on all screen/window sizes
 * Con(s): More work
 */

/** Global Variables */
var uID = 0,
    uName,
    resultsContainer = $("#results"),
    resultLayout = 3,
    perPage = 9,
    numPages,
    filterType = "",
    filterCuisine = "",
    filterCost = 5,
    apiResult = [];

/** Debugging variables */
var clearConsole = false, //Production: false
    hideWarn = true,      //Production: true
    debug = false;        //Production: false

/**
 * Parse provided JSON, filtering out requsted results. Returning the filtered results to be displayed.
 * @param {number} pageNum
 * @param {json} data
 * @return {json} filter
 */
function filter(pageNum, data) {
  if(clearConsole){console.clear();}
  if(!hideWarn){console.warn("Starting to filter results...");}
  var destringify = JSON.parse(data);
  var tmp, types, genres;
  var response = [];
  var typeFilter = false, cuisineFilter = false, costFilter = false;

  for (var i = 0; i < destringify.length; i++) {
    
    /** Check if type is correct */
    $.each(destringify[i].types, function(j, v) {
      if (destringify[i].types[j].name === filterType || filterType.length <= 0) {
        typeFilter = true;
        if(debug){console.log("> Checking %s[%s] against filterType[%s]... ", destringify[i].id, destringify[i].types[j].name, filterType, typeFilter);}
        return (false);
      } else {
        if(debug){console.log("> Checking %s[%s] against filterType[%s]... ", destringify[i].id, destringify[i].types[j].name, filterType, false);}
      }
    });

    /** Check if cusisine is correct */
    $.each(destringify[i].genres, function(j, v) {
      if (destringify[i].genres[j].name === filterCuisine || filterCuisine.length <= 0) {
        cuisineFilter = true;
        if(debug){console.log("> Checking %s[%s] against filterCuisine[%s]... ", destringify[i].id, destringify[i].genres[j].name, filterCuisine, cuisineFilter);}
        return (false);
      } else {
        if(debug){console.log("> Checking %s[%s] against filterCuisine[%s]... ", destringify[i].id, destringify[i].genres[j].name, filterCuisine, false);}
      }
    });

    /** IF passes filters push to temp array to rebuild result */
    if (typeFilter) {
      if (cuisineFilter) {
        if (destringify[i].cost === filterCost || filterCost > 4) {
          costFilter = true;
          if(debug){console.log("> Checking %s[%s] against filterCost[%s]... ", destringify[i].id, destringify[i].cost, filterCost, costFilter);}
          response.push(destringify[i]);
        } else {
          if(debug){console.log("> Checking %s[%s] against filterCost[%s]... ", destringify[i].id, destringify[i].cost, filterCost, false);}
        }
      }
    }
    if(debug){console.log(" ");}
  }
  
  if(!hideWarn){console.warn("> Rebuilding JSON with results that passed above filters.");}
  tmp = '[';
  
  /** Loop through records */
  $.each(response, function(i, v) {
    if(debug){console.log("> Building %s", response[i].id);}
    tmp += '{';
    tmp += '"id": ' + response[i].id + ', ';
    tmp += '"name": "' + response[i].name + '", ';
    if (!response[i].street_name) {
      tmp += '"street_name": null, ';
    } else {
      tmp += '"street_name": "' + response[i].street_name + '", ';
    }
    if (!response[i].zip_code) {
      tmp += '"zip_code": null, ';
    } else {
      tmp += '"zip_code": "' + response[i].zip_code + '", ';
    }
    if (!response[i].web_site) {
      tmp += '"web_site": null, ';
    } else {
      tmp += '"web_site": "' + response[i].web_site + '", ';
    }
    if (!response[i].phone_number) {
      tmp += '"phone_number": null, ';
    } else {
      tmp += '"phone_number": "' + response[i].phone_number + '", ';
    }
    tmp += '"cost": "' + response[i].cost + '",';
    tmp += '"created_at": "' + response[i].created_at + '",';
    tmp += '"updated_at": "' + response[i].updated_at + '",';
    tmp += '"types": [{';

    types = "";
    
    if(debug){console.log("> Building type(s)");}
    
    /** Loop through types */
    $.each(response[i].types, function(j, v) {
      types += '"id": ' + response[i].types[j].id + ',';
      types += '"name": "' + response[i].types[j].name + '",';
      if (response[i].types[j].description) {
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

    tmp += '"genres": [';
    
    /** Loop through genres */
    genres = "";
    if(debug){console.log("> Building genre(s)");}
    $.each(response[i].genres, function(k, v) {
      genres += '{';
      genres += '"id": ' + response[i].genres[k].id + ',';
      genres += '"name": "' + response[i].genres[k].name + '",';
      if (!response[i].genres[k].description) {
        genres += '"description": null,';
      } else {
        genres += '"description": "' + response[i].genres[k].description + '",';
      }
      genres += '"created_at": "' + response[i].genres[k].created_at + '",';
      genres += '"updated_at": "' + response[i].genres[k].updated_at + '"';
      genres += '},'
    });

    /** Remove the trailing comma created in the for loop & append to tmp */
    tmp += genres.substring(0, genres.length - 1);
    tmp += '],';

    tmp += '"restaurant_likes": [';

    /** Loop through restaurant_likes */
    restaurant_likes = "";
    
    if(debug){console.log("> Building like(s)");}
    $.each(response[i].restaurant_likes, function(l, v) {
      restaurant_likes += '{';
      restaurant_likes += '"restaurant_id": ' + response[i].restaurant_likes[l].restaurant_id + ',';
      restaurant_likes += '"user_id": ' + response[i].restaurant_likes[l].user_id + ',';
      restaurant_likes += '"liked": ' + response[i].restaurant_likes[l].liked + ',';
      restaurant_likes += '"disliked": ' + response[i].restaurant_likes[l].disliked;
      restaurant_likes += '},';
    });

    /** Remove the trailing comma created in the for loop and append to tmp */
    tmp += restaurant_likes.substring(0, restaurant_likes.length - 1);
    
    tmp += ']';
    tmp += '},';
    
    if(debug){console.log(" ");}
  });

  /** Only remove the last character in string if it is longer than 1 **/
  if (tmp.length > 1) {
    /** Remove the trailing comma created in the for loop */
    tmp = tmp.substring(0, tmp.length - 1);
  }

  tmp += ']';
  displayResults(pageNum, tmp);
}

/**
 * Parse provided JSON, prnt results to screen.
 * @param {integer} pageNum
 * @param {json} results
 */
function displayResults(pageNum, results) {
  if(!hideWarn){console.warn("Starting to display results...");}
  var newResult,
    restaurantLink,
    restaurantName,
    restaurantImage,
    restaurantActions,
    resIMG,
    result,
    i,
    ii,
    j,
    k,
    resultLayoutCSS,
    heightBuffer,
    alikeCounter,
    adislikeCounter,
    blikeCounter,
    bdislikeCounter,
    likeCount = 0,
    dislikeCount = 0,
    isLiked = false,
    isDisliked = false,
    maxLen;
  
  /** Validate results and sort by most liked */
  if (typeof results === 'string') {
    results = JSON.parse(results);
  }
  
  /** Clear results so we can repopulate it further down */
  resultsContainer.html("");
  
  /** Handle an empty result **/
  if (results.length <= 0) {
    if(!hideWarn){console.warn("> No results!");}
    var NaNResults = '<div class="row"><div class="col span-3-of-3 center">We don\'t seem to have what you are looking for right now.<br />Don\'t give up! The right match is out there somewhere.</div></div>';
    resultsContainer.append(NaNResults);
    $("#resultsContainer").fadeIn("slow");
    return;
  }
  
  if(!hideWarn){console.warn("> Sorting results...");}
  results.sort(function(a, b) {
    alikeCounter = 0;
    adislikeCounter = 0;
    blikeCounter = 0;
    bdislikeCounter = 0;
    
    
    $.each(a.restaurant_likes, function(l, v) {
      if(debug){console.log('> Counting likes/dislikes for ' + a.id);}
      if (a.restaurant_likes[l].liked) {
        alikeCounter += 1;
      }
      if (a.restaurant_likes[l].disliked) {
        adislikeCounter += 1;
      }
    });

    $.each(b.restaurant_likes, function(l, v) {
      if(debug){console.log('> Counting likes/dislikes for ' + b.id);}
      if (b.restaurant_likes[l].liked) {
        blikeCounter += 1;
      }
      if (b.restaurant_likes[l].disliked) {
        bdislikeCounter += 1;
      }
    });
    
    if ((alikeCounter - adislikeCounter) > (blikeCounter - bdislikeCounter)) {
      if(debug){console.log("> "+a.id + "[" + (alikeCounter - adislikeCounter) +"] has more points than " + b.id + "[" + (alikeCounter - adislikeCounter) + "]");console.log("");}
      return -1;
    }
    if ((alikeCounter - adislikeCounter) < (blikeCounter - bdislikeCounter)) {
      if(debug){console.log("> "+a.id + "[" + (alikeCounter - adislikeCounter) +") has less points than " + b.id + "[" + (blikeCounter - bdislikeCounter) + "]");console.log("");}
      return 1;
    }
    if(debug){console.log("> "+a.id + "[" + (alikeCounter - adislikeCounter) + "] & " + b.id + "[" + (blikeCounter - bdislikeCounter) + "] are identical.");console.log("");}
    return 0;
  });
  
  
  
  if(!hideWarn){console.warn("> Displaying results.");}
  perPage = parseInt(perPage);
  pageNum = parseInt(pageNum);
  
  if(perPage === 1){
    numPages = results.length;
  } else if(results.length <= perPage){
    numPages = 1;
  } else if(results.length % perPage){
    numPages = parseInt(results.length / perPage) + 1;
  } else {
    numPages = results.length / perPage;
  }
    
  if(numPages <= 1){
    numPages = 1;
  }
  
  if(results.length <= perPage){
    maxLen = perPage;
  } else if(results.length % perPage && pageNum == numPages){
    maxLen = results.length % perPage;
    maxLen = results.length - maxLen;
  } else {
    maxLen = perPage;
  }
  
  var iStart = ((pageNum * perPage) - perPage);
  
  if(pageNum > numPages){
    results = [];
    if(!hideWarn){console.warn("> No results!");}
    var maxPageExceed =   '<div class="row"><div class="col span-3-of-3 center">We don\'t seem to have that many pages of results.<br />';
        maxPageExceed +=  '<a href="#1" onclick="javascript:filter(1, apiResult);">Go to page 1</a> or click <a href="#1" onclick="javascript: setFilters()">Apply FIlters</a></div></div>';
    resultsContainer.append(maxPageExceed);
    $("#resultsContainer").fadeIn("slow");
    return;
  }
  
  ii = 0;
  /** Loop through each result & print it to the page */
  //for (i = 0; i < results.length; i++) {
  for (i = iStart; i < results.length; i++) {
    ii++;
    /** Set result to the current record */
    result = results[i];

    resIMG = getRestaurantLogo(result);

    /** Determine grid layout for resuilt */
    if (resultLayout > 1) {
      resultLayoutCSS = "span-1-of-" + resultLayout;
    } else {
      resultLayoutCSS = "span-3-of-3";
    }
    
    likeCount = 0;
    dislikeCount = 0;
    isLiked = false;
    isDisliked = false;
    
    $.each(result.restaurant_likes, function(m, v) {
      if (result.restaurant_likes[m].liked) {
        likeCount += 1;
      }
      if (result.restaurant_likes[m].disliked) {
        dislikeCount += 1;
      }
       if ( parseInt(uID) > 0 && parseInt(result.restaurant_likes[m].user_id) === parseInt(uID) ) {
         if(debug){console.log("> Checking if User " + result.restaurant_likes[m].user_id + " likes or dislikes restaurant " + result.id);}
         if (result.restaurant_likes[m].liked) {
           if(debug){console.log("> User " + result.restaurant_likes[m].user_id + " likes restaurant " + result.id);}
           isLiked = true;
         } else if (result.restaurant_likes[m].disliked) {
          if(debug){console.log("> User " + result.restaurant_likes[m].user_id + " dislikes restaurant " + result.id);}
           isDisliked = true;
         } else {
           if(debug){console.log("> User " + result.restaurant_likes[m].user_id + " has no opinion ons restaurant " + result.id);}
           isLiked = false;
           isDisliked = false;
         }
       } else {
         if(debug){console.warn("User " + result.restaurant_likes[m].user_id + " is not the logged in user. Checking next record.");}
       }
    });

    /** Build the HTML for the result */
    restaurantActions = '<div class="restaurantActions">';

    if (isDisliked) {
      restaurantActions += '<span class="pull-right"><button id="dislike' + result.id + '" class="btn btn-selected" title="It wasn\'t for me."><i class="fa fa-ban"></i></button>&nbsp;<sub id="dislikes' + result.id + '">' + dislikeCount + '</sub></span>';
    } else {
      restaurantActions += '<span class="pull-right"><button id="dislike' + result.id + '" class="btn btn-default" title="It wasn\'t for me."><i class="fa fa-ban"></i></button>&nbsp;<sub id="dislikes' + result.id + '">' + dislikeCount + '</sub></span>';
    }

    if (isLiked) {
      restaurantActions += '<span class="pull-right"><button id="like' + result.id + '" class="btn btn-selected" title="I loved it!"><i class="fa fa-heart"></i></button>&nbsp;<sub id="likes' + result.id + '">' + likeCount + '</sub></span>';
    } else {
      restaurantActions += '<span class="pull-right"><button id="like' + result.id + '" class="btn btn-default" title="I loved it!"><i class="fa fa-heart"></i></button>&nbsp;<sub id="likes' + result.id + '">' + likeCount + '</sub></span>';
    }

    restaurantActions += '</div>';
    restaurantImage = '<div class="restaurantImage" title="' + result.name + '\r\nClick for more information..."><img src="' + resIMG + '"></div>';
    restaurantName = '<div class="restaurantName">' + result.name + '</div>';
    restaurantLink = '<div id="info' + result.id + '" class="restaurantLink" title="' + result.name + '\r\nClick for more information...">' + restaurantName + restaurantImage + '</div>';
    newResult = '<div class="result col ' + resultLayoutCSS + '">' + restaurantLink + restaurantActions + '</div>';

    /** Print this result to the page */
    resultsContainer.append(newResult);

    /** Generate event handlers for like, dislike, and info actions */
    (function(info) {
      if(debug){console.log("> Creating event listeners.");console.log("");}
      $("button#like" + info.id).click(function() {
        if(!hideWarn){console.warn("Event Triggered: button#like" + info.id + " was clicked...");}
        addLike(info.id);
      });
      $("button#dislike" + info.id).click(function() {
        if(!hideWarn){console.warn("Event Triggered: button#dislike" + info.id + " was clicked...");}
        addDislike(info.id);
      });
      $("#info" + info.id).click(function() {
        if(!hideWarn){console.warn("Event Triggered: #info" + info.id + " was clicked...");}
        popInfo(info);
      });
    })(result);

    /**
     * After last record is processed:
     * - FadeIn results ( Makes the initial page load more visually appealing )
     * - Fix images so they are all the same height
     * - Add CSS to allow images to keep their aspect ratio
     */
    if (ii >= maxLen || i === parseInt(results.length - 1)) {
      if(debug){console.log("> Last record processed. Fading In result(s).");console.log("");}
      heightBuffer = 0.7;
      $("#resultsContainer").fadeIn("slow");
      var maxHeight = parseInt($("#results .result img").css("width")) + "px";
      if (parseInt($("#results .result img").css("width")) >= parseInt($(window).height() * heightBuffer)) {
        maxHeight = parseInt($(window).height() * heightBuffer) + "px";
      }
      $("#results img").css({
        "width": "auto",
        "max-width": "100%",
        "max-height": maxHeight,
        "height": maxHeight
      });
      
      resultsContainer.append('<div class="col span-3-of-3"><div id="pagination"></div></div>');
      if(numPages >= 10){
        $('#pagination').bootpag({
            total: numPages,
            page: pageNum,
            maxVisible: 10,
            href: "#{{number}}",
            leaps: false,
            next: 'next',
            prev: 'previous'
          });
        } else {
          $('#pagination').bootpag({
            total: numPages,
            page: pageNum,
            maxVisible: numPages,
            href: "#{{number}}",
            leaps: false,
            next: 'next',
            prev: 'previous'
          });
      }
      $('#pagination').on('page', function(event, num){
        displayResults(num, results);
      });
      
      return false;
    }
  }
}

/**
 * Determine which image to show
 * @param {array} asset
 */
function getRestaurantLogo(asset) {
  if(debug){console.log("> Function Called: getRestaurantLogo");}
  if (asset.image) {
    return asset.image;
  } else {
    var cuisineName = "";
    if (asset.genres[0]) {
      cuisineName = asset.genres[0].name;
    }
    return dynIMGBaseURL+"/?font=Lato-Regular&cuisine=" + cuisineName;
  }
}

/**
 * Make an API call to update like/dislike for user
 * @param {number} resId
 */
function addLike(resId) {
  if(debug){console.log("> Function Called: addLike("+resId+")");}
  /** Ensure user is logged in to use this feature */
  if(uID <= 0){
      if(debug){console.log("> User is not logged in. Display modal asking for login.");}
      $("#loginModal").dialog({
        autoOpen: true,
        width: '600px',
        modal: true,
        title: "Login Required",
        buttons: {
          "Login": function(){
            if(debug){console.log("> Login button was clicked Sending user to Login Page.");}
            window.location = "login.html";
          },
          "Go Back": function() {
            if(debug){console.log("> Go Back was clicked. Closing modal.");}
            $(this).dialog("close");
            /** Setting overflow of html back to normal */
            $('html').css("overflow", "visible");
          }
        },
        open: function(event, ui) {
          /** Hide Overflow of html, visual improvement when modal is open */
          $("html").css("overflow", "hidden");
          /** Set focus to parent so close button is not selected by default */
          $(this).parent().focus();
        },
        beforeClose: function(){
          /** Setting overflow of html back to normal */
          $('html').css("overflow", "visible");
        }
      });
      return;
  } else if ($("#like" + resId).hasClass("btn-selected")) {
    if(debug){console.log("> User has already selected this option. Doing nothing.");}
    /** Do nothing, asset is already liked */
    return;
  } else {
    /**
     * API Call:
     * PUT liked = true and disliked = false for logged in user.
     */
    var newLike = {
      restaurant_like: {
        restaurant_id: resId,
        user_id: uID,
        liked: true,
        disliked: false
      }
    };

    newLike = JSON.stringify(newLike);

    var jqxhr = $.ajax({
      url: apiUpdateLikes,
      type: "POST",
      data: newLike,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(result) {
        if(debug){console.log("> Updating like counter and reloading results.");}
        apiResult = JSON.stringify(result);
        filter(apiResult);
      },
      error: function() {
        if(debug){console.warn("> Failed to update like.");}
      }
    });
  }
  if(debug){console.log("");}
}

/**
 * Make an API call to update like/dislike for user
 * @param {number} resId
 */
function addDislike(resId) {
  if(debug){console.log("> Function Called: addDislike("+resId+")");}
  /** Ensure user is logged in to use this feature */
  if(uID <= 0){
      if(debug){console.log("> User is not logged in. Display modal asking for login.");}
      $("#loginModal").dialog({
        autoOpen: true,
        width: '600px',
        modal: true,
        title: "Login Required",
        buttons: {
          "Login": function(){
            if(debug){console.log("> Login button was clicked Sending user to Login Page.");}
            window.location = "login.html";
          },
          "Go Back": function() {
            if(debug){console.log("> Go Back was clicked. Closing modal.");}
            $(this).dialog("close");
            /** Setting overflow of html back to normal */
            $('html').css("overflow", "visible");
          }
        },
        open: function(event, ui) {
          /** Hide Overflow of html, visual improvement when modal is open */
          $("html").css("overflow", "hidden");
          /** Set focus to parent so close button is not selected by default */
          $(this).parent().focus();
        },
        beforeClose: function(){
          /** Setting overflow of html back to normal */
          $('html').css("overflow", "visible");
        }
      });
      return;
  } else if ($("#dislike" + resId).hasClass("btn-selected")) {
    if(debug){console.log("> User has already selected this option. Doing nothing.");}
    /** Do nothing, asset is already disliked */
    return;
  } else {
    /**
     * API Call:
     * PUT liked = false and disliked = true for logged in user.
     */
    
    var newDislike = {
      restaurant_like: {
        restaurant_id: resId,
        user_id: uID,
        liked: false,
        disliked: true
      }
    };

    newDislike = JSON.stringify(newDislike);

    var jqxhr = $.ajax({
      url: apiUpdateLikes,
      type: "POST",
      data: newDislike,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(result) {
        if(debug){console.log("> Updating dislike counter and reloading results.");}
        apiResult = JSON.stringify(result);
        filter(apiResult);
      },
      error: function() {
        if(debug){console.warn("> Failed to update dislike.");}
      }
    });
  }
  if(debug){console.log("");}
}

/**
 * Pull GET data, set filter variables, update default selections for filter menu
 */
function loadFilters() {
  if(!hideWarn){console.warn("Loading filters...");}
  var queryStart = window.location.search.indexOf("?") + 1,
    queryEnd = window.location.search.indexOf("#") + 1 || window.location.search.length + 1,
    query = window.location.search.slice(queryStart, queryEnd - 1),
    pairs = query.replace(/\+/g, " ").split("&"),
    params = {},
    i, n, v, nv;

  /** Checking if there is no GET data to parse */
  if (query === window.location.search || query === "") {
    return;
  }

  for (i = 0; i < pairs.length; i++) {
    nv = pairs[i].split("=");
    n = decodeURIComponent(nv[0]);
    v = decodeURIComponent(nv[1]);
    //var filterType,filterCuisine,filterCost;
    switch (n) {
      case 'type':
        if (v.length >= 1) {
          filterType = v;
          $("#restaurantTypeSearch").val(v);
        } else {
          filterType = "";
        }
        break;
      case 'food':
        if (v.length >= 1) {
          filterCuisine = v;
          $("#foodTypeSearch").val(v);
        } else {
          filterCuisine = "";
        }
        break;
      case 'cost':
        if (v.length >= 1) {
          filterCost = v;
          $("#costLevelSearch").val(v);
        } else {
          filterCost = 5;
        }
        break;
      default:
        console.warn("Unexpected parameter was found in URI.");
    }
  }
}

/**
 * Set filter variables & reload results
 */
function setFilters() {
  if(!hideWarn){console.warn("Setting filters...");}
  resultLayout = $("#resultLayoutType").val();
  filterType = $("#restaurantTypeSearch").val();
  filterCuisine = $("#foodTypeSearch").val();
  filterCost = $("#costLevelSearch").val();

  /** Setting results per page */
  switch (parseInt(resultLayout)) {
    case 1:
      perPage = 1;
      break;
    case 2:
      perPage = 4;
      break;
    default:
      perPage = 9;
  }
  
  var startPage;
  var string = window.location.href;
  if(string){string = string.split('#')[1];}
  if(string){string = string.split('?')[0];}
  
  if (string) { // If there is a query string to extract
    startPage = string;
    if (startPage < 1) {
      startPage = 1;
    }
  } else {
    startPage = 1;
  }

  filter(startPage, apiResult);
}

/**
 * Show other information about the asset
 * @param {array} result
 */
function popInfo(result) {
  if(debug){console.log("> Function Called: popInfo()");}
  var i,
      typesList,
      genresList,
      costSymbol,
      modalButtons;
  
  /**
   * Feature: Make modal width responsive
   * Pro(s): Looks better on all screen/window sizes
   * Con(s): More work
   */
  var modalWidth = "1200px";

  /** Display the information from the asset in the modal before showing it */
  resIMG = getRestaurantLogo(result);
  if (resIMG.length > 1) {
    $("#infoRestaurantImage").prop('src', resIMG);
  }
  if (result.name && result.name.length > 1) {
    $("#infoRestaurantName").html(result.name);
  }
  if (result.street_address && result.zip_code && result.street_address.length > 1 && result.zip_code.length > 1) {
    $("#infoRestaurantAddress").html(result.street_address + ", Pittsburgh " + result.zip_code);
  }
  if (result.phone_number && result.phone_number.length > 1) {
    $("#infoRestaurantPhone").html(result.phone_number);
  }
  if (result.web_site && result.web_site.length > 1) {
    $("#infoRestaurantWebsite").html('<a href="' + result.web_site + '" target="_blank">' + result.web_site + '</a>');
  }

  if (result.types) {
    typesList = "";
    for (i = 0; i < result.types.length; i++) {
      typesList += result.types[i].name + ", ";
    }
    typesList = typesList.substring(0, typesList.length - 2);
    $("#infoRestaurantType").html(typesList);
  }

  if (result.genres) {
    genresList = "";
    for (i = 0; i < result.genres.length; i++) {
      genresList += result.genres[i].name + ", ";
    }
    genresList = genresList.substring(0, genresList.length - 2);
    $("#infoRestaurantCuisine").html(genresList);
  }

  if (result.cost) {
    costSymbol = "";
    for (i = 0; i < parseInt(result.cost); i++) {
      costSymbol += "$";
    }
    $("#infoRestaurantCost").html(costSymbol);
  }

  /** Display Modal with other info about asset */
  if(uID > 0){
    modalButtons = {
//       "Edit": function(){
//         if(debug){console.log("> Edit Button clicked!");}
//         editAsset(result);
//       },
      Close: function() {
        if(debug){console.log("> Closing modal.");}
        $(this).dialog("close");
      }
    };
  } else {
    modalButtons = {
      Close: function() {
        if(debug){console.log("> Closing modal.");}
        $(this).dialog("close");
      }
    };
  }
  
  $("#modal").dialog({
    autoOpen: true,
    width: modalWidth,
    modal: true,
    title: "More Information",
    buttons: modalButtons,
    open: function(event, ui) {
      /** Hide Overflow of html, visual improvement when modal is open */
      $("html").css("overflow", "hidden");
      /** Set focus to parent so close button is not selected by default */
      $(this).parent().focus();
    },
    beforeClose: function(){
      /** Setting overflow of html back to normal */
      $('html').css("overflow", "visible");
    }
  });
  
}

/**
 * Edit information about the asset
 * @param {array} result
 */
function editAsset(result){
  //TODO: Create text boxes, combo boxes, etc for editing
  
  var modalButtons;
  if(debug){console.log("> Function Called: editAsset()");}
  modalButtons = {
    Save: function(){
      if(debug){console.log("> Save Button clicked!");}
      popInfo(result);
    },
    Close: function() {
      if(debug){console.log("> Closing modal.");}
      $(this).dialog("close");
      /** Setting overflow of html back to normal */
      $('html').css("overflow", "visible");
    }
  };
  $('#modal').dialog('option', 'title', 'Edit Information');
  $('#modal').dialog('option', 'buttons', modalButtons);
}

/**
 * Run the following after the page renders.
 */
$().ready(function() {
  if(!hideWarn){console.warn("HTML & CSS loaded. Starting up JavaScript...");}
  var startPage;
  var string = window.location.href;
  if(string){string = string.split('#')[1];}
  if(string){string = string.split('?')[0];}
  
  if (string) { // If there is a query string to extract
    startPage = string;
    if (startPage < 1) {
      startPage = 1;
    }
  } else {
    startPage = 1;
  }
  
  /** Define elements that will use jQuery UI tooltips */
  $('#resultsContainer').tooltip();
  $('#modal > .row').tooltip();

  uName = localStorage.getItem('usersName');
  uID = localStorage.getItem('usersId');

  /**
   * API Call
   * GET results from API
   * result apiResult
   */
  if(!hideWarn){console.warn("> Making first call to server..");console.warn("> This may take a while if the server has not been hit in the past 30 minutes.");}
  $.get(apiRestaurants, function(response){
  }).done(function(response){
    if(!hideWarn){console.warn("> Server Responded!");}
    apiResult = JSON.stringify(response);
    loadFilters();
    filter(startPage, apiResult);
  }).fail(function(){
    if(!hideWarn){console.warn("> Server failed to responded in a timely manner, try again soon!");}
    var serverTimeout = '<div class="row"><div class="col span-3-of-3 center">We are having trouble loading your matches right now. Excuse me while I go an check on the hampsters!<br />Try the <a href="#1" onclick="javascript: setFilters()">Apply FIlters</a> button in a little bit.</div></div>';
    resultsContainer.append(serverTimeout);
    $("#resultsContainer").fadeIn("slow");
  });

  /** Create event listener for the Apply Filters button */
  $("#applyFiltersButton").click(function() {
    setFilters();
  });
});