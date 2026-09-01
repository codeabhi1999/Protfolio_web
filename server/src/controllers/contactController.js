import ContactMessage from '../models/ContactMessage.js';
import { sendNotificationEmail } from '../services/emailService.js';

// @desc    Submit a contact message (Public)
// @route   POST /api/contact
// @access  Public
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

    // Save message to MongoDB
    const contactMessage = await ContactMessage.create({
      name,
      email,
      phone,
      subject: subject || 'General Inquiry',
      message,
      status: 'New',
    });

    // Send email notification (async, non-blocking)
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
      data: contactMessage,
      emailSent: emailResult.success,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages (Protected)
// @route   GET /api/contact
// @access  Private
export const getMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: 'Messages fetched successfully',
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a message status (Protected)
// @route   PATCH /api/contact/:id
// @access  Private
export const updateMessageStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !['New', 'Read', 'Replied', 'Archived'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status option');
    }

    let message = await ContactMessage.findById(req.params.id);

    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }

    message.status = status;
    await message.save();

    res.status(200).json({
      success: true,
      message: 'Message status updated successfully',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a message (Protected)
// @route   DELETE /api/contact/:id
// @access  Private
export const deleteMessage = async (req, res, next) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
