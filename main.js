import { qs, qsa, ce, GetById } from "./shortcuts.js";

/* ====== LAYOUT / MENU ====== */
const isMobile  = window.matchMedia('(max-width: 480px)');
const isTablet  = window.matchMedia('(min-width: 481px) and (max-width: 1024px)');
const isDesktop = window.matchMedia('(min-width: 1025px)');

function gestisciLayout() {
  if (isMobile.matches || isTablet.matches) {
    createHamburgerMenu();
  } else if (isDesktop.matches) {
    // layout desktop
  }
}
isMobile.addEventListener('change', gestisciLayout);
isTablet.addEventListener('change', gestisciLayout);
isDesktop.addEventListener('change', gestisciLayout);
gestisciLayout();

function createHamburgerMenu() {
  const leftSide    = qs(".left-header");
  const socialMedia = qs(".social-media");
  const header      = qs("header");
  header.style.justifyContent = "space-between";
  leftSide.style.display = "none";
  socialMedia.style.display = "none";

  if (!GetById('hamburger-menu')) {
    const hamburgerMenu = ce("img");
    hamburgerMenu.id = 'hamburger-menu';
    hamburgerMenu.src = "img/hamburger.png";
    hamburgerMenu.style.width = '2rem';
    hamburgerMenu.style.cursor = 'pointer';
    header.appendChild(hamburgerMenu);

    hamburgerMenu.addEventListener('click', () => {
      const bodyOverlay = ce("div");
      bodyOverlay.classList.add("body-overlay");
      document.body.appendChild(bodyOverlay);

      const infoContainer = ce("div");
      infoContainer.classList.add("info-container");
      socialMedia.style.display = "flex";
      leftSide.style.display = "flex";
      infoContainer.appendChild(socialMedia);
      infoContainer.appendChild(leftSide);
      document.body.appendChild(infoContainer);

      const portfolioBtns = GetById("portfolio-btns");
      portfolioBtns.classList.add("portfolio-btns");
      portfolioBtns.querySelectorAll("a").forEach((btn) => {
        btn.addEventListener("click", closeMenu);
      });

      const closeBtn = ce("img");
      closeBtn.classList.add("close-button");
      closeBtn.src = "img/close.png";
      header.appendChild(closeBtn);
      hamburgerMenu.remove();

      function closeMenu() {
        bodyOverlay.remove();
        infoContainer.remove();
        closeBtn.remove();
        header.appendChild(hamburgerMenu);
        leftSide.style.display = "none";
        socialMedia.style.display = "none";
      }
      closeBtn.addEventListener("click", closeMenu);
      bodyOverlay.addEventListener("click", (e) => {
        if (e.target === bodyOverlay) closeMenu();
      });
    });
  }
}

/* ====== PROGETTI ====== */
async function getProjects() {
  try {
    let resp = await fetch('projects.json');
    let projects = await resp.json();
    console.log(projects);
    projects.forEach(p => project(p.title, p.description, p.image, p.technologies, p.liveDemo, p.repo));
    let lastP = projects[5];
    console.log(lastP);
    lastP.addEventListener("mouseover", moreToCome)
    function moreToCome(){
      console.log("hi")
    }
    console.log(lastP);
  } catch (err) {
    console.log(err);
  }
}
getProjects();

function project(title, description, image, technologies, liveDemo, repo) {
  const projectsContainer = qs(".projects-container");
  projectsContainer.classList.add("projects-container");

  const theProject = ce("div");
  theProject.classList.add("the-project");
  projectsContainer.appendChild(theProject);

  const pTitle = ce("h2");
  pTitle.textContent = title;
  theProject.appendChild(pTitle);

  const pImage = ce("img");
  pImage.src = image;
  theProject.appendChild(pImage);

  const pDescription = ce("p");
  pDescription.classList.add("projects-description");
  pDescription.textContent = description;
  theProject.appendChild(pDescription);

  const pTechnologies = ce("p");
  pTechnologies.classList.add("projects-technologies");
  pTechnologies.textContent = `Tecnologie usate: ${technologies}`;
  theProject.appendChild(pTechnologies);

  const overlay = ce("div");
  overlay.classList.add("project-overlay");
  theProject.appendChild(overlay);

  theProject.addEventListener("mouseover", () => {
    overlay.style.opacity = "1";
    createBtns();
  });
  theProject.addEventListener("mouseout", () => {
    overlay.style.opacity = "0";
  });

  function createBtns() {
    if (theProject.querySelector(".reference-container")) return;

    const buttonContainer = ce("div");
    buttonContainer.classList.add("reference-container");
    overlay.appendChild(buttonContainer);

    const pLiveDemo = ce("button");
    pLiveDemo.classList.add("projects-btns");
    pLiveDemo.setAttribute("data-url", liveDemo);
    pLiveDemo.textContent = "Dai un'occhiata";
    buttonContainer.appendChild(pLiveDemo);

    const pRepo = ce("button");
    pRepo.classList.add("projects-btns");
    pRepo.setAttribute("data-url", repo);
    pRepo.textContent = "Repository";
    buttonContainer.appendChild(pRepo);

    function openDemo(event) {
      const url = event.currentTarget.getAttribute("data-url");
      if (url) window.open(url, "_blank");
    }
    pLiveDemo.addEventListener("click", openDemo);
    pRepo.addEventListener("click", openDemo);
  }
}

