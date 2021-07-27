const NUMBERS = /[0-9]/;
const TEN_NUMBERS = /[0-9]{10}/;
const at = /@+/;
const MIN_MAX_TEL_LENGTH = 10;
const isStorageSupport = true;
let storageTel = '';
let storageEmail = '';
const pageHeaderWrapper = document.querySelector('.page-header__wrapper');
const pageHeaderContainer = document.querySelector('.page-header__container');
const mainNavList = document.querySelector('.main-nav__list');
const mainNavToggle = document.querySelector('.main-nav__toggle');
const placesOfVisitLinks = document.querySelectorAll('.places-of-visit__link-block')
const tabTriggers = document.querySelectorAll('.countries__button-tab');
const tabContents = document.querySelectorAll('.countries__item');
const tabButtons = document.querySelectorAll('.countries__button');
const overlay = document.querySelector('.overlay');
const successModal = document.querySelector('.success-modal');
const successModalCloseButton = document.querySelector('.success-modal__close');
const tour = document.querySelector('.tour');
const tourCloseButton = document.querySelector('.tour__close');
const tourInputs = document.querySelectorAll('.tour__input');
const tourInputTel = document.querySelector('.tour__input--tel')
const tourInputEmail = document.querySelector('.tour__input--email');
const tourInputContainerTel = document.querySelector('.tour__input-container--tel');
const tourInputContainerEmail = document.querySelector('.tour__input-container--email');
const tourButtonSubmit = document.querySelector('.tour__button');
const tourForm = document.querySelector('.tour__form');

const questionsFormInputs = document.querySelectorAll('.questions-form__input');
const questionsFormInputTel = document.querySelector('.questions-form__input--tel')
const questionsFormInputEmail = document.querySelector('.questions-form__input--email');
const questionsFormInputContainerTel = document.querySelector('.questions-form__input-container--tel');
const questionsFormInputContainerEmail = document.querySelector('.questions-form__input-container--email');
const questionsFormButtonSubmit = document.querySelector('.questions-form__button');
const questionsFormContainer = document.querySelector('.questions-form__container');

const pricesButtons = document.querySelectorAll('.prices__button');
const pricesItems = document.querySelectorAll('.prices__item');
const requiredTourInputs = [];

tourInputs.forEach(element => {
  if (element.required) {
    requiredTourInputs.push(element);
  }
});

const requiredQuestionsFormInputs = [];

questionsFormInputs.forEach(element => {
  if (element.required) {
    requiredQuestionsFormInputs.push(element);
  }
});

try {
  storageTel = localStorage.getItem('tel');
  storageEmail = localStorage.getItem('email')
} catch (err) {
  isStorageSupport = false;
}

if (storageTel) {
  questionsFormInputTel.value = storageTel;
}
if (storageEmail) {
  questionsFormInputEmail.value = storageEmail;
}

// Меню навигации

pageHeaderWrapper.classList.remove('page-header__wrapper--nojs');
mainNavList.classList.remove('main-nav__list--nojs');
mainNavToggle.classList.remove('main-nav__toggle--nojs');

mainNavToggle.addEventListener('click', () => {
  pageHeaderContainer.classList.toggle('page-header__container--opened');
  mainNavToggle.classList.toggle('main-nav__toggle--opened');
  mainNavList.classList.toggle('main-nav__list--opened');
});

// Табы

const onTabLinkClick = (evt) => {
  const id = evt.target.getAttribute('data-tab');
  const tab = document.querySelector('.countries__button-tab[data-tab="' + id + '"]');
  const content = document.querySelector('.countries__item[data-tab="' + id + '"]');
  const showTrigger = document.querySelector('.countries__button-tab--show');
  const showContent = document.querySelector('.countries__item--show');

  showTrigger.classList.remove('countries__button-tab--show');
  tab.classList.add('countries__button-tab--show');

  showContent.classList.remove('countries__item--show');
  content.classList.add('countries__item--show');
};

tabTriggers.forEach(trigger => {
  trigger.addEventListener('click', onTabLinkClick);
});
placesOfVisitLinks.forEach(link => {
  link.addEventListener('click', onTabLinkClick);
});

// Форма покупки тура

