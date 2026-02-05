const mongoose = require('mongoose');

// Schema for embedded Tableau visualizations within an article
const visualizationSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['tableau', 'chart.js', 'custom'],
    default: 'tableau',
  },
  tableauEmbedUrl: String,
  title: String,
  position: Number, // Order in article (1, 2, 3...)
  description: String, // Alt text/caption
}, { _id: false });

// Main Article Schema
const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      maxlength: 500,
    },
    category: {
      type: String,
      enum: ['Technology', 'Business', 'Political', 'Other'],
      default: 'Other',
    },
    tags: [String],
    author: {
      type: String,
      default: 'NITE Team',
    },
    featuredImage: String, // URL to featured image
    seoMetaDescription: {
      type: String,
      maxlength: 160,
    },
    seoKeywords: [String],
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    visualizations: [visualizationSchema],
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    publishedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
articleSchema.index({ slug: 1 }); // For finding by slug
articleSchema.index({ status: 1, publishedAt: -1 }); // For published articles sorted by date
articleSchema.index({ category: 1 }); // For filtering by category
articleSchema.index({ tags: 1 }); // For filtering by tags

module.exports = mongoose.model('Article', articleSchema);