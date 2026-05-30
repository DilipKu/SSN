import { supabase } from '@/src/lib/supabase';

const CATEGORIES = [
  { name: 'Saree', slug: 'saree' },
  { name: 'Lehenga', slug: 'lehenga' },
  { name: 'Gown', slug: 'gown' },
  { name: 'Kurti Set', slug: 'kurti-set' },
  { name: 'Dupatta', slug: 'dupatta' },
  { name: 'Accessories', slug: 'accessories' },
];

const OCCASIONS = [
  { name: 'Wedding', slug: 'wedding', image_url: 'https://images.pexels.com/photos/30215055/pexels-photo-30215055.jpeg' },
  { name: 'Reception', slug: 'reception', image_url: 'https://images.pexels.com/photos/32293226/pexels-photo-32293226.jpeg' },
  { name: 'Engagement', slug: 'engagement', image_url: 'https://images.pexels.com/photos/14072957/pexels-photo-14072957.jpeg' },
  { name: 'Haldi', slug: 'haldi', image_url: 'https://images.pexels.com/photos/30672290/pexels-photo-30672290.jpeg' },
  { name: 'Mehendi', slug: 'mehendi', image_url: 'https://images.pexels.com/photos/28120522/pexels-photo-28120522.jpeg' },
  { name: 'Sangeet', slug: 'sangeet', image_url: 'https://images.pexels.com/photos/18180650/pexels-photo-18180650.jpeg' },
  { name: 'Party', slug: 'party', image_url: 'https://images.pexels.com/photos/20349697/pexels-photo-20349697.jpeg' },
  { name: 'Festive', slug: 'festive', image_url: 'https://images.pexels.com/photos/18118330/pexels-photo-18118330.jpeg' },
  { name: 'Gala', slug: 'gala', image_url: 'https://images.pexels.com/photos/7149136/pexels-photo-7149136.jpeg' },
];

export async function seedMasterData() {
  console.log('Seeding master data...');
  const errors: any[] = [];

  try {
    // 1. Seed Categories
    console.log('Seeding categories...');
    for (const cat of CATEGORIES) {
      const { error } = await supabase
        .from('categories')
        .upsert(cat, { onConflict: 'name' });
      
      if (error) {
        console.error(`Error seeding category ${cat.name}:`, error);
        errors.push({ type: 'category', name: cat.name, error });
      }
    }

    // 2. Seed Occasions
    console.log('Seeding occasions...');
    for (const occ of OCCASIONS) {
      const { error } = await supabase
        .from('occasions')
        .upsert(occ, { onConflict: 'name' });
      
      if (error) {
        console.error(`Error seeding occasion ${occ.name}:`, error);
        errors.push({ type: 'occasion', name: occ.name, error });
      }
    }

    if (errors.length > 0) {
      return { 
        success: false, 
        error: new Error(`Failed to seed ${errors.length} items. Check console for details.`),
        details: errors 
      };
    }

    console.log('Master data seeding complete!');
    return { success: true };
  } catch (err) {
    console.error('Seeding failed:', err);
    return { success: false, error: err };
  }
}
