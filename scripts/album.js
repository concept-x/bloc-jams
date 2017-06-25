//Example album
var albumPicasso = {
  title: 'The Colors',
  artist: 'Pablo Picasso',
  label: 'Cubism',
  year: '1881',
  albumArtUrl: 'assets/images/album_covers/01.png',
  songs: [
    {title: 'Blue', duration: '4:26'},
    {title: 'Green', duration: '3:14'},
    {title: 'Red', duration: '5:01'},
    {title: 'Pink', duration: '3:21'},
    {title: 'Magenta', duration: '2:15'}
  ]
};

var albumMarconi = {
  title: 'The Telephone',
  artist: 'Guglielmo Marconi',
  label: 'EM',
  year: '1909',
  albumArtUrl: 'assets/images/album_covers/20.png',
  songs: [
    {title: 'Hello, Operator?', duration: '1:01'},
    {title: 'Ring, ring, ring', duration: '5:01'},
    {title: 'Fits in your pocket', duration: '3:21'},
    {title: 'Can you hear me now?', duration: '3:14'},
    {title: 'Wrong phone number', duration: '2:15'}
  ]
};

var albumSummer = {
  title: 'Summer',
  artist: 'The Four Seasons',
  label: '365',
  year: '2017',
  albumArtUrl: 'assets/images/album_covers/03.png',
  songs: [
    {title: 'Long Days', duration: '3:11'},
    {title: 'Lake Parties', duration: '4:56'},
    {title: 'Cookouts', duration: '5:04'},
    {title: 'Hot, hot, hot', duration: '2:43'},
    {title: 'Skeeter Bites', duration: '1:53'}
  ]
};

var createSongRow = function(songNumber, songName, songLength){
  var template =
  '<tr class="album-view-song-item">'
  +'  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
  +'  <td class="song-item-title">' + songName + '</td>'
  +'  <td class="song-item-duration">' + songLength + '</td>'
  +'</tr>'
  ;

  return template;
};

var albumTitle = document.getElementsByClassName('album-view-title')[0];
var albumArtist = document.getElementsByClassName('album-view-artist')[0];
var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
var albumImage = document.getElementsByClassName('album-cover-art')[0];
var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

var setCurrentAlbum = function(album){
  //#1: select all HTML elements to display on album page

  //#2: identify and return values of certain nodes
  albumTitle.firstChild.nodeValue = album.title;
  albumArtist.firstChild.nodeValue = album.artist;
  albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
  albumImage.setAttribute('src', album.albumArtUrl);

  //#3: clear album song list HTML so js can dynamically populate info
  albumSongList.innerHTML = '';

  //#4: iterate thru album songs + insert them using innerHTML
  for (var i =0; i < album.songs.length; i++){
    albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
  }
};
//ckpoint 13: change song# to pause button
//starting at .song-item-number, bubble up to find a parent with a specified class name
var findParentByClassName = function(element, targetClass) {//takes current element & target parent class args
  if(element){//pass in element you want parent of
    var currentParent = element.parentElement;//set cP = immediate parent of current element
    while(currentParent.className !== targetClass && currentParent.className !== null){//while cP class !== target class and cP class exists
      currentParent = currentParent.parentElement;//move one step up the DOM tree to find next parent
    }
    return currentParent;//if 'if-condition' is no longer met, return cP & exit function (we've found target parent class)
  }
};//end findParentByClassName function

//start getSongItem method...take element w/className & return .song-item-number class using switch stmt
var getSongItem = function (element){//I got this right by mahself!!
  //use switch statement to return element w/.song-item-number class. Either
  //1.the element already *is* .song-item-number, or
  //2.element is a sibling of .song-item-number, or
  //3. element is a parent of .song-item-number
  switch(element.className){
    //account for all possible relationships to .song-item-number from other album.css classes
    case 'album-song-button':
    case 'ion-play':
    case 'ion-pause': //in all three cases, return below:
      return findParentByClassName(element,'song-item-number');
    case 'album-view-song-item':
      return element.querySelector('.song-item-number');
    case 'song-item-title':
    case 'song-item-duration':
      return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
    case 'song-item-number': //if the element *is* what we're looking for, then
      return element;//just return it. Why isn't this the default?
    default://answer is blank here...why?
      return;
  }
};
//end getSongItem
//end ckpoint 13 code

var clickHandler = function(targetElement) {
  var songItem = getSongItem(targetElement);

  if(currentlyPlayingSong === null){
    songItem.innerHTML = pauseButtonTemplate;
    currentlyPlayingSong = songItem.getAttribute('data-song-number');
  } else if(currentlyPlayingSong === songItem.getAttribute('data-song-number')){
      songItem.innerHTML = playButtonTemplate;
      currentlyPlayingSong = null;
  } else if(currentlyPlayingSong !== songItem.getAttribute('data-song-number')){
      var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
      currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
      songItem.innerHTML = pauseButtonTemplate;
      currentlyPlayingSong = songItem.getAttribute('data-song-number');
  }
};

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
//Elements we'll be adding listeners to
var songRows = document.getElementsByClassName('album-view-song-item');
//Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

//Store state of playing songs
var currentlyPlayingSong = null;

window.onload = function(){
  setCurrentAlbum(albumPicasso);

songListContainer.addEventListener('mouseover', function(event){
  //Only target individual song rows during event delegation
  if(event.target.parentElement.className === 'album-view-song-item'){
    //Change content from song# to play button
      
      var songItem = getSongItem(event.target);

      if(songItem.getAttribute('data-song-number') !== currentlyPlayingSong){
        songItem.innerHTML = playButtonTemplate;
      }
  }
});
//update w/conditional that only changes innerHTML of <td> when <td> !== currently playing song

  for(var i = 0; i<songRows.length; i++){
    songRows[i].addEventListener('mouseleave', function(event){
      //#1: cache the song being left in a var
      var songItem = getSongItem(event.target);
      var songItemNumber = songItem.getAttribute('data-song-number');

      //#2: check whether mouse is leaving current song, and change songItem if not
      if(songItemNumber !==currentlyPlayingSong){
        songItem.innerHTML = songItemNumber;
      }
    });

    songRows[i].addEventListener('click', function(event){
      //event handler call
      clickHandler(event.target);
    });
  }
  var albumArray = [albumPicasso, albumMarconi, albumSummer];
  var index = 1;
  albumImage.addEventListener("click", function(event){
    setCurrentAlbum(albumArray[index]);
    index++;
    if (index == albumArray.length){
      index = 0;
    }
  });
};
