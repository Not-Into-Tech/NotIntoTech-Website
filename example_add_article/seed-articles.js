// to run this code: open terminal and type "node example_add_article/seed-articles.js"
require('dotenv').config();
const mongoose = require('mongoose');
const Article = require('./src/model/article-model');

const MONGODB_URI = process.env.MONGODB_URI;

// Sample articles with visualizations
const sampleArticles = [
  {
    title: 'AI & Machine Learning Trends 2025',
    slug: 'ai-machine-learning-trends-2025',
    content: `
      <h2>The AI Revolution Continues</h2>
      <p>Artificial Intelligence and Machine Learning have transformed industries in 2025. From healthcare to finance, AI applications are becoming mainstream.</p>
      
      <h3>Major Breakthroughs</h3>
      <ul>
        <li>Large Language Models reach new capabilities</li>
        <li>Generative AI adoption in enterprises accelerates</li>
        <li>AI ethics and regulation frameworks emerge</li>
        <li>Edge AI computation becomes practical</li>
      </ul>
      
      <h3>Industry Impact</h3>
      <p>The visualization below shows the distribution of AI investments across different sectors in 2025.</p>
    `,
    excerpt: 'Exploring AI and machine learning breakthroughs and industry trends for 2025',
    category: 'Technology',
    tags: ['AI', 'machine learning', 'technology', 'innovation'],
    author: 'John Chen',
    featuredImage: 'https://images.unsplash.com/photo-1677442d019cecf595a59103f9a5e6b85267db40?w=800',
    seoMetaDescription: 'AI and machine learning trends for 2025 with industry analysis',
    seoKeywords: ['artificial intelligence', 'machine learning', 'technology', 'AI trends'],
    status: 'published',
    publishedAt: new Date('2025-01-03'),
    visualizations: [
      {
        id: 'viz_ai_001',
        type: 'tableau',
        tableauEmbedUrl: 'https://public.tableau.com/views/WorldIndicators/GDPandPopulation',
        title: 'AI Investment by Sector 2025',
        position: 1,
        description: 'Distribution of venture capital and corporate investment in AI across different industries'
      }
    ]
  },
  {
    title: 'Digital Transformation in Finance',
    slug: 'digital-transformation-finance',
    content: `
      <h2>Finance Meets Innovation</h2>
      <p>The financial services industry is undergoing rapid digital transformation. Banks, fintech companies, and investment firms are adopting new technologies at unprecedented rates.</p>
      
      <h3>Key Transformations</h3>
      <ul>
        <li>Blockchain and cryptocurrency integration</li>
        <li>Robotic Process Automation (RPA) in operations</li>
        <li>AI-powered risk management systems</li>
        <li>Real-time payment systems</li>
      </ul>
      
      <p>See the detailed analysis of digital adoption rates and ROI metrics in the visualizations below.</p>
    `,
    excerpt: 'How digital transformation is reshaping the financial services industry',
    category: 'Business',
    tags: ['finance', 'digital transformation', 'technology', 'business'],
    author: 'Emily Rodriguez',
    featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    seoMetaDescription: 'Digital transformation trends in finance and banking sector analysis',
    seoKeywords: ['digital transformation', 'finance', 'fintech', 'blockchain'],
    status: 'published',
    publishedAt: new Date('2025-01-01'),
    visualizations: [
      {
        id: 'viz_finance_001',
        type: 'tableau',
        tableauEmbedUrl: 'https://public.tableau.com/views/COVID-19Dashboard/Dashboard1',
        title: 'Digital Adoption Rates in Financial Services',
        position: 1,
        description: 'Percentage of financial institutions adopting key digital technologies'
      }
    ]
  }
];

// Seed the database with sample articles
async function seedDatabase() {
  try {
    console.log('Starting database seed...');
    console.log(` Connecting to MongoDB: ${MONGODB_URI.substring(0, 50)}...`);

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      dbName: 'notintotech-website'
    });

    console.log('Connected to MongoDB');

    // Optional: Clear existing articles (comment out if you want to keep existing data)
    // const deleteCount = await Article.deleteMany({});
    // console.log(`Deleted ${deleteCount.deletedCount} existing articles`);

    // Insert sample articles
    const result = await Article.insertMany(sampleArticles);
    console.log(`Successfully created ${result.length} sample articles:`);

    result.forEach((article, index) => {
      console.log(`\n  ${index + 1}. "${article.title}"`);
      console.log(`     Slug: ${article.slug}`);
      console.log(`     Category: ${article.category}`);
      console.log(`     Visualizations: ${article.visualizations.length}`);
      console.log(`     View at: http://(IP/Port/URL)/articles/${article.slug}`);
    });

    console.log('\nDatabase seed completed successfully!');
    console.log('\nNext steps:');
    console.log('   1. Start your server: npm run dev');
    console.log('   2. Visit: http://(IP/Port/URL)/articles');
    console.log('   3. Click any article to view details and visualizations');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
}

// Run seed
seedDatabase();