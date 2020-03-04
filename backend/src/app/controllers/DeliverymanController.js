import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  async index(req, res) {

    const { page = 1 } = req.query;
    const deliverymans = await Deliveryman.findAll({

      limit: 10,
      offset: (page - 1) * 10,
    });

    return res.json(deliverymans);
  }


  async store(req, res) {
    const deliveryman = await Deliveryman.create(req.body);

    return res.json( deliveryman );
  }

  async update(req, res) {
    const { name, email } = req.body;
    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (email && email != deliveryman.email) {
      const deliverymanExists = await Deliveryman.findOne({ where: { email }, });

      if (deliverymanExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }
   const {id} = await deliveryman.update(req.body);

    return res.json({ id, name, email });
  }

  async delete(req, res) {
    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id);
    if (!deliveryman) {
      return res.status(400).json({ error: 'User not found' });
    }

    await deliveryman.destroy();

    return res.status(200).json({ ok: 'Deliveryman Deleted' });
  }

}

export default new DeliverymanController();
