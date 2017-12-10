var keys = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

var twitter = new Twitter(keys.twitterKeys);
var spotify = new Spotify(keys.spotifyToken);

function getMyTweets() {

    var params = {screen_name: 'Chase_Observes'};
    twitter.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
        //    console.log(tweets);
            for(var i=0; i < tweets.length; i++) {
                console.log(tweets[i].created_at);
                console.log(" ");
                console.log(tweets[i].text);
            }
        }
    });
}

function getArtistNames(artist) {
    return artist.name;
}

function getMeSpotify(songName) {
    spotify.search({ type: 'track', query: songName }, function(err, data) {
        if ( err ) {
            console.log('Error occurred: ' + err);
            return;
        }
     
        var songs = data.tracks.items;
        for (var i = 0; i < songs.length; i++) {
            console.log(i);
            console.log("artist(s): " + songs[i].artists.map(getArtistNames));
            console.log("song name: " + songs[i].name);
            console.log("preview song: " + songs[i].preview_url);
            console.log("album: " + songs[i].album.name);
            console.log("-------------------------------------------");
        } 
    });
}

function getMeMovies(movieName) {
    request('http://www.omdbapi.com/?t=' + movieName + '&apikey=dc8f2ad', function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        var jsonData = JSON.parse(body);

        console.log('Title: ' + jsonData.Title);
        console.log('Year: ' + jsonData.Year);
        console.log('IMDB Rating: ' + jsonData.imdbRating);
        console.log('Country: ' + jsonData.Country);
        console.log('Language: ' + jsonData.Language);
        console.log('Plot: ' + jsonData.Plot);
        console.log('Actors: ' + jsonData.Actors);
        console.log('Rotten Tomatoes Rating: ' + jsonData.Ratings[JSON.stringify(1)].Value);
    });
}

function doWhatItSays() {
    fs.readFile('random.txt', 'utf8', function (err, data) {
        if (err) throw err;
        
        var dataArr = data.split(',');

        if (dataArr.length == 2) {
            pick(dataArr[0], dataArr[1]);
        } else if (dataArr.length == 1) {
            pick(dataArr[0]);
        }
    });
}

var pick = function(caseData, functionData) {
    switch(caseData) {
        case "my-tweets" :
            getMyTweets();
            break;
        case "spotify-this-song" :
            getMeSpotify(functionData);
            break;
        case "movie-this" :
            getMeMovies(functionData);
            break;
        case "do=what-it-says" :
            doWhatItSays();
            break;
        default:
        console.log("LIRI does not know that");
    }
}

var runThis = function(argOne, argTwo) {
    pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);