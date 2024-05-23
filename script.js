document.getElementById('eruption-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const dateIssued = document.getElementById('date-issued').value;
  const timeIssued = document.getElementById('time-issued').value;
  const volcanoName = document.getElementById('volcano-name').value;
  const avgSulfurDioxide = document.getElementById('avg-sulfur-dioxide').value;
  const dateEmissionMeasure = document.getElementById('date-emission-measure').value;
  const volcanicEarthquakes = document.getElementById('volcanic-earthquakes').value;
  const steamActivity = document.getElementById('steam-activity').value;
  const alertLevel = document.getElementById('alert-level').value;
  const otherActivities = document.getElementById('other-activities').value;
  const recommendedActions = document.getElementById('recommended-actions').value;
  const source = document.getElementById('source').value;
  
  const data = {
    "contents": [
      {
        "parts": [
          {
            "text": `Generate a news article with the following details:\nDate Issued: ${dateIssued}\nTime Issued: ${timeIssued}\nName of Volcano: ${volcanoName}\nAverage Sulfur Dioxide: ${avgSulfurDioxide} tons\nDate Emission Measure: ${dateEmissionMeasure}\nVolcanic Earthquakes Recorded: ${volcanicEarthquakes}\nSteamed Activity: ${steamActivity}\nAlert Level: ${alertLevel}\nOther Volcanic Activities: ${otherActivities}\nRecommended Actions: ${recommendedActions}\nSource: ${source}\n\nPlease generate a well-structured article in paragraph form only, without asterisks, and with proper punctuation and grammar. The output should have the following structure:\n\n[Title]\n[Location and Date]\n\n[Article]\n\nEnsure that no asterisks are used in the article.`
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
