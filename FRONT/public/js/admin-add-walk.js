const API_URL = 'http://localhost:3000';
//const API_URL = 'http://steven-boehm.cloudapp.net:3000';

var fileArray = [];
const id = _id => document.getElementById(_id);

const removeFile = function(el) {
    const images = document.getElementById('img-preview-container');
    const divToRemove = el.parentNode;
    const fileName = divToRemove.getElementsByTagName('img')[0].title;

    fileArray = fileArray.filter(file => file.name !== fileName);
    // fileArray = fileArray.filter(fr => fr.result !== divToRemove.getElementsByTagName('img')[0].src);
    divToRemove.remove();
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
    distance: parseInt(id('walk-distance').value),
    altitude: parseInt(id('walk-altitude').value)
});

const sendWalkObject = walkObject => new Promise((resolve, reject) => fetch(`${API_URL}/walks`, {
	method: "POST",
	headers: {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json',
	    'Authorization': window.FB_ID
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
	    .then(_ => {
	        window.location.href = '/admin';
	    })
	    .catch(console.error);
};

window.addEventListener('DOMContentLoaded', e => {
    document.getElementById('upload-images').addEventListener('change',  previewImages, false);
    document.getElementById('submit').onclick = createWalk;
});
