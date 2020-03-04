import { parseISO, getHours } from 'date-fns';

import Deliveryman from '../models/Deliveryman';
import Delivery from '../models/Delivery';


class WithdrawController {
  async update(req, res) {
    const { start_date } = req.body;
    const { id, delivery_id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id);
    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    const delivery = await Delivery.findByPk(delivery_id);
    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    if (delivery.deliveryman_id !== Number(id)) {
      return res
        .status(400)
        .json({ error: "Delivery doesn't belongs to the deliveryman " });
    }

    if (delivery.start_date) {
      return res.status(400).json({ error: 'Delivery has alredy started' });
    }

    const parsedDate = parseISO(start_date);
    const hour = getHours(parsedDate);
    if (hour >= 18 || hour < 8) {
      return res
        .status(400)
        .json({ error: 'Withdraw can only be done between 08:00 and 18:00' });
    }

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: id,
        start_date: null,
        signature_id: null,
      },
    });
    if (deliveries.length >= 5) {
      return res
        .status(400)
        .json({ error: 'A deliveryman can make only 5 withdraws a day' });
    }

    await delivery.update({ start_date, status: 'RETIRADA' });

    return res.status(200).json(delivery);
  }
}

export default new WithdrawController();
