const API_URL = 'http://localhost:3000';
var fileArray = [];
const id = _id => document.getElementById(_id);

const walkId = window.location.pathname.match(/.*\/(.+)$/i)[1];

const fetchWalk = _ => new Promise(
    (resolve, reject) =>
	fetch(`${API_URL}/walks/${walkId}`)
	.then(res => res.json())
	.then(resolve)
	.catch(reject)
);

const fillWalkData = walkData => new Promise(
    (resolve, reject) => {
	id('walk-title').value = walkData.name;
	id('walk-summary').value = walkData.summary;
	id('walk-description').value = walkData.description;

	id('walk-price-from').value = walkData.prices.from;
	id('walk-price-to').value = walkData.prices.to;
	id('walk-price-detail').value = walkData.prices.detail;

	id('walk-difficulty').value = walkData.difficulty;
	id('walk-nights').value = walkData.nights;
	id('walk-days').value = walkData.days;


	id('delete-pictures-container').innerHTML = walkData.pictures.map(picURL => `
<div class="col s4 img-to-delete">
  <img height="200" src="${API_URL}${picURL}"/>
  <a class="btn-floating btn-large waves-effect waves-light red absolute del-preview-img" onclick="removeFile(this)">
    <i class="material-icons"> delete_forever </i>
  </a>
</div>
`).join('');

	resolve(walkData);
    });

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

    fetchWalk(walkId)
	.then(fillWalkData)
	.then(console.log)
	.catch(console.error);

    // document.getElementById('upload-images').addEventListener('change',  previewImages, false);
    // document.getElementById('submit').onclick = createWalk;
});
