// ==================== SEARCH FUNCTIONALITY ====================
const searchIcon = document.getElementById('searchIcon');
const searchModal = document.getElementById('searchModal');
const searchClose = document.getElementById('searchClose');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

// Open search modal
if (searchIcon) {
  searchIcon.addEventListener('click', function () {
    searchModal.classList.add('active');
    searchInput.focus();
    document.body.style.overflow = 'hidden';
  });
}

// Close search modal
if (searchClose) {
  searchClose.addEventListener('click', closeSearchModal);
}

if (searchModal) {
  searchModal.addEventListener('click', function (e) {
    if (e.target === searchModal) {
      closeSearchModal();
    }
  });
}

function closeSearchModal() {
  searchModal.classList.remove('active');
  searchInput.value = '';
  searchResults.innerHTML = '';
  document.body.style.overflow = '';
}

// Search functionality
function searchTitles(query) {
  if (!query || query.trim().length < 2) {
    searchResults.innerHTML = '';
    return;
  }

  const searchTerm = query.toLowerCase().trim();
  const results = [];

  // Search through all headings (h1, h2, h3, h4, h5, h6)
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

  headings.forEach(heading => {
    const text = heading.textContent.toLowerCase();
    if (text.includes(searchTerm)) {
      // Find the closest section or parent element with an ID
      let targetElement = heading;
      let sectionId = null;
      let sectionName = '';

      // Try to find parent section
      let parent = heading.parentElement;
      while (parent && parent !== document.body) {
        if (parent.id) {
          sectionId = parent.id;
          // Try to get section name from nearby elements
          const sectionTitle = parent.querySelector('.section-title h2, h2');
          if (sectionTitle) {
            sectionName = sectionTitle.textContent;
          }
          break;
        }
        parent = parent.parentElement;
      }

      // If no section ID found, try to get ID from heading's parent
      if (!sectionId) {
        const headingParent = heading.closest('section, div, article');
        if (headingParent && headingParent.id) {
          sectionId = headingParent.id;
        }
      }

      results.push({
        title: heading.textContent,
        element: heading,
        sectionId: sectionId,
        sectionName: sectionName || heading.textContent
      });
    }
  });

  displaySearchResults(results, searchTerm);
}

function displaySearchResults(results, searchTerm) {
  if (results.length === 0) {
    searchResults.innerHTML = '<div class="search-no-results">No results found for "' + searchTerm + '"</div>';
    return;
  }

  let html = '';
  results.forEach((result, index) => {
    html += `
      <div class="search-result-item" data-index="${index}">
        <h4>${highlightText(result.title, searchTerm)}</h4>
        ${result.sectionName && result.sectionName !== result.title ? `<p>${result.sectionName}</p>` : ''}
      </div>
    `;
  });

  searchResults.innerHTML = html;

  // Add click handlers to results
  const resultItems = searchResults.querySelectorAll('.search-result-item');
  resultItems.forEach((item, index) => {
    item.addEventListener('click', function () {
      const result = results[index];
      scrollToResult(result);
      closeSearchModal();
    });
  });
}

function highlightText(text, searchTerm) {
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function scrollToResult(result) {
  let targetElement = result.element;

  // If there's a section ID, try to scroll to that section
  if (result.sectionId) {
    const section = document.getElementById(result.sectionId);
    if (section) {
      targetElement = section;
    }
  }

  // Scroll to the element
  const offsetTop = targetElement.offsetTop - 100;
  window.scrollTo({
    top: offsetTop,
    behavior: 'smooth'
  });
}

// Search on input
if (searchInput) {
  let searchTimeout;
  searchInput.addEventListener('input', function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchTitles(this.value);
    }, 300); // Debounce search
  });

  // Handle Enter key
  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const firstResult = searchResults.querySelector('.search-result-item');
      if (firstResult) {
        firstResult.click();
      }
    }
    if (e.key === 'Escape') {
      closeSearchModal();
    }
  });
}

// Keyboard shortcut: Ctrl+K or Cmd+K to open search
document.addEventListener('keydown', function (e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    if (!searchModal.classList.contains('active')) {
      searchIcon.click();
    }
  }
});

