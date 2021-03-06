function displayResults(articles) {
    // First, empty the table
    $("tbody").empty();
  
    // Then, for each entry of that json...
    articles.forEach(function(article) {
      // Append each of the animal's properties to the table
      var tr = $("<tr>").append(
        $("<td>").text(article.title),
        $("<td>").text(article.link),
        $("<td>").text(article.image),
        $("<td>").text(article.summary)
      );
  
      $("tbody").append(tr);
    });
  }


$.getJSON("/articles", function(articles) {
    // Call our function to generate a table body
    displayResults(articles);
  });