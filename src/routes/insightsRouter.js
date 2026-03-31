const express = require('express');
const router = express.Router();
const Article = require('../model/article-model');

// Display articles list page
router.get('/insights', (req, res) => {
  res.render('page-insights');
});

// Display single article
router.get('/insights/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
      status: 'published',
    });

    if (!article) {
      return res.status(404).render('error', { 
        error: 'Article not found',
        message: 'The article you\'re looking for doesn\'t exist.' 
      });
    }

    // Increment views
    article.views = (article.views || 0) + 1;
    await article.save();

    res.render('insights-detail', { article });
  } catch (error) {
    res.status(500).render('error', { 
      error: 'Failed to load article',
      message: error.message 
    });
  }
});

module.exports = router;