// ==================== END SEARCH FUNCTIONALITY ====================

// ==================== MULTILINGUAL SYSTEM ====================
const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      rooms: "Rooms",
      gallery: "Gallery",
      mousseGallery: "Mousse Gallery",
      gastronomy: "Delicious Gastronomy",
      activitiesFun: "Activities & Fun",
      piscine: "Pool",
      contact: "Contact"
    },
    hero: {
      welcome: "Welcome To",
      tagline: "The place where, we create smiles."
    },
    about: {
      label: "About Us",
      para1: "I am a hotel located in Hammamet, halfway between the city centers of Hammamet and Nabeul. Set on a 4000 m² wooded garden, right on the water, I benefit from an atypical view of the Mediterranean.",
      para2: "Morning, noon and night, on a full board basis, we offer sincere cuisine, rooted in the seasons, local yet modern, joyful and generous, always in a relaxed, simple and friendly atmosphere.",
      para3: "Throughout the day, in the sun or under the parasols of our beach or our four pools, enjoy a fruit cocktail, a beer or the wine of your choice. Not forgetting our water park.",
      para4: "A dynamic animation team hosts daily yoga classes, sports activities and themed evenings.",
      para5: "Cross the doors of our hotel and we do everything we can to make you want to come back. There is no greater reward than work done with sincerity.",
      readMore: "Read More"
    },
    rooms: {
      discover: "DISCOVER",
      title: "Our Rooms & Suites",
      standard: "Standard Room",
      standardPlus: "Standard Plus Room",
      Modern: "Modern Room",
      ModernSeaView: "Modern Sea View Room",
      ac: "Air Conditioning",
      tv: "Flat Screen TV",
      curtains: "Blackout Curtains",
      balcony: "Private Balcony",
      poolView: "Pool View",
      wifi: "Free WiFi",
      seaViewText: "Sea View",
      moreDetails: "More Details"
    },
    gallery: {
      label: "Gallery",
      title: "Gallery",
      mousse: "Mousse Gallery",
      mousseDesc: "Enjoy the best moments from our summer events and activities",
      gastronomy: "Delicious Gastronomy",
      gastronomyDesc: "Savor exquisite Mediterranean flavors and culinary delights",
      activities: "Activities & Fun",
      activitiesDesc: "More amazing moments and activities for our guests",
      pool: "Our Pools"
    },
    services: {
      label: "AMENITIES",
      title: "Hotel Services",
      restaurant: "Restaurant & Bar",
      restaurantDesc: "Enjoy western and eastern Mediterranean cuisine and fresh seafood with stunning pool views.",
      beach: "Private Beach",
      beachDesc: "Exclusive access to pristine sandy beaches with complimentary sun loungers.",
      pool: "Swimming Pool",
      poolDesc: "Outdoor infinity pool with water slides and private pool for relaxation.",
      spa: "Spa & Wellness",
      spaDesc: "Rejuvenate with traditional hammam and massage treatments.",
      wifi: "Free WiFi",
      wifiDesc: "High-speed internet access in the business center.",
      parking: "Free Parking",
      parkingDesc: "Complimentary parking for all guests during their stay.",
      tennis: "Tennis Court",
      tennisDesc: "Exclusive access to the tennis court for guests with a tennis racket.",
      golf: "Golf Course",
      golfDesc: "Exclusive access to the golf course for guests with a golf club."
    },
    testimonials: {
      label: "REVIEWS",
      title: "What Our Guests Say",
      rev1: "Beautiful hotel, we go there twice a year and feel very good. The staff and management are very professional. Very satisfactory room. The buffet varies a lot.",
      rev2: "Great stay, great hotel. Very complete buffet for all tastes. Pleasant and helpful hotel staff. I recommend 1000%.",
      rev3: "Everything is perfect, the hotel is very beautiful and the staff is very kind. Great holiday, good animation, very good vacation!",
      tripAdvisorLink: "For more reviews, click here"
    },
    contact: {
      label: "GET IN TOUCH",
      title: "Contact Us",
      addressLabel: "Address",
      emailLabel: "Email",
      googleTravel: "View on Google Travel"
    },
    footer: {
      description: "Your perfect Mediterranean escape. Experience luxury, comfort, and the beauty of Tunisia's coastline.",
      follow: "Follow Us"
    }
  },
  fr: {
    nav: {
      home: "Accueil",
      about: "À propos",
      rooms: "Chambres",
      gallery: "Galerie",
      mousseGallery: "Galerie Mousse",
      gastronomy: "Gastronomie Délicieuse",
      activitiesFun: "Activités et Divertissements",
      piscine: "Piscine",
      contact: "Contact"
    },
    hero: {
      welcome: "Bienvenue à",
      tagline: "Nous fabriquons du sourire."
    },
    about: {
      label: "À propos de nous",
      para1: "Je suis un hôtel situé à Hammamet, à mi-chemin entre les centres-villes de Hammamet et de Nabeul. Posé sur un jardin arboré de 4000 m², les pieds dans l’eau, je bénéficie d’une vue atypique sur la Méditerranée.",
      para2: "Matin, midi et soir, en formule pension complète, nous proposons une cuisine sincère, ancrée dans les saisons, locale mais moderne, joyeuse et généreuse, toujours dans une ambiance décontractée, simple et conviviale.",
      para3: "Tout au long de la journée, au soleil ou sous les parasols de notre plage ou de nos quatre piscines, savourez un cocktail de fruits, une bière ou le vin de votre choix. Sans oublier notre parc aquatique.",
      para4: "Une équipe d’animation dynamique anime quotidiennement des cours de yoga, des activités sportives et des soirées à thème.",
      para5: "Franchissez les portes de notre hôtel et nous mettons tout en œuvre pour que votre séjour vous donne envie de revenir. Il n’existe pas de plus belle récompense qu’un travail accompli avec sincérité.",
      readMore: "Contactez nous"
    },
    rooms: {
      discover: "DÉCOUVRIR",
      title: "Nos Chambres et Suites",
      standard: "Chambre Standard",
      standardPlus: "Chambre Standard Plus",
      Modern: "Chambre Moderne",
      ModernSeaView: "Chambre Moderne Vue Mer",
      ac: "Climatisation",
      tv: "TV écran plat",
      curtains: "Rideaux occultants",
      balcony: "Balcon privé",
      poolView: "Vue sur la piscine",
      wifi: "WiFi gratuit",
      seaViewText: "Vue sur mer",
      moreDetails: "Plus de détails"
    },
    gallery: {
      label: "Galerie",
      title: "Moments d'été",
      mousse: "Galerie Mousse",
      mousseDesc: "Profitez des meilleurs moments de nos événements et activités estivaux",
      gastronomy: "Gastronomie Délicieuse",
      gastronomyDesc: "Savourez des saveurs méditerranéennes exquises et des délices culinaires",
      activities: "Activités et Divertissements",
      activitiesDesc: "Encore plus de moments et d'activités incroyables pour nos invités",
      pool: "Nos Piscines"
    },
    services: {
      label: "ÉQUIPEMENTS",
      title: "Services de l'hôtel",
      restaurant: "Restaurant et Bar",
      restaurantDesc: "Dégustez une cuisine méditerranéenne occidentale et orientale et des fruits de mer frais avec une vue imprenable sur la piscine.",
      beach: "Plage privée",
      beachDesc: "Accès exclusif à des plages de sable immaculées avec des transats gratuits.",
      pool: "Piscine",
      poolDesc: "Piscine à débordement extérieure avec toboggans aquatiques et piscine privée pour la détente.",
      spa: "Spa et Bien-être",
      spaDesc: "Régénérez-vous avec des traitements de hammam traditionnel et de massage.",
      wifi: "WiFi gratuit",
      wifiDesc: "Accès Internet haut débit dans le centre d'affaires.",
      parking: "Parking gratuit",
      parkingDesc: "Parking gratuit pour tous les invités pendant leur séjour.",
      tennis: "Court de tennis",
      tennisDesc: "Accès exclusif au court de tennis pour les invités avec une raquette de tennis.",
      golf: "Terrain de golf",
      golfDesc: "Accès exclusif au terrain de golf pour les invités avec un club de golf."
    },
    testimonials: {
      label: "AVIS",
      title: "Ce que disent nos invités",
      rev1: "Bel hôtel nous y allons deux fois par an et nous nous sentons très bien. Le personnel et la direction sont très professionnels. Chambre très satisfaisante. Le buffet varie beaucoup.",
      rev2: "Super séjour ! Super hôtel ! Buffet très complet et pour tous les goûts. Personnel de l’hôtel agréable et serviable. Je recommande à 1000 %.",
      rev3: "Tout est parfait l’hôtel est très beau et le personnel très gentil super vacances bonne animation très bonnes vacances !",
      tripAdvisorLink: "Pour plus d'avis, cliquez ici"
    },
    contact: {
      label: "NOUS CONTACTER",
      title: "Contactez-nous",
      addressLabel: "Adresse",
      emailLabel: "Email",
      googleTravel: "Voir sur Google Travel"
    },
    footer: {
      description: "Votre évasion méditerranéenne parfaite. Découvrez le luxe, le confort et la beauté du littoral tunisien.",
      follow: "Suivez-nous"
    }
  },
  pl: {
    nav: {
      home: "Strona główna",
      about: "O nas",
      rooms: "Pokoje",
      gallery: "Galeria",
      mousseGallery: "Galeria Mousse",
      gastronomy: "Pyszna Gastronomia",
      activitiesFun: "Zabawy i Atrakcje",
      piscine: "Basen",
      contact: "Kontakt"
    },
    hero: {
      welcome: "Witamy w",
      tagline: "Miejsce, w którym tworzymy uśmiechy."
    },
    about: {
      label: "O nas",
      para1: "Jestem hotelem położonym w Hammamet, w połowie drogi między centrami miast Hammamet i Nabeul. Położony w 4000 m² zalesionym ogrodzie, tuż nad wodą, cieszę się nietypowym widokiem na Morze Śródziemne.",
      para2: "Rano, w południe i wieczorem, w ramach pełnego wyżywienia, oferujemy szczerą kuchnię, zakorzenioną w porach roku, lokalną, ale nowoczesną, radosną i hojną, zawsze w zrelaksowanej, prostej i przyjaznej atmosferze.",
      para3: "Przez cały dzień, w słońcu lub pod parasolami na naszej plaży lub przy naszych czterech basenach, ciesz się koktajlem owocowym, piwem lub winem według własnego wyboru. Nie zapominając o naszym parku wodnym.",
      para4: "Dynamiczny zespół animatorów prowadzi codzienne zajęcia jogi, zajęcia sportowe i wieczory tematyczne.",
      para5: "Przekrocz progi naszego hotelu, a my zrobimy wszystko, abyś chciał tu wrócić. Nie ma większej nagrody niż praca wykonana ze szczerością.",
      readMore: "Czytaj więcej"
    },
    rooms: {
      discover: "ODKRYJ",
      title: "Nasze Pokoje i Apartamenty",
      standard: "Pokój Standardowy",
      standardPlus: "Pokój Standard Plus",
      Modern: "Nowoczesny Pokój",
      ModernSeaView: "Nowoczesny Pokój z Widokiem na Morze",
      ac: "Klimatyzacja",
      tv: "Telewizor płaski",
      curtains: "Zasłony zaciemniające",
      balcony: "Prywatny balkon",
      poolView: "Widok na basen",
      wifi: "Darmowe WiFi",
      seaViewText: "Widok na morze",
      moreDetails: "Więcej szczegółów"
    },
    gallery: {
      label: "Galeria",
      title: "Letnie chwile",
      mousse: "Galeria Mousse",
      mousseDesc: "Ciesz się najlepszymi chwilami z naszych letnich wydarzeń i aktywności",
      gastronomy: "Pyszna Gastronomia",
      gastronomyDesc: "Rozkoszuj się wykwintnymi smakami śródziemnomorskimi i kulinarnymi przysmakami",
      activities: "Zabawy i Atrakcje",
      activitiesDesc: "Więcej niesamowitych chwil i aktywności dla naszych gości",
      pool: "Nasze Baseny"
    },
    services: {
      label: "UDOGODNIENIA",
      title: "Usługi hotelowe",
      restaurant: "Restauracja i Bar",
      restaurantDesc: "Ciesz się kuchnią zachodnią i wschodnią śródziemnomorską oraz świeżymi owocami morza z oszałamiającym widokiem na basen.",
      beach: "Prywatna plaża",
      beachDesc: "Ekskluzywny dostęp do nieskazitelnych piaszczystych plaż z bezpłatnymi leżakami.",
      pool: "Basen",
      poolDesc: "Zewnętrzny basen infinity z zjeżdżalniami wodnymi i prywatnym basenem do relaksu.",
      spa: "Spa i Wellness",
      spaDesc: "Odmładzaj się tradycyjnymi zabiegami hammam i masażami.",
      wifi: "Darmowe WiFi",
      wifiDesc: "Szybki dostęp do internetu w centrum biznesowym.",
      parking: "Darmowy parking",
      parkingDesc: "Bezpłatny parking dla wszystkich gości podczas pobytu.",
      tennis: "Kort tenisowy",
      tennisDesc: "Ekskluzywny dostęp do kortu tenisowego dla gości z rakietą tenisową.",
      golf: "Pole golfowe",
      golfDesc: "Ekskluzywny dostęp do pola golfowego dla gości z kijem golfowym."
    },
    testimonials: {
      label: "OPINIE",
      title: "Co mówią nasi goście",
      rev1: "Piękny hotel, odwiedzamy go dwa razy w roku i czujemy się tu bardzo dobrze. Personel i kierownictwo są bardzo profesjonalni. Pokój bardzo zadowalający. Bufet jest bardzo urozmaicony.",
      rev2: "Świetny pobyt, świetny hotel. Bardzo bogaty bufet dla każdego gustu. Miły i pomocny personel hotelu. Polecam w 1000%.",
      rev3: "Wszystko jest idealne, hotel jest bardzo piękny, a personel bardzo miły. Świetne wakacje, dobra animacja, bardzo dobry wypoczynek!",
      tripAdvisorLink: "Aby uzyskać więcej opinii, kliknij tutaj"
    },
    contact: {
      label: "SKONTAKTUJ SIĘ",
      title: "Skontaktuj się z nami",
      addressLabel: "Adres",
      emailLabel: "Email",
      googleTravel: "Zobacz w Google Travel"
    },
    footer: {
      description: "Twoja idealna ucieczka na Morze Śródziemne. Doświadcz luksusu, komfortu i piękna tunezyjskiego wybrzeża.",
      follow: "Śledź nas"
    }
  }
};

