import './css/styles.css';
import fetchCountries from '../src/js/fetchCountries.js';
import Lodash from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', Lodash(onInputField, DEBOUNCE_DELAY));

function onInputField(event) {
  const countries = event.target.value.trim();

  if (countries === '') {
    countryListEl.innerHTML = '';
    countryInfoEl.innerHTML = '';
    return;
  }

  fetchCountries(countries)
    .then(renderCountriesInfo)
    .catch(error =>
      Notiflix.Notify.failure('Oops, there is no country with that name')
    );
}

function renderCountriesInfo(countries) {
  if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    countryListEl.innerHTML = '';
  }

  const markup = countries
    .map(({ name, capital, population, flags, languages }) => {
      return `<img src="${flags.svg}" alt="${name.official}" width="30px">
          <h1 class="official-name">${name.official}</h1>
          <p><b>Capital:</b> ${capital}</p>
          <p><b>Population:</b> ${population}</p>
          <p><b>Langueges:</b> ${Object.values(languages)}</p>`;
    })
    .join('');
  countryInfoEl.innerHTML = markup;

  if (countries.length > 1) {
    countryInfoEl.innerHTML = '';
  }

  renderCountriesList(countries);
}

function renderCountriesList(countries) {
  if (countries.length >= 2 && countries.length <= 10) {
    const markup = countries
      .map(({ name, flags }) => {
        return `<li>
        <img src="${flags.svg}" alt="${name.official}" width="30px">
        <p class="official-name"><b>${name.official}</b>
      </li>`;
      })
      .join('');
    countryListEl.innerHTML = markup;
  }

  if (countries.length === 1) {
    countryListEl.innerHTML = '';
  }
}
