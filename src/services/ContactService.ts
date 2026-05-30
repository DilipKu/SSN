import { supabase } from '@/src/lib/supabase';

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status?: 'Pending' | 'In Progress' | 'Resolved' | 'Closed';
  priority?: 'Low' | 'Normal' | 'High' | 'Urgent';
  created_at?: string;
  updated_at?: string;
  admin_notes?: string;
}

export class ContactService {
  // Send a new contact message
  static async sendMessage(messageData: Omit<ContactMessage, 'id' | 'created_at' | 'updated_at'>): Promise<ContactMessage> {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([{
        ...messageData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message. Please try again.');
    }

    return data;
  }

  // Get all messages (for admin)
  static async getAllMessages(): Promise<ContactMessage[]> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error);
      throw new Error('Failed to fetch messages');
    }

    return data || [];
  }

  // Get message by ID
  static async getMessageById(id: string): Promise<ContactMessage | null> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching message:', error);
      return null;
    }

    return data;
  }

  // Update message status (for admin)
  static async updateMessageStatus(id: string, status: ContactMessage['status'], adminNotes?: string): Promise<ContactMessage> {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({
        status,
        admin_notes: adminNotes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating message:', error);
      throw new Error('Failed to update message');
    }

    return data;
  }

  // Update message priority (for admin)
  static async updateMessagePriority(id: string, priority: ContactMessage['priority']): Promise<ContactMessage> {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({
        priority,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating message priority:', error);
      throw new Error('Failed to update message priority');
    }

    return data;
  }

  // Delete message (for admin)
  static async deleteMessage(id: string): Promise<void> {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting message:', error);
      throw new Error('Failed to delete message');
    }
  }

  // Get messages by status (for admin filtering)
  static async getMessagesByStatus(status: ContactMessage['status']): Promise<ContactMessage[]> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching messages by status:', error);
      throw new Error('Failed to fetch messages');
    }

    return data || [];
  }

  // Get message statistics (for admin dashboard)
  static async getMessageStats(): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
    closed: number;
  }> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('status');

    if (error) {
      console.error('Error fetching message stats:', error);
      throw new Error('Failed to fetch message statistics');
    }

    const messages = data || [];
    return {
      total: messages.length,
      pending: messages.filter(m => m.status === 'Pending').length,
      inProgress: messages.filter(m => m.status === 'In Progress').length,
      resolved: messages.filter(m => m.status === 'Resolved').length,
      closed: messages.filter(m => m.status === 'Closed').length,
    };
  }
}