// Language configuration
const languageFlags = {
  en: 'assets/images/flag.png', // UK flag
  fr: 'https://flagcdn.com/w40/fr.png', // French flag
  pl: 'https://flagcdn.com/w40/pl.png' // Polish flag
};

// Get current language from localStorage or default to 'fr' (French)
let currentLanguage = localStorage.getItem('selectedLanguage') || 'fr';

// Function to update all translatable elements
function updateLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('selectedLanguage', lang);

  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const keys = key.split('.');
    let translation = translations[lang];

    for (let k of keys) {
      translation = translation[k];
    }

    if (translation) {
      element.textContent = translation;
    }
  });

  // Update language selector
  const langSpan = document.getElementById('currentLang');
  const flagImg = document.getElementById('flagImg');

  if (langSpan) {
    langSpan.innerHTML = lang.toUpperCase() + ' <i class="fa fa-angle-down"></i>';
  }

  if (flagImg && languageFlags[lang]) {
    flagImg.src = languageFlags[lang];
    flagImg.alt = lang.toUpperCase();
    // Ensure image loads properly
    flagImg.onload = function () {
      this.style.display = 'block';
    };
    flagImg.onerror = function () {
      // Fallback if image fails to load
      console.warn('Flag image failed to load for language:', lang);
    };
  }

  // Update HTML lang attribute
  document.documentElement.lang = lang;
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function () {
  updateLanguage(currentLanguage);

  // Add click handlers to language options
  document.querySelectorAll('.lang-option').forEach(option => {
    option.addEventListener('click', function (e) {
      e.preventDefault();
      const lang = this.getAttribute('data-lang');
      updateLanguage(lang);

      // Close dropdown
      const dropdown = document.querySelector('.flag-dropdown');
      if (dropdown) {
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'hidden';
      }
    });
  });

  // Language selector click and hover behavior
  const languageOption = document.getElementById('languageSelector');
  if (languageOption) {
    const dropdown = languageOption.querySelector('.flag-dropdown');

    // Toggle dropdown on click
    languageOption.addEventListener('click', function (e) {
      e.stopPropagation();
      if (dropdown) {
        const isActive = languageOption.classList.contains('active');
        if (isActive) {
          languageOption.classList.remove('active');
          dropdown.style.top = '60px';
          dropdown.style.opacity = '0';
          dropdown.style.visibility = 'hidden';
        } else {
          languageOption.classList.add('active');
          dropdown.style.top = '40px';
          dropdown.style.opacity = '1';
          dropdown.style.visibility = 'visible';
        }
      }
    });

    // Keep dropdown open on hover (existing behavior)
    languageOption.addEventListener('mouseenter', function () {
      if (dropdown) {
        dropdown.style.top = '40px';
        dropdown.style.opacity = '1';
        dropdown.style.visibility = 'visible';
        languageOption.classList.add('active');
      }
    });

    languageOption.addEventListener('mouseleave', function () {
      if (dropdown) {
        dropdown.style.top = '60px';
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'hidden';
        languageOption.classList.remove('active');
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
      if (!languageOption.contains(e.target)) {
        languageOption.classList.remove('active');
        if (dropdown) {
          dropdown.style.top = '60px';
          dropdown.style.opacity = '0';
          dropdown.style.visibility = 'hidden';
        }
      }
    });
  }
});

