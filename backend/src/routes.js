import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import FileController from './app/controllers/FileController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliverymanActionController from './app/controllers/DeliverymanActionController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';

import authMiddleware from './app/middleware/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/deliverymans/:id/deliveries', DeliverymanActionController.index);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.post('/recipients', RecipientController.store);
routes.post('/deliverymans', DeliverymanController.store);
routes.post('/deliveries', DeliveryController.store);

routes.post('/delivery/:delivery_id/problems', DeliveryProblemController.store);
routes.get('/deliveries/problems', DeliveryProblemController.index);


routes.use(authMiddleware);

routes.put('/users', UserController.update);
routes.put('/recipients', RecipientController.update);


routes.put('/deliverymans/:id', DeliverymanController.update);
routes.delete('/deliverymans/:id', DeliverymanController.delete);
routes.get('/deliverymans', DeliverymanController.index);

routes.post('/files', upload.single('file'), FileController.store);

routes.delete('/deliveries/:id', DeliveryController.delete);
routes.put('/deliveries/:id', DeliveryController.update);
routes.get('/deliveries', DeliveryController.index);

export default routes;
