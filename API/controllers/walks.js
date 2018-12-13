import Walk from './../models/walks';

const create     = async (req, res) => {
    console.log(req.body);
    const _walk = new Walk(req.body);
    const walk = await _walk.save();

    return res.json(walk);
};

const getAll     = async (req, res) => {
    const ret = await Walk.getAll();
    return ret;
};

const getById    = async (req, res) => {
    const ret = await Walk.getBy({_id: req.params.id});
    return ret;
};

const updateById = async (req, res) => {
    const ret = await Walk.updateById(req.params.id, req.body.update);
    return ret;
};

const deleteById = async (req, res) => {
    const ret = await Walk.deleteBy({_id: req.params.id});
    return ret;
};

export default {
    create,
    getAll,
    getById,
    updateById,
    deleteById
};
