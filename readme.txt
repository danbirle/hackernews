Simply run index.html
- the Javascript is going to populate the stories <section> as soon as the required promises are resolved
- placed a loading spinner that's removed once the promises are resolved 

scripts.js
- using jQuery to fetch & format data
- getting the random ids: 10 times picking a random array-position number and removing it afterwards, so it does not re-occur
- getting the stories by id & getting authors by id have to start loading as soon as they have something to load by. Called them inside the .done() method of the call
- another requirement was to show items (sorted) on page when all of them are done loading. Using a promise to determine that and going through the array twice, switching the items' position if the order isn't ascending
- putting all data in the StoryCard class's properties and appending everything to the stories <section>

style.css
- truncated links as they were too long
- using a class 'loaded' (and displaying an error in console) to show all the cards that loaded successfully (missing hyperlink counts as not successfully, so I'm simply triggering the class on that)
