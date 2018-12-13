import express                  from 'express';
import walksCtrl                from './../controllers/walks';

const walksRouter = express.Router();

walksRouter.route('/')
    .get(walksCtrl.getAll)
    .post(walksCtrl.create);

walksRouter.route('/:id')
    .get(walksCtrl.getById)
    .put(walksCtrl.updateById)
    .delete(walksCtrl.deleteById);

export {walksRouter};
export default walksRouter;
