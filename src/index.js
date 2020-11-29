import $ from 'jquery';

import './index.css';

import bookmarksList from './bookmarks-list';
import store from './store';
import api from './api';


const main = function () {
  console.log('DOM is loaded');
  api.getItems()
    .then((items) => {
      items.forEach((item) => store.addItem(item));
      bookmarksList.render();
    });
  bookmarksList.bindEventListeners();
  bookmarksList.render();
};

$(main);