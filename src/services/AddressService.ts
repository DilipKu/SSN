import { supabase } from '@/src/lib/supabase';
import { Address } from '@/src/types';

export const AddressService = {
  async getAddresses(userId: string) {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });

    if (error) throw error;
    return data;
  },

  async addAddress(userId: string, address: Omit<Address, 'id'>) {
    // If setting as default, unset others first
    if (address.is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId);
    }

    const { data, error } = await supabase
      .from('addresses')
      .insert({ ...address, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateAddress(userId: string, addressId: string, address: Partial<Address>) {
    // If setting as default, unset others first
    if (address.is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId);
    }

    const { error } = await supabase
      .from('addresses')
      .update(address)
      .eq('id', addressId);

    if (error) throw error;
  },

  async deleteAddress(addressId: string) {
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', addressId);

    if (error) throw error;
  }
};
