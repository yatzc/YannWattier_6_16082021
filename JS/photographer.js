// #region ============ DOM ELEMENTS
// MAIN
const mainContainer = document.querySelector("#main_container");
// FORM
const formBtnOpen    = document.querySelectorAll(".btn_contact");
const formBg         = document.querySelector(".bground");
const formCrossClose = document.querySelectorAll(".close");

// lightbox
const photoContainer = document.querySelector("#portfolio_photos");
// const lightboxBtnOpen    = document.querySelectorAll(".test");
// const lightboxBg         = document.querySelector(".lightbox_bground");
// const lightboxCrossClose = document.querySelectorAll(".lightbox_close");
// const lightboxBtnClose = document.querySelector("#btn_message");

// #endregion ============ DOM ELEMENTS

// #region ============ MAIN
let searchParams = new URLSearchParams(window.location.search);

//test si id est dans url
if (searchParams.has("id")) {
    // récupération id dans variable
    let photographeId = searchParams.get("id");
    // garder l'id lors de la validation du formulaire
    document.querySelector("#id").value = photographeId;


    // APPEL PHOTOGRATHER JSON
    fetch("./data/FishEyeData.json").then(response => { return response.json(); })
        .then(data => {

            // #region ============ identifiant du photographe
            const identity = data.photographers.filter( function(identifiant){
                return identifiant.id == photographeId;
            });

            // titre onglet (Fisheye - nom photographe)
            document.getElementById("onglet").innerHTML = "Fisheye - " + identity[0].name;
            
            // form contact name
            document.querySelector(".bground h1").innerHTML = "Contacter-moi " + identity[0].name;

            // name
            document.getElementById("name").innerHTML = identity[0].name;
            // city + country
            document.getElementById("place").innerHTML = identity[0].city + ", " + identity[0].country;
            // tagline
            document.getElementById("tagline").innerHTML = identity[0].tagline;
            // tags
            function tags(tag) {
                return `
                ${tag.map(tag => `<a aria-label="Trier par ${tag}" role="menuitem" href="#" class="btn_tag" data-filter="${tag}" >#${tag}</a>`).join("")}
              `;
            }
            document.querySelector(".filter-box").innerHTML = tags(identity[0].tags.sort());
            // Photo
            document.querySelector("#photo_photographer").src = "./Photos/Photographers_ID_Photos/" + identity[0].portrait;
            // #endregion ============ identifiant du photographe

            // #region ============ PORTFOLIO
            // media du photographe
            var theMediasOfPhotographer = data.media.filter(donnees => donnees.photographerId == photographeId);
            window.altTxt = data.description;

            // #region ============ SELECT
            const btnSelect = document.querySelector(".css-select");

            window.cssSelect = (option) => {
                const parent = option.parentNode.parentNode;
                parent.querySelector("[data-css-select='hidden']").value = option.dataset.cssSelect;
                parent.querySelector("[data-css-select='selected']").value = option.innerHTML;
                document.activeElement.blur();
                // document.getElementById("select").setAttribute('aria-expanded', 'true');
            };

            btnSelect.addEventListener("keydown", (event) => {
                const target = event.target;
                if ((target.dataset.cssSelect === "Popularité") && (event.keyCode === 13)) {
                    mediaSort("Popularité");
                    return null;
                }
                if ((target.dataset.cssSelect === "Date") && (event.keyCode === 13)) {
                    mediaSort("Date");
                    return null;
                }
                if ((target.dataset.cssSelect === "Titre") && (event.keyCode === 13)) {
                    mediaSort("Titre");
                    return null;
                }
            });

            btnSelect.addEventListener("mousedown", (event) => {
                const target = event.target;

                if (target.dataset.cssSelect === "Popularité") {
                    mediaSort("Popularité");
                    return null;
                }
                if (target.dataset.cssSelect === "Date") {
                    mediaSort("Date");
                    return null;
                }
                if (target.dataset.cssSelect === "Titre") {
                    mediaSort("Titre");
                    return null;
                }
            });
            // #endregion ============ SELECT

            // #region ====== Le tri par SELECT
    
            function mediaSort(styleMedia) {
                if (styleMedia == "") { theMediasOfPhotographer; }
                else if (styleMedia == "Popularité") { theMediasOfPhotographer.sort((a, b) => b.likes - a.likes); }
                else if (styleMedia == "Date")       { theMediasOfPhotographer.sort((a, b) => new Date(b.date) - new Date(a.date)); }
                else if (styleMedia == "Titre")      { theMediasOfPhotographer.sort(function (a, b) {
                    if (a.title.toLowerCase() < b.title.toLowerCase()) { return -1; }
                    if (a.title.toLowerCase() > b.title.toLowerCase()) { return  1; } 
                    return  0;
                });}

                
                document.getElementById("portfolio_photos").innerHTML = `${theMediasOfPhotographer.map(mediaTemplate).join("")}`;

                const hearts = document.querySelectorAll(".media_likes button");

                hearts.forEach(heart => { heart.addEventListener("click", isLike); });
                function isLike() {
                    this.dataset.like = this.dataset.like == "true" ? "false" : "true";
                    this.dataset.datanblike = this.dataset.datanblike == 1 ? 0 : 1;
                
                    // Get id
                    let numberLikePhoto = parseInt(document.querySelector(".media_likes p[data-id='"+this.dataset.id+"']").innerHTML);
                    if(this.dataset.datanblike == 0)
                        numberLikePhoto--;
                    else
                        numberLikePhoto++;
  
                    // Update on DOM
                    document.querySelector(".media_likes p[data-id='"+this.dataset.id+"']").innerHTML = numberLikePhoto;
  
                    calculateLikes();
                }

                Lightbox.init();
        
            }

            // #endregion ============ Le tri par SELECT

            // #region ============ FACTORY
            class MyMedia {
                constructor(isMedia) {
                    this._media = isMedia;
                }
                createMedia() {}
            }

            class MyImage extends MyMedia {
                constructor(_media) {
                    super(_media);
                }
                createMedia() {
                    return `<a aria-label="${this._media.description}" href="./Photos/${photographeId}/${this._media.image}"><img role="img" alt="${this._media.description}" role="button" src="./Photos/${photographeId}/small/${this._media.image}"></a>`;
                }
                
            }

            class MyVideo extends MyMedia {
                constructor(_media) {
                    super(_media);
                }
                createMedia() {
                    let file = this._media.video;
                    file = file.substr(0, file.lastIndexOf(".")) + ".jpg";
                    return `<a aria-label="${this._media.description}" href="./Photos/${photographeId}/${this._media.video}"><img role="img" alt="${this._media.description}" role="button" src="./Photos/${photographeId}/small/${file}"></a>`;
                }
            }

            function factory(isMedia) {

                if(isMedia.image) {
                    return new MyImage(isMedia);
                } else if(isMedia.video) {
                    return new MyVideo(isMedia);
                } else {
                    console.log("error");
                }
            }
            // #endregion ============ FACTORY

            // #region ====== Affichage photo card
            function mediaTemplate(mediaPhotographer) {
                return `
                    <article class="photo_article ${mediaPhotographer.tags}">
                      <div class="photo_flex">
                        ${factory(mediaPhotographer).createMedia()}
                        <div class="photo_foot">
                          <p class="media_text">${mediaPhotographer.title}</p>
                          <div class="media_likes">
                            <p tabindex="0" data-datanblike="0" data-id="${mediaPhotographer.id}" class="number_like" >${mediaPhotographer.likes}</p>
                            <button aria-label="click si tu aime" data-like="false" data-id="${mediaPhotographer.id}" class="btn_heart"><i class="fas fa-heart"></i></button>
                          </div>
                        </div>
                      </div>
                    </article>
                    `;
            }
              
            document.getElementById("portfolio_photos").innerHTML = `${theMediasOfPhotographer.map(mediaTemplate).join("")}`;
            // #endregion ============ Affichage photo card

            // #endregion ============ PORTFOLIO

            // #region ============ LIKES COUNT
            // =============== LIKE from add heart
            const hearts = document.querySelectorAll(".media_likes button");

            hearts.forEach(heart => {
                heart.addEventListener("click", isLike);
            });
            function isLike() {
                this.dataset.like = this.dataset.like == "true" ? "false" : "true";
                this.dataset.datanblike = this.dataset.datanblike == 1 ? 0 : 1;
              
                // Get id
                let numberLikePhoto = parseInt(document.querySelector(".media_likes p[data-id='"+this.dataset.id+"']").innerHTML);
                if(this.dataset.datanblike == 0)
                    numberLikePhoto--;
                else
                    numberLikePhoto++;

                // Update on DOM
                document.querySelector(".media_likes p[data-id='"+this.dataset.id+"']").innerHTML = numberLikePhoto;

                calculateLikes();
            }

            function calculateLikes() {
                const numberLike = document.querySelectorAll(".media_likes button[data-like='true']").length;
                document.querySelector(".count").innerHTML = numberLike  + totalLikesJSON;
            }

            // =============== LIKE from likes JSON
            let totalLikesJSON = 0;

            for(let i = 0; i < theMediasOfPhotographer.length; i++) {
                totalLikesJSON += theMediasOfPhotographer[i].likes;
            }

            // display like + price/day
            document.querySelector(".count").innerHTML = totalLikesJSON;
            document.querySelector(".price").innerHTML = identity[0].price + "€/jour";

            // #endregion ============ LIKES COUNT            

            // #region ============ TAGS photo style

            const btns = document.querySelectorAll(".btn_tag");
            const storePhoto = document.querySelectorAll(".photo_article");

            for (let i = 0; i < btns.length; i++) {

                btns[i].addEventListener("click", (e) => {
                    e.preventDefault();
                  
                    const filter = e.target.dataset.filter;
                    console.log(filter);
                  
                    storePhoto.forEach((product)=> {
                        if (!filter){
                            product.style.display = "block";
                        } else {
                            if (product.classList.contains(filter)){
                                product.style.display = "block";
                            } else {
                                product.style.display = "none";
                            }
                        }
                    });
                });
            }

            // #endregion ============ TAGS photo style

            Lightbox.init();        

        }).catch(err => {
            console.log(err);
        });

} else {
    // Si id photographer KO : redirection vers index.html
    window.location.pathname = "index.html";
}
// #endregion ============ MAIN

// #region ============ FORM

// open form (btn)
formBtnOpen.forEach((btn) => btn.addEventListener("click", openBtnForm));
function openBtnForm() {
    formBg.style.display = "block";
    form.reset();
    // history.pushState({}, "", "photographer.html?id=" + photographeId);
    form.first.style.border = "none";
    form.last.style.border = "none";
    form.email.style.border = "none";
    form.textarea.style.border = "none";
    // smallFirst.style.display = "none";
    // smallLast.style.display = "none";
    // smallEmail.style.display = "none";
    // smallTextarea.style.display = "none";
    document.getElementById("identity_card").style.display = "none";
    document.getElementById("portfolio").style.display = "none";
    document.getElementById("bloc_counter").style.display = "none";
    document.getElementById("portfolio_photos").classList.remove("portfolio_container");
    document.getElementById("portfolio_photos").classList.add("hide");
    document.getElementById("banner").style.display = "none";
    mainContainer.setAttribute("aria-hidden", "true");
    formBg.setAttribute("aria-hidden", "false");
    document.querySelector(".content").focus();
}

// ========================================== CLOSE FORM BY CROSS BTN
formCrossClose.forEach((btn) => btn.addEventListener("click", closeBtnForm));
function closeBtnForm() {
    formBg.style.display = "none";
    mainContainer.setAttribute("aria-hidden", "false");
    formBg.setAttribute("aria-hidden", "true");
    document.getElementById("identity_card").style.display = "flex";
    document.getElementById("portfolio").style.display = "flex";
    document.getElementById("portfolio_photos").classList.remove("hide");
    document.getElementById("portfolio_photos").classList.add("portfolio_container");
    document.getElementById("bloc_counter").style.display = "flex";
    document.getElementById("banner").style.display = "block";
}
// ========================================== CLOSE FORM BY KEYCODE
window.addEventListener("keydown", checkKeyPress, false);
function checkKeyPress(key) {
    if(key.keyCode === 27) {
        formBg.style.display = "none";
        mainContainer.setAttribute("aria-hidden", "false");
        formBg.setAttribute("aria-hidden", "true");
        document.getElementById("identity_card").style.display = "flex";
        document.getElementById("portfolio").style.display = "block";
        document.getElementById("bloc_counter").style.display = "flex";
        document.getElementById("portfolio_photos").classList.remove("hide");
        document.getElementById("portfolio_photos").classList.add("portfolio_container");
        document.getElementById("banner").style.display = "block";
    }
}

// ========================================== CLOSE FORM BY KEYCODE
const closeForm = document.getElementById("closeform");
closeForm.addEventListener("keydown", (key) => {
    if(key.keyCode === 13){
        document.getElementById("identity_card").style.display = "flex";
        document.getElementById("portfolio").style.display = "block";
        document.getElementById("bloc_counter").style.display = "flex";
        document.getElementById("portfolio_photos").classList.remove("hide");
        document.getElementById("portfolio_photos").classList.add("portfolio_container");
        document.getElementById("banner").style.display = "block";
        formBg.style.display = "none";
    }
});

//#region ==== CONDITION RULES
let form = document.querySelector("#contactForm");

// ========================================== FIRSTNAME
form.first.addEventListener("change", function () { validFirst(this); });

const validFirst = function (inputFirst) {
    let firstRegExp = new RegExp("^[a-zA-Z]{2,20}$", "g");

    let testFirst = firstRegExp.test(inputFirst.value);

    let small = inputFirst.nextElementSibling;

    if (testFirst) {
        small.style.display = "none";
        small.classList.remove("text-danger");
        inputFirst.style.border = "green solid 2px";
        form.first.setAttribute("aria-invalid", "true");
        return true;
    } else {
        small.style.display = "inline-block";
        small.innerHTML = "Vous devez entrer 2 caractères ou plus.";
        small.classList.add("text-danger");
        inputFirst.style.border = "red solid 2px";
        form.first.setAttribute("aria-invalid", "false");
        return false;
    }
};

// ========================================== LASTNAME
form.last.addEventListener("change", function () { validLast(this); });

const validLast = function (inputLast) {
    let lastRegExp = new RegExp("^[a-zA-Z]{2,20}$", "g");

    let testLast = lastRegExp.test(inputLast.value);

    let small = inputLast.nextElementSibling;

    if (testLast) {
        small.style.display = "none";
        small.classList.remove("text-danger");
        inputLast.style.border = "green solid 2px";
        form.last.setAttribute("aria-invalid", "true");
        return true;
    } else {
        small.style.display = "inline-block";
        small.innerHTML = "Vous devez entrer 2 caractères ou plus.";
        small.classList.add("text-danger");
        inputLast.style.border = "red solid 2px";
        form.last.setAttribute("aria-invalid", "false");
        return false;
    }
};

// ========================================== EMAIL
form.email.addEventListener("change", function () { validEmail(this); });

const validEmail = function (inputEmail) {
    let emailRegExp = new RegExp( "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$", "g" );

    let testEmail = emailRegExp.test(inputEmail.value);

    let small = inputEmail.nextElementSibling;

    if (testEmail) {
        small.style.display = "none";
        small.classList.remove("text-danger");
        inputEmail.style.border = "green solid 2px";
        form.email.setAttribute("aria-invalid", "true");
        return true;
    } else {
        small.style.display = "inline-block";
        small.innerHTML = "Vous devez entrer une adresse email valide.";
        small.classList.add("text-danger");
        inputEmail.style.border = "red solid 2px";
        form.email.setAttribute("aria-invalid", "false");
        return false;
    }
};

// ========================================== MESSAGE
form.textarea.addEventListener("change", function () { validMessage(this); });

const validMessage = function (inputTextarea) {
    let textareaRegExp = new RegExp("[a-z]", "g");

    let testTextarea = textareaRegExp.test(inputTextarea.value);

    let small = inputTextarea.nextElementSibling;

    if (testTextarea) {
        small.style.display = "none";
        small.classList.remove("text-danger");
        inputTextarea.style.border = "green solid 2px";
        form.textarea.setAttribute("aria-invalid", "true");
        return true;
    } else {
        small.style.display = "inline-block";
        small.innerHTML = "Vous devez entrer 2 caractères ou plus.";
        small.classList.add("text-danger");
        inputTextarea.style.border = "red solid 2px";
        form.textarea.setAttribute("aria-invalid", "false");
        return false;
    }
};


// ========================================== VALIDATION BTN FORM
// Listen form & close form & open THANKS (btn)
form.addEventListener("submit", function (e) {
    if (
        validFirst(form.first) &&
        validLast(form.last) &&
        validEmail(form.email) &&
        validMessage(form.textarea)
    ) {
        formBg.style.display = "none";
        mainContainer.setAttribute("aria-hidden", "false");
        formBg.setAttribute("aria-hidden", "true");
        formBtnOpen.focus();
    
        let searchParamsForm = new URLSearchParams(window.location.search);
        console.log(
            "ID = " +
        searchParamsForm.get("id") +
            " First = " +
        searchParamsForm.get("first") +
            " Last = " +
        searchParamsForm.get("last") +
            " Email = " +
        searchParamsForm.get("email") +
            " Textarea = " +
        searchParamsForm.get("textarea")
        );
        e.preventDefault();
    } else {
        formBg.style.display = "block";
        e.preventDefault();
    }
});

// #endregion ============ FORM

// #endregion

// #region ============ LIGHTBOX

/**
 * @param {HTMLElement} element
 * @param {string[]} srcArray liste des URL des srcArray du diaporama
 * @param {string} srcTxt image actuel dans la lightbox
 */
class Lightbox {

    /**
     * @param {string} srcTxt SRC de l'image
     * @param {string} altTxt ALT de l'image
     * @param {string[]} srcArray liste des URL des srcArray du diaporama
     */
    constructor(srcTxt, srcArray, altTxt, altArray) {
        this.element = this.buildDOM(srcTxt);
        this.srcArray = srcArray;
        this.altArray = altArray;
        // this.altTxt = altTxt;
        this.loadMedia(srcTxt, altTxt);
        this.onKeyUp = this.onKeyUp.bind(this);
        document.body.appendChild(this.element);
        document.addEventListener("keyup", this.onKeyUp);
    }

    static init() {
        // ajout src de chaque image du portfolio dans arraySrc
        const arraySrc = Array.from(document.querySelectorAll("a[href$='.jpg'], a[href$='.mp4']"));

        const gallerySrc = arraySrc.map(link => link.getAttribute("href"));

        // ajout alt de chaque image du portfolio dans arrayAlt
        const arrayAlt = Array.from(document.querySelectorAll("a[href$='.jpg'], a[href$='.mp4']"));
        const galleryAlt = arrayAlt.map(link => link.getAttribute("aria-label"));

        arraySrc.forEach(link => link.addEventListener("click", e => {
            e.preventDefault();
            new Lightbox(e.currentTarget.getAttribute("href"), gallerySrc, e.currentTarget.getAttribute("aria-label"), galleryAlt);
        }));
    }

    loadMedia(srcTxt, altTxt) {
        const extension = srcTxt.split(".").pop();
        this.srcTxt = null;
        this.altTxt = null;

        console.log(this.element.querySelector(".lightbox_container"));

        if(extension == "jpg") {
            // const image = new Image();
            const image = document.createElement("img");
            // image.controls = true;
            const containerImage = this.element.querySelector(".lightbox_container");
            const loader = document.createElement("div");
            loader.classList.add("lightbox_loader");
            containerImage.innerHTML = "";

            containerImage.appendChild(loader);
            
            image.onload = () => {
                this.srcTxt = srcTxt;
                this.altTxt = altTxt;
                containerImage.removeChild(loader);
                containerImage.appendChild(image);
            };
            image.src = srcTxt;
            image.alt = altTxt;
        }

        else if(extension == "mp4") {
            const video = document.createElement("video");
            video.controls = true;
            // ajout de sous titre
            video.innerHTML = `<track kind="subtitles" src="${srcTxt}.vtt" srclang="fr" label="Français">`;
            const containerVideo = this.element.querySelector(".lightbox_container");
            const loader = document.createElement("div");
            loader.classList.add("lightbox_loader");
            containerVideo.innerHTML = "";

            containerVideo.appendChild(loader);
          
            video.onloadstart  = () => {
                this.srcTxt = srcTxt;
                containerVideo.removeChild(loader);
                containerVideo.appendChild(video);
            };
            video.src = srcTxt;
            video.alt = altTxt;
        }
        
    }

    /**
     * Ferme la lightbox via touche ESC
     * Image precedente de la lightbox via touche gauche
     * Image suivante de la lightbox via touche droite
     * @param {KeyboardEvent} e 
     */
    onKeyUp(e) {
        if      (e.key === "Escape")     { this.close(e); }
        else if (e.key === "ArrowLeft")  { this.prev(e); }
        else if (e.key === "ArrowRight") { this.next(e); }
    }

    /**
     * Ferme la livebox
     * @param {MouseEvent|KeyboardEvent} e 
     */
    close(e) {
        e.preventDefault();
        this.element.classList.add("fadeOut");
        window.setTimeout(() => {
            this.element.parentElement.removeChild(this.element);
        }, 500);
        document.removeEventListener("keyup", this.onKeyUp);
        mainContainer.setAttribute("aria-hidden", "false");
        photoContainer.setAttribute("aria-hidden", "true");
        window.location.reload(true);
    }

    /**
     * Passe à l'image suivante
     * @param {MouseEvent|KeyboardEvent} e 
     */
    next(e) {
        e.preventDefault();
        // debugger
        let i = this.srcArray.findIndex(image => image === this.srcTxt);
        let j = this.altArray.findIndex(alt => alt === this.altTxt);
        if (i === this.srcArray.length - 1) { i = -1; }
        if (j === this.altArray.length - 1) { j = -1; }
        this.loadMedia(this.srcArray[i + 1], this.altArray[j + 1]);
    }

    /**
     * Passe à l'image suivante
     * @param {MouseEvent|KeyboardEvent} e 
     */
    prev(e) {
        e.preventDefault();
        let i = this.srcArray.findIndex(image => image === this.srcTxt);
        let j = this.altArray.findIndex(alt => alt === this.altTxt);
        if (i === 0) { i = this.srcArray.length; }
        if (j === 0) { j = this.altArray.length; }
        this.loadMedia(this.srcArray[i - 1], this.altArray[i - 1]);
    }

    /**
     * @param {string} srcTxt URL de l'image
     * @return {HTMLElement}
     */
    buildDOM() {
        mainContainer.setAttribute("aria-hidden", "true");
        photoContainer.setAttribute("aria-hidden", "false");
        document.getElementById("identity_card").style.display = "none";
        document.getElementById("portfolio").style.display = "none";
        document.getElementById("bloc_counter").style.display = "none";
        document.getElementById("portfolio_photos").style.display = "none";
        document.getElementById("banner").style.display = "none";

        const dom = document.createElement("div");
        dom.classList.add("lightbox_bground");
        dom.innerHTML = `
            <button aria-label="bouton fermer" class="lightbox_close">Fermer</button>
            <button aria-label="bouton suivant" class="lightbox_next">Suivant</button>
            <button aria-label="bouton précédent" class="lightbox_prev">Précédent</button>
            <div class="lightbox_container"></div>
        `;
        dom.querySelector(".lightbox_close").addEventListener("click", this.close.bind(this));
        dom.querySelector(".lightbox_next").addEventListener("click", this.next.bind(this));
        dom.querySelector(".lightbox_prev").addEventListener("click", this.prev.bind(this));
        return dom;
    }
}
// #endregion ============ LIGHTBOX