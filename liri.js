
require("dotenv").config();
var keys = require("./keys");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);



var getArtistNames = function (artist) {
    return artist.name;
}

var getMeSpotify = function (songName) {
    spotify.search({
        type: 'track',
        query: songName
    },
        function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            for (var i = 0; i < 5; i++) {
                console.log("Artists: " + data.tracks.items[i].artists.map(getArtistNames));
                console.log(data.tracks.items[i].name);
                console.log(data.tracks.items[i].preview_url);
                console.log(data.tracks.items[i].album.name);
                console.log("----------------");
            }


        });
};


var getMeConcerts = function (artist) {
    // Make a request for a user with a given ID
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
        .then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                console.log("Venue name: " + response.data[i].venue.name);
                console.log(`Venue location: ${response.data[i].venue.city}, ${response.data[i].venue.region}, ${response.data[i].venue.country}`)
                console.log(moment(response.data[i].datetime).format("MM/DD/YYYY"));
                console.log("-----------");

            }

        })
        .catch(function (error) {
            console.log(error);
        });

    // // Optionally the request above could also be done as
    // axios.get('/user', {
    //     params: {
    //         ID: 12345
    //     }
    // })
    //     .then(function (response) {
    //         console.log(response);
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });

};



var getMeMovie = function (movieName) {
    // Make a request for a user with a given ID
  
    if (!movieName) {
        movieName = "Mr. Nobody";
    };
    axios
        .get('http://omdbapi.com/?t=' + movieName + '&y=&plot=short&r=json&apikey=trilogy')
        .then(function (response) {
            console.log("Title: " + response.data.Title);
            console.log("Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            console.log("--------------");
        })
        .catch(function (error) {
            console.log(error);
        });

};

var doWhatItSays = function () {
    fs.readFile("random.txt", "utf8", function(error, data){
        console.log(data);
        var dataArray = data.split(",");
        // console.log(dataArray);

        if (dataArray.length === 2) {
            pick(dataArray[0], dataArray[1]);
        } else if (dataArray.length === 1) {
            pick(dataArray[0]);
        }
    })

};

var pick = function (caseChoice, userChoice) {
    switch (caseChoice) {
        case 'spotify-this-song':
            getMeSpotify(userChoice);
            break;
        case 'concert-this':
            getMeConcerts(userChoice);
            break;
        case 'movie-this':
            getMeMovie(userChoice);
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
        default:
            console.log("LIRI does not understand that selection!");
    }

};

var runThis = function (arg1, arg2) {
    pick(arg1, arg2);

};

runThis(process.argv[2], process.argv.slice(3).join(" "));

