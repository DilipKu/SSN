import { supabase } from '@/src/lib/supabase';
import { Product, Category, Occasion, WeddingRole } from '@/src/types';

export const ProductService = {
  // 1. Fetch all products with optional filters
  async getProducts(filters?: {
    category?: string;
    occasion?: string;
    role?: string;
    search?: string;
    priceRange?: [number, number];
    isBestSeller?: boolean;
    isNewArrival?: boolean;
  }) {
    let selectString = `
        *,
        category:categories${filters?.category && filters.category !== 'all' ? '!inner' : ''}(name, slug),
        images:product_images(url, display_order),
        occasions:product_occasions(occasion:occasions(name)),
        roles:product_wedding_roles(role:wedding_roles(name))
    `;

    let query = supabase.from('products').select(selectString);

    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category.slug', filters.category.toLowerCase());
    }

    if (filters?.isBestSeller) {
      query = query.eq('is_best_seller', true);
    }

    if (filters?.isNewArrival) {
      query = query.eq('is_new_arrival', true);
    }

    if (filters?.priceRange) {
      query = query.gte('price', filters.priceRange[0]).lte('price', filters.priceRange[1]);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    
    let transformed = this.transformProducts(data);

    // Apply Intersection Filtering (AND) for Styling Experience - products matching BOTH occasion AND role
    if (filters?.occasion && filters?.role) {
      transformed = transformed.filter(product => {
        const matchesOccasion = product.occasion.includes(filters.occasion as any);
        const matchesRole = product.weddingRoles && product.weddingRoles.includes(filters.role as any);
        return matchesOccasion && matchesRole; // AND logic - requires both to match
      });
    }

    return transformed;
  },

  // 2. Fetch single product by slug or id
  async getProduct(identifier: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(name),
        images:product_images(url, display_order),
        occasions:product_occasions(occasion:occasions(name)),
        roles:product_wedding_roles(role:wedding_roles(name))
      `)
      .or(`id.eq.${identifier},slug.eq.${identifier}`)
      .single();

    if (error) throw error;
    return this.transformProduct(data);
  },

  // 3. Fetch all categories
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  },

  // 4. Fetch all occasions
  async getOccasions() {
    const { data, error } = await supabase
      .from('occasions')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  },

  // 5. Fetch all wedding roles
  async getWeddingRoles() {
    const { data, error } = await supabase
      .from('wedding_roles')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  },

  // Helper: Transform Supabase response to frontend Product type
  transformProduct(item: any): Product {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: Number(item.price),
      originalPrice: item.original_price ? Number(item.original_price) : undefined,
      category: item.category?.name || 'Uncategorized',
      occasion: item.occasions?.map((o: any) => o.occasion.name) || [],
      weddingRoles: item.roles?.map((r: any) => r.role.name) || [],
      images: item.images?.sort((a: any, b: any) => a.display_order - b.display_order).map((img: any) => img.url) || [],
      sizes: item.sizes || ['Free Size'],
      colors: item.colors || [],
      fabric: item.fabric || 'Unknown',
      craftsmanship: item.craftsmanship,
      stock: Number(item.stock || 0),
      isBestSeller: item.is_best_seller,
      isNewArrival: item.is_new_arrival,
      rating: Number(item.rating),
      reviewsCount: item.reviews_count,
      story: item.story || '',
      stylingTips: item.styling_tips || [],
    };
  },

  transformProducts(items: any[]): Product[] {
    return items.map(item => this.transformProduct(item));
  }
};
