const darkModeBtn = document.getElementById("darkModeBtn");
const imageCounter = document.getElementById("imageCounter");

const galleryItems = document.querySelectorAll(".gallery-item");
const lightbox = document.querySelector(".lightbox");
const lightboxImg = document.getElementById("lightbox-img");

const closeBtn = document.querySelector(".close");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const filterBtns = document.querySelectorAll(".filter-btn");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let currentIndex = 0;
let activeFilter = "all";

/* GET VISIBLE IMAGES */
function getVisibleImages() {
    return Array.from(galleryItems).filter(img => {

        if (activeFilter === "all") return true;

        if (activeFilter === "favorites") {
            const id = Number(img.dataset.id);
            return favorites.includes(id);
        }

        return img.classList.contains(activeFilter);
    });
}

/* UPDATE COUNTER */
function updateCounter() {
    const visibleImages = getVisibleImages();

    if (!visibleImages.length) return;

    const visibleIndex = visibleImages.indexOf(galleryItems[currentIndex]);

    imageCounter.textContent =
        (visibleIndex + 1) + " / " + visibleImages.length;
}

/* FAVORITES + LIGHTBOX */
galleryItems.forEach((item) => {

    const id = Number(item.dataset.id);

    const heart = document.createElement("span");
    heart.classList.add("favorite");

    heart.innerHTML = favorites.includes(id) ? "♥" : "♡";

    if (favorites.includes(id)) {
        heart.classList.add("active");
    }

    heart.addEventListener("click", (e) => {
        e.stopPropagation();

        if (favorites.includes(id)) {
            favorites = favorites.filter(i => i !== id);
            heart.innerHTML = "♡";
            heart.classList.remove("active");
        } else {
            favorites.push(id);
            heart.innerHTML = "♥";
            heart.classList.add("active");
        }

        localStorage.setItem("favorites", JSON.stringify(favorites));
    });

    item.parentElement.appendChild(heart);

    item.addEventListener("click", () => {

        currentIndex = Number(item.dataset.id);

        lightbox.style.display = "flex";
        lightboxImg.src = item.src;

        document.body.style.overflow = "hidden";

        updateCounter();
    });
});

/* CLOSE */
closeBtn.addEventListener("click", () => {
    lightbox.style.display = "none";
    document.body.style.overflow = "auto";
});

/* NEXT */
nextBtn.addEventListener("click", () => {

    const visibleImages = getVisibleImages();
    let currentVisibleIndex = visibleImages.indexOf(galleryItems[currentIndex]);

    currentVisibleIndex++;

    if (currentVisibleIndex >= visibleImages.length) {
        currentVisibleIndex = 0;
    }

    currentIndex = Number(visibleImages[currentVisibleIndex].dataset.id);

    lightboxImg.src = visibleImages[currentVisibleIndex].src;

    updateCounter();
});

/* PREV */
prevBtn.addEventListener("click", () => {

    const visibleImages = getVisibleImages();
    let currentVisibleIndex = visibleImages.indexOf(galleryItems[currentIndex]);

    currentVisibleIndex--;

    if (currentVisibleIndex < 0) {
        currentVisibleIndex = visibleImages.length - 1;
    }

    currentIndex = Number(visibleImages[currentVisibleIndex].dataset.id);

    lightboxImg.src = visibleImages[currentVisibleIndex].src;

    updateCounter();
});

/* FILTERS */
filterBtns.forEach(btn => {
    btn.addEventListener("click", function () {

        filterBtns.forEach(b => b.classList.remove("active"));
        this.classList.add("active");

        activeFilter = this.dataset.filter;

        galleryItems.forEach(img => {
            const wrapper = img.parentElement;
            const id = Number(img.dataset.id);

            if (activeFilter === "favorites") {
                wrapper.style.display =
                    favorites.includes(id) ? "block" : "none";
            }

            else if (
                activeFilter === "all" ||
                img.classList.contains(activeFilter)
            ) {
                wrapper.style.display = "block";
            } else {
                wrapper.style.display = "none";
            }
        });
    });
});

/* KEYBOARD */
document.addEventListener("keydown", (e) => {

    if (lightbox.style.display === "flex") {

        if (e.key === "ArrowRight") nextBtn.click();
        if (e.key === "ArrowLeft") prevBtn.click();

        if (e.key === "Escape") {
            lightbox.style.display = "none";
            document.body.style.overflow = "auto";
        }
    }
});

/* DARK MODE */
darkModeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "darkMode",
        document.body.classList.contains("dark")
    );
});

if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
}