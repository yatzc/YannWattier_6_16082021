// #region ============ DOM ELEMENTS
// MAIN
const mainContainer = document.querySelector("#main_container");
// FORM
const formBtnOpen    = document.querySelectorAll(".btn_contact");
const formBg         = document.querySelector(".bground");
const formCrossClose = document.querySelectorAll(".close");

// lightbox
const photoContainer = document.querySelector("#portfolio_photos");
const lightboxBtnOpen    = document.querySelectorAll(".test");
const lightboxBg         = document.querySelector(".lightbox_bground");
const lightboxCrossClose = document.querySelectorAll(".lightbox_close");
const lightboxBtnClose = document.querySelector("#btn_message");
// #endregion ============ DOM ELEMENTS

// #region ============ MAIN
let searchParams = new URLSearchParams(window.location.search);

//test si id est dans url
if (searchParams.has(`id`)) {
  // récupération id dans variable
  let photographeId = searchParams.get(`id`);
  // garder l'id lors de la validation du formulaire
  document.querySelector("#id").value = photographeId;


  // APPEL PHOTOGRATHER JSON
  fetch('./data/FishEyeData.json').then(response => { return response.json(); })
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

// #region ============ SELECT

      function DropDown(dropDown) {
        const [toggler, menu] = dropDown.children;
        
        const handleClickOut = e => {
          if(!dropDown) {
            return document.removeEventListener('click', handleClickOut);
            
          }
          if(!dropDown.contains(e.target)) {
            this.toggle(false);
          }
        };
        
        const setValue = (item) => {
          const val = item.textContent;
          toggler.textContent = val;
          this.value = val;
          this.toggle(false);
          dropDown.dispatchEvent(new Event('change'));
          toggler.focus();
        }
        
        const handleItemKeyDown = (e) => {
          e.preventDefault();

          if(e.keyCode === 38 && e.target.previousElementSibling) {
            e.target.previousElementSibling.focus();
          } else if(e.keyCode === 40 && e.target.nextElementSibling) {
            e.target.nextElementSibling.focus();
          } else if(e.keyCode === 27) {
            this.toggle(false);
          } else if(e.keyCode === 13 || e.keyCode === 32) {
            setValue(e.target);
          }
        }

        const handleToggleKeyPress = (e) => {
          e.preventDefault();

          if(e.keyCode === 27) {
            this.toggle(false);
          } else if(e.keyCode === 13 || e.keyCode === 32) {
            this.toggle(true);
          }
        }
        
        toggler.addEventListener('keydown', handleToggleKeyPress);
        toggler.addEventListener('click', () => this.toggle());
        [...menu.children].forEach(item => {
          item.addEventListener('keydown', handleItemKeyDown);
          item.addEventListener('click', () => setValue(item));
        });
        
        this.element = dropDown;
        
        this.value = toggler.textContent;
        
        this.toggle = (expand = null) => {
          expand = expand === null
            ? menu.getAttribute('aria-expanded') !== 'true'
            : expand;

          menu.setAttribute('aria-expanded', expand);
          
          if(expand) {
            toggler.classList.add('active');
            menu.children[0].focus();
            document.addEventListener('click', handleClickOut);
            dropDown.dispatchEvent(new Event('opened'));
          } else {
            toggler.classList.remove('active');
            dropDown.dispatchEvent(new Event('closed'));
            document.removeEventListener('click', handleClickOut);
          }
        }
      }

      var dropDown = new DropDown(document.querySelector('.dropdown'));
        
      dropDown.element.addEventListener('change', e => {
        // console.log('changed', dropDown.value);
        mediaSort(dropDown.value);
      });

// dropDown.toggle();

// #endregion ============ SELECT

// #region ============ Le tri par SELECT
    
      function mediaSort(styleMedia) {
        if (styleMedia == "") { theMediasOfPhotographer = theMediasOfPhotographer; }
        else if (styleMedia == "Popularité") { theMediasOfPhotographer.sort((a, b) => b.likes - a.likes); }
        else if (styleMedia == "Date")       { theMediasOfPhotographer.sort((a, b) => new Date(b.date) - new Date(a.date)); }
        else if (styleMedia == "Titre")      { theMediasOfPhotographer.sort(function (a, b) {
          if (a.title.toLowerCase() < b.title.toLowerCase()) { return -1; }
          if (a.title.toLowerCase() > b.title.toLowerCase()) { return  1; } 
          return  0;
        })}

// #region ============ Affichage photo card par tri

                
        document.getElementById("portfolio_photos").innerHTML = `${theMediasOfPhotographer.map(mediaTemplate).join("")}`;

        Lightbox.init();   
// #endregion ============ Affichage photo card
        
      }

// #endregion ============ Le tri par SELECT

// #region ============ Affichage photo card
      function mediaTemplate(mediaPhotographer) {
        return `
        <article class="photo_article ${mediaPhotographer.tags}">
          <div class="photo_flex">
            ${toggleMedia(mediaPhotographer)}
            <div class="photo_foot">
              <p tabindex="0" class="media_text">${mediaPhotographer.title}</p>
              <p tabindex="0" class="media_price">${mediaPhotographer.price}€</p>
              <div class="media_likes">
                <p tabindex="0" data-datanblike="0" data-id="${mediaPhotographer.id}" class="number_like" >${mediaPhotographer.likes}</p>
                <button data-like="false" data-id="${mediaPhotographer.id}" class="btn_heart"><i class="fas fa-heart"></i></button>
              </div>
            </div>
          </div>
        </article>
        `;
      }
      // Fonction qui affiche les photos et fait lien avec soit video soit photo en fonction du media json
      function toggleMedia(isMedia) {
        if (isMedia.image) { 
          return (`<a href="./Photos/${photographeId}/${isMedia.image}"><img role="img" alt="${isMedia.description}" role="button" src="./Photos/${photographeId}/small/${isMedia.image}"></a>`); }
        else if (isMedia.video) {
          let file = isMedia.video;
          file = file.substr(0, file.lastIndexOf(".")) + ".jpg";
          return (`<a href="./Photos/${photographeId}/${isMedia.video}"><img role="img" alt="${isMedia.description}" role="button" src="./Photos/${photographeId}/small/${file}"></a>`); }
      }
              
      document.getElementById("portfolio_photos").innerHTML = `${theMediasOfPhotographer.map(mediaTemplate).join("")}`;
// #endregion ============ Affichage photo card

// #endregion ============ PORTFOLIO

// #region ============ LIKES COUNT
      // =============== LIKE from add heart
      const hearts = document.querySelectorAll('.media_likes button');

      hearts.forEach(heart => {
        heart.addEventListener('click', isLike);
      })
      function isLike() {
        this.dataset.like = this.dataset.like == "true" ? "false" : "true";
        this.dataset.datanblike = this.dataset.datanblike == 1 ? 0 : 1;
        
        // Get id
        let numberLikePhoto = parseInt(document.querySelector('.media_likes p[data-id="'+this.dataset.id+'"]').innerHTML);
        if(this.dataset.datanblike == 0)
          numberLikePhoto--;
        else
          numberLikePhoto++;

        // Update on DOM
        document.querySelector('.media_likes p[data-id="'+this.dataset.id+'"]').innerHTML = numberLikePhoto;

        calculateLikes();
      }

      function calculateLikes() {
        const numberLike = document.querySelectorAll('.media_likes button[data-like="true"]').length;
        document.querySelector(".count").innerHTML = numberLike  + totalLikesJSON;
      }

      // =============== LIKE from likes JSON
      let totalLikesJSON = 0;

      for(let i = 0; i < theMediasOfPhotographer.length; i++) {
        totalLikesJSON += theMediasOfPhotographer[i].likes;
      }

      document.querySelector(".count").innerHTML = totalLikesJSON;
      document.querySelector(".price").innerHTML = identity[0].price + "€/jour";


      // Add one like to photo



// #endregion ============ LIKES COUNT            

// #region ============ TAGS photo style

      const btns = document.querySelectorAll('.btn_tag');
      const storePhoto = document.querySelectorAll('.photo_article');

      for (let i = 0; i < btns.length; i++) {

          btns[i].addEventListener('click', (e) => {
              e.preventDefault();
              
              const filter = e.target.dataset.filter;
              console.log(filter);
              
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

      Lightbox.init();        

    }).catch(err => {
        // Do something for an error here
    });

} else {
    // Si id photographer KO : redirection vers index.html
    window.location.pathname = `index.html`;
}
// #endregion ============ MAIN

// #region ============ FORM

// open form (btn)
formBtnOpen.forEach((btn) => btn.addEventListener("click", openBtnForm));
function openBtnForm(e) {
  formBg.style.display = "block";
  form.reset();
  // history.pushState({}, "", "photographer.html?id=" + photographeId);
  form.first.style.border = "none";
  form.last.style.border = "none";
  form.email.style.border = "none";
  form.textarea.style.border = "none";
  smallFirst.style.display = "none";
  smallLast.style.display = "none";
  smallEmail.style.display = "none";
  smallTextarea.style.display = "none";
  mainContainer.setAttribute('aria-hidden', 'true');
  formBg.setAttribute('aria-hidden', 'false');
  lightboxBtnClose.focus();
}

// close form (cross)
formCrossClose.forEach((btn) => btn.addEventListener("click", closeBtnForm));
function closeBtnForm() {
  formBg.style.display = "none";
  mainContainer.setAttribute('aria-hidden', 'false');
  formBg.setAttribute('aria-hidden', 'true');
  formBtnOpen.focus();
}
// close form (key escape)
window.addEventListener("keydown", checkKeyPress, false);
function checkKeyPress(key) {
  if(key.keyCode === 27) { formBg.style.display = "none"; }
  mainContainer.setAttribute('aria-hidden', 'false');
  formBg.setAttribute('aria-hidden', 'true');
  // formBtnOpen.focus();
}

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
  let textareaRegExp = new RegExp("^[a-zA-Z]{2,20}$", "g");

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
    mainContainer.setAttribute('aria-hidden', 'false');
    formBg.setAttribute('aria-hidden', 'true');
    formBtnOpen.focus();
    
    let searchParamsForm = new URLSearchParams(window.location.search);
    console.log(
      "ID = " +
      searchParamsForm.get(`id`) +
      " First = " +
      searchParamsForm.get(`first`) +
      " Last = " +
      searchParamsForm.get(`last`) +
      " Email = " +
      searchParamsForm.get(`email`) +
      " Textarea = " +
      searchParamsForm.get(`textarea`)
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
 * @param {string[]} images liste des URL des images du diaporama
 * @param {string} url image actuel dans la lightbox
 */
class Lightbox {

  static init() {
    const links = Array.from(document.querySelectorAll('a[href$=".jpg"], a[href$=".mp4"]'))
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
    this.element = this.buildDOM(url);
    this.images = images;
    this.loadMedia(url);
    this.onKeyUp = this.onKeyUp.bind(this);
    document.body.appendChild(this.element);
    document.addEventListener('keyup', this.onKeyUp);
  }

  loadMedia(url) {
    const extension = url.split('.').pop();
    this.url = null;

    if(extension == 'jpg') {
      // const image = new Image();
      const image = document.createElement('img');
      image.controls = true;
      const containerImage = this.element.querySelector('.lightbox_container');
      const loader = document.createElement('div');
      loader.classList.add('lightbox_loader');
      containerImage.innerHTML = '';

      containerImage.appendChild(loader);
      
      image.onload = () => {
        this.url = url;
        containerImage.removeChild(loader);
        containerImage.appendChild(image);
      }
      image.src = url;
    }

    else if(extension == 'mp4') {
      const video = document.createElement('video');
      video.controls = true;
      // ajout de sous titre
      video.innerHTML = `<track kind="subtitles" src="${url}.vtt" srclang="fr" label="Français">`;
      const containerVideo = this.element.querySelector('.lightbox_container');
      const loader = document.createElement('div');
      loader.classList.add('lightbox_loader');
      containerVideo.innerHTML = '';

      containerVideo.appendChild(loader);
      
      video.onloadstart  = () => {
        this.url = url;
        containerVideo.removeChild(loader);
        containerVideo.appendChild(video);
        
      }
      video.src = url;
    }
    
  }

  /**
   * Ferme la lightbox via touche ESC
   * Image precedente de la lightbox via touche gauche
   * Image suivante de la lightbox via touche droite
   * @param {KeyboardEvent} e 
   */
  onKeyUp(e) {
    if      (e.key === 'Escape')     { this.close(e) }
    else if (e.key === 'ArrowLeft')  { this.prev(e) }
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
    mainContainer.setAttribute('aria-hidden', 'false');
    photoContainer.setAttribute('aria-hidden', 'true');
  }

  /**
   * Passe à l'image suivante
   * @param {MouseEvent|KeyboardEvent} e 
   */
  next(e) {
    e.preventDefault()
    // debugger
    let i = this.images.findIndex(image => image === this.url)
    if (i === this.images.length - 1) {
        i = -1;
    }
    this.loadMedia(this.images[i + 1])
  }

  /**
   * Passe à l'image suivante
   * @param {MouseEvent|KeyboardEvent} e 
   */
  prev(e) {
    e.preventDefault()
    let i = this.images.findIndex(image => image === this.url)
    if (i === 0) {
        i = this.images.length;
    }
    this.loadMedia(this.images[i - 1])
  }

  /**
   * @param {string} url URL de l'image
   * @return {HTMLElement}
   */
  buildDOM(url) {
    mainContainer.setAttribute('aria-hidden', 'true');
    photoContainer.setAttribute('aria-hidden', 'false');

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
// #endregion ============ LIGHTBOX

// #endregion ======================== PAGE photographer

