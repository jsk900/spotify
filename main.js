window.onload = () => start();

//Globals
const url = 'https://elegant-croissant.glitch.me/spotify';
let artist = 'prince';
let type = 'artist';
let urlLoad;
let search;
let nextPage;

//Get DOM Elements
const input = document.querySelector('input[type="text"]');
const select = document.querySelector('select');
const go = document.querySelector('button');
const section = document.querySelector('section');
const footer = document.querySelector('footer');

const start = () => {
  input.focus();
  urlLoad = `${url}?q=${artist}&type=${type}`;
  dataLoad(urlLoad);
};

//Get data from api
const dataLoad = url => {
  fetch(url)
    .then(checkStatus)
    .then(response => response.json())
    .then(response => show(response))
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
const show = response => {
  search = response.artists || response.albums;
  nextPage = search.next;
  search.items.map(art => {
    let figure = document.createElement('figure');
    let imagePlaceholder = document.createElement('img');
    let figcaption = document.createElement('figcaption');
    if (art.images.length !== 0) {
      imagePlaceholder.src = art.images[0].url;
    } else {
      imagePlaceholder.src = './images/noImage.png';
    }

    if (art.name.length > 50) {
      let newTitle = art.name.substring(0, 30);
      figcaption.innerHTML = newTitle;
    } else {
      figcaption.innerHTML = art.name;
    }

    figure.appendChild(imagePlaceholder);
    figure.appendChild(figcaption);
    section.appendChild(figure);
  });
};

const deleteList = () => {
  const [...figureList] = document.querySelectorAll('section figure');

  if (figureList.length > 1) {
    figureList.map(figure => section.removeChild(figure));
  }
};

const infinite = () => {
  if (nextPage) {
    urlLoad = nextPage.replace(
      'https://api.spotify.com/v1/search',
      'https://elegant-croissant.glitch.me/spotify'
    );
    dataLoad(urlLoad);
  }
};

//Handle errors
const errorHandler = error => {
  console.log(error);
};

//Listeners
select.addEventListener('click', e => {
  type = e.target.value;
});

go.addEventListener('click', e => {
  e.preventDefault();
  artist = input.value;
  urlLoad = `${url}?q=${artist}&type=${type}`;
  input.value = '';
  input.focus();
  deleteList();
  dataLoad(urlLoad);
});

//Very neat code to handle infinite scrolling
document.addEventListener('DOMContentLoaded', () => {
  let options = {
    root: null,
    rootMargins: '0px',
    threshold: 0.2
  };

  const observer = new IntersectionObserver(infinite, options);
  observer.observe(footer);
});
