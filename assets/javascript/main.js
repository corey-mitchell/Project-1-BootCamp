
$("#movieInputSubmit").click(async function() {
  let movieName = $("#movieInput").val().trim();
  let spotifyUserId = await getUserId();
  spotifyUserId = spotifyUserId.id;
  let omdbData = await omdbAjax(movieName);
  let imdbSoundtrackData = await parseimdbAjax(movieName);
  $("#soundTrackList").empty();
  $("#createPlaylistButton").empty();
  imdbSoundtrackData.map((data, index) => $("#soundTrackList").append(`<li class='list-group-item'>${index+1}: ${data.trackName}</li>`))
  // ====================================================================================
  // Use omdbData to create some of the rest of the site functionality, like putting up the poster and whatnot.
  // console.log(omdbData); // this will be the typical OMDB response you're used to


  // ====================================================================================
  let playlistButton = $("<button class='btn btn-warning'>");
  playlistButton.text("Create Spotify Playlist");
  playlistButton.click(async function() {
    let playlistId = await createSpotifyPlaylist(movieName);
    playlistId = playlistId.id;

    let pushUrl = `https://api.spotify.com/v1/users/${spotifyUserId}/playlists/${playlistId}/tracks?uris=`
    const searchResults = await Promise.all(imdbSoundtrackData.map(async function(songName, i, arr) {
      let trackUrl = await spotifyTrackSearch(songName.trackName);
      if (trackUrl.tracks.items.length > 0) {
        pushUrl += "spotify%3Atrack%3A"+trackUrl.tracks.items[0].id+",";
      }
      }));
    pushUrl.slice(0, -1);
    spotifyPostToPlaylist(pushUrl);
  })
  $("#createPlaylistButton").append(playlistButton);
})
