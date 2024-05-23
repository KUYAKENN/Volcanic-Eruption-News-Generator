document.getElementById('eruption-form').addEventListener('submit', function(e) {
  e.preventDefault();
  //nag define ako ng cons na sya kukuha ng words from interface ppasok dito sa back
  const volcanoName = document.getElementById('volcano-name').value;
  const location = document.getElementById('location').value;
  const date = document.getElementById('date').value;
  const description = document.getElementById('description').value;
  
  //nag define dito ng data which magiging limitation papasok sa api na AI kung baga ito yung maga bigay ng limit nyo if ano yung gusto nyo ma output
  const data = {
    "contents": [
      {
        "parts": [
          {
            "text": `Generate an article about a volcanic eruption with the following details:\nVolcano Name: ${volcanoName}\nLocation: ${location}\nDate: ${date}\nDescription: ${description}\n\nPlease generate a well-structured article in paragraph form only, without asterisks, and with proper punctuation and grammar. The output should have the following structure:\n\n[Title]\n[Location and Date]\n\n[Article] Ensure that no asterisks are used in the article. make it atleast 400 up words`
          }
        ]
      }
    ]
  };
  
  const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'; //api keys to wag nyo ibigay kanino kasi account ko to huhu
  const apiKey = 'AIzaSyDcAhnT84DLBlxuWIFhWvath4DqsUAzI9E'; //ito reason bakit nakaka connect sa api ni gemini ai
  
  fetch(apiUrl + '?key=' + apiKey, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) //dito pinapasok yung mga data na tig input tas ibibigay papunta kay ai na naka json
  }) 
  .then(response => {
    if (!response.ok) {
      throw new Error('API request failed'); //if nag ka error example pag nag generate ka ito lumabas meaning may error sa pag fetch ng data
    }
    return response.json();
  })
  .then(result => { //ito na yung output pumasok sa for loop para mabigyan sya ng structure tulad sa alignment ng articles
    console.log(result); // Log the entire result to understand its structure
    if (result && result.candidates && result.candidates.length > 0) {
      const candidate = result.candidates[0];
      console.log(candidate); // Log the first candidate to see its structure
      
      if (candidate.content) {
        console.log(candidate.content); // Log the content object to see its structure
        
        // Log all keys and values of the content object
        for (const key in candidate.content) {
          console.log(`Key: ${key}, Value: ${candidate.content[key]}`);
        }

        // Check for text in the nested parts array
        if (candidate.content.parts && candidate.content.parts[0] && candidate.content.parts[0].text) {
          let articleContent = candidate.content.parts[0].text;

          // Remove asterisks from the article content
          articleContent = articleContent.replace(/\*\*/g, '');

          // Remove title and location/date part if present
          articleContent = articleContent.replace(/^\s*[\w\s,]+-\s*/, '');

          // Create the formatted output without title and location/date
          const generatedArticle = `
            ${articleContent}
          `;

          document.getElementById('generated-article').innerHTML = generatedArticle;
        } else {
          throw new Error('Unexpected content structure');
        }
      } else {
        throw new Error('Content property missing');
      }
    } else {
      throw new Error('Unexpected response structure');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('generated-article').innerHTML = 'An error occurred while generating the article.';
  });
});
