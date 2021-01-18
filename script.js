// ONE WAY TO GET DATA FROM AN API

// let apiQuotes = [];

// // Show New Quote
// function newQuote(){
//     // pick a random quote from apiQuotes array
//     const quote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)];
//     console.log(quote);
// }


// // Get Quotes from API
// async function getQuotes(){
//     const apiUrl = 'https://type.fit/api/quotes';
//     try {
//         const response = await fetch(apiUrl);
//         apiQuotes = await response.json();
//         newQuote();
//     } catch(error){
//         console.log('whoops! no quote!', error);
//     }
// }

// THE OTHER METHOD, USING FORISMATIC ( A WEBSITE FOR QUOTES) API , call proxy api first, then forismatic api 

const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');

// Show loading spinner
function showLoadSpin(){
    loader.hidden = false;
    quoteContainer.hidden = true;
}

// Hide loading spinner
function removeLoadSpin(){
    if(!loader.hidden){
        quoteContainer.hidden = false;
        loader.hidden = true;
    }
}

// Get quote from API
async function getQuotes(){
    showLoadSpin();
    // We need to use a Proxy url to make our api call in order to avoid CORS issue
    const apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
    const proxyUrl = 'https://warm-river-40639.herokuapp.com/'
    try {
        const response = await fetch(proxyUrl + apiUrl);
        const data = await response.json();
        if (data.quoteAuthor === '') { // if author is blank, add unknown
            authorText.innerText = 'Unknown';
        } else {
            authorText.innerText = data.quoteAuthor;
        }
        // dynamically reduce font size for long quotes
        if (data.quoteText.length > 120){
            quoteText.classList.add('long-quote'); // css manipulation
        } else {
            quoteText.classList.remove('long-quote');
        }
        quoteText.innerText = data.quoteText;
        // Stop loader, show the quote
        removeLoadSpin();
    } catch(error){
        getQuotes();

    }
}

// Tweet quote
function tweetQuote(){
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}` ;
    window.open(twitterUrl, '_blank');
}

// Event Listeners
newQuoteBtn.addEventListener('click', getQuotes);
twitterBtn.addEventListener('click', tweetQuote);
// On Load
getQuotes();