// ==================== END MULTILINGUAL SYSTEM ====================

// Navbar scroll effect
window.addEventListener('scroll', function () {
  const menuItem = document.querySelector('.menu-item');
  if (window.scrollY > 100) {
    menuItem.classList.add('scrolled');
  } else {
    menuItem.classList.remove('scrolled');
  }
});

// Sticky Book Now Button
const stickyBtn = document.querySelector('.sticky-book-btn');
if (stickyBtn) {
  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
      stickyBtn.classList.add('visible');
    } else {
      stickyBtn.classList.remove('visible');
    }
  });
}

// Back to Top Button
const backToTop = document.querySelector('.back-to-top');
window.addEventListener('scroll', function () {
  if (window.scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

// Mobile Menu Toggle
const mobileToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.menu-item-bottom .nav-menu');

if (mobileToggle) {
  mobileToggle.addEventListener('click', function () {
    this.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
}

// Active Section Indicator
const sections = document.querySelectorAll('section, header');
const navLinks = document.querySelectorAll('.nav-menu .mainmenu li a');

window.addEventListener('scroll', function () {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.parentElement.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.parentElement.classList.add('active');
    }
  });
});

// Ripple Effect on Buttons
document.querySelectorAll('.primary-btn, .cta-button, .sticky-book-btn').forEach(button => {
  button.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    this.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});

// Gallery Lightbox - Enhanced for card elements
const galleryCards = document.querySelectorAll('.card');
const galleryItems = document.querySelectorAll('.gallery-item img, .gallery img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');

let currentImageIndex = 0;
let allImages = [];

// collect all images only when DOM is loaded to ensure all background images are available
document.addEventListener('DOMContentLoaded', function () {
  // Collection of images
  allImages = [];

  // Collect all images from both gallery cards and gallery items
  galleryCards.forEach((card, index) => {
    const imageDiv = card.querySelector('.image');
    if (imageDiv) {
      // Get background image URL
      const bgImage = window.getComputedStyle(imageDiv).backgroundImage;
      const imageUrl = bgImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');

      if (imageUrl && imageUrl !== 'none') {
        allImages.push({ src: imageUrl, element: card });

        // Make card clickable and add accessibility
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `View image ${index + 1} in lightbox`);

        // Click handler
        card.addEventListener('click', function () {
          const imgIndex = allImages.findIndex(img => img.element === card);
          currentImageIndex = imgIndex;
          openLightbox(imageUrl);
        });

        // Keyboard handler for accessibility
        card.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const imgIndex = allImages.findIndex(img => img.element === card);
            currentImageIndex = imgIndex;
            openLightbox(imageUrl);
          }
        });
      }
    }
  });

  // Also handle regular gallery items
  galleryItems.forEach((img, index) => {
    const originalSrc = img.src;
    allImages.push({ src: originalSrc, element: img });

    const galleryItem = img.closest('.gallery-item') || img.parentElement;
    if (!galleryItem.querySelector('.gallery-overlay')) {
      const overlay = document.createElement('div');
      overlay.className = 'gallery-overlay';
      overlay.innerHTML = '<i class="fa fa-search-plus"></i>';
      galleryItem.appendChild(overlay);
    }

    galleryItem.style.cursor = 'pointer';
    galleryItem.setAttribute('role', 'button');
    galleryItem.setAttribute('tabindex', '0');
    galleryItem.setAttribute('aria-label', `View image ${allImages.length} in lightbox`);

    galleryItem.addEventListener('click', function () {
      const imgIndex = allImages.findIndex(img => img.src === originalSrc);
      currentImageIndex = imgIndex >= 0 ? imgIndex : allImages.length - 1;
      openLightbox(originalSrc);
    });

    galleryItem.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const imgIndex = allImages.findIndex(img => img.src === originalSrc);
        currentImageIndex = imgIndex >= 0 ? imgIndex : allImages.length - 1;
        openLightbox(originalSrc);
      }
    });
  });
});

