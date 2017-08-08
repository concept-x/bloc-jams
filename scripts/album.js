var setSong = function(songNumber){
	if(currentSoundFile){
		currentSoundFile.stop();
	}
	currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber -1];
	//#1: assign new Buzz sound object
	currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl,{
		//#2 passed in a settings obj with 2 properties defined
		formats: ['mp3'],
		preload: true
	});
	setVolume(currentVolume);
};

var seek = function(time) {
		if (currentSoundFile) {
				currentSoundFile.setTime(time);
		}
}

var setVolume = function(volume){
	if (currentSoundFile){
		currentSoundFile.setVolume(volume);
	}
};

var getSongNumberCell = function(number){
	return $('.song-item-number[data-song-number="' + number + '"]');
};

var createSongRow = function(songNumber, songName, songLength){
  var template =
  '<tr class="album-view-song-item">'
  +'  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
  +'  <td class="song-item-title">' + songName + '</td>'
  +'  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
  +'</tr>'
;

  var $row = $(template);

  var clickHandler = function (){
      var songNumber = parseInt($(this).attr('data-song-number'));

      if (currentlyPlayingSongNumber !== null) {
    // Revert to song number for currently playing song because user started playing new song.
          var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
          currentlyPlayingCell.html(currentlyPlayingSongNumber);
          updatePlayerBarSong();
        }
        if (currentlyPlayingSongNumber !== songNumber) {
    // Switch from Play -> Pause button to indicate new song is playing.
          setSong(songNumber);
					currentSoundFile.play();
					updateSeekBarWhileSongPlays();
					currentSongFromAlbum = currentAlbum.songs[songNumber -1];

					var $volumeFill = $('.volume .fill');
					var $volumeThumb = $('.volume .thumb');
					$volumeFill.width(currentVolume + '%');
					$volumeThumb.css({left: currentVolume + '%'});

					$(this).html(pauseButtonTemplate);
          updatePlayerBarSong();
      } else if (currentlyPlayingSongNumber === songNumber) {
    // Switch from Pause -> Play button to pause currently playing song.
				if (currentSoundFile.isPaused()){
					$(this).html(pauseButtonTemplate);
					$('.main-controls .play-pause').html(playerBarPauseButton);
					currentSoundFile.play();
					updateSeekBarWhileSongPlays();
		}		else {
					$(this).html(playButtonTemplate);
					$('.main-controls .play-pause').html(playerBarPlayButton);
					currentSoundFile.pause();
					}
        }
    }; //end clickhandler

    var onHover = function(event){
      var songNumberCell = $(this).find('.song-item-number');
          var songNumber = parseInt(songNumberCell.attr('data-song-number'));

          if (songNumber !== currentlyPlayingSongNumber) {
              songNumberCell.html(playButtonTemplate);
          }
    };

    var offHover = function(event){
      var songNumberCell = $(this).find('.song-item-number');
          var songNumber = parseInt(songNumberCell.attr('data-song-number'));

          if (songNumber !== currentlyPlayingSongNumber) {
              songNumberCell.html(songNumber);
          }
    };

  $row.find('.song-item-number').click(clickHandler);
  $row.hover(onHover, offHover);
  return $row;
}

var $albumTitle = $('.album-view-title');
var $albumArtist = $('.album-view-artist');
var $albumReleaseInfo = $('.album-view-release-info');
var $albumImage = $('.album-cover-art');
var $albumSongList = $('.album-view-song-list');

