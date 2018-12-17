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

walksRouter.route('/add-pictures/:id')
    .post(walksCtrl.preStorePictures, walksCtrl.storePictures, walksCtrl.postStorePictures);

walksRouter.route('/del-pictures/:id')
    .put(walksCtrl.delPictures);

export {walksRouter};
export default walksRouter;
