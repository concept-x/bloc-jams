//var collectionItemTemplate =
//#1 wrap template in function to return html result as jQ object
var buildCollectionItemTemplate = function(){
  var template =
  '<div class="collection-album-container column fourth">'
    + ' <img src="assets/images/album_covers/01.png"/>'
    + ' <div class="collection-album-info caption">'
    + '  <p>'
    + '   <a class="album-name" href="album.html"> The Colors </a>'
    + '   <br/>'
    + '   <a href="album.html"> Pablo Picasso </a>'
    + '   <br/>'
    + '   X songs'
    + '   <br/>'
    + '  </p>'
    + ' </div>'
    +'</div>'
    ;

    //#2 no jQuery yet, but just in case, wrap template in jQ object
    return $(template);
  };
  //window.onload = function(){
  $(window).load(function(){
  //  var collectionContainer = document.getElementsByClassName('album-covers')[0];
    var $collectionContainer = $('.album-covers');
    //#3
    //#4
    $collectionContainer.empty();//literally empties out the node

    for (var i=0; i < 12; i++){
      //collectionContainer.innerHTML += collectionItemTemplate;
      var $newThumbnail = buildCollectionItemTemplate();
      //#5
      $collectionContainer.append($newThumbnail);//.append = +=
    }
  });
