const express = require('express');
const router = express.Router();
const supabase = require('../database/supabaseClient');

// Standardized select query with aliases to maintain EJS compatibility
const ARTICLE_SELECT = 'id, title, slug, content, excerpt, category, tags, author, featuredImage:featured_image, seoMetaDescription:seo_meta_description, seoKeywords:seo_keywords, status, tableauUrl:tableau_url, views, publishedAt:published_at, createdAt:created_at, updatedAt:updated_at';

// Display articles list page
router.get('/insights', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const skip = (page - 1) * limit;

    const { count, error: countError } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    if (countError) throw countError;

    const { data: articles, error } = await supabase
      .from('articles')
      .select(ARTICLE_SELECT)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .order('created_at', { ascending: false })
      .range(skip, skip + limit - 1);

    if (error) throw error;

    res.render('page-insights', {
      articles: articles || [],
      pagination: {
        page,
        pages: Math.ceil((count || 0) / limit),
        total: count || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching insights list:', error);
    res.render('page-insights', {
      articles: [],
      pagination: { page: 1, pages: 0, total: 0 },
    });
  }
});

// Display single article
router.get('/insights/:slug', async (req, res) => {
  try {
    const { data: article, error } = await supabase
      .from('articles')
      .select(ARTICLE_SELECT)
      .eq('slug', req.params.slug)
      .eq('status', 'published')
      .single();

    if (error || !article) {
      return res.status(404).render('error', {
        error: 'Article not found',
        message: 'The article you\'re looking for doesn\'t exist.'
      });
    }

    // Increment views
    const newViews = (article.views || 0) + 1;
    await supabase
      .from('articles')
      .update({ views: newViews })
      .eq('id', article.id);
    
    article.views = newViews;

    res.render('insights-detail', { article });
  } catch (error) {
    console.error('Error fetching insight single:', error);
    res.status(500).render('error', {
      error: 'Failed to load article',
      message: error.message
    });
  }
});

module.exports = router;