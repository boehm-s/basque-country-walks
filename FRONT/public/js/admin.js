const API_URL = 'http://localhost:3000';

const fetchWalks = _ => new Promise(
    (resolve, reject) =>
	fetch(`${API_URL}/walks`)
	.then(res => res.json())
	.then(resolve)
	.catch(reject)
);

const walkCardHTML = walk => `
      <div class="row">
        <div class="col s12 m7">
          <div class="card">
            <div class="card-image">
              <img src="${walk.pictures[0]}">
              <span class="card-title">${walk.name}</span>
            </div>
            <div class="card-content">
              <p>${walk.description}</p>
            </div>
            <div class="card-action">
              <a href="/admin/update/${walk.name}"></a>
            </div>
          </div>
        </div>
      </div>
`;

document.addEventListener('DOMContentLoaded', e => {
    const container = document.getElementById('list-walks');
    fetchWalks()
	.then(walksJSON => walksJSON.map(walkCardHTML))
	.then(html => container.innerHTML = html);
});