function openLightbox(src) {
  if (lightboxImg && lightbox) {
    lightboxImg.src = src;
    lightboxImg.alt = `Gallery image ${currentImageIndex + 1} of ${allImages.length}`;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus on close button for accessibility
    if (lightboxClose) {
      setTimeout(() => lightboxClose.focus(), 100);
    }
  }
}

function closeLightbox() {
  if (lightbox) {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

function showNextImage() {
  if (allImages.length > 0) {
    currentImageIndex = (currentImageIndex + 1) % allImages.length;
    if (lightboxImg) {
      lightboxImg.src = allImages[currentImageIndex].src;
      lightboxImg.alt = `Gallery image ${currentImageIndex + 1} of ${allImages.length}`;
    }
  }
}

function showPrevImage() {
  if (allImages.length > 0) {
    currentImageIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
    if (lightboxImg) {
      lightboxImg.src = allImages[currentImageIndex].src;
      lightboxImg.alt = `Gallery image ${currentImageIndex + 1} of ${allImages.length}`;
    }
  }
}

if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxClose.setAttribute('aria-label', 'Close lightbox');
}

if (lightboxNext) {
  lightboxNext.addEventListener('click', showNextImage);
  lightboxNext.setAttribute('aria-label', 'Next image');
}

if (lightboxPrev) {
  lightboxPrev.addEventListener('click', showPrevImage);
  lightboxPrev.setAttribute('aria-label', 'Previous image');
}

if (lightbox) {
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Set initial ARIA state
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.setAttribute('aria-label', 'Image lightbox');
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', function (e) {
  if (lightbox && lightbox.classList.contains('active')) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  }
});

