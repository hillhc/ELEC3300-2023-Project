const express = require('express');
const axios = require('axios');
const app = express();
const fs = require('fs');
const NEWS_API_KEY = 'e5f19bf7a2e945aaba86f280b55351be';
const port = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  try {
    const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWS_API_KEY}`);
    const articles = [
      response.data.articles[0].title,
      response.data.articles[1].title,
    ];
    const data = {
      articles: [
        response.data.articles[0].title,
        response.data.articles[1].title,
      ]
    };
    fs.writeFile('data.json', JSON.stringify(data), err => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Unable to save news data' });
      } else {
        console.log('News data saved to file');
      }
    });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to retrieve news data' });
  }
});

app.get('/data', (req, res) => {
  try {
    console.log(req);
    const data = fs.readFileSync('data.json');
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to read news data' });
  }
});

app.listen(port, () => {
  console.log('Server running on port ' + port);
});