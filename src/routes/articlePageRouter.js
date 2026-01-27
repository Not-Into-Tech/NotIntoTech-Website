const express = require('express');
const router = express.Router();
const Article = require('../model/article-model');

// Display articles list page
router.get('/articles', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 9;
    const skip = (page - 1) * limit;

    const articles = await Article.find({status: 'published'})
      .sort({publishedAt: -1})
      .skip(skip)
      .limit(limit);

    const total = await Article.countDocuments({ status: 'published' });

    res.render('page-articles', {
      articles,
      pagination: {
        page: parseInt(page),
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).render('error', { 
      error: 'Failed to load articles',
      message: error.message 
    });
  }
});

// Display single article
router.get('/articles/:slug', async (req, res) => {
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

    res.render('article-detail', { article });
  } catch (error) {
    res.status(500).render('error', { 
      error: 'Failed to load article',
      message: error.message 
    });
  }
});

module.exports = router;