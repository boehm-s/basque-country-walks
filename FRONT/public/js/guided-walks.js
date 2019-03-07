const API_URL = 'http://localhost:3000';
//const API_URL = 'http://steven-boehm.cloudapp.net:3000';

const id = _id => document.getElementById(_id);
const tag = _tag => Array.from(document.getElementsByTagName(_tag));
const cls = _cls => Array.from(document.getElementsByClassName(_cls));

const fetchWalks = _ => new Promise(
    (resolve, reject) =>
	fetch(`${API_URL}/walks`)
	.then(res => res.json())
	.then(resolve)
	.catch(reject)
);

const walkCardHTML = walk => `
        <div class="col m12 l6 xl4">
          <div class="card" data-name="${walk.name}" data-summary="${walk.summary}" data-price="${walk.price}" data-days="${walk.days}" data-nights="${walk.nights}" data-difficulty="${walk.difficulty}">
            <div class="card-image">
              <div class="img-div" style="background: url(${API_URL}/${walk.pictures[0] ? walk.pictures[0] : 'no-image.png'}) no-repeat center center; background-size: cover"> </div>
              <span class="card-title">${walk.name}</span>
            </div>
            <div class="card-content icon-details-container details">
               <div class="walk-mini-detail-container">
                   <div class="walk-mini-detail">  <i class="material-icons">brightness_low</i> <span class="text-icon"> ${walk.days} </span> </div>
                   <div class="walk-mini-detail">  <i class="material-icons">brightness_3</i> <span class="text-icon"> ${walk.nights} </span> </div>
                   <div class="walk-mini-detail">  <i class="material-icons">directions_walk</i> <span class="text-icon"> ${walk.difficulty} / 5 </span> </div>
               </div>
               <div class="walk-price"> <span class="text-price"> From ${walk.prices.from}€ </span></div>
            </div>
            <div class="card-content">
              <p>${walk.summary}</p>
            </div>
            <div class="card-action discover-walk" onclick="window.location.href = '/walks/${walk._id}'" style="text-align: center; cursor:pointer">
              <a href="/walks/${walk._id}" class="blue-text"> Discover the walk </a>
            </div>
          </div>
        </div>
`;


const deleteWalk = function(e) {
    console.log({e, a: this});
    const card = e.parentNode.parentNode.parentNode;
    const walkName = card.getElementsByClassName('card-title')[0].innerHTML;

    if (window.confirm(`Are you sure you want to delete walk   "${walkName}"`)) {
	fetch(`${API_URL}/walks/${e.dataset.id}`, {
    	    method: "DELETE",
	    headers: {
		'Authorization': window.FB_ID
	    }
	}).then(o => o.json()).then(jsonRes => {
	    console.log(jsonRes);
	    card.remove();
	    return jsonRes;
	});
    }
};

const searchWalks = e => {
    const walksCards = cls('card');

    walksCards.forEach(card => {
        const input = e.target.value.toLowerCase();
        const inputIsInSummary = card.dataset.summary.toLowerCase().includes(input);
        const inputIsInName = card.dataset.name.toLowerCase().includes(input);
        card.parentNode.style.display = inputIsInSummary || inputIsInName ? "block" : "none";
    });
}


document.addEventListener('DOMContentLoaded', e => {
    const container = id('list-walks');
    const searchWalksBar = id('search-walks-bar');

    fetchWalks()
	.then(walksJSON => `<div class="row"> ${walksJSON.map(walkCardHTML).join('')} </div>`)
	    .then(html => container.innerHTML = html);

    searchWalksBar.oninput = searchWalks;
});
