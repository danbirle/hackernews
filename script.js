(function () {
  var noOfStories = 10; // Number of stories that will be displayed
  var storyIDs = [];

  var getStoryIDs;
  var getStory;

  var cards = [];
  var loadedAllCards = $.Deferred();

  class StoryCard {
  constructor(title, url, timestamp, score, author, karma, show) {
    this.title = title;
    this.url = url;
    this.timestamp = timestamp;
    this.score = score;
    this.author = author;
    this.karma = karma;
    this.show = show;
    }
  }



  getAllStoriesIDs();
  getStoryIDs.done(function () {
    getStoriesByID(storyIDs);
    $.when(loadedAllCards).done(function (allCards) {
      $('.spinner').remove();
      for (var i = 0; i < allCards.length - 1; i++) {
        for (var j = i+1; j < allCards.length; j++) {
          if (allCards[i].score > allCards[j].score) {
            var aux = allCards[i];
            allCards[i] = allCards[j];
            allCards[j] = aux;
          }
        }
      }
      for (var i = 0; i < allCards.length; i++) {
        var publishDate = new Date(allCards[i].timestamp);
        $('.card').eq(i).addClass(allCards[i].show);
        $('.card').eq(i).append(
          '<div class="content">'+
          '<div class="score">Score <span>'+allCards[i].score+'</span></div>'+
          '<h1>'+allCards[i].title+'</h1>'+
          '<p><a href="'+allCards[i].url+'">'+allCards[i].url+'</a></p>'+
          '<p>Published on '+ (publishDate.getDate()+'/'+(publishDate.getMonth()+1)+'/'+publishDate.getFullYear())+'</span>'+
          ' by '+ allCards[i].author+', <br>Karma points:'+ allCards[i].karma +'</p>'+
          '</div>'
        );
      }


    });
  });

  ////////////////////////////////////////////////////////////////////////////////
  // Get Jsons
  ////////////////////////////////////////////////////////////////////////////////

  function getAllStoriesIDs() {
    // Get random stories
    getStoryIDs = $.getJSON('https://hacker-news.firebaseio.com/v0/topstories.json', function (data) {
      var i = 0;
      while (i < noOfStories) {
        var randomStoryIndex = Math.floor(Math.random() * data.length) + 1;
        storyIDs.push(data[randomStoryIndex]);
        data.splice(randomStoryIndex, 1); // removing occurence so that it doesn't repeat

        i++;
      }
    }).done(function() {
      for (var i = 0; i < storyIDs.length; i++) {
        $('#stories').append('<div class="card"></div>');
      }
    })
    .fail(function() {
      console.log('Error reading stories');
    });
  }

  function getStoriesByID(allStoryIDs) {
    // Get stories by ID
    var crtCard;
    for (var i = 0; i < allStoryIDs.length; i++) {
      if (typeof allStoryIDs[i] != 'undefined') {
        getStory = $.getJSON('https://hacker-news.firebaseio.com/v0/item/'+allStoryIDs[i]+'.json', function (data) {
        }).done(function(data) {
          getAuthorByID(data);
        })
        .fail(function() {
          console.log('Error reading specific story');
        });
      } else {
        console.log('Error reading specific story');
      }
    }
  }


  function getAuthorByID(storyData) {
    // Get author by ID
    if (typeof storyData != 'undefined') {
      getAuthor = $.getJSON('https://hacker-news.firebaseio.com/v0/user/'+storyData.by+'.json', function (data) {
      }).done(function(data) {
        var displayOrHide = '';
        if (typeof storyData.title != 'undefined' &&
          typeof storyData.url != 'undefined' &&
          typeof storyData.time != 'undefined' &&
          typeof storyData.score != 'undefined' &&
          typeof data.karma != 'undefined') {
            displayOrHide = 'loaded';
        } else {
          console.log('Error reading specific card');
        }
        cards.push(new StoryCard(storyData.title, storyData.url, storyData.time, storyData.score, storyData.by, data.karma, displayOrHide));
        if (cards.length >= noOfStories) {
          loadedAllCards.resolve(cards);
        }
      })
      .fail(function() {
        console.log('Error reading specific author');
      });
    } else {
      console.log('Error reading specific author');
    }
  }

})();
