const API_URL = 'http://localhost:3000';
var fileArray = [];
const id = _id => document.getElementById(_id);

const buildWalkObject = _ => Promise.resolve({
    name: id('walk-title').value,
    prices: {
	from: parseInt(id('walk-price-from').value),
	to: parseInt(id('walk-price-to').value),
	detail: id('walk-price-detail').value
    },
    summary: id('walk-summary').value,
    description: id('walk-description').value,
    days: parseInt(id('walk-days').value),
    nights: parseInt(id('walk-nights').value),
    difficulty: parseInt(id('walk-difficulty').value),
});

const sendWalkObject = walkObject => new Promise((resolve, reject) => fetch(`${API_URL}/walks`, {
	method: "POST",
	headers: {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json'
	},
	body: JSON.stringify(walkObject)
    }).then(o => o.json()).then(resolve)
);

const sendWalkImages = walk => new Promise((resolve, reject) => {
    const fd = new FormData();

    fileArray.forEach(file => fd.append('walkImages', file));

    fetch(`${API_URL}/walks/add-pictures/${walk._id}`, {
	method: "POST",
	body: fd
    }).then(resolve);
});

const createWalk = e => {
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();

    buildWalkObject()
	.then(sendWalkObject)
	.then(sendWalkImages)
	.then(console.log)
	.catch(console.error);
};

window.addEventListener('DOMContentLoaded', e => {
    console.log('admin-EDIT-walk');

    document.getElementById('upload-images').addEventListener('change',  previewImages, false);
    document.getElementById('submit').onclick = createWalk;
});
