import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const searchBoxEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');
const notifyOptions = {
  borderRadius: '10px',
  fontSize: '16px',
  width: '300px',
  cssAnimationStyle: 'zoom',
  useFontAwesome: true,
  fontAwesomeIconStyle: 'shadow',
  fontAwesomeIconSize: '24px',
};

searchBoxEl.addEventListener(
  'input',
  debounce(handleSearchBoxInput, DEBOUNCE_DELAY)
);

function handleSearchBoxInput() {
  const name = searchBoxEl.value.trim();
  if (name.length === 0) {
    countryInfoEl.innerHTML = '';
    countryListEl.innerHTML = '';
    return;
  }
  fetchCountries(name)
    .then(data => {
      if (data.length === 1) {
        countryListEl.innerHTML = '';
        makeCountryMarkup(data);
      } else if (data.length <= 10) {
        countryInfoEl.innerHTML = '';
        makeCountriesMarkup(data);
      } else if (data.length > 10) {
        countryInfoEl.innerHTML = '';
        countryListEl.innerHTML = '';
        Notify.info(
          'Too many matches found. Please enter a more specific name.',
          notifyOptions
        );
      }
    })
    .catch(() => {
      countryInfoEl.innerHTML = '';
      countryListEl.innerHTML = '';
      Notify.failure('Oops, there is no country with that name', notifyOptions);
    });
}

function makeCountryMarkup(data) {
  return (countryInfoEl.innerHTML = `
    <div class="inner-wrapper">
      <img src="${data[0].flags.svg}" alt="flag" height="24"/> 
      <h1 class="title">${data[0].name}</h1>
    </div>
      <p class="sub-title">Capital: <span class="text">${
        data[0].capital
      }</span></p>
      <p class="sub-title">Population: <span class="text">${
        data[0].population
      }</span></p>
      <p class="sub-title">Languages: <span class="text">${data[0].languages
        .map(l => l.name)
        .join(', ')}</span></p>`);
}

function makeCountriesMarkup(data) {
  const counties = data
    .map(
      country =>
        `<li>
          <img src="${country.flags.svg}" alt="flag" width="30" />
          <span>${country.name}</span>
        </li>`
    )
    .join(' ');
  countryListEl.insertAdjacentHTML('beforeend', counties);
}
