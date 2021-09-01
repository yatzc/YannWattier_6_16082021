// #region PAGE index
// APPEL PHOTOGATHER JSON
const fetchSearch = async() => {
    photographer_card = await fetch(
        './FishEyeData.json')
        .then(response => { return response.json(); })
        .then(data => {

        function tags(tag) {
            return `
            <ul class="tag-list">
                ${tag.map(tag => `<li><button class="btn_tag">#${tag}</button></li>`).join("")}
            </ul>
            `;
        }

        function photographerTemplate(photographer) {
            return `
            <article class="photographer__article" id="${photographer.id}">
                <a href="photographer.html?id=${photographer.id}">
                    <div class="foto">
                        <img class="photo__photographer" src="./Photos/Photographers_ID_Photos/${photographer.portrait}">
                        <h2>${photographer.name}</h2>
                    </div>
                </a>
                <h3>${photographer.city}, ${photographer.country}</h3>
                <p>${photographer.tagline}</p>
                <h4>${photographer.price}€/jour</h4>
                <nav aria-label="Photographe navigation" role="search">
                    ${photographer.tags ? tags(photographer.tags) : ""}
                </nav>
            </article>
            `;
        }

        document.getElementById("articles").innerHTML = `
            ${data.photographers.map(photographerTemplate).join("")}        
        `;

        })
}
// #endregion

// #region OBJECT
// CONSTRUCTEUR
function Photographer(name, id, city, country, tags, tagline, price, portrait) {
    this.name = name;
    this.id = id;
    this.city = city;
    this.country = country;
    this.tags = tags;
    this.tagline = tagline;
    this.price = price;
    this.portrait = portrait;
}
// OBJET
let newPhotographer = new Photographer("toto", 10, "Albi", "France", ["art", "fashion", "events"], "Voir le beau", 100, "MimiKeel.jpg");

console.log(newPhotographer);


// fetch('./FishEyeData.json', {
// 	method: "POST",
// 	headers: { 
// 		'Accept': 'application/json', 
// 		'Content-Type': 'application/json' 
// 	},
// 	body: JSON.stringify(jsonBody)
// });


// #endregion


fetchSearch();