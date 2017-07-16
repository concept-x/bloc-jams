

var createSongRow = function(songNumber, songName, songLength){
  var template =
  '<tr class="album-view-song-item">'
  +'  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
  +'  <td class="song-item-title">' + songName + '</td>'
  +'  <td class="song-item-duration">' + songLength + '</td>'
  +'</tr>'
  ;

//  var $row = $(template);
  var $row = $(template);


  var clickHandler = function (){
    var songNumber = $(this).attr('data-song-number');

    if (currentlyPlayingSong !== null) {
  // Revert to song number for currently playing song because user started playing new song.
        var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSong + '"]');
        currentlyPlayingCell.html(currentlyPlayingSong);
      }
      if (currentlyPlayingSong !== songNumber) {
  // Switch from Play -> Pause button to indicate new song is playing.
        $(this).html(pauseButtonTemplate);
        currentlyPlayingSong = songNumber;
    } else if (currentlyPlayingSong === songNumber) {
  // Switch from Pause -> Play button to pause currently playing song.
        $(this).html(playButtonTemplate);
        currentlyPlayingSong = null;
      }
  };

  var onHover = function(event){
    var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');

        if (songNumber !== currentlyPlayingSong) {
            songNumberCell.html(playButtonTemplate);
        }
  };

  var offHover = function(event){
    var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');

        if (songNumber !== currentlyPlayingSong) {
            songNumberCell.html(songNumber);
        }
  };

  $row.find('.song-item-number').click(clickHandler);
  $row.hover(onHover, offHover);
  return $row;
};

var $albumTitle = $('.album-view-title');
var $albumArtist = $('.album-view-artist');
var $albumReleaseInfo = $('.album-view-release-info');
var $albumImage = $('.album-cover-art');
var $albumSongList = $('.album-view-song-list');

var setCurrentAlbum = function(album){

  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);
  $albumSongList.empty();

  //#4: iterate thru album songs + insert them using jQuery
  for (var i =0; i < album.songs.length; i++){
    var $newRow = createSongRow(i +1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($newRow);
  }
};

//Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

//Store state of playing songs
var currentlyPlayingSong = null;

$(document).ready(function(){
  setCurrentAlbum(albumPicasso);

  var albumArray = [albumPicasso, albumMarconi, albumSummer];
  var index = 1;
  $albumImage.click(function(event){
    setCurrentAlbum(albumArray[index]);
    index++;
    if (index == albumArray.length){
      index = 0;
    }
  });
});
  /*albumImage.addEventListener("click", function(event){
    setCurrentAlbum(albumArray[index]);
    index++;
    if (index == albumArray.length){
      index = 0;
    }
  });*/