/* ====== FORM MODALE ====== */
// Usa un id dedicato per il bottone che apre il form
const openContactBtn = GetById("openContactBtn"); // <--- crea questo id nel tuo HTML per il pulsante “Lavora con me”
const contactForm    = GetById("contactForm");
const formStatus     = GetById("formStatus");
const emailInput     = GetById("email");

openContactBtn?.addEventListener("click", showModule);

// rende disponibile ovunque
function tornaIndietro() {
  const module = GetById("contactForm");
  const overlay = qs(".body-overlay");
  if (overlay) overlay.remove();
  if (module) module.classList.remove("backdrop-show");
  // rimettilo nel body se l’avevi spostato
  if (module && module.parentElement !== document.body) {
    document.body.appendChild(module);
  }
}


function showModule() {
  console.log("showModule chiamata - Inizializzazione step...");
  
  const bodyOverlay = ce("div");
  bodyOverlay.classList.add("body-overlay");
  document.body.appendChild(bodyOverlay);

  const module = GetById("contactForm");
  module.classList.add("backdrop-show");
  bodyOverlay.insertAdjacentElement("afterend", module);

  bodyOverlay.addEventListener("click", (e) => {
    if (e.target === bodyOverlay) tornaIndietro();
  });

  GetById("tornaIndietroBtn")?.addEventListener("click", tornaIndietro);
  /*
  GetById("cancelBtn")?.addEventListener("click", (e) => {
    e.preventDefault();      // il type="reset" resetta, noi chiudiamo anche
    contactForm.reset();
    tornaIndietro();
  });
  */

  // Forza l'inizializzazione degli step prima di tutto
  console.log("Forzo l'inizializzazione degli step...");
  
  // Nascondi TUTTI gli step prima
  STEP_IDS.forEach((id) => {
    const pane = GetById(id);
    if (pane) {
      pane.style.display = 'none';
      console.log(`Step ${id} nascosto`);
    }
  });
  
  // Mostra SOLO il primo step
  const firstStep = GetById(STEP_IDS[0]);
  if (firstStep) {
    firstStep.style.display = 'block';
    console.log(`Step ${STEP_IDS[0]} reso visibile`);
  }
  
  // Imposta currentStep a 0
  currentStep = 0;
  
  // Assicurati che solo il primo step sia visibile
  showStep(0);
  
  bindStepButtonsOnce();
  
  // Configurazione validazione in tempo reale
  setupRealTimeValidation();
}

// ===== Wizard-lite: un'unica coppia di bottoni per tutti gli step =====
const STEP_IDS = [
  'initialForm',
  'projectForm',
  'budgetForm',
  'tempisticheForm',
  'commentForm',
  'privacyForm'
];

let currentStep = 0;

// Inizializza gli step all'avvio della pagina
function initializeSteps() {
  STEP_IDS.forEach((id, i) => {
    const pane = GetById(id);
    if (pane) {
      pane.style.display = (i === 0) ? 'block' : 'none';
    }
  });
}