// Gallery Filter Tabs
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItemsFilter = document.querySelectorAll('.gallery-item, .gallery > *');

filterButtons.forEach(button => {
  button.addEventListener('click', function () {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');

    const filter = this.getAttribute('data-filter');
    galleryItemsFilter.forEach(item => {
      if (filter === 'all' || item.classList.contains(filter)) {
        item.style.display = '';
        item.style.animation = 'fadeInUp 0.5s ease';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// Lazy Loading Images
const lazyImages = document.querySelectorAll('img[loading="lazy"]');
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src || img.src;
      img.classList.add('loaded');
      observer.unobserve(img);
    }
  });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const href = this.getAttribute('href');
    const target = document.querySelector(href);

    if (target) {
      let scrollPosition;

      // Special handling for rooms section - center the room images
      if (href === '#chambre') {
        const roomsGrid = document.getElementById('rooms-grid');
        if (roomsGrid) {
          const gridRect = roomsGrid.getBoundingClientRect();
          const gridTop = gridRect.top + window.pageYOffset;
          const gridHeight = gridRect.height;
          const viewportHeight = window.innerHeight;

          // Calculate center position: grid top + half grid height - half viewport height
          // Add offset to scroll a bit higher (80px offset)
          scrollPosition = gridTop + (gridHeight / 2) - (viewportHeight / 2) - 80;

          // Ensure we don't scroll above the section
          const sectionTop = target.offsetTop - 100;
          scrollPosition = Math.max(scrollPosition, sectionTop);
        } else {
          scrollPosition = target.offsetTop - 100;
        }
      } else if (href === '#about') {
        // Special handling for about section - scroll a bit higher
        scrollPosition = target.offsetTop - 60;
      } else {
        // Default behavior for other sections
        scrollPosition = target.offsetTop - 100;
      }

      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });

      // Close mobile menu if open
      if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
      }
    }
  });
});

