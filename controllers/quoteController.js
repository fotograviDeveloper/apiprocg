// controllers/quoteController.js
const { Quote, QuoteItem, Product } = require('../models');

const quoteController = {
  async createQuote(req, res) {
    try {
      const { client_name, client_email, client_phone, items, subtotal, tax, discount, total } = req.body;
      const userId = req.user.id;

      const quote = await Quote.create({
        client_name,
        client_email,
        client_phone,
        subtotal,
        tax,
        discount,
        total,
        user_id: userId,
      });

      for (const item of items) {
        await QuoteItem.create({
          quote_id: quote.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          discount: item.discount || 0,
          total_price: item.total_price,
        });
      }

      res.status(201).json({ message: 'Cotización creada', quote });
    } catch (error) {
      console.error('Error al crear cotización:', error);
      res.status(500).json({ error: 'Error al crear cotización' });
    }
  },

  async getAllQuotes(req, res) {
    try {
      const quotes = await Quote.findAll({
        include: [QuoteItem],
        order: [['created_at', 'DESC']],
      });
      res.json(quotes);
    } catch (error) {
      console.error('Error al obtener cotizaciones:', error);
      res.status(500).json({ error: 'Error al obtener cotizaciones' });
    }
  },

  async getQuoteById(req, res) {
    try {
      const { id } = req.params;
      const quote = await Quote.findByPk(id, {
        include: [QuoteItem],
      });

      if (!quote) return res.status(404).json({ error: 'Cotización no encontrada' });

      res.json(quote);
    } catch (error) {
      console.error('Error al obtener cotización:', error);
      res.status(500).json({ error: 'Error al obtener cotización' });
    }
  },

  async updateQuoteStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const quote = await Quote.findByPk(id);
      if (!quote) return res.status(404).json({ error: 'Cotización no encontrada' });

      quote.status = status;
      await quote.save();

      res.json({ message: 'Estado de cotización actualizado', quote });
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      res.status(500).json({ error: 'Error al actualizar estado' });
    }
  },

  async deleteQuote(req, res) {
    try {
      const { id } = req.params;

      const quote = await Quote.findByPk(id);
      if (!quote) return res.status(404).json({ error: 'Cotización no encontrada' });

      await QuoteItem.destroy({ where: { quote_id: id } });
      await quote.destroy();

      res.json({ message: 'Cotización eliminada' });
    } catch (error) {
      console.error('Error al eliminar cotización:', error);
      res.status(500).json({ error: 'Error al eliminar cotización' });
    }
  },
};

module.exports = quoteController;
