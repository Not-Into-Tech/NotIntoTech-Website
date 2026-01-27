const express = require('express');
const router = express.Router();
const Article = require('../model/article-model');
const {isAdmin} = require('../middleware/authMiddleware');
const sanitizeArticle = require('../middleware/sanitizeArticle');
const { 
  validateArticleCreate, 
  validateArticleUpdate, 
  handleValidationErrors 
} = require('../middleware/validateArticle');

// ============================================
// PUBLIC API ROUTES (Read-only)
// ============================================

/**
 * GET /api/articles
 * Fetch all published articles with pagination
 */
router.get('/api/articles', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const articles = await Article.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('title slug excerpt category tags createdAt publishedAt author views featuredImage');

    const total = await Article.countDocuments({ status: 'published' });

    res.json({
      success: true,
      data: articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch articles' });
  }
});

/**
 * GET /api/articles/:slug
 * Fetch single article by slug
 */
router.get('/api/articles/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
      status: 'published',
    });

    if (!article) {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }

    // Increment views
    article.views = (article.views || 0) + 1;
    await article.save();

    res.json({ success: true, data: article });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch article' });
  }
});

/**
 * GET /api/articles/category/:category
 * Fetch articles by category
 */
router.get('/api/articles/category/:category', async (req, res) => {
  try {
    const articles = await Article.find({
      category: req.params.category,
      status: 'published',
    })
      .sort({ publishedAt: -1 })
      .select('title slug excerpt category publishedAt author views');

    res.json({ success: true, data: articles });
  } catch (error) {
    console.error('Error fetching articles by category:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch articles' });
  }
});

// ============================================
// ADMIN API ROUTES (CRUD) - Protected by auth
// ============================================

/**
 * POST /api/articles
 * Create new article (ADMIN)
 * Header: Authorization: Bearer {ADMIN_TOKEN}
 */
router.post(
  '/api/articles',
  isAdmin,
  validateArticleCreate,
  handleValidationErrors,
  sanitizeArticle,
  async (req, res) => {
    try {
      const { title, content, category, excerpt, tags, author, visualizations, seoMetaDescription, seoKeywords, featuredImage } = req.body;

      // Auto-generate slug
      const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 100);

      // Check slug uniqueness
      const existingArticle = await Article.findOne({ slug });
      if (existingArticle) {
        return res.status(400).json({ 
          success: false, 
          error: 'An article with this title already exists' 
        });
      }

      const article = new Article({
        title,
        slug,
        content,
        excerpt: excerpt || content.substring(0, 150),
        category: category || 'Other',
        tags: tags || [],
        author: author || 'NITE Team',
        visualizations: visualizations || [],
        seoMetaDescription: seoMetaDescription || excerpt || content.substring(0, 160),
        seoKeywords: seoKeywords || [],
        featuredImage: featuredImage || null,
        status: 'draft',
      });

      await article.save();

      res.status(201).json({ 
        success: true, 
        message: 'Article created successfully',
        data: article 
      });
    } catch (error) {
      console.error('Error creating article:', error);
      res.status(500).json({ success: false, error: 'Failed to create article' });
    }
  }
);

/**
 * GET /api/articles-admin/all
 * Fetch all articles (published + drafts) - ADMIN ONLY
 */
router.get('/api/articles-admin/all', isAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const skip = (page - 1) * limit;

    const filter = status ? { status } : {};

    const articles = await Article.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Article.countDocuments(filter);

    res.json({
      success: true,
      data: articles,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Error fetching admin articles:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch articles' });
  }
});

/**
 * PUT /api/articles/:id
 * Update article (ADMIN)
 */
router.put(
  '/api/articles/:id',
  isAdmin,
  validateArticleUpdate,
  handleValidationErrors,
  sanitizeArticle,
  async (req, res) => {
    try {
      const updates = { ...req.body };
      delete updates.status; // Prevent status change via PUT

      const article = await Article.findByIdAndUpdate(
        req.params.id,
        { ...updates, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!article) {
        return res.status(404).json({ success: false, error: 'Article not found' });
      }

      res.json({ 
        success: true, 
        message: 'Article updated successfully',
        data: article 
      });
    } catch (error) {
      console.error('Error updating article:', error);
      res.status(500).json({ success: false, error: 'Failed to update article' });
    }
  }
);

/**
 * POST /api/articles/:id/publish
 * Publish article (ADMIN)
 */
router.post('/api/articles/:id/publish', isAdmin, async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'published', 
        publishedAt: new Date(),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }

    res.json({ 
      success: true, 
      message: 'Article published successfully',
      data: article 
    });
  } catch (error) {
    console.error('Error publishing article:', error);
    res.status(500).json({ success: false, error: 'Failed to publish article' });
  }
});

/**
 * POST /api/articles/:id/unpublish
 * Unpublish article (ADMIN)
 */
router.post('/api/articles/:id/unpublish', isAdmin, async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'draft',
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }

    res.json({ 
      success: true, 
      message: 'Article unpublished successfully',
      data: article 
    });
  } catch (error) {
    console.error('Error unpublishing article:', error);
    res.status(500).json({ success: false, error: 'Failed to unpublish article' });
  }
});

/**
 * DELETE /api/articles/:id
 * Delete article (ADMIN)
 */
router.delete('/api/articles/:id', isAdmin, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }

    res.json({ 
      success: true, 
      message: 'Article deleted successfully',
      data: { deletedId: article._id }
    });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ success: false, error: 'Failed to delete article' });
  }
});

/**
 * POST /api/articles/:id/visualizations
 * Add visualization (ADMIN)
 */
router.post('/api/articles/:id/visualizations', isAdmin, async (req, res) => {
  try {
    const { vizId, type, tableauEmbedUrl, title, position, description } = req.body;

    // Validate required fields
    if (!vizId || !tableauEmbedUrl) {
      return res.status(400).json({ 
        success: false, 
        error: 'vizId and tableauEmbedUrl are required' 
      });
    }

    const article = await Article.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          visualizations: {
            id: vizId,
            type: type || 'tableau',
            tableauEmbedUrl,
            title: title || 'Visualization',
            position: position || 1,
            description: description || '',
          }
        },
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }

    res.json({ 
      success: true, 
      message: 'Visualization added successfully',
      data: article 
    });
  } catch (error) {
    console.error('Error adding visualization:', error);
    res.status(500).json({ success: false, error: 'Failed to add visualization' });
  }
});

/**
 * DELETE /api/articles/:id/visualizations/:vizId
 * Remove visualization (ADMIN)
 */
router.delete('/api/articles/:id/visualizations/:vizId', isAdmin, async (req, res) => {
  try {
    const { id, vizId } = req.params;

    const article = await Article.findByIdAndUpdate(
      id,
      {
        $pull: { visualizations: { id: vizId } },
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }

    res.json({ 
      success: true, 
      message: 'Visualization removed successfully',
      data: article 
    });
  } catch (error) {
    console.error('Error removing visualization:', error);
    res.status(500).json({ success: false, error: 'Failed to remove visualization' });
  }
});

module.exports = router;