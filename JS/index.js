// import { tags, photographerTemplate } from './JS/index/displayPhotographer.mjs';

// #region PAGE index
// APPEL PHOTOGATHER JSON
const fetchSearch = async() => {
    let photographer_card = await fetch('./data/FishEyeData.json')
        .then(response => { return response.json(); })
        .then(data => {

// #region ============ GET data média of JSON
            let mediaId             = [];
            let mediaPhotographerId = [];
            let mediaTitle          = [];
            let mediaImage          = [];
            let mediaTags           = [];
            let mediaLikes          = [];
            let mediaDate           = [];
            let mediaPrice          = [];


            // function getDataPhotographer() {
                data.photographers.forEach((elt, i) => {
                    mediaId[i]             = elt.id;
                    mediaPhotographerId[i] = elt.photographerId;
                    mediaTitle[i]          = elt.title;
                    mediaImage[i]          = elt.image;
                    mediaTags[i]           = elt.tags;
                    mediaLikes[i]          = elt.likes;
                    mediaDate[i]           = elt.date;
                    mediaPrice[i]          = elt.price;
                });
            // }
                
// #endregion ============ Récupération des média du JSON

// #region ============ Affichage des photographes
            function tags(tag) {
                return `
                <ul role="menu" class="tag-list">
                    ${tag.map(tag => `<li role="menuitem"><a href="#" class="btn_tag" data-filter="${tag}" >#${tag}</a></li>`).join("")}
                </ul>
                `;
            }

            function photographerTemplate(photographer) {
                return `
                <article role="menuitem" class="article_photographer ${photographer.tags.join(" ")}" id="${photographer.id}">
                    <a href="photographer.html?id=${photographer.id}">
                        <img role="img" alt="photo de ${photographer.name}" class="photo__photographer" src="./Photos/Photographers_ID_Photos/${photographer.portrait}">
                        <h2>${photographer.name}</h2>
                    </a>
                    <h3 tabindex="0" aria-label="localité de ${photographer.name} est ${photographer.city} en ${photographer.country}">${photographer.city}, ${photographer.country}</h3>
                    <p tabindex="0" aria-label="le dicton du photographe est ${photographer.tagline}">${photographer.tagline}</p>
                    <h4 tabindex="0" aria-label="le prix du photographe est de ${photographer.price} euro par jour">${photographer.price}€/jour</h4>
                    <nav class="card_nav" aria-label="card navigation"  role="search">
                        ${photographer.tags ? tags(photographer.tags) : ""}
                    </nav>
                </article>
                `;
            }

            document.getElementById("articles").innerHTML = `
                ${data.photographers.map(photographerTemplate).join("")}        
            `;
// #endregion ============ Affichage des photographes

// #region ============ Affichage des main_nav tags
            // concat les array des tags en un seul array "allTags"
            let allTags = mediaTags.flat();
            // supprime les doublons du array "allTags"
            let uniqueTags = [...new Set(allTags)];

            document.querySelector("#main_nav").innerHTML = tags(uniqueTags);
// #endregion ============  Affichage des tags

// #region ============ TAGS photo style
            const btns = document.querySelectorAll('.btn_tag');
            const storePhoto = document.querySelectorAll('.article_photographer');

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
// #endregion PAGE index


// #region scroll action
// import { openBlocPass } from './JS/index/backOnTop.mjs';
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