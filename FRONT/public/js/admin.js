const API_URL = 'http://localhost:3000';

const fetchWalks = _ => new Promise(
    (resolve, reject) =>
	fetch(`${API_URL}/walks`)
	.then(res => res.json())
	.then(resolve)
	.catch(reject)
);

const walkCardHTML = walk => `
        <div class="col s12 m6 l4 xl3">
          <div class="card">
            <div class="card-image">
              <img src="${API_URL}/${walk.pictures[0] ? walk.pictures[0] : 'no-image.png'}">
              <span class="card-title">${walk.name}</span>
            </div>
            <div class="card-content">
               <div class="walk-mini-detail"> ${walk.days} <i class="material-icons">wb_sunny</i> </div>
               <div class="walk-mini-detail"> ${walk.nights} <i class="material-icons">brightness_3</i> </div>
               <div class="walk-mini-detail"> ${walk.difficulty} / 5 <i class="material-icons">directions_walk</i> </div>

            </div>
            <div class="card-content">
              <p>${walk.description}</p>
            </div>
            <div class="card-action">
              <a href="/admin/update/${walk.name}"> EDIT </a>
              <a href="/admin/delete/${walk.name}" class="red-text"> DELETE </a>
            </div>
          </div>
        </div>
`;

document.addEventListener('DOMContentLoaded', e => {
    const container = document.getElementById('list-walks');
    fetchWalks()
	.then(walksJSON => `<div class="row"> ${walksJSON.map(walkCardHTML).join('')} </div>`)
	.then(html => container.innerHTML = html);
});
