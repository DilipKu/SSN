import { supabase } from '@/src/lib/supabase';
import { slugify } from '@/src/lib/utils';

export const AdminService = {
  // 1. Product Management
  async getAllProducts() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(name),
        images:product_images(url, display_order)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getProductById(productId: string) {
    return supabase
      .from('products')
      .select(`
        *,
        category:categories(name),
        images:product_images(id, url, display_order),
        product_occasions(occasion_id),
        product_wedding_roles(role_id)
      `)
      .eq('id', productId)
      .single();
  },

  async createProduct(productData: any, images: File[], occasions: string[], roles: string[]) {
    // 0. Ensure unique slug
    let baseSlug = productData.slug || slugify(productData.name);
    let uniqueSlug = baseSlug;
    let counter = 1;
    
    while (true) {
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('slug', uniqueSlug)
        .single();
      
      if (!existing) break;
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    productData.slug = uniqueSlug;

    // 1. Insert product
    const { data: product, error: pError } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (pError) throw pError;

    // 2. Upload images and link them
    if (images.length > 0) {
      await this.uploadProductImages(product.id, images);
    }

    // 3. Link occasions
    if (occasions.length > 0) {
      const occasionLinks = occasions.map(occId => ({
        product_id: product.id,
        occasion_id: occId
      }));
      const { error: oError } = await supabase.from('product_occasions').insert(occasionLinks);
      if (oError) throw oError;
    }

    // 4. Link roles
    if (roles && roles.length > 0) {
      const roleLinks = roles.map(roleId => ({
        product_id: product.id,
        role_id: roleId
      }));
      const { error: rError } = await supabase.from('product_wedding_roles').insert(roleLinks);
      if (rError) throw rError;
    }

    return product;
  },

  async updateProduct(productId: string, updates: any, newImages: File[], occasions: string[], roles: string[]) {
    // If slug is being updated, ensure it's unique
    if (updates.slug) {
      let baseSlug = updates.slug;
      let uniqueSlug = baseSlug;
      let counter = 1;
      
      while (true) {
        const { data: existing } = await supabase
          .from('products')
          .select('id')
          .eq('slug', uniqueSlug)
          .neq('id', productId)
          .single();
        
        if (!existing) break;
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      updates.slug = uniqueSlug;
    }

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select()
      .single();

    if (error) throw error;

    // Handle image updates (append new ones)
    if (newImages.length > 0) {
      await this.uploadProductImages(productId, newImages);
    }

    // Handle occasion updates (replace all)
    if (occasions) {
      const { error: dError } = await supabase.from('product_occasions').delete().eq('product_id', productId);
      if (dError) throw dError;

      if (occasions.length > 0) {
        const occasionLinks = occasions.map(occId => ({
          product_id: productId,
          occasion_id: occId
        }));
        const { error: iError } = await supabase.from('product_occasions').insert(occasionLinks);
        if (iError) throw iError;
      }
    }

    // Handle role updates (replace all)
    if (roles) {
      const { error: drError } = await supabase.from('product_wedding_roles').delete().eq('product_id', productId);
      if (drError) throw drError;

      if (roles.length > 0) {
        const roleLinks = roles.map(roleId => ({
          product_id: productId,
          role_id: roleId
        }));
        const { error: irError } = await supabase.from('product_wedding_roles').insert(roleLinks);
        if (irError) throw irError;
      }
    }

    return data;
  },

  async deleteProduct(productId: string) {
    // 1. Storage cleanup (optional but recommended)
    // For now, just delete the records (Cascade will handle product_images and product_occasions)
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) throw error;
  },

  // 2. Storage Management
  async uploadProductImages(productId: string, files: File[]) {
    const uploadPromises = files.map(async (file, index) => {
      const fileExt = file.name.split('.').pop();
      const colorTag = (file as any).colorTag;
      const colorSuffix = colorTag ? `_color_${encodeURIComponent(colorTag)}` : '';
      const fileName = `${productId}/${Date.now()}-${index}${colorSuffix}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      const { error: iError } = await supabase.from('product_images').insert({
        product_id: productId,
        url: publicUrl,
        display_order: index
      });
      if (iError) throw iError;
      return true;
    });

    return Promise.all(uploadPromises);
  },

  async deleteProductImage(imageId: string, filePath: string) {
    // 1. Delete from storage
    const { error: sError } = await supabase.storage
      .from('product-images')
      .remove([filePath]);
    
    if (sError) console.warn('Storage delete error:', sError);

    // 2. Delete from DB
    const { error: dError } = await supabase
      .from('product_images')
      .delete()
      .eq('id', imageId);

    if (dError) throw dError;
  },

  // 3. Category & Occasion Management
  async createCategory(categoryData: any) {
    // 0. Ensure unique slug
    let baseSlug = categoryData.slug || slugify(categoryData.name);
    let uniqueSlug = baseSlug;
    let counter = 1;
    
    while (true) {
      const { data: existing } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', uniqueSlug)
        .single();
      
      if (!existing) break;
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    categoryData.slug = uniqueSlug;

    const { data, error } = await supabase
      .from('categories')
      .insert(categoryData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateCategory(id: string, updates: any) {
    // If slug is being updated, ensure it's unique
    if (updates.slug) {
      let baseSlug = updates.slug;
      let uniqueSlug = baseSlug;
      let counter = 1;
      
      while (true) {
        const { data: existing } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', uniqueSlug)
          .neq('id', id)
          .single();
        
        if (!existing) break;
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      updates.slug = uniqueSlug;
    }

    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteCategory(id: string) {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
  },

  // 4. Order Management
  async getAllOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        profiles(display_name, email),
        items:order_items(
          *,
          product:products(name)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getOrderById(orderId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        profiles(display_name, email),
        items:order_items(
          *,
          product:products(name, images:product_images(url))
        )
      `)
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateOrderStatus(orderId: string, status: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) throw error;
    return data;
  },

  // 5. Occasion Management
  async getAllOccasions() {
    const { data, error } = await supabase
      .from('occasions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createOccasion(occasionData: any) {
    // 0. Ensure unique slug
    let baseSlug = occasionData.slug || slugify(occasionData.name);
    let uniqueSlug = baseSlug;
    let counter = 1;
    
    while (true) {
      const { data: existing } = await supabase
        .from('occasions')
        .select('id')
        .eq('slug', uniqueSlug)
        .single();
      
      if (!existing) break;
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    occasionData.slug = uniqueSlug;

    const { data, error } = await supabase
      .from('occasions')
      .insert({ ...occasionData, created_at: new Date().toISOString() })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateOccasion(id: string, updates: any) {
    // If slug is being updated, ensure it's unique
    if (updates.slug) {
      let baseSlug = updates.slug;
      let uniqueSlug = baseSlug;
      let counter = 1;
      
      while (true) {
        const { data: existing } = await supabase
          .from('occasions')
          .select('id')
          .eq('slug', uniqueSlug)
          .neq('id', id)
          .single();
        
        if (!existing) break;
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      updates.slug = uniqueSlug;
    }

    const { data, error } = await supabase
      .from('occasions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteOccasion(id: string) {
    const { error } = await supabase.from('occasions').delete().eq('id', id);
    if (error) throw error;
  },

  // 6. Generic Image Management
  async uploadImage(file: File, bucket: string = 'media') {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  },

  // 7. Profile/Customer Management
  async getRecentCustomers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;
    return data;
  },

  // 8. Analytics & Dashboard Stats
  async getDashboardStats(startDate?: string) {
    let ordersQuery = supabase.from('orders').select('total_amount');
    let customersQuery = supabase.from('profiles').select('*', { count: 'exact', head: true });

    if (startDate) {
      ordersQuery = ordersQuery.gte('created_at', startDate);
      customersQuery = customersQuery.gte('created_at', startDate);
    }

    const [
      { count: productsCount },
      { count: totalOrdersCount },
      { count: totalCustomersCount },
      { data: ordersData },
      { count: rangeCustomersCount }
    ] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      ordersQuery,
      customersQuery
    ]);

    const revenue = ordersData?.reduce((acc, order) => acc + (order.total_amount || 0), 0) || 0;
    const ordersCount = ordersData?.length || 0;

    return {
      revenue,
      orders: startDate ? ordersCount : (totalOrdersCount || 0),
      customers: startDate ? (rangeCustomersCount || 0) : (totalCustomersCount || 0),
      products: productsCount || 0
    };
  },

  async getCategoryDistribution() {
    const { data, error } = await supabase
      .from('products')
      .select('category:categories(name)');
    
    if (error) throw error;
    
    const distribution: { [key: string]: number } = {};
    data.forEach((item: any) => {
      const name = item.category?.name || 'Uncategorized';
      distribution[name] = (distribution[name] || 0) + 1;
    });
    
    const colors = ['#1A0505', '#D4AF37', '#8B0000', '#4A4A4A', '#C5A47E', '#722F37'];
    
    return Object.entries(distribution).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
  },

  async getSalesTrend(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('orders')
      .select('total_amount, created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    const trendMap: { [key: string]: { sales: number, orders: number } } = {};
    
    // Pre-fill days to avoid gaps
    for (let i = 0; i <= days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      trendMap[label] = { sales: 0, orders: 0 };
    }
    
    data.forEach((order: any) => {
      const label = new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      if (trendMap[label]) {
        trendMap[label].sales += Number(order.total_amount);
        trendMap[label].orders += 1;
      }
    });
    
    return Object.entries(trendMap)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => {
        // Sort by date properly since labels are strings
        const dateA = new Date(a.name + ' ' + new Date().getFullYear());
        const dateB = new Date(b.name + ' ' + new Date().getFullYear());
        return dateA.getTime() - dateB.getTime();
      });
  }
};
