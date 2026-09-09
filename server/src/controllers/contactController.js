import { sendNotificationEmail } from '../services/emailService.js';
import { dbFetchAll, dbInsert, dbUpdate, dbDelete } from '../config/dbHelper.js';
import { isSupabaseConfigured } from '../config/supabase.js';

export const submitMessage = async (req, res, next) => {
  const { name, email, phone, subject, message } = req.body;

  try {
    if (!name || !email || !message) {
      res.status(400);
      throw new Error('Please fill in all required fields (Name, Email, Message)');
    }

    if (message.length < 10) {
      res.status(400);
      throw new Error('Message must be at least 10 characters long');
    }

    let savedMessage = null;

    if (isSupabaseConfigured()) {
      try {
        savedMessage = await dbInsert('contact_messages', {
          name,
          email,
          phone: phone || '',
          subject: subject || 'General Inquiry',
          message,
          status: 'New',
        });
      } catch (err) {
        console.warn('[Supabase Message Insert Warning]:', err.message);
      }
    }

    if (!savedMessage) {
      savedMessage = {
        _id: `msg_${Date.now()}`,
        name,
        email,
        phone: phone || '',
        subject: subject || 'General Inquiry',
        message,
        status: 'New',
        createdAt: new Date().toISOString(),
      };
    }

    const emailResult = await sendNotificationEmail({
      name,
      email,
      phone,
      subject: subject || 'General Inquiry',
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
      data: savedMessage,
      emailSent: emailResult.success,
    });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    if (isSupabaseConfigured()) {
      try {
        const messages = await dbFetchAll('contact_messages', { orderBy: 'created_at', ascending: false });
        if (messages) {
          return res.status(200).json({
            success: true,
            message: 'Messages fetched successfully from Supabase',
            data: messages,
          });
        }
      } catch (err) {
        console.warn('[Supabase Messages Get Error]:', err.message);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Messages fetched (empty/fallback)',
      data: [],
    });
  } catch (error) {
    next(error);
  }
};

export const updateMessageStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!status || !['New', 'Read', 'Replied', 'Archived'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status option');
    }

    if (isSupabaseConfigured()) {
      const updated = await dbUpdate('contact_messages', id, { status });
      return res.status(200).json({
        success: true,
        message: 'Message status updated successfully in Supabase',
        data: updated,
      });
    }

    res.status(400).json({
      success: false,
      message: 'Database not configured to update message',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured()) {
      await dbDelete('contact_messages', id);
      return res.status(200).json({
        success: true,
        message: 'Message deleted successfully from Supabase',
      });
    }

    res.status(400).json({
      success: false,
      message: 'Database not configured to delete message',
    });
  } catch (error) {
    next(error);
  }
};