var setCurrentAlbum = function(album){
  currentAlbum = album;

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

//only starts after song has been paused, then played again.???
var updateSeekBarWhileSongPlays = function(){
	if (currentSoundFile){
		var setCurrentTimeInPlayerBar = function(currentTime){
			$('.current-time').text(currentTime);
		};
//#10 bind timeupdate to currentSoundFile. TimeUpdate fires repeatedly during playback.
		currentSoundFile.bind('timeupdate', function(event){
//#11 calculate seekBarFillRation with getTime & getDuration = custom buzz methods
			var seekBarFillRatio = this.getTime() / this.getDuration();
			var $seekBar = $('.seek-control .seek-bar');
//**Assign 21 #1 here
			updateSeekPercentage($seekBar, seekBarFillRatio);
			setCurrentTimeInPlayerBar(filterTimeCode(this.getTime()));
		});
	}
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio){
	var offsetXPercent = seekBarFillRatio * 100;
	//#1 making sure our percentage 0 < x < 100
	offsetXPercent = Math.max(0, offsetXPercent);
	offsetXPercent = Math.min(100, offsetXPercent);
	//#2 convert percentage to string + % sign for CSS to use
	var percentageString = offsetXPercent + '%';
	$seekBar.find('.fill').width(percentageString);
	$seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function(){
	//#6 use jQuery to find all .seek-bar elements inside .player-bar elements
	var $seekBars = $('.player-bar .seek-bar');

	$seekBars.click(function(event){
		//#3 pageX = jQuery x-value of click event; subtract seek bar offset from click-X
		var offsetX = event.pageX - $(this).offset().left;
		var barWidth = $(this).width();
		//#4 calculae seekBarFillRatio
		var seekBarFillRatio = offsetX / barWidth;
		//#5 function call w/parameters
		updateSeekPercentage($(this), seekBarFillRatio);

		if ($(this).parent().attr("class") === 'seek-control'){
			seek(currentSoundFile.getDuration() * seekBarFillRatio);
			} else {setVolume(seekBarFillRatio * 100);
			};
});


	//#7 find .thumb inside seekBar; add event listener for mousedown
	$seekBars.find('.thumb').mousedown(function(event){
		//#8 use 'this' to determine whether song seek or volume control fired mousedown
		var $seekBar = $(this).parent();
		//#9 first instance of .bind
		$(document).bind('mousemove.thumb', function(event){
			var offsetX = event.pageX - $seekBar.offset().left;
			var barWidth = $seekBar.width();
			var seekBarFillRatio = offsetX / barWidth;

			updateSeekPercentage($seekBar, seekBarFillRatio);
		});

		//#10 unbind...comment out to see thumb & fill move after mouse release
		$(document).bind('mouseup.thumb', function(){
			$(document).unbind('mousemove.thumb');
			$(document).unbind('mouseup.thumb');
		});
	});
};

var nextSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _incrementing_ the song here
    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }

    // Save the last song number before changing it
    var lastSongNumber = currentlyPlayingSongNumber;

    // Set a new current song
		setSong(currentSongIndex + 1);
		currentSoundFile.play();
		updateSeekBarWhileSongPlays();
  //  currentlyPlayingSongNumber = currentSongIndex + 1;
  //  currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    // Update the Player Bar information
    updatePlayerBarSong();

    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _decrementing_ the song here
    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length -1;
    }

    // Save the last song number before changing it
    var lastSongNumber = currentlyPlayingSongNumber;

    // Set a new current song
		setSong(currentSongIndex + 1);
		currentSoundFile.play();
		updateSeekBarWhileSongPlays();
    //currentlyPlayingSongNumber = currentSongIndex + 1;
    //currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    // Update the Player Bar information
    updatePlayerBarSong();

    $('.main-controls .play-pause').html(playerBarPauseButton);

    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var trackIndex = function(album,song){
  return album.songs.indexOf(song);
}
//Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

//global vars holding current song & album info
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

//first, establish your variable ...
var $toggle = $('.main-controls .play-pause')

//then, your function (i ironed out a few kinks, there may still be a couple things that need to be finessed)
var togglePlayFromPlayerBar = function () {
  var $songNumberCell = getSongNumberCell(currentlyPlayingSongNumber)
  if (currentSoundFile.isPaused()) {
    $songNumberCell.html(pauseButtonTemplate);
    $toggle.html(playerBarPauseButton);
    currentSoundFile.play();
  } else {
  	$songNumberCell.html(playButtonTemplate)
    $toggle.html(playerBarPlayButton);
    currentSoundFile.pause();
	}
}

$(document).ready(function(){
  setCurrentAlbum(albumPicasso);
	setupSeekBars();
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
	//then, in your document ready ...
	$toggle.click(togglePlayFromPlayerBar)
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
var filterTimeCode = function(timeInSeconds){
var wholeSecs = parseFloat(timeInSeconds);
var wholeMins = (wholeSecs / 60);
wholeMins = Math.floor(wholeMins);
var remainderSecs = (wholeSecs % 60);
var returnTime = wholeMins+':'+remainderSecs;
returnTime;
 };


var updatePlayerBarSong = function(){//lesson 19
	var setTotalTimeInPlayerBar = function(totalTime){
		$('.total-time').text(totalTime);
	};
 $(".currently-playing .song-name").text(currentSongFromAlbum.title);
 $('.currently-playing .artist-name').text(currentAlbum.artist);
 $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
 $('.main-controls .play-pause').html(playerBarPauseButton);
 setTotalTimeInPlayerBar(filterTimeCode(currentSoundFile.getDuration()));
};
