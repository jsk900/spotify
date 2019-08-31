window.onload = () => start();

//Globals
const url = 'https://elegant-croissant.glitch.me/spotify';
let artist;
let type = 'album';

//Get DOM Elements
const input = document.querySelector('input[type="text"]');
const button = document.querySelector('button');
const section = document.querySelector('section');

const start = () => {
  input.focus();
};

//Get data from api
const dataLoad = () => {
  let urlLoad = `${url}?q=${artist}&type=${type}`;
  fetch(urlLoad)
    .then(checkStatus)
    .then(response => response.json())
    .then(response => response.albums.items.map(art => show(art)))
    .catch(error => errorHandler(error));
};

//Deal with promise
const checkStatus = response => {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
};

//Show data
const show = art => {
  let figure = document.createElement('figure');
  let imagePlaceholder = document.createElement('img');
  let figcaption = document.createElement('figcaption');
  imagePlaceholder.src = art.images[0].url;

  if (art.name.length > 50) {
    let newTitle = art.name.substring(0, 30);
    figcaption.innerHTML = newTitle;
  } else {
    figcaption.innerHTML = art.name;
  }

  figure.appendChild(imagePlaceholder);
  figure.appendChild(figcaption);
  section.appendChild(figure);
};

const deleteList = () => {
  const [...figureList] = document.querySelectorAll('section figure');

  if (figureList.length > 1) {
    figureList.map(figure => section.removeChild(figure));
  }
};

//Handle errors
const errorHandler = error => {
  console.log('error');
};

//Listeners
button.addEventListener('click', e => {
  e.preventDefault();
  artist = input.value;
  input.value = '';
  input.focus();
  deleteList();
  dataLoad();
});
