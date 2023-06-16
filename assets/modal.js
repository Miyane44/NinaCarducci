let modal = null;

const gallery = document.querySelector('.gallery');

const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(galleryItem => galleryItem.addEventListener("click", openModal));

var tagsCollection = [];

const options = {
    columns: {
        xs: 1,
        sm: 2,
        md: 3,
        lg: 3,
        xl: 3
    },
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "top",
    navigation: true
};

createModal();

createRowWrapper();

galleryItems.forEach(galleryItem => createTagsCollection(galleryItem));
galleryItems.forEach(galleryItem => responsiveImageItem(galleryItem));
galleryItems.forEach(galleryItem => moveItemInRowWrapper(galleryItem));
galleryItems.forEach(galleryItem => wrapItemInColumn(galleryItem, options.columns));

displayShowItemTags();

function createModal() {

    const divModal = document.createElement('div');
    divModal.className = "modal fade";
    divModal.id = "myAwesomeLightbox";
    divModal.tabIndex = -1;
    divModal.role = "dialog";
    divModal.ariaHidden = "true";

    const modal = `<div class="modal-dialog" role="document">
    <div class="modal-content js-modal-stop">
    <div class="modal-body">
    <div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;">&lt;</div>
    <img class="lightboxImage img-fluid" alt="Contenu de l'image affichée dans la modale au clic">
    <div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">&gt;</div>
    </div>
    </div>
    </div>`

    divModal.innerHTML = modal;

    gallery.appendChild(divModal);
}

function createRowWrapper() {
    const galleryItemsRow = document.createElement('div');

    if (gallery.firstChild.className !== "gallery-items-row row") {
        galleryItemsRow.className = "gallery-items-row row";
        gallery.appendChild(galleryItemsRow);
    }
}

function createTagsCollection(element) {
    var theTag = element.getAttribute('data-gallery-tag');
    if (options.showTags && theTag !== undefined && tagsCollection.indexOf(theTag) === -1) {
        tagsCollection.push(theTag);
    }
}

const filters = document.querySelectorAll('.nav-link');
filters.forEach(filter => filter.addEventListener("click", function () {

    if (filter.classList.contains("active-tag")) {
      return;
    }
    
    const activeFilter = document.querySelector(".active-tag");
    activeFilter.classList.remove("active-tag");
    activeFilter.classList.add("clickable");

    filter.classList.add("active-tag");
    filter.classList.remove("clickable");

    var tag = filter.getAttribute("data-images-toggle");

    galleryItems.forEach(function(galleryItem) {
        
        const parent = galleryItem.parentNode;
        parent.style.display = 'none';
        if (tag === "all") {
            parent.style.display = null;

        } else if (galleryItem.getAttribute("data-gallery-tag") === tag) {
            parent.style.display = null;
        } 
    });
}));

function responsiveImageItem(element) {
    if (element.tagName === "IMG") {
      element.classList.add("img-fluid");
    }
  }

function moveItemInRowWrapper(element) {
    const galleryItemsRow = document.querySelector('.gallery-items-row')

    galleryItemsRow.appendChild(element);
}

function wrapItemInColumn(element, columns) {
    const galleryItemsRow = document.querySelector('.gallery-items-row');

    const divImg = document.createElement('div');

    if (columns.constructor === Number) {
        var number = Math.ceil(12 / columns);
        
        divImg.className = 'item-column mb-4 col-' + number;
    
        divImg.appendChild(element);
        galleryItemsRow.appendChild(divImg);

    } else if (columns.constructor === Object) {
        var columnClasses = "";
        var number;
        if (columns.xs) {
            number = Math.ceil(12 / columns.xs);
            columnClasses += "col-" + number + " ";
        }
        if (columns.sm) {
            number = Math.ceil(12 / columns.sm);
            columnClasses += "col-sm-" + number + " ";
        }
        if (columns.md) {
            number = Math.ceil(12 / columns.md);
            columnClasses += "col-md-" + number + " ";
        }
        if (columns.lg) {
            number = Math.ceil(12 / columns.lg);
            columnClasses += "col-lg-" + number + " ";
        }
        if (columns.xl) {
            number = Math.ceil(12 / columns.xl);
            columnClasses += "col-xl-" + number;
        }
        divImg.className = "item-column mb-4 " + columnClasses;

        divImg.appendChild(element);
        galleryItemsRow.appendChild(divImg);
    } else {
        console.error(`Columns should be defined as numbers or objects. ${typeof columns} is not supported.`);
    }
}

function displayShowItemTags() {
    if (options.showTags) {
        showItemTags(gallery, options.tagsPosition, tagsCollection);
    }
}

function showItemTags(gallery, position, tags) {
    var tagItems =
    '<li class="nav-item"><span class="nav-link active-tag"  data-images-toggle="all">Tous</span></li>';
    tags.forEach(function(value) {
        tagItems += `<li class="nav-item">
        <span class="nav-link clickable"  data-images-toggle="${value}">${value}</span></li>`;
    });
    var tagsList = document.createElement('ul');
    tagsList.className = "my-4 tags-bar nav nav-pills";
    tagsList.innerHTML = tagItems;
    
    if (position === "bottom") {
        gallery.appendChild(tagsList);
    } else if (position === "top") {
        gallery.prepend(tagsList);
    } else {
        console.error(`Unknown tags position: ${position}`);
    }
}

function openModal(event) {

    event.preventDefault();

    modal = document.querySelector(".modal");
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
    modal.classList.add("show");
    modal.style.display = "block";

    modal.addEventListener('click', closeModal);
    
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);

    const image = document.querySelector(".lightboxImage");
    image.src = event.srcElement.src;
}

const previous = document.querySelectorAll('.mg-prev');
previous.forEach(previousButton => previousButton.addEventListener('click', function() {
    let imagesCollection = [];

    galleryItems.forEach(galleryItem => imagesCollection.push(galleryItem.src));

    const imageActiveSrc = document.querySelector(".lightboxImage").getAttribute('src');

    const index = imagesCollection.indexOf(imageActiveSrc);

    const previousImage = imagesCollection[index - 1] || imagesCollection[imagesCollection.length - 1];

    const image = document.querySelector(".lightboxImage");
    image.src = previousImage;
}));

const next = document.querySelectorAll('.mg-next');
next.forEach(nextButton => nextButton.addEventListener('click', function() {
    let imagesCollection = [];
    
    galleryItems.forEach(galleryItem => imagesCollection.push(galleryItem.src));

    const imageActiveSrc = document.querySelector(".lightboxImage").getAttribute('src');

    const index = imagesCollection.indexOf(imageActiveSrc);

    const nextImage = imagesCollection[index + 1] || imagesCollection[0];

    const image = document.querySelector(".lightboxImage");
    image.src = nextImage;
}));

function closeModal(e) {
    if (modal === null) return;
    e.preventDefault();
    window.setTimeout(function() {
        modal.style.display = "none";
        modal = null;
    }, 500)
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
}

function stopPropagation(e) {
    e.stopPropagation();
};