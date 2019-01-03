import express                  from 'express';
import walksCtrl                from './../controllers/walks';
import authCtrl                 from './../controllers/auth';

const walksRouter = express.Router();

walksRouter.route('/')
    .get(walksCtrl.getAll)
    .post(
	authCtrl.ensureAuth,
	walksCtrl.create
    );

walksRouter.route('/:id')
    .get(walksCtrl.getById)
    .put(
	authCtrl.ensureAuth,
	walksCtrl.updateById
    )
    .delete(
	authCtrl.ensureAuth,
	walksCtrl.deleteById
    );

walksRouter.route('/add-pictures/:id')
    .post(
	authCtrl.ensureAuth,
	walksCtrl.preStorePictures,
	walksCtrl.storePictures,
	walksCtrl.postStorePictures
    );

walksRouter.route('/del-pictures/:id')
    .put(
	authCtrl.ensureAuth,
	walksCtrl.delPictures
    );

export {walksRouter};
export default walksRouter;
