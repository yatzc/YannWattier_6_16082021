// #region ======================== PAGE photographer

// #region ============ CARD
let searchParams = new URLSearchParams(window.location.search);

//test si id est dans url
// console.log(searchParams.has(`id`));

if (searchParams.has(`id`)) {
    // code à effectuer
    let photographeId = searchParams.get(`id`);
    // console.log(photographeId);


    // APPEL PHOTOGATHER JSON
    fetch('./FishEyeData.json').then(response => { return response.json(); })
        .then(data => {

            const identity = data.photographers.filter( function(identifiant){
              return identifiant.id == photographeId;
            });

            // onglet
            const onglet = document.getElementById("onglet");
            onglet.innerHTML = "Fisheye - " + identity[0].name;

            // name
            const name = document.getElementById("name");
            name.innerHTML = identity[0].name;
            // city + country
            const place = document.getElementById("place");
            place.innerHTML = identity[0].city + ", " + identity[0].country;
            // tagline
            const tagline = document.getElementById("tagline");
            tagline.innerHTML = identity[0].tagline;
            // tags
            function tags(tag) {
              return `
              <a href="">
                <ul class="tag-list">
                    ${tag.map(tag => `<li><button class="btn_tag">#${tag}</button></li>`).join("")}
                </ul>
              </a>
              `;
            }

            (function() { document.querySelector("#identity_card_tags").innerHTML = tags(identity[0].tags.sort()); }())
            // Photo
            const img = document.querySelector("#photo_photographer");
            img.src = "./Photos/Photographers_ID_Photos/" + identity[0].portrait;

            // ============================================ PORTFOLIO
            const photos = data.media.filter(donnees => donnees.photographerId == photographeId);
// console.table(photos);

            function photoTemplate(photo) {
              return `
              <article class="photo_article">
                <div class="photo_flex">
                  <a href="./Photos/${photographeId}/${photo.image}">
                    <img src="./Photos/${photographeId}/${photo.image}">
                  </a>
                  <p>${photo.title}</p>
                </div>
              </article>
              `;
            }
                    
            document.getElementById("portfolio_photos").innerHTML = `
                ${photos.map(photoTemplate).join("")}
            `;

            Lightbox.init();        

    }).catch(err => {
        // Do something for an error here
    });

} else {
    // proposition redirection vers index.html
    window.location.pathname = `index.html`;
}
// #endregion

// #region ============ SELECT
function updated(element) {
    let idx     = element.selectedIndex;
    let val     = element.options[idx].value;
    let content = element.options[idx].innerHTML;
    alert(val + " " + content);
}
// #endregion

// #region ============ DOM ELEMENTS photographer page
// FORM
const formBtnOpen    = document.querySelectorAll(".btn_contact");
const formBg         = document.querySelector(".bground");
const formCrossClose = document.querySelectorAll(".close");
// lightbox
const lightboxBtnOpen    = document.querySelectorAll(".test");
const lightboxBg         = document.querySelector(".lightbox_bground");
const lightboxCrossClose = document.querySelectorAll(".lightbox_close");
// #endregion

// #region ============ FORM

// open form (btn)
formBtnOpen.forEach((btn) => btn.addEventListener("click", openBtnForm));
function openBtnForm(e) {
  formBg.style.display = "block";
  form.reset();
//   form.first.style.border = "none";
//   form.last.style.border = "none";
//   form.email.style.border = "none";
//   history.pushState({}, "", "index.html");
//   firstSmall.style.display = "none";
//   lastSmall.style.display = "none";
//   emailSmall.style.display = "none";
}

// close form (cross)
formCrossClose.forEach((btn) => btn.addEventListener("click", closeBtnForm));
function closeBtnForm() {
  formBg.style.display = "none";
}

//#region ==== CONDITION RULES
let form = document.querySelector("#recordingForm");

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
    return true;
  } else {
    small.style.display = "inline-block";
    small.innerHTML = "Vous devez entrer 2 caractères ou plus.";
    small.classList.add("text-danger");
    inputFirst.style.border = "red solid 2px";
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
    return true;
  } else {
    small.style.display = "inline-block";
    small.innerHTML = "Vous devez entrer 2 caractères ou plus.";
    small.classList.add("text-danger");
    inputLast.style.border = "red solid 2px";
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
    return true;
  } else {
    small.style.display = "inline-block";
    small.innerHTML = "Vous devez entrer une adresse email valide.";
    small.classList.add("text-danger");
    inputEmail.style.border = "red solid 2px";
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
    validBirthdate(form.birthdate) &&
    validQuantity(form.quantity) &&
    validCondition(form.checkbox1)
  ) {
    formBg.style.display = "none";
    thanksBg.style.display = "block";
    e.preventDefault();
  } else {
    formBg.style.display = "block";
    e.preventDefault();
  }
});
//#endregion

// #endregion

// #region ============ LIGHTBOX

// // open lightbox (btn)
// lightboxBtnOpen.forEach((btn) => btn.addEventListener("click", openBtnLightbox));
// function openBtnLightbox(e) {
//   lightboxBg.style.display = "block";
// }

// // close lightbox (cross)
// lightboxCrossClose.forEach((btn) => btn.addEventListener("click", closeBtnLightbox));
// function closeBtnLightbox() {
//   lightboxBg.style.display = "none";
// }


/**
 * @param {HTMLElement} element
 * @param {string[]} images liste des URL des images du diaporama
 * @param {string} url image actuel dans la lightbox
 */
class Lightbox {
  static init() {
    const links = Array.from(document.querySelectorAll('a[href$=".jpg"], a[href$="300"]'))
    const gallery = links.map(link => link.getAttribute('href'))
    // debugger
    links.forEach(link => link.addEventListener('click', e => {
        e.preventDefault()
        new Lightbox(e.currentTarget.getAttribute('href'), gallery)
    }))
  }

  /**
   * @param {string} url URL de l'image
   * @param {string[]} images liste des URL des images du diaporama
   */
  constructor(url, images) {
    this.element = this.buildDOM(url)
    this.images = images
    this.loadImage(url)
    this.onKeyUp = this.onKeyUp.bind(this)
    document.body.appendChild(this.element)
    document.addEventListener('keyup', this.onKeyUp)
  }

  loadImage(url) {
    this.url = null
    const image = new Image();
    const container = this.element.querySelector('.lightbox_container')
    const loader = document.createElement('div')
    loader.classList.add('lightbox_loader')
    container.innerHTML = ''
    container.appendChild(loader)
    image.onload = () => {
      container.removeChild(loader)
      container.appendChild(image)
      this.url = url
    }

    image.src = url
  }


  /**
   * Ferme la lightbox via touche ESC
   * Image precedente de la lightbox via touche gauche
   * Image suivante de la lightbox via touche droite
   * @param {KeyboardEvent} e 
   */
  onKeyUp(e) {
    if      (e.key === 'Escape') { this.close(e) }
    else if (e.key === 'ArrowLeft') { this.prev(e) }
    else if (e.key === 'ArrowRight') { this.next(e) }
  }

  /**
   * Ferme la livebox
   * @param {MouseEvent|KeyboardEvent} e 
   */
  close(e) {
    e.preventDefault()
    this.element.classList.add('fadeOut')
    window.setTimeout(() => {
        this.element.parentElement.removeChild(this.element)
    }, 500)
    document.removeEventListener('keyup', this.onKeyUp)
  }

  /**
   * Passe à l'image suivante
   * @param {MouseEvent|KeyboardEvent} e 
   */
  next(e) {
    e.preventDefault()
    let i = this.images.findIndex(image => image === this.url)
    if (i === this.images.length - 1) {
        i = -1
    }
    this.loadImage(this.images[i + 1])
  }

  /**
   * Passe à l'image suivante
   * @param {MouseEvent|KeyboardEvent} e 
   */
  prev(e) {
    e.preventDefault()
    let i = this.images.findIndex(image => image === this.url)
    if (i === 0) {
        i = this.images.length
    }
    this.loadImage(this.images[i + - 1])
  }

  /**
   * @param {string} url URL de l'image
   * @return {HTMLElement}
   */
  buildDOM(url) {
    const dom = document.createElement('div')
    dom.classList.add('lightbox_bground')
    dom.innerHTML = `
        <button class="lightbox_close">Fermer</button>
        <button class="lightbox_next">Suivant</button>
        <button class="lightbox_prev">Précédent</button>
        <div class="lightbox_container"></div>
    `
    dom.querySelector('.lightbox_close').addEventListener('click', this.close.bind(this))
    dom.querySelector('.lightbox_next').addEventListener('click', this.next.bind(this))
    dom.querySelector('.lightbox_prev').addEventListener('click', this.prev.bind(this))
    return dom
  }
}
// #endregion

// #endregion

// #region CODE JL
// const datas = data.photographers.filter(donnees => donnees.id == photographeId);
// console.log(datas);

// console.log(JSON.stringify(identity))
// #endregion