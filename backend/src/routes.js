import { Router } from 'express';
import User from './app/models/User';

const routes = new Router();

routes.get('/', async (req, res) =>{
    const user = await User.create({
      name: 'Daniel Simões',
      email: 'daniel.simoes@hotmail.com',
      password_hash: 'dt123456',
    });
    return res.json(user);
});

export default routes;
