// #region PAGE index
// APPEL PHOTOGATHER JSON
const fetchSearch = async() => {
    photographer_card = await fetch('./FishEyeData.json')
        .then(response => { return response.json(); })
        .then(data => {

// #region ============ Affichage des photographes
            function tags(tag) {
                return `
                <ul class="tag-list">
                    ${tag.map(tag => `<li><button class="btn_tag">#${tag}</button></li>`).join("")}
                </ul>
                `;
            }

            function photographerTemplate(photographer) {
                return `
                <article class="photographer__article ${photographer.tags.join(" ")}" id="${photographer.id}">
                    <a href="photographer.html?id=${photographer.id}">
                        <div class="foto">
                            <img class="photo__photographer" src="./Photos/Photographers_ID_Photos/${photographer.portrait}">
                            <h2>${photographer.name}</h2>
                        </div>
                    </a>
                    <h3>${photographer.city}, ${photographer.country}</h3>
                    <p>${photographer.tagline}</p>
                    <h4>${photographer.price}€/jour</h4>
                    <nav aria-label="filtre hotographe" role="search">
                        ${photographer.tags ? tags(photographer.tags) : ""}
                    </nav>
                </article>
                `;
            }

            document.getElementById("articles").innerHTML = `
                ${data.photographers.map(photographerTemplate).join("")}        
            `;
// #endregion ============ Affichage des photographes

// #region ============ Affichage des tags
            for(i = 0 ; i < data.photographers.length ; i++) {
                // console.log(data.photographers[i].tags);
            } 

            let allTags = 
                data.photographers[0].tags.concat(
                data.photographers[1].tags,
                data.photographers[2].tags,
                data.photographers[3].tags,
                data.photographers[4].tags,
                data.photographers[5].tags
            );
            // console.log(allTags);

            let uniqueTags = [...new Set(allTags)];
            // console.log(uniqueTags);

            function tags(tag) {
                return `
                <ul class="tag-list">
                    ${tag.map(tag => `<li><a href="#" class="btn_tag" data-filter="${tag}" >#${tag}</a></li>`).join("")}
                </ul>
                `;
            }
            document.querySelector("#main_nav").innerHTML = tags(uniqueTags);
// #endregion ============  Affichage des tags

// #region ============ TAGS photo style
            const btns = document.querySelectorAll('.btn_tag');
            const storePhoto = document.querySelectorAll('.photographer__article');

            for (let i = 0; i < btns.length; i++) {

                btns[i].addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    const filter = e.target.dataset.filter;
                    // console.log(filter);
                    
                    storePhoto.forEach((product)=> {
                        if (!filter){
                            product.style.display = 'block';
                        } else {
                            if (product.classList.contains(filter)){
                                product.style.display = 'block';
                            } else {
                                product.style.display = 'none';
                            }
                        }
                    });
                });
            };
// #endregion ============ TAGS photo style


        })



















}
// #endregion

// #region ============ TAGS photo style




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

// console.log(newPhotographer);



// #endregion

// #region scroll action
const openBlocPass = document.querySelector(".btn_backTop");

window.addEventListener('scroll', () => {
    // destructuring : ici "scrollTop" == position du scroll vertical
    const {scrollTop} = document.documentElement;
    console.log(scrollTop);

    if(scrollTop >= 300) {
        //changer "display:none;" par "display:block;" à btn_backTop
        openBlocPass.style.display = "block";

    } else if(scrollTop <= 300) {
        //changer "display:block;" par "display:none;" à btn_backTop
        openBlocPass.style.display = "none";
    }
})
// #endregion scroll action




fetchSearch();