// Parallax Effect for Hero Video
window.addEventListener('scroll', function () {
  const scrolled = window.pageYOffset;
  const heroVideo = document.querySelector('.bg-video');
  if (heroVideo) {
    heroVideo.style.transform = `translateY(${scrolled * 0.5}px) scale(1.1)`;
  }
});

// ==================== TESTIMONIAL SLIDER ====================
document.addEventListener('DOMContentLoaded', function () {
  const sliderWrapper = document.querySelector('.testimonial-wrapper');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const dotsContainer = document.querySelector('.slider-dots');

  let currentIndex = 0;
  let startX = 0;
  let isDragging = false;

  // Initialize dots
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.dot');

  function updateSlider() {
    sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlider();
  }

  function goToSlide(index) {
    currentIndex = index;
    updateSlider();
  }

  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  // Auto-play
  let autoPlayInterval = setInterval(nextSlide, 5000);

  const sliderContainer = document.querySelector('.testimonial-slider-container');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    sliderContainer.addEventListener('mouseleave', () => {
      clearInterval(autoPlayInterval);
      autoPlayInterval = setInterval(nextSlide, 5000);
    });

    // Touch support
    sliderContainer.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      clearInterval(autoPlayInterval);
    });

    sliderContainer.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const currentX = e.touches[0].clientX;
      const diff = startX - currentX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
        isDragging = false;
      }
    });

    sliderContainer.addEventListener('touchend', () => {
      isDragging = false;
      autoPlayInterval = setInterval(nextSlide, 5000);
    });
  }
});
// ==================== END TESTIMONIAL SLIDER ====================

