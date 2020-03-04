import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import DeliveryProblem from '../models/DeliveryProblem';
import DeliveryProblem from '../models/DeliveryProblem';
import Recipient from '../models/Recipient';

class DeliveryProblemController {
  async store(req, res) {
    const { delivery_id } = req.params;

    const delivery = await Delivery.findByPk(delivery_id);
    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    if (delivery.canceled_at) {
      return res.status(400).json({ error: 'Delivery is canceled' });
    }

    const { description } = req.body;
    const problem = await DeliveryProblem.create({
      delivery_id,
      description,
    });

    return res.status(201).json(problem);
  }

  async index(req, res) {

    const { page = 1 } = req.query;

    const problems = await DeliveryProblem.findAll({

      limit: 10,
      offset: (page - 1) * 10,

      attributes: ['id', 'description'],
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: ['product', 'start_date', 'end_date', 'canceled_at'],
          include: [
            {
              model: Recipient,
              as: 'recipient',
              attributes: [
                'name',
                'street',
                'number',
                'postal_code',
                'compliment',
                'state',
                'city',
              ],
            },
            {
              model: Deliveryman,
              as: 'deliveryman',
              attributes: ['name', 'email'],
            },
          ],
        },
      ],
    });

    return res.status(200).json(problems);
  }
  async delete(req, res) {
      const { id } = req.params;

      const { delivery_id } = await DeliveryProblem.findById(id);

      const delivery = await Delivery.findByPk(delivery_id, {
        include: [
          {
            model: Deliveryman,
            as: 'deliveryman',
            attributes: ['id', 'name', 'email'],
          },
          {
            model: Recipient,
            as: 'recipient',
          },
        ],
      });

      await delivery.update({ canceled_at: new Date(), status: 'CANCELADA' });
      await DeliveryProblem.findByIdAndDelete(id);

      return res.json({});
    }


}

export default new DeliveryProblemController();