function showStep(index) {
  console.log(`showStep chiamata con indice: ${index}`);
  currentStep = Math.max(0, Math.min(index, STEP_IDS.length - 1));
  console.log(`currentStep impostato a: ${currentStep}`);

  // 1) Mostra solo il pannello corrente
  STEP_IDS.forEach((id, i) => {
    const pane = GetById(id);
    if (pane) {
      const shouldShow = (i === currentStep);
      console.log(`Step ${id} (indice ${i}): ${shouldShow ? 'VISIBILE' : 'NASCOSTO'}`);
      pane.style.display = shouldShow ? 'block' : 'none';
    } else {
      console.log(`Step ${id} NON TROVATO nel DOM`);
    }
  });

  // 2) Sposta i bottoni subito sotto lo step corrente
  const currentPane = GetById(STEP_IDS[currentStep]);
  const actions     = GetById('formActions');
  if (currentPane && actions) currentPane.insertAdjacentElement('afterend', actions);

  // 3) Mostra "Avanti" negli step intermedi, "Invia" all'ultimo
  const avantiBtn = GetById('avantiBtn');
  const submitBtn = GetById('submitBtn');
  const lastIndex = STEP_IDS.length - 1;

  if (currentStep === lastIndex) {
    if (avantiBtn) avantiBtn.style.display = 'none';
    if (submitBtn) submitBtn.style.display = '';
  } else {
    if (avantiBtn) avantiBtn.style.display = '';
    if (submitBtn) submitBtn.style.display = 'none';
  }
}


function validateCurrentStep() {
  const pane = GetById(STEP_IDS[currentStep]);
  if (!pane) return true;
  const fields = pane.querySelectorAll('input, select, textarea');
  for (const el of fields) {
    if (!el.checkValidity()) {
      el.reportValidity(); // popup nativo del browser
      return false;
    }
  }
  return true;
}

function bindStepButtonsOnce() {
  const avantiBtn = GetById('avantiBtn');
  const cancelBtn = GetById('cancelBtn');
  const form      = GetById('contactForm');

  if (avantiBtn && !avantiBtn.dataset.bound) {
    avantiBtn.dataset.bound = '1';
    avantiBtn.addEventListener('click', () => {
      // se è submit (ultimo step) lascia inviare al browser
      if (avantiBtn.getAttribute('type') === 'submit') return;
      if (!validateCurrentStep()) return;
      showStep(currentStep + 1);
    });
  }
  const lastIndex = STEP_IDS.length - 1;

  if (cancelBtn && !cancelBtn.dataset.bound) {
    cancelBtn.dataset.bound = '1';
    cancelBtn.addEventListener('click', (e) => {
      e.preventDefault(); // blocca il reset nativo del type="reset"
  
      if (currentStep > 0 && currentStep < lastIndex) {
        // step intermedio → torna indietro di uno
        showStep(currentStep - 1);
      } else {
        // primo step O ultimo step → reset + chiudi
        contactForm?.reset();
        tornaIndietro();
      }
    });
  }  
}




// --- riferimenti utili ---
// Le variabili sono già dichiarate sopra con GetById()

// --- validazione campi form ---
function validateName(value, minLength = 2) {
  const trimmed = value.trim();
  if (!trimmed) return { ok: false, msg: "Il campo è obbligatorio." };
  if (trimmed.length < minLength) return { ok: false, msg: `Inserisci almeno ${minLength} caratteri.` };
  if (trimmed.length > 80) return { ok: false, msg: "Il campo non può superare 80 caratteri." };
  return { ok: true, value: trimmed };
}

function validateSelect(value, required = true) {
  if (required && !value) return { ok: false, msg: "Seleziona una voce." };
  return { ok: true, value };
}

function validateMessage(value, minLength = 20) {
  const trimmed = value.trim();
  if (!trimmed) return { ok: false, msg: "Il campo è obbligatorio." };
  if (trimmed.length < minLength) return { ok: false, msg: `Scrivi almeno ${minLength} caratteri.` };
  if (trimmed.length > 2000) return { ok: false, msg: "Il messaggio non può superare 2000 caratteri." };
  return { ok: true, value: trimmed };
}

function validateURL(value) {
  if (!value) return { ok: true, value: "" }; // campo opzionale
  const trimmed = value.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return { ok: false, msg: "L'URL deve iniziare con http:// o https://" };
  }
  try {
    new URL(trimmed);
    return { ok: true, value: trimmed };
  } catch {
    return { ok: false, msg: "Inserisci un URL valido." };
  }
}

function validateConsent(checked) {
  if (!checked) return { ok: false, msg: "Devi accettare per inviare." };
  return { ok: true, value: checked };
}

function validateOptionalText(value, maxLength = 80) {
  if (!value) return { ok: true, value: "" }; // campo opzionale
  const trimmed = value.trim();
  if (trimmed.length > maxLength) return { ok: false, msg: `Il campo non può superare ${maxLength} caratteri.` };
  return { ok: true, value: trimmed };
}

