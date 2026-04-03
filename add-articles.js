// to run this code: open terminal and type "node add-articles.js"
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY; // Note: For seeding, ideally you use SERVICE_ROLE_KEY to bypass RLS, but ANON_KEY might work if RLS allows public insert (unlikely) or if you just use service key.

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase credentials in .env file!');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Sample articles directly mapping to the new Supabase schema
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
    featured_image: 'https://images.unsplash.com/photo-1677442d019cecf595a59103f9a5e6b85267db40?w=800',
    seo_meta_description: 'AI and machine learning trends for 2025 with industry analysis',
    seo_keywords: ['artificial intelligence', 'machine learning', 'technology', 'AI trends'],
    status: 'published',
    published_at: new Date('2025-01-03').toISOString(),
    tableau_url: 'https://public.tableau.com/views/WorldIndicators/GDPandPopulation'
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
    featured_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    seo_meta_description: 'Digital transformation trends in finance and banking sector analysis',
    seo_keywords: ['digital transformation', 'finance', 'fintech', 'blockchain'],
    status: 'published',
    published_at: new Date('2025-01-01').toISOString(),
    tableau_url: 'https://public.tableau.com/views/COVID-19Dashboard/Dashboard1'
  }
];

// Seed the database with sample articles
async function seedDatabase() {
  try {
    console.log('Starting database seed to Supabase...');
    console.log(`Connecting to Supabase: ${SUPABASE_URL.substring(0, 50)}...`);

    // Insert sample articles
    const { data: result, error } = await supabase
      .from('articles')
      .insert(sampleArticles)
      .select();

    if (error) {
      if (error.code === '42501') {
        throw new Error('RLS Policy blocked the insert.');
      }
      throw error;
    }

    console.log(`Successfully created ${result.length} sample articles!`);

    result.forEach((article, index) => {
      console.log(`\n  ${index + 1}. "${article.title}"`);
      console.log(`     Slug: ${article.slug}`);
      console.log(`     Category: ${article.category}`);
      console.log(`     Tableau URL Attached: ${article.tableau_url ? 'Yes' : 'No'}`);
      console.log(`     View at: http://localhost:3000/insights/${article.slug}`);
    });

    console.log('\nDatabase seed completed successfully!');
    console.log('\nNext steps:');
    console.log('   1. Start your server: npm run dev');
    console.log('   2. Visit: http://localhost:3000/insights');
    console.log('   3. Click any article to view details and visualizations');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:\n', error.message);
    process.exit(1);
  }
}

// Run seed
seedDatabase();