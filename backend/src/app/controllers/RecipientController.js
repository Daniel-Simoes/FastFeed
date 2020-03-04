import Recipient from '../models/Recipient';

class RecipientsController {
  async store(req, res) {
    const { name, street, number, compliment, state, city, postal_code } = await Recipient.create(req.body);

    return res.json({
      name,
      street,
      number,
      compliment,
      state,
      city,
      postal_code,
    });
  }
  async update(req, res) {

    const recipient = await Recipient.findByPk(req.userId);
    const { id, name, street, number, compliment, state, city, postal_code } = await recipient.update(req.body);

    return res.json({
      id,
      name,
      street,
      number,
      compliment,
      state,
      city,
      postal_code,
    });
  }

}

export default new RecipientsController();
