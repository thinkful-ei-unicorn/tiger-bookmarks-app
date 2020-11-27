import $ from 'jquery';
import './index.css';

import bookmark from './bookmark'
import store from './store';
import api from './api';


const main = function () {
  console.log('DOM is loaded');
  api.getBookmarks()
    .then((bookmarks) => {
      bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
      bookmark.render();
    });
  bookmark.bindEventListeners();
  bookmark.render();
};

$(main);