function validateEmail(raw) {
  const value = raw.trim().toLowerCase();
  if (!value) return { ok: false, msg: "L’email è obbligatoria." };
  if (/\s/.test(value)) return { ok: false, msg: "L’email non può contenere spazi." };
  if (value.includes("..")) return { ok: false, msg: "L’email non può contenere due punti consecutivi." };

  const parts = value.split("@");
  if (parts.length !== 2) return { ok: false, msg: "Inserisci un formato valido (es. nome@dominio.it)." };

  const [local, domain] = parts;
  if (!local || !domain) return { ok: false, msg: "Manca la parte locale o il dominio." };
  if (local.startsWith(".") || local.endsWith(".")) return { ok: false, msg: "La parte locale non può iniziare/finire con un punto." };
  if (domain.startsWith("-") || domain.endsWith("-")) return { ok: false, msg: "Il dominio non può iniziare/finire con un trattino." };
  if (!domain.includes(".")) return { ok: false, msg: "Il dominio deve contenere un punto." };

  const tld = domain.split(".").pop();
  if (!tld || tld.length < 2) return { ok: false, msg: "Il TLD deve avere almeno 2 caratteri." };

  const localOk  = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~.-]+$/.test(local);
  if (!localOk) return { ok: false, msg: "Caratteri non validi prima della @." };

  const domainOk = /^(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/.test(domain);
  if (!domainOk) return { ok: false, msg: "Dominio non valido." };

  return { ok: true, value };
}

// Funzione per mostrare/nascondere messaggi di errore
function showFieldError(field, message) {
  const errorDiv = field.parentElement.querySelector('.error-msg');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
    field.classList.add('error');
  }
}

function hideFieldError(field) {
  const errorDiv = field.parentElement.querySelector('.error-msg');
  if (errorDiv) {
    errorDiv.classList.remove('show');
    field.classList.remove('error');
  }
}

// Funzione per validare un campo e mostrare/nascondere errori
function validateField(field, validator) {
  const result = validator(field.value);
  if (!result.ok) {
    showFieldError(field, result.msg);
    return false;
  } else {
    hideFieldError(field);
    return true;
  }
}

// Funzione per configurare la validazione in tempo reale
function setupRealTimeValidation() {
  // Campi nome e cognome
  const nameField = GetById("name");
  const cognomeField = GetById("cognome");
  
  if (nameField) {
    nameField.addEventListener("input", () => validateField(nameField, validateName));
    nameField.addEventListener("blur", () => validateField(nameField, validateName));
  }
  
  if (cognomeField) {
    cognomeField.addEventListener("input", () => validateField(cognomeField, validateName));
    cognomeField.addEventListener("blur", () => validateField(cognomeField, validateName));
  }

  // Campo email
  if (emailInput) {
    emailInput.addEventListener("input", () => validateField(emailInput, validateEmail));
    emailInput.addEventListener("blur", () => validateField(emailInput, validateEmail));
  }

  // Campo azienda (opzionale)
  const companyField = GetById("company");
  if (companyField) {
    companyField.addEventListener("input", () => validateField(companyField, validateOptionalText));
    companyField.addEventListener("blur", () => validateField(companyField, validateOptionalText));
  }

  // Campi select obbligatori
  const projectTypeField = GetById("projectType");
  const budgetField = GetById("budget");
  
  if (projectTypeField) {
    projectTypeField.addEventListener("change", () => validateField(projectTypeField, validateSelect));
  }
  
  if (budgetField) {
    budgetField.addEventListener("change", () => validateField(budgetField, validateSelect));
  }

  // Campo messaggio
  const messageField = GetById("message");
  if (messageField) {
    messageField.addEventListener("input", () => validateField(messageField, validateMessage));
    messageField.addEventListener("blur", () => validateField(messageField, validateMessage));
  }

  // Campo timeline (opzionale)
  const timelineField = GetById("timeline");
  if (timelineField) {
    timelineField.addEventListener("change", () => validateField(timelineField, validateSelect));
  }

  // Campo URL (opzionale)
  const websiteField = GetById("website");
  if (websiteField) {
    websiteField.addEventListener("input", () => validateField(websiteField, validateURL));
    websiteField.addEventListener("blur", () => validateField(websiteField, validateURL));
  }

  // Campo consenso
  const consentField = GetById("consent");
  if (consentField) {
    consentField.addEventListener("change", () => validateField(consentField, validateConsent));
  }
}