const onTourInputTelInput = () => {
  const inputValue = tourInputTel.value;
  const valueLength = tourInputTel.value.length;

  const addError = () => {
    tourInputTel.classList.add('input--error');
    tourInputContainerTel.classList.add('tour__input-container--error');
  };

  const removeError = () => {
    tourInputTel.classList.remove('input--error');
    tourInputContainerTel.classList.remove('tour__input-container--error');
  };

  if (!inputValue) {
    tourInputTel.setCustomValidity('Обязательное поле');
  } else if (valueLength > MIN_MAX_TEL_LENGTH) {
    tourInputTel.setCustomValidity(`Удалите лишние ${valueLength - MIN_MAX_TEL_LENGTH} символы`);
    addError();
  } else if (!NUMBERS.test(inputValue)) {
    tourInputTel.setCustomValidity('В данном поле требуются только цифры');
    addError();
  } else if (valueLength < MIN_MAX_TEL_LENGTH) {
    tourInputTel.setCustomValidity(`Ещё ${MIN_MAX_TEL_LENGTH - valueLength} символа(ов)`);
    addError();
  } else if (!TEN_NUMBERS.test(inputValue)) {
    tourInputTel.setCustomValidity('В данном поле требуются только цифры');
    addError();
  } else {
    tourInputTel.setCustomValidity('');
    removeError();
  }
  if (!inputValue) {
    removeError();
  }
  tourInputTel.reportValidity();
};

const onTourInputEmailInput = () => {
  const inputValue = tourInputEmail.value;
  if (inputValue && !at.test(inputValue)) {
    tourInputEmail.setCustomValidity('Адрес электронной почты должен содержать "@"');
    tourInputEmail.classList.add('input--error');
    tourInputContainerEmail.classList.add('tour__input-container--error');
  } else {
    tourInputEmail.setCustomValidity('');
    tourInputEmail.classList.remove('input--error');
    tourInputContainerEmail.classList.remove('tour__input-container--error');
  }
};

const onTourButtonSubmitClick = () => {
  requiredTourInputs.forEach(input => {
    if (!input.checkValidity()) {
      input.classList.add('input--error');
      if (input.classList.contains('tour__input--tel')) {
        tourInputContainerTel.classList.add('tour__input-container--error');
      } else {
        tourInputContainerEmail.classList.add('tour__input-container--error');
      }
    }
  })
};

const deleteTourFormListeners = () => {
  tour.classList.remove('tour--show');
  overlay.classList.remove('overlay--show');
  tourCloseButton.removeEventListener('click', onTourCloseButtonClick);
  tourInputTel.removeEventListener('input', onTourInputTelInput)
  tourInputEmail.removeEventListener('input', onTourInputEmailInput);
  tourButtonSubmit.removeEventListener('click', onTourButtonSubmitClick);
  document.removeEventListener('keydown', onTourEscKeydown);
  document.removeEventListener('click', onTourOverlayClick);
};

const onTourCloseButtonClick = () => {
  deleteTourFormListeners();
}

const onTourEscKeydown = (evt) => {
  if (evt.key === 'Escape' || evt.key === 'Esc') {
    deleteTourFormListeners();
  }
};

const onTourOverlayClick = (evt) => {
  if (evt.target.classList.contains('overlay')) {
    deleteTourFormListeners();
  }
};

const deleteSuccessModalListeners = () => {
  overlay.classList.remove('overlay--show');
  successModal.classList.remove('success-modal--show');
  successModalCloseButton.removeEventListener('click', onSuccessModalCloseButtonClick);
  document.removeEventListener('keydown', onSuccessEscKeydown);
  document.removeEventListener('click', onSuccessOverlayClick);
};

const onSuccessModalCloseButtonClick = () => {
  deleteSuccessModalListeners();
}

const onSuccessEscKeydown = (evt) => {
  if (evt.key === 'Escape' || evt.key === 'Esc') {
    deleteSuccessModalListeners();
  }
};

const onSuccessOverlayClick = (evt) => {
  if (evt.target.classList.contains('overlay')) {
    deleteSuccessModalListeners();
  }
};

const onButtonTourOpenClick = () => {
  tour.classList.add('tour--show');
  overlay.classList.add('overlay--show');
  tourInputTel.focus();
  if (storageTel) {
    tourInputTel.value = storageTel;
  }
  if (storageEmail) {
    tourInputEmail.value = storageEmail;
  }
  tourInputTel.addEventListener('input', onTourInputTelInput)
  tourInputEmail.addEventListener('input', onTourInputEmailInput);
  tourButtonSubmit.addEventListener('click', onTourButtonSubmitClick);
  tourCloseButton.addEventListener('click', onTourCloseButtonClick);
  document.addEventListener('keydown', onTourEscKeydown);
  document.addEventListener('click', onTourOverlayClick);
};

tabButtons.forEach(button => {
  button.addEventListener('click', onButtonTourOpenClick);
});

pricesButtons.forEach(button => {
  button.addEventListener('click', onButtonTourOpenClick);
})

tourForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  tour.classList.remove('tour--show');
  successModal.classList.add('success-modal--show');
  successModalCloseButton.addEventListener('click', onSuccessModalCloseButtonClick);
  document.addEventListener('keydown', onSuccessEscKeydown);
  document.addEventListener('click', onSuccessOverlayClick);
  if (isStorageSupport) {
    if (tourInputTel.value) {
      localStorage.setItem('tel', tourInputTel.value);
    }
    if (tourInputEmail.value) {
      localStorage.setItem('email', tourInputEmail.value);
    }
  }
  tourInputTel.removeEventListener('input', onTourInputTelInput)
  tourInputEmail.removeEventListener('input', onTourInputEmailInput);
  tourButtonSubmit.removeEventListener('click', onTourButtonSubmitClick);
  tourCloseButton.removeEventListener('click', onTourCloseButtonClick);
  document.removeEventListener('keydown', onTourEscKeydown);
  document.removeEventListener('click', onTourOverlayClick);
});

const onQuestionsFormInputTelInput = () => {
  const inputValue = questionsFormInputTel.value;
  const valueLength = questionsFormInputTel.value.length;

  const addError = () => {
    questionsFormInputTel.classList.add('input--error');
    questionsFormInputContainerTel.classList.add('questions-form__input-container--error');
  };

  const removeError = () => {
    questionsFormInputTel.classList.remove('input--error');
    questionsFormInputContainerTel.classList.remove('questions-form__input-container--error');
  };

  if (!inputValue) {
    questionsFormInputTel.setCustomValidity('Обязательное поле');
  } else if (valueLength > MIN_MAX_TEL_LENGTH) {
    questionsFormInputTel.setCustomValidity(`Удалите лишние ${valueLength - MIN_MAX_TEL_LENGTH} символы`);
    addError();
  } else if (!NUMBERS.test(inputValue)) {
    questionsFormInputTel.setCustomValidity('В данном поле требуются только цифры');
    addError();
  } else if (valueLength < MIN_MAX_TEL_LENGTH) {
    questionsFormInputTel.setCustomValidity(`Ещё ${MIN_MAX_TEL_LENGTH - valueLength} символа(ов)`);
    addError();
  } else if (!TEN_NUMBERS.test(inputValue)) {
    questionsFormInputTel.setCustomValidity('В данном поле требуются только цифры');
    addError();
  } else {
    questionsFormInputTel.setCustomValidity('');
    removeError();
  }
  if (!inputValue) {
    removeError();
  }
  questionsFormInputTel.reportValidity();
};

const onQuestionsFormInputEmailInput = () => {
  const inputValue = questionsFormInputEmail.value;
  if (inputValue && !at.test(inputValue)) {
    questionsFormInputEmail.setCustomValidity('Адрес электронной почты должен содержать "@"');
    questionsFormInputEmail.classList.add('input--error');
    questionsFormInputContainerEmail.classList.add('questions-form__input-container--error');
  } else {
    questionsFormInputEmail.setCustomValidity('');
    questionsFormInputEmail.classList.remove('input--error');
    questionsFormInputContainerEmail.classList.remove('questions-form__input-container--error');
  }
};

const onQuestionsFormButtonSubmitClick = () => {
  requiredQuestionsFormInputs.forEach(input => {
    if (!input.checkValidity()) {
      input.classList.add('input--error');
      if (input.classList.contains('questions-form__input--tel')) {
        questionsFormInputContainerTel.classList.add('questions-form__input-container--error');
      } else {
        questionsFormInputContainerEmail.classList.add('questions-form__input-container--error');
      }
    }
  })
};

questionsFormInputTel.addEventListener('input', onQuestionsFormInputTelInput)
questionsFormInputEmail.addEventListener('input', onQuestionsFormInputEmailInput);
questionsFormButtonSubmit.addEventListener('click', onQuestionsFormButtonSubmitClick);

questionsFormContainer.addEventListener('submit', (evt) => {
  evt.preventDefault();
  overlay.classList.add('overlay--show');
  successModal.classList.add('success-modal--show');
  successModalCloseButton.addEventListener('click', onSuccessModalCloseButtonClick);
  document.addEventListener('keydown', onSuccessEscKeydown);
  document.addEventListener('click', onSuccessOverlayClick);
  if (isStorageSupport) {
    if (questionsFormInputTel.value) {
      localStorage.setItem('tel', questionsFormInputTel.value);
    }
    if (questionsFormInputEmail.value) {
      localStorage.setItem('email', questionsFormInputEmail.value);
    }
  }
});

// Плавный скролл по клику на якорь

$('a[href*="#"]').on('click', function(evt) {
  evt.preventDefault();
  const anchor = $(this).attr('href');
  $('html, body').stop().animate({
    scrollTop: $(anchor).offset().top - 60
  }, 800);
});
