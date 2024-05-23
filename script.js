document.getElementById('eruption-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const volcanoName = document.getElementById('volcano-name').value;
  const location = document.getElementById('location').value;
  const date = document.getElementById('date').value;
  const description = document.getElementById('description').value;
  
  const data = {
    "contents": [
      {
        "parts": [
          {
            "text": `Generate a news article about a volcanic eruption with the following details:\nVolcano Name: ${volcanoName}\nLocation: ${location}\nDate: ${date}\nDescription: ${description}`
          }
        ]
      }
    ]
  };
  
  const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  const apiKey = 'AIzaSyDcAhnT84DLBlxuWIFhWvath4DqsUAzI9E';
  
  fetch(apiUrl + '?key=' + apiKey, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('API request failed');
    }
    return response.json();
  })
  .then(result => {
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
          const generatedArticle = candidate.content.parts[0].text;
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
