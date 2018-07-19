
function popitup(url,windowName) {
       newwindow=window.open(url,windowName,'height=700,width=400');
       if (window.focus) {newwindow.focus()}
}
let uriRedirectTest = "http://127.0.0.1:8080/apiredirect.html"
spotifyWindow = `http://accounts.spotify.com/authorize?client_id=0bfbe170f82c46a089b7d9d412592492&redirect_uri=${uriRedirectTest}&response_type=token`


if (localStorage.getItem("spotifyAPItoken") === null) {
  let linkButton = $("<button class='btn btn-warning'>Log in to Spotify</button>");
  linkButton.click(() => {
    popitup(spotifyWindow, "spotifyAPIAuth");
    $("#apiWarningModal").modal('hide');
  });
  $("#spotifyLinker").append(linkButton);
  $("#apiWarningModal").modal();
}


$("#apiTest").click(() => {$.ajax(
  {
    method: "GET",
    url: "https://api.spotify.com/v1/search",
    headers: {
      "Authorization": 'Bearer ' + localStorage.getItem('spotifyAPItoken')
    },
    data: {
      "q": "run the jewels",
      "type": "artist"
      // "client_id":  "0bfbe170f82c46a089b7d9d412592492",
      // "redirect_uri":  "../../index.html",
      // "scope":  "user-read-private user-read-email"
    },
    success: function(result) {
      console.log(result)
    },
  }
)});
