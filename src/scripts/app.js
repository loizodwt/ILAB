"use-strict"
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);


document.addEventListener("DOMContentLoaded", function () {
  const path = window.location.pathname; 

  if (path.includes("bento.html")) {
      initBento();
  }
  else if (path.includes("index.html")) {
      initIndex();
  }
  else if (path.includes("jeux.html")) {
      initGames();
  }
  else if (path.includes("maps.html")) {
      initMap();
  }

  function initIndex() {
    document.querySelector(".button--next").addEventListener("click", function() {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: ".section2", offsetY: 50 },  
        ease: "power2.inOut"
      });
    });
    
  }

  function initGames() {
    
    // Sélecteurs pour les éléments de chronomètre
const spansChrono = {
  sansMalus: {
      minutes: document.querySelector(".sections__section--chrono .minutes"),
      seconds: document.querySelector(".sections__section--chrono .seconds"),
      millis: document.querySelector(".sections__section--chrono .millis"),
  },
  avecMalus: {
      minutes: document.querySelector(".sections__section--malus .minutes"),
      seconds: document.querySelector(".sections__section--malus .seconds"),
      millis: document.querySelector(".sections__section--malus .millis"),
  },
};

let chrono = { sansMalus: 0, avecMalus: 0 }; // Chronomètres
let timer = null; // Pour stocker le handle du timer
let currentChronoType = ''; // Type de chronomètre actif

function reset(chronoType) {
  chrono[chronoType] = 0;
  updateDisplay(spansChrono[chronoType]);
}

function start(chronoType) {
  if (!timer) {
      currentChronoType = chronoType;
      timer = setInterval(() => {
          chrono[chronoType]++;
          updateDisplay(spansChrono[chronoType]);
      }, 1);
  }
}

function stop() {
  clearInterval(timer);
  timer = null;
}

function updateDisplay(spans) {
  const millis = chrono[currentChronoType] % 1000;
  const seconds = Math.floor(chrono[currentChronoType] / 1000) % 60;
  const minutes = Math.floor(chrono[currentChronoType] / 60000);
  
  spans.minutes.innerHTML = ("0" + minutes).slice(-2);
  spans.seconds.innerHTML = ("00" + seconds).slice(-2);
  spans.millis.innerHTML = ("000" + millis).slice(-3);
}

// Enregistrer les événements pour chaque section
const sections = {
  sansMalus: document.querySelector(".sections__section--chrono"),
  avecMalus: document.querySelector(".sections__section--malus"),
};

sections.sansMalus.querySelector(".sections__button--start").addEventListener('click', () => start('sansMalus'));
sections.sansMalus.querySelector(".sections__button--stop").addEventListener('click', stop);
sections.sansMalus.querySelector(".sections__button--reset").addEventListener('click', () => reset('sansMalus'));

sections.avecMalus.querySelector(".sections__button--start").addEventListener('click', () => start('avecMalus'));
sections.avecMalus.querySelector(".sections__button--stop").addEventListener('click', stop);
sections.avecMalus.querySelector(".sections__button--reset").addEventListener('click', () => reset('avecMalus'));

// Gérer le défilement des sections
const allSections = document.querySelectorAll(".sections__section");
let currentIndex = 0;

document.querySelector(".game__next").addEventListener("click", () => {
  const currentSection = allSections[currentIndex];
  const inputField = currentSection.querySelector(".sections__input");

  if (inputField && inputField.value.trim() === "") {
      alert("Veuillez remplir le champ requis avant de continuer.");
      return;
  }

  currentIndex = (currentIndex + 1) % allSections.length;

  if (currentIndex === allSections.length - 1) {
      const nameInput = document.querySelector(".sections__input").value;
      const resultTitle = document.querySelector(".sections__section--result h3");
      resultTitle.textContent = `Voici ton temps, ${nameInput}`;

      const resultMalus = document.querySelector(".sections__section--result h4:nth-of-type(2)");
      const resultSansMalus = document.querySelector(".sections__section--result h4:nth-of-type(1)");
      
      resultMalus.textContent = `Avec malus : ${formatTime(chrono.avecMalus)}`;
      resultSansMalus.textContent = `Sans malus : ${formatTime(chrono.sansMalus)}`;
  }

  allSections[currentIndex].scrollIntoView({ behavior: "smooth" });

  document.querySelector(".game__next").style.display = (currentIndex === allSections.length - 1) ? "none" : "block";
});

// Fonction pour formater le temps pour l'affichage
function formatTime(time) {
  const millis = time % 1000;
  const seconds = Math.floor(time / 1000) % 60;
  const minutes = Math.floor(time / 60000);
  return `${("0" + minutes).slice(-2)}:${("00" + seconds).slice(-2)}.${("000" + millis).slice(-3)}`;
}


  }

  function initBento() {
    //Vars
    const $menu = document.querySelector(".menu");
    const $items = document.querySelectorAll(".menu--item");
    const $images = document.querySelectorAll(".menu--item img");

    let menuWidth = $menu.clientWidth;
    let itemWidth = $items[0].clientWidth;
    const itemSpacing = 36; 
    let wrapWidth = $items.length * (itemWidth + itemSpacing); 

    let scrollSpeed = 0;
    let oldScrollY = 0;
    let scrollY = 0;
    let y = 0;

    //Lerp
    const lerp = (v0, v1, t) => {
      return v0 * (1 - t) + v1 * t;
    };


    //Dispose
    const dispose = (scroll) => {
      gsap.set($items, {
        x: (i) => {
          return i * (itemWidth + itemSpacing) + scroll; 
        },
        modifiers: {
          x: (x, target) => {
            const s = gsap.utils.wrap(
              -itemWidth - itemSpacing,  
              wrapWidth - itemWidth,
              parseInt(x)
            );
            return `${s}px`;
          }
        }
      });
    };
    dispose(0);


    //Wheel
    const handleMouseWheel = (e) => {
      scrollY -= e.deltaY * 0.9;
    };

    //Touch
    let touchStart = 0;
    let touchX = 0;
    let isDragging = false;
    const handleTouchStart = (e) => {
      touchStart = e.clientX || e.touches[0].clientX;
      isDragging = true;
      $menu.classList.add("is-dragging");
    };
    const handleTouchMove = (e) => {
      if (!isDragging) return;
      touchX = e.clientX || e.touches[0].clientX;
      scrollY += (touchX - touchStart) * 2.5;
      touchStart = touchX;
    };
    const handleTouchEnd = () => {
      isDragging = false;
      $menu.classList.remove("is-dragging");
    };

    //Listeners
    $menu.addEventListener("wheel", handleMouseWheel);

    $menu.addEventListener("touchstart", handleTouchStart);
    $menu.addEventListener("touchmove", handleTouchMove);
    $menu.addEventListener("touchend", handleTouchEnd);

    $menu.addEventListener("mousedown", handleTouchStart);
    $menu.addEventListener("mousemove", handleTouchMove);
    $menu.addEventListener("mouseleave", handleTouchEnd);
    $menu.addEventListener("mouseup", handleTouchEnd);

    $menu.addEventListener("selectstart", () => {
      return false;
    });

    //Resize
    window.addEventListener("resize", () => {
      menuWidth = $menu.clientWidth;
      itemWidth = $items[0].clientWidth;
      wrapWidth = $items.length * (itemWidth + itemSpacing); 
    });



//Render
const autoScrollSpeed = 0.3;

const render = () => {
  requestAnimationFrame(render);
  
  // Ajout de la vitesse de défilement automatique
  scrollY -= autoScrollSpeed; // Défilement automatique à chaque frame

  y = lerp(y, scrollY, 0.1);
  dispose(y);

  scrollSpeed = y - oldScrollY;
  oldScrollY = y;

  gsap.to($items, {
    skewX: -scrollSpeed * 0.2,
    rotate: scrollSpeed * 0.01,
    scale: 1 - Math.min(100, Math.abs(scrollSpeed)) * 0.003
  });
};
render();
  }

  function initMap() {
    //initialtion
      var map = L.map('map').setView([50.4674, 4.8719], 13);

      //Layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 20
      }).addTo(map);

      // marks
  }
});




