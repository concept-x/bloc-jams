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
  +'  <td class="song-item-number">' + songNumber + '</td>'
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

window.onload = function(){
  setCurrentAlbum(albumPicasso);

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
//Assignment 11: Add an event listener to the album cover. When a user clicks it, the album page content should toggle between the three album objects
 //how to iterate thru repeatedly? 0, 1, 2, 0, 1, 2, 0...? Add a condition "if [i] == 2, on next click [i] == 0?
