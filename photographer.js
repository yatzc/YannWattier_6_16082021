// #region ======================== PAGE photographer

// #region ============ MAIN
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

// #region ============ identifiant du photographe
      const identity = data.photographers.filter( function(identifiant){
        return identifiant.id == photographeId;
      });

      // titre onglet (Fisheye - nom photographe)
      document.getElementById("onglet").innerHTML = "Fisheye - " + identity[0].name;

      // name
      document.getElementById("name").innerHTML = identity[0].name;
      // city + country
      document.getElementById("place").innerHTML = identity[0].city + ", " + identity[0].country;
      // tagline
      document.getElementById("tagline").innerHTML = identity[0].tagline;
      // tags
      function tags(tag) {
        return `
          ${tag.map(tag => `<a href="#" class="btn_tag" data-filter="${tag}" >#${tag}</a>`).join("")}
        `;
      }
      document.querySelector(".filter-box").innerHTML = tags(identity[0].tags.sort());
      // Photo
      document.querySelector("#photo_photographer").src = "./Photos/Photographers_ID_Photos/" + identity[0].portrait;
// #endregion ============ identifiant du photographe

// #region ============ PORTFOLIO
      // media du photographe
      const photos = data.media.filter(donnees => donnees.photographerId == photographeId);

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

    if(e.keyCode === 38 && e.target.previousElementSibling) { // up
      e.target.previousElementSibling.focus();
    } else if(e.keyCode === 40 && e.target.nextElementSibling) { // down
      e.target.nextElementSibling.focus();
    } else if(e.keyCode === 27) { // escape key
      this.toggle(false);
    } else if(e.keyCode === 13 || e.keyCode === 32) { // enter or spacebar key
      setValue(e.target);
    }
  }

  const handleToggleKeyPress = (e) => {
    e.preventDefault();

    if(e.keyCode === 27) { // escape key
      this.toggle(false);
    } else if(e.keyCode === 13 || e.keyCode === 32) { // enter or spacebar key
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

const dropDown = new DropDown(document.querySelector('.dropdown'));
  
dropDown.element.addEventListener('change', e => {
  console.log('changed', dropDown.value);
  mediaSort(dropDown.value);
});

dropDown.element.addEventListener('opened', e => {
  console.log('opened', dropDown.value);
});

dropDown.element.addEventListener('closed', e => {
  console.log('closed', dropDown.value);
});

// dropDown.toggle();

// #endregion ============ SELECT

// #region ============ Le tri par SELECT

    function mediaSort(articles) {
      switch (articles.innerText) {
        case "Popularité":
          photos.sort((a, b) => b.likes - a.likes);
          break;
        case "Date":
          photos.sort((a, b) => new Date(b.date) - new Date(a.date));
          break;
        case "Titre":
          photos.sort(function (a, b) {
            if (a.title.toLowerCase() < b.title.toLowerCase()) { return -1; }
            if (a.title.toLowerCase() > b.title.toLowerCase()) { return 1; } 
            else { return 0; }
          });
          break;
      }
    }

// #endregion ============ Le tri par SELECT


      function photoTemplate(photo) {
        return `
        <article class="photo_article ${photo.tags}">
          <div class="photo_flex">
            <a  href="./Photos/${photographeId}/${photo.image}">
              <img alt="" aria-labelledby="overflow_ellipsis" role="button" src="./Photos/${photographeId}/small/${photo.image}">
            </a>
            <div class="photo_foot">
              <p class="overflow_ellipsis">${photo.title}</p>
              <div class="media_likes">
                <p data-datanblike="0" data-id="${photo.id}" class="number_like" >${photo.likes}</p>
                <button data-like="false" data-id="${photo.id}" class="btn_heart"><i class="fas fa-heart"></i></button>
              </div>
            </div>
          </div>
        </article>
        `;
      }
              
      document.getElementById("portfolio_photos").innerHTML = `${photos.map(photoTemplate).join("")}`;
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
        addOneLike();
      }

      function calculateLikes() {
        const numberLike = document.querySelectorAll('.media_likes button[data-like="true"]').length;
        document.querySelector(".count").innerHTML = numberLike  + totalLikesJSON;
      }

      // =============== LIKE from likes JSON
      let totalLikesJSON = 0;

      for(let i = 0; i < photos.length; i++) {
        // console.log(photos[i].likes);
        totalLikesJSON += photos[i].likes;
      }



// const arr = [10, 20, 30];
// const reducer = (acc, curr) => acc + curr;
// console.log(arr.reduce(reducer));


      // console.log(totalLikesJSON);
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

// #region ============ DOM ELEMENTS FORM + lightbox
// FORM
const formBtnOpen    = document.querySelectorAll(".btn_contact");
const formBg         = document.querySelector(".bground");
const formCrossClose = document.querySelectorAll(".close");
// lightbox
const lightboxBtnOpen    = document.querySelectorAll(".test");
const lightboxBg         = document.querySelector(".lightbox_bground");
const lightboxCrossClose = document.querySelectorAll(".lightbox_close");
// #endregion ============ DOM ELEMENTS FORM + lightbox

// #region ============ FORM

// open form (btn)
formBtnOpen.forEach((btn) => btn.addEventListener("click", openBtnForm));
function openBtnForm(e) {
  formBg.style.display = "block";
  form.reset();
  form.first.style.border = "none";
  form.last.style.border = "none";
  form.email.style.border = "none";
}

// close form (cross)
formCrossClose.forEach((btn) => btn.addEventListener("click", closeBtnForm));
function closeBtnForm() {
  formBg.style.display = "none";
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
    validBirthdate(form.birthdate)
  ) {
    formBg.style.display = "none";
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
// #endregion ============ LIGHTBOX

// #region ============ Class Media factory






class VideoMedia {
  constructor(optionOfMedia) {
    this.optionOfMedia  = optionOfMedia;

    function create(parameter, data) {
      return new VideoMedia( data[parameter] ?? 1 );
    }
  }
  
}

class ImageMedia {
  constructor(optionOfMedia) {
    this.optionOfMedia  = optionOfMedia;

    function create(data) {
      return new ImageMedia( data[parameter] ?? 1 );
    }
  }
}


// static function findType(parameter, data) {
//   const parameter = Image;
//   switch (parameter) {
//     case 'video':
//       console.log('Test video.');
//       return new VideoMedia(data.media['video']);
//       break;
//     case 'image':
//       console.log('Test image');
//       return new ImageMedia(data.media['image']);
//       break;
//     default:
//       console.log(`Error.`);
//   }
// }

  






// #endregion ======================== PAGE photographer



// #region CODE JL
// const datas = data.photographers.filter(donnees => donnees.id == photographeId);
// console.log(datas);

// console.log(JSON.stringify(identity))
// #endregion