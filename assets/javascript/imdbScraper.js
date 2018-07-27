// Function to retrieve soundtrack info from inputed movie

// NOTE: EXAMPLE USAGE: imdbAjax("John Wick", (x) => test.push(x))


async function omdbAjax(name) {
  const result = $.ajax( {
      url: `http://www.omdbapi.com/?t=${name}&apikey=76978dc&plot=full`,
      method: "GET"
  })
  return result
}

async function imdbScraper(name) {
  let data = await omdbAjax(name);
  const result = $.ajax({
    url: `https://cors.io/?https://www.imdb.com/title/${data.imdbID}/soundtrack`,
    method: "GET",
    crossDomain: true,
    dataType: "html"
  })
  return result;
}

async function parseimdbAjax(name) {
      let result = await imdbScraper(name)
      // Parses web page to legible HTML
      body = '<div id="body-mock">' + result.replace(/^[\s\S]*<body.*?>|<\/body>[\s\S]*$/ig, '') + '</div>';
      // This checks a specific spot in some of these soundtrack pages, for a huge piece of json that has all the data we need, in a specific react script tag Some have it, some don't.
      // This will increase our accuracy, webscraping is hard because we are at the whims of the host-site gods, and however they decided to format that particular page
      // =========================================================================================================
      let returnData = [];
      if ($(body).find('script:contains("trackIds")').text().includes(',')) {
        let scriptJson = $(body).find('script:contains("trackIds")').text();
        scriptJson = scriptJson.replace(/.+?(?=\{"albumOpenS)/, '["center-1-react",');
        scriptJson = scriptJson.replace(/Samples\"\}\].*/, 'Samples"}]');
        let jsonObj = JSON.parse(scriptJson);
        for (key in jsonObj[1].albumData.tracks) {
          returnData.push({"isTrue": true, "trackName": jsonObj[1].albumData.tracks[key].trackTitle, "artist": jsonObj[1].albumData.tracks[key].artists});
        }
      }
      // Otherwise, do it how we used to do it
      // =========================================================================================================
      else{
        var $body = $("#soundtracks_content", body).children().children();
        for (var i = 0; i < $body.length; i++) {
          // logs song title
          returnData.push({"isTrue": false, "trackName": Array.from($($body[i]).contents())[0].data, "artist": Array.from($($body[i]).contents().closest('a:first-of-type').text()).join("")});
        }
      }
      return returnData;
    }
