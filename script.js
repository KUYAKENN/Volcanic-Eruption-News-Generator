document.getElementById('eruption-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const requiredFields = [
    'volcano-name',
    'date-issued',
    'other-activities'
  ];

  const optionalFields = [
    'time-issued',
    'avg-sulfur-dioxide',
    'date-emission-measure',
    'volcanic-earthquakes',
    'steam-activity',
    'alert-level',
    'recommended-actions',
    'source'
  ];

  const fieldValues = {};
  let isRequiredFieldEmpty = false;

  // Check required fields
  requiredFields.forEach(field => {
    const value = document.getElementById(field).value.trim();
    fieldValues[field] = value;
    if (!value) {
      isRequiredFieldEmpty = true;
    }
  });

  if (isRequiredFieldEmpty) {
    alert('Please fill out the required fields: Name of Volcano, Date Issued, and Other Volcanic Activities.');
    return;
  }

  // Collect optional fields
  optionalFields.forEach(field => {
    const value = document.getElementById(field).value.trim();
    fieldValues[field] = value;
  });

  const data = {
    "contents": [
      {
        "parts": [
          {
            "text": `Generate a news article with the following details:\n${
              fieldValues['date-issued'] ? `Date Issued: ${fieldValues['date-issued']}\n` : ''
            }${
              fieldValues['time-issued'] ? `Time Issued: ${fieldValues['time-issued']}\n` : ''
            }${
              fieldValues['volcano-name'] ? `Name of Volcano: ${fieldValues['volcano-name']}\n` : ''
            }${
              fieldValues['avg-sulfur-dioxide'] ? `Average Sulfur Dioxide: ${fieldValues['avg-sulfur-dioxide']} tons\n` : ''
            }${
              fieldValues['date-emission-measure'] ? `Date Emission Measure: ${fieldValues['date-emission-measure']}\n` : ''
            }${
              fieldValues['volcanic-earthquakes'] ? `Volcanic Earthquakes Recorded: ${fieldValues['volcanic-earthquakes']}\n` : ''
            }${
              fieldValues['steam-activity'] ? `Steamed Activity: ${fieldValues['steam-activity']}\n` : ''
            }${
              fieldValues['alert-level'] ? `Alert Level: ${fieldValues['alert-level']}\n` : ''
            }${
              fieldValues['other-activities'] ? `Other Volcanic Activities: ${fieldValues['other-activities']}\n` : ''
            }${
              fieldValues['recommended-actions'] ? `Recommended Actions: ${fieldValues['recommended-actions']}\n` : ''
            }${
              fieldValues['source'] ? `Source: ${fieldValues['source']}\n` : ''
            }\nPlease generate a well-structured article in paragraph form only, without asterisks, and with proper punctuation and grammar. The output should have the following structure:\n\n[Title]\n[Location and Date]\n\n[Article]\n\nEnsure that no asterisks are used in the article.`
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