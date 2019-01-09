import mongoose from 'mongoose';

const walkSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
	unique: true
    },
    prices: {
	from: Number,
	to: Number,
	detail: String
    },
    summary: String,
    description: String,
    distance: Number,
    altitude: Number,
    days: Number,
    nights: Number,
    difficulty: Number,
    pictures : [{
        type: String,
	unique: true
    }],
});

const getBy = async (filter, {limit = 0} = {}) => {
    const walks = await Walk.find(filter).limit(limit);
    return walks;
};

const getAll = (opts) => getBy({}, opts);

const updateById = async (id, update) => {
    const updated = await Walk.update({_id: id}, {
	$set: update
    });

    return updated;
};

const deleteBy = async (filter) => {
    const deleted = await getBy(filter);

    await Walk.deleteMany(filter);

    return deleted;
};

walkSchema.statics.getBy      = getBy;
walkSchema.statics.updateById = updateById;
walkSchema.statics.getAll     = getAll;
walkSchema.statics.deleteBy   = deleteBy;

var Walk = mongoose.model('Walk', walkSchema);

export default Walk;
