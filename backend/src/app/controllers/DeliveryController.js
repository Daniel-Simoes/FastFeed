import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import DeliveryMan from '../models/Deliveryman';


class DeliveryController {
  async store(req, res) {
    const { product, recipient_id, deliveryman_id } = req.body;

    const {
      id,

    } = await Delivery.create({
      product,
      recipient_id,
      deliveryman_id,
      status: 'PENDENTE',
    });

    return res.json({
      id,
      product,
      recipient_id,
      deliveryman_id,
    });
}

async index(req, res) {
  const { q: productName, page = 1 } = req.query;

  const deliveries = productName
    ? await Delivery.findAll({

        order: ['id'],
        attributes: [
          'id',
          'product',
          'status',
          'start_date',
          'canceled_at',
          'end_date',
        ],
        include: [
          {
            model: DeliveryMan,
            as: 'deliveryman',
            attributes: ['name', 'email'],
          },
          {
            model: Recipient,
            as: 'recipient',
            paranoid: false,
            attributes: [
              'id',
              'name',
              'street',
              'number',
              'compliment',
              'city',
              'state',
              'postal_code',
            ],
          },
        ],
      })
    : await Delivery.findAll({
        attributes: [
          'id',
          'product',
          'status',
          'start_date',
          'canceled_at',
          'end_date',
        ],
        order: ['id'],
        limit: 5,
        offset: (page - 1) * 5,
        include: [
          {
            model: DeliveryMan,
            as: 'deliveryman',
            attributes: ['name', 'email'],
          },
          {
            model: Recipient,
            as: 'recipient',
            attributes: [
              'name',
              'street',
              'number',
              'compliment',
              'state',
              'city',
              'postal_code',
            ],
          },
        ],
      });

  return res.json(deliveries);
  }

async update(req, res) {
  const { id } = req.params;

  const delivery = await Delivery.findByPk(id);
  if (!delivery) {
    return res.status(400).json({ error: 'Delivery not found' });
  }

  const { deliveryman_id, recipient_id } = req.body;

  if (deliveryman_id) {
    const deliveryman = await DeliveryMan.findByPk(deliveryman_id);
    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }
  }

  if (recipient_id) {
    const recipient = await Recipient.findByPk(recipient_id);
    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found' });
    }
  }

  const { canceled_at } = req.body;
  if (canceled_at) {
    return res.status(400).json({ error: 'Cancel date are not modifiable' });
  }

  await delivery.update(req.body);


  return res.json(delivery);
}

async delete(req, res) {
  const { id } = req.params;

  const delivery = await Delivery.findByPk(id, {
    attributes: ['id', 'product', 'start_date', 'canceled_at', 'end_date'],

  });
  if (!delivery) {
    return res.status(400).json({ error: 'Delivery not found' });
  }

  await delivery.destroy();

  return res.json({ ok: true });
}

}



export default new DeliveryController();
