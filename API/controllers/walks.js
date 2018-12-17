import fs from 'fs';
import path from 'path';
import multer from 'multer';
import Walk from './../models/walks';

const fsPromises = fs.promises;

const PUBLIC_PATH = path.resolve(__dirname, '..', 'public');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
	const dest = path.resolve(PUBLIC_PATH, 'walks', req.walkName);
	cb(null, dest);
    },
    filename: function (req, file, cb) {
	cb(null, file.originalname);
    }
});
const upload = multer({ storage });
const storePictures = upload.array('walkImages');

const create     = async (req, res, next) => {
    try {
	const _walk = new Walk(req.body);
	var walk = await _walk.save();
    } catch (e) {
	if (e.code == 11000) { // dpulicate key error
	    res.status(409).end("A walk with this name already exists");
	}
	next(e);
    }

    return res.json(walk);
};

const preStorePictures = async (req, res, next) => {
    const walk = await Walk.findOne({_id: req.params.id});
    const walkName = walk.name;
    const pictureDir = './public/walks/' + walkName;

    req.walkName = walkName;

    if (!fs.existsSync(pictureDir)) {
	await fsPromises.mkdir(pictureDir, { recursive: true });
    }

    next();
};

const postStorePictures = async (req, res, next) => {
    const picturesArrayPath = req.files.map(file => file.path.split('API/public')[1]);
    const updateWalk = await Walk.update({_id: req.params.id }, {
	$addToSet: { pictures: { $each: picturesArrayPath } }
    });

    const updatedWalk = await Walk.findOne({_id: req.params.id});

    res.json(updatedWalk);
};


const delPictures = async (req, res) => {
    const updateWalk = await Walk.update({_id: req.params.id }, {
	$pull: { pictures: { $in: req.body.picsToRemove } }
    });
    const updatedWalk = await Walk.findOne({_id: req.params.id});

    const picturesPath = path.resolve(PUBLIC_PATH, 'walks', updatedWalk.name);
    const picturesList = fs.readdirSync(picturesPath).map(filename => path.resolve(picturesPath, filename));
    const picturesToRemove = picturesList.filter(path => !updatedWalk.pictures.some(_p => path.includes(_p)));

    picturesToRemove.forEach(path => fs.unlinkSync(path));

    res.json(updatedWalk);
};

const getAll     = async (req, res) => {
    const ret = await Walk.getAll();
    return res.json(ret);
};

const getById    = async (req, res) => {
    const ret = await Walk.findOne({_id: req.params.id});
    return res.json(ret);
};

const updateById = async (req, res) => {
    const ret = await Walk.updateById(req.params.id, req.body.update);
    return res.json(ret);
};

const deleteById = async (req, res) => {
    const ret = await Walk.deleteBy({_id: req.params.id});
    return res.json(ret);
};

export default {
    create,
    preStorePictures,
    storePictures,
    postStorePictures,
    delPictures,
    getAll,
    getById,
    updateById,
    deleteById
};