// --- submit: usa solo i popup nativi ---
contactForm.addEventListener("submit", async (e) => {
   // Honeypot anti-spam
   const hp = GetById('hp');
   if (hp && hp.value.trim() !== '') { 
     e.preventDefault(); 
     return; 
   }
 
   // Validazione dello step corrente (nativa)
   if (!validateCurrentStep()) { 
     e.preventDefault(); 
     return; 
   }
 
  e.preventDefault();
  console.log("Form submit event triggered!"); // Debug
  
  // Validazione di tutti i campi obbligatori
  const nameField = GetById("name");
  const cognomeField = GetById("cognome");
  const projectTypeField = GetById("projectType");
  const budgetField = GetById("budget");
  const messageField = GetById("message");
  const consentField = GetById("consent");
  
  console.log("Fields found:", { nameField, cognomeField, projectTypeField, budgetField, messageField, consentField }); // Debug
  
  let isValid = true;
  
  // Validazione nome
  if (nameField && !validateField(nameField, validateName)) {
    isValid = false;
  }
  
  // Validazione cognome
  if (cognomeField && !validateField(cognomeField, validateName)) {
    isValid = false;
  }
  
  // Validazione email
  if (emailInput && !validateField(emailInput, validateEmail)) {
    isValid = false;
  }
  
  // Validazione azienda (opzionale)
  const companyField = GetById("company");
  if (companyField && !validateField(companyField, validateOptionalText)) {
    isValid = false;
  }
  
  // Validazione tipo progetto
  if (projectTypeField && !validateField(projectTypeField, validateSelect)) {
    isValid = false;
  }
  
  // Validazione budget
  if (budgetField && !validateField(budgetField, validateSelect)) {
    isValid = false;
  }
  
  // Validazione timeline (opzionale)
  const timelineField = GetById("timeline");
  if (timelineField && !validateField(timelineField, validateSelect)) {
    isValid = false;
  }
  
  // Validazione messaggio
  if (messageField && !validateField(messageField, validateMessage)) {
    isValid = false;
  }
  
  // Validazione consenso
  if (consentField && !validateField(consentField, validateConsent)) {
    isValid = false;
  }
  
  // Validazione URL (opzionale)
  const websiteField = GetById("website");
  if (websiteField && !validateField(websiteField, validateURL)) {
    isValid = false;
  }
  
  // Se non è valido, non procedere
  if (!isValid) {
    console.log("Form validation failed!"); // Debug
    return;
  }

  console.log("Form validation passed, sending data..."); // Debug
  
  // Invio via fetch (AJAX)
  const formData = new FormData(contactForm);

  try {
    console.log("Sending data to Formspree..."); // Debug
    // Sostituisci questo URL con quello che ti dà Formspree
    const resp = await fetch("https://formspree.io/f/xgvzqkbe", { 
      method: "POST", 
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log("Response received:", resp); // Debug
    if (resp.ok) {
      if (formStatus) {
        formStatus.textContent = "Richiesta inviata con successo! 🎉";
        formStatus.classList.add("form-status")
        let pForm = qs("#privacyForm");
        pForm.remove();
        /*
        formStatus.style.color = "#28a745";
        formStatus.style.border = "1px solid ##28a745";
        formStatus.style.borderRadius = '1em';
        */
      }
        // disabilita i bottoni per evitare doppi invii
  GetById('avantiBtn')?.setAttribute('disabled', 'disabled');
  GetById('submitBtn')?.setAttribute('disabled', 'disabled');
  GetById('cancelBtn')?.setAttribute('disabled', 'disabled');

       // aspetta un attimo, poi chiudi
  setTimeout(() => {
    contactForm.reset();
    // torna allo step iniziale per la prossima apertura
    showStep(0);
    // chiudi la modale
    tornaIndietro();
    // riabilita i bottoni per il prossimo utilizzo
    GetById('avantiBtn')?.removeAttribute('disabled');
    GetById('submitBtn')?.removeAttribute('disabled');
    GetById('cancelBtn')?.removeAttribute('disabled');
    if (formStatus) formStatus.textContent = "";
  }, 3000);

    } else {
      if (formStatus) {
        formStatus.textContent = "Errore durante l’invio. Riprova.";
        formStatus.style.color = "#dc3545";
      }
    }
  } catch (err) {
    console.error(err);
    formStatus.textContent = "Errore di connessione. Verifica la tua connessione.";
    formStatus.style.color = "#dc3545";
  }
});

// Inizializza gli step quando la pagina si carica
document.addEventListener('DOMContentLoaded', initializeSteps);
