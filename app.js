// const stockList = [ 'INTC' ]
const stocksList = [ 'INTC', 'AMD', 'MSI', 'NVDA', 'MSFT' ]

const stockInfo = function () {

  // Grab the stock symbol from the button clicked and add it to the queryURL
  const stock = $(this).attr('data-name');
  const queryURL = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,logo,news&range=1m&last=10&filter=symbol,companyName,latestPrice,headline,summary,source,url`;

  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function(result) {
console.log(result);

    // Creating a div to hold the stock
    const stockDiv = $('<div>').addClass('stock');

    // Storing the company name
    const companyName = result.quote.companyName;

    // Creating an element to display the company name
    const nameContainer = $('<h2>').text(`${companyName}`);

    // Appending the name to our stockDiv
    stockDiv.append(nameContainer);

    // Storing the company image
    const companyImage = result.logo.url;

    // Creating an element to display the company name
    const imageContainer = $(`<img>`);
    imageContainer.attr("src", companyImage);
    stockDiv.append(imageContainer);

    // Storing the stock symbol
    const stockSymbol = result.quote.symbol;

    // Creating an element to display the stock symbol
    const symbolContainer = $('<p>').text(`Stock Symbol: ${stockSymbol}`);

    // Appending the symbol to our stockDiv
    stockDiv.append(symbolContainer);

    // Storing the price
    const stockPrice = result.quote.latestPrice;

  // Creating an element to display the price
    const priceContainer = $('<p>').text(`Stock Price: $${stockPrice}`);

    // Appending the price to the stockDiv
    stockDiv.append(priceContainer);

    // Storing the first 10 news summaries
    const sliceArray = result.news.slice( 0 , 10);
    console.log(sliceArray);

    const companyArticles = $('<div>');

// loop through the shortened array and call the buildArticle function to add article info
sliceArray.forEach(function(element){
  companyArticles.append(buildArticle(element));
})

    // Appending the summary to the stockDiv

    stockDiv.append(companyArticles);

    // adding the stockDiv to the DOM
    $('#stocks-view').prepend(stockDiv);
  })
};

const buildArticle = function(element) {

  const articleLink = $('<a>')
  .attr('href', element.url)
  .attr('target', '_blank');


  // If the article has a headline, append to articleLink
  const headline = element.headline;

  if (headline) {
    articleLink.append($('<h4>').text(headline));
  }

  // If the article has a source, append to articleLink
  const source = element.source;

  if (source) {
    articleLink.append($('<h5>').text(source));
  }

  // If the article has a summary, append to articleLink
  const summary = element.summary;

  if (summary) {
    articleLink.append($('<p>').text(element.summary));
  }

  const articleListItem = $('<li>')
  articleListItem.append(articleLink)

  return articleListItem;
}



// Function for displaying stock data
const render = function () {

  // Deleting the stocks prior to adding new stocks
  // (this is necessary otherwise you will have repeat buttons)
  $('#btn-view').empty();

  // Looping through the array of stocks
  for (let i = 0; i < stocksList.length; i++) {

    // Then dynamicaly generating buttons for each stock in the array
    // This code $('<button>') is all jQuery needs to create the beginning and end tag. (<button></button>)
    const newButton = $('<button class="btn btn-outline-light nav-item nav-link">');

    // Adding a class of stock-btn to our button
    newButton.addClass('stock-btn');

    // Adding a data-attribute
    newButton.attr('data-name', stocksList[i]);

    // Providing the initial button text
    newButton.text(stocksList[i]);

    // Adding the button to the buttons-view div
    $('#btn-view').append(newButton);
  }
}

const getStockSymbols = function (event) {

    // event.preventDefault() prevents the form from trying to submit itself.
    // We're using a form so that the user can hit enter instead of clicking the button if they want

  event.preventDefault();

  // This line will grab the text from the input box
  const stock = $('#stock-input').val().trim();

// This line converts the text to uppercase
  const upper = stock.toUpperCase();

// This line defines a variable for the queryURL
  const queryURL = `https://api.iextrading.com/1.0/ref-data/symbols`

  // This makes an api call to get the symbols
  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function(result) {
    result.forEach(function(element){

  // if the value entered matches a symbol from the api call then add it to the stocklist else clear the input and do nothing
      if (upper === element.symbol) {
        stocksList.push(upper);

        // calling render which handles the processing of the stock array
        render();
        return;
      } else {
        // Deletes the contents of the input
        $('#stock-input').val('');
       }

      });
  })
};

// Even listener for #add-stock button
$('#add-stock').on('click', getStockSymbols);

// Adding a click event listener to all elements with a class of 'stock-btn'
$('#btn-view').on('click', '.stock-btn', stockInfo);

// Calling the renderButtons function to display the intial buttons
render();