// Image Zoom on Hover for Gallery
document.querySelectorAll('.gallery img, .gallery-item img').forEach(img => {
  img.addEventListener('mouseenter', function () {
    this.style.transition = 'transform 0.5s ease';
  });
});


// Add animation on scroll - Enhanced
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal-active');
      observer.unobserve(entry.target); // Only animate once
    }
  });
}, observerOptions);

// Observe various elements for scroll reveal
const revealElements = document.querySelectorAll(
  '.service-card, .testimonial-card, .hp-room-item, .about-text, .section-title, .card'
);

revealElements.forEach((el, index) => {
  el.classList.add('reveal');
  // Stagger animation delay for service cards
  if (el.classList.contains('service-card')) {
    el.style.transitionDelay = `${(index % 8) * 0.1}s`;
  }
  observer.observe(el);
});

// ==================== VIDEO AUTOPLAY FALLBACK ====================
document.addEventListener('DOMContentLoaded', function () {
  const heroVideo = document.querySelector('.bg-video');
  if (heroVideo) {
    // Attempt to play
    const playPromise = heroVideo.play();

    if (playPromise !== undefined) {
      playPromise.catch(error => {
        // Auto-play was prevented
        console.log("Autoplay was prevented. Adding interaction listener to start video.");

        // Start on first interaction if blocked
        const startVideo = () => {
          heroVideo.play();
          document.removeEventListener('click', startVideo);
          document.removeEventListener('touchstart', startVideo);
        };
        document.addEventListener('click', startVideo);
        document.addEventListener('touchstart', startVideo);
      });
    }
  }
});
