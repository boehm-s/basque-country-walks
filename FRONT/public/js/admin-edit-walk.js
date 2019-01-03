const API_URL = 'http://localhost:3000';
//const API_URL = 'http://steven-boehm.cloudapp.net:3000';

var fileArray = [];
var filesToDelete = [];
var originalWalk = null;

const id = _id => document.getElementById(_id);
const tag = _tag => Array.from(document.getElementsByTagName(_tag));
const cls = _cls => Array.from(document.getElementsByClassName(_cls));

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
	[
	    ['walk-title',        walkData.name],
	    ['walk-summary',      walkData.summary],
	    ['walk-description',  walkData.description],
	    ['walk-price-from',   walkData.prices ? walkData.prices.from   : null],
	    ['walk-price-to',     walkData.prices ? walkData.prices.to     : null],
	    ['walk-price-detail', walkData.prices ? walkData.prices.detail : null],
	    ['walk-difficulty',   walkData.difficulty],
	    ['walk-nights',       walkData.nights],
	    ['walk-days',         walkData.days],
	].forEach(assoc => {
	    if (assoc[1]) id(assoc[0]).value = assoc[1];
	});

	id('delete-pictures-container').innerHTML = walkData.pictures.map(picURL => `
<div class="col update-img-to-delete relative">
  <img height="200" src="${API_URL}${picURL}"/>
  <a class="btn-floating btn-large waves-effect waves-light red absolute update-del-preview-img" onclick="removeUpdateFile(this)">
    <i class="material-icons"> delete_forever </i>
  </a>
</div>
`).join('');

	// activate all labels (UI)
	tag('label').filter(el => el.parentNode.classList.contains('input-field'))
	    .forEach(label => label.classList.add('active'));

	originalWalk = walkData;

	resolve(walkData);
    });

const removeFile = function(el) {
    const images = document.getElementById('img-preview-container');
    const divToRemove = el.parentNode;
    const fileName = divToRemove.getElementsByTagName('img')[0].title;

    fileArray = fileArray.filter(file => file.name !== fileName);
    // fileArray = fileArray.filter(fr => fr.result !== divToRemove.getElementsByTagName('img')[0].src);
    divToRemove.remove();
};


const removeUpdateFile = el => {
    const container = el.parentNode;
    const src = container.getElementsByTagName('img')[0].src;
    const dbSrc = decodeURI(src.replace(API_URL, ''));

    filesToDelete.push(dbSrc);
    container.remove();
};

const previewImages = function() {
    const preview = document.getElementById('img-preview-container');

    if (this.files) {
	[].forEach.call(this.files, readAndPreview);
    }

    function readAndPreview(file) {
	// Make sure `file.name` matches our extensions criteria
	if (!/\.(jpe?g|png|gif)$/i.test(file.name)) {
	    alert(file.name + " is not an image");
	}

	var reader = new FileReader();

	reader.addEventListener('load', function() {
	    const divImg = `
<div class="col relative preview-img-container">
  <img height="200" title="${file.name}" src="${this.result}"/>
  <a class="btn-floating btn-large waves-effect waves-light red absolute del-preview-img" onclick="removeFile(this)">
    <i class="material-icons"> delete_forever </i>
  </a>
</div>`;
	    preview.innerHTML += divImg;
	}, false);

	reader.readAsDataURL(file);
	fileArray = Array.from(id('upload-images').files);
    };
};

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

const walkUpdateDiff = walkObj => new Promise((resolve, reject) => {
    const updateWalk = Object.keys(originalWalk)
	  .filter(key => !['__v', '_id', 'prices'].some(k => key == k))
	  .reduce((acc, val) => {
	      if (walkObj[val] !== originalWalk[val])
		  acc[val] = walkObj[val];
		  return acc;
	  }, {});

    updateWalk.prices = {};

    ['from', 'to', 'detail'].forEach(priceKey => {
	if (originalWalk.prices && originalWalk.prices[priceKey] !== walkObj.prices[priceKey])
	    updateWalk.prices[priceKey] = walkObj.prices[priceKey];
	else if (updateWalk.prices && updateWalk.prices[priceKey])
	    updateWalk.prices[priceKey] = originalWalk.prices[priceKey];
    });

    if (!updateWalk.pictures)
	delete updateWalk.pictures;
    if (Object.keys(updateWalk.prices).length == 0)
	delete updateWalk.prices;

    return resolve(updateWalk);
});

const sendWalkUpdate = walkUpdateObj => new Promise((resolve, reject) => fetch(`${API_URL}/walks/${walkId}`, {
    method: "PUT",
    headers: {
	'Accept': 'application/json',
	'Content-Type': 'application/json'
    },
    body: JSON.stringify({update: walkUpdateObj})
}).then(o => o.json()).then(resolve)
						   );

const removeWalkImages = _ =>
      new Promise((resolve, reject) =>  {
	  if (filesToDelete.length >= 1) {
	      fetch(`${API_URL}/walks/del-pictures/${walkId}`, {
		  method: "PUT",
		  headers: {
		      'Accept': 'application/json',
		      'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({picsToRemove: filesToDelete})
	      }).then(o => o.json()).then(resolve);
	  } else {
	      resolve();
	  }
      });

const sendWalkImages = _ => new Promise((resolve, reject) => {
    const fd = new FormData();

    fileArray.forEach(file => fd.append('walkImages', file));

    fetch(`${API_URL}/walks/add-pictures/${walkId}`, {
	method: "POST",
	body: fd
    }).then(resolve);
});

const updateWalk = e => {
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();

    buildWalkObject()
	.then(walkUpdateDiff)
	.then(sendWalkUpdate)
	.then(removeWalkImages)
	.then(sendWalkImages)
	.then(_ => {
	    window.location.href = '/admin';
	})
	.catch(console.error);
};

window.addEventListener('DOMContentLoaded', e => {
    console.log('admin-EDIT-walk');

    fetchWalk(walkId)
	.then(fillWalkData)
	.then(console.log)
	.catch(console.error);

    document.getElementById('upload-images').addEventListener('change',  previewImages, false);
    document.getElementById('submit').onclick = updateWalk;
});
