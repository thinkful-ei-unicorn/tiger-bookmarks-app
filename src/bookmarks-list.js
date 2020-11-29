import $ from 'jquery';

import store from './store';

import api from './api';

const generateItemElement = function (item) {
  function ratingLabel (item){
    let heartsView = [];
    if (item.rating > 1) {
      for (let i = 0; i < item.rating; i++) {
        heartsView.push(`<label type="radio" checked="checked" class="heartView">♡</label>`);
      }
    }
    return heartsView.join(' ');
  }
  let itemTitle = 
  `
    <form id="js-edit-item-form">
      <input class="bookmark-item" type="text" value="${item.title}" required/>
    </form>
    <div class="rating-box">
      ${ratingLabel(item)}
    </div>
    <br>
    <label> Visit site: <a href="${item.url}" target="new_blank">${item.url}</a>
    </label>
    <section class="bookmark-desc">${item.desc}</section>
      <div class="bookmark-item-controls">
        <button class="bookmark-item-toggle js-item-toggle">
          <span class="button-label">close</span>
        </button>
        <button class="bookmark-item-delete js-item-delete">
          <span class="button-label">delete</span>
        <button>
  `;
  if (!item.expanded) {
    itemTitle =
    `
    <div class="bookmark-box">
      <span class="bookmark-item bookmark-item__expanded">${item.title}</span>
      <div class="rating-box">${ratingLabel(item)}</div>
    </div>
    `;
  }
  return`
  <li class="js-item-element" data-item-id="${item.id}">${itemTitle}</div>
  </li>
  `;
};

const generateBookmarkItemString = function (bookmarksList) {
  const items = bookmarksList.map((item) => generateItemElement(item));
  return items.join('');
};

const generateError = function (message) {
  return `
  <section class="error-content">
    <button id="cancel-error">X</button>
    <p>${message}</p>
  </section>
  `;
};

const renderError = function () {
  if (store.error) {
    const el = generateError(store.error);
    $('.error-container').html(el);
  } else {
    $('.error-container').empty();
  }
};

const handleCloseError = function () {
  $('.main-view').on('click', '#cancel-error', () => {
    store.setError(null);
    renderError();
  });
};

const render = function () {
  renderError();
  //filter item list by item rating
  let items = [...store.bookmarks];
  items = items.filter(item => item.rating >= store.filter);
  //render the bookmark list to the DOM
  const bookmarkListItemsString = generateBookmarkItemString(items);
  //insert HTML to the DOM
  if (store.adding === false) {
    let html = `
    <div class="new-bookmark-form">
    </div>
    <div class="my-bookmarks-view">
    <header>
      <h2>My Bookmarks</h2>
      <form id="initial-view">
        <button class="initial-view-new">
          <span class="button-label"New</span>
        </button>
        <select id="ratings" name="ratings">
          <option>
            <span class="button-label"></span>Filter By</span>
          </option>
          <option value="1">1 heart</option>
          <option value="2">2 hearts</option>
          <option value="3">3 hearts</option>
          <option value="4">4 hearts</option>
          <option value="5">5 hearts</option>
        </select>
      <form>
      </header>
      <ul class="bookmark-list js-bookmark-list"></ul>
      </div
    `;
    $('.main-view').html(html);
    $('.js-bookmark-list').html(bookmarkListItemsString);
  } else {
    $('.my-bookmarks-view').empty();
  }
};

$.fn.extend({
  serializeJson: function () {
    const formData = new FormData(this[0]);
    const o = {};
    formData.forEach((val, name) => o[name] = val);
    return JSON.stringify(o);
  }
});

const handleNewItemSubmit = function () {
  $('.main-view').on('submit', '#js-new-bookmark-form', event => {
    event.preventDefault();
    const bookmark = $(event.target).serializeJson();
    api.createItem(bookmark)
      .then((bookmark) => {
        store.addItem(bookmark);
        store.adding = false;
        store.filter = 0;
        addNewForm();
        render();
      })
      .catch((error) => {
        store.setError(error.message);
        renderError();
      });
  });
};

const getItemIdFromElement = function (item) {
  return $(item).closest('.js-item-element').data('item-id');
};

const handleDeleteItemClicked = function () {
  return $('.main-view').on('click', '.js-item-delete', event => {
    //get the index of the item in store.items
    const id = getItemIdFromElement(event.currentTarget);
    //delete the item
    api.deleteItem(id)
      .then(() => {
        store.findAndDelete(id);
        //render the updated bookmark list
        render();
      })
      .catch((error) => {
        store.setError(error.message);
        renderError();
      });
  });
};

const handleEditBookmarkItemSubmit = function () {
  $('.main-view').on('submit', '#js-edit-item-form', event => {
    event.preventDefault();
    const id = getItemIdFromElement(event.currentTarget);
    const itemName = $(event.currentTarget).find('.bookmark-item').val();
    api.updateItem(id, {title:itemName})
      .then((newItem) => {
        store.findAndUpdate(id, {title:itemName});
        store.filter = 0;
        render();
      })
      .catch((error) => {
        console.log(error);
        store.setError(error.message);
        renderError();
      });
  });
};

const handleItemExpandClicked = function () {
  $('.main-view').on('click', '.bookmark-item__expanded', event => {
    const id = getItemIdFromElement(event.currentTarget);
    const item = store.findById(id);
    item.expanded = !item.expanded;
    render();
  });
};

const handleCloseClicked = function () {
  $('.main-view').on('click', 'js-item-toggle', event => {
    const id = getItemIdFromElement(event.currentTarget);
    const item = store.findById(id);
    item.expanded = !item.expanded;
    render();
  });
};

const handleFilterClick = function () {
  let filterValue = $('#ratings option:selected').val();
  store.filter = filterValue;
  render();
};

const handleNewCancel = function () {
  $('.main-view').on('click', '.cancel', event => {
    event.preventDefault();
    store.adding = false;
    addNewForm();
    render();
  });
};

const handleNewSubmit = function () {
  $('.main-view').on('click', '.initial-view-new', event => {
    event.preventDefault();
    console.log('clicked-new');
    store.adding = true;
    addNewForm();
  });
};

const addNewForm = function () {
  if (store.adding) {
    const newForm = `
    <div class="error-container"></div>
    <form id="js-new-bookmark-form">
      <label for="bookmark-entry">Add New Bookmark:</label>
      <br>
      <input type="url" name="url" class="bookmark-url-entry" value="https://" placeholder="github.com" required>
      <br>
      <label for="bookmark-title-entry">Bookmark Title:</label>
      <br>
      <input type="text" name="title" class="bookamrk-title-entry" placeholder="GitHub">
      <br>
      <label for="bookmark-rating-entry"> Rating:</label>
      <br>
      <div class="txt-center">
        <div class="rating">
          <input id="heart5" name="rating" type="radio" value="5" class="radio-button-hide"/>
          <label for="heart5">♡</label>
          <input id="heart4" name="rating" type="radio" value="4" class="radio-button-hide"/>
          <label for="heart4">♡</label>
          <input id="heart3" name="rating" type="radio" value="3" class="radio-button-hide"/>
          <label for="heart3">♡</label>
          <input id="heart2" name="rating" type="radio" value="2" class="radio-button-hide"/>
          <label for="heart2">♡</label>
          <input id="heart1" name="rating" type="radio" value="1" class="radio-button-hide"/>
          <label for="heart1">♡</label>
          <div class="clear"></div>
          <input id="heart5" name="rating" type="radio" value="5" class="heartRadio"/>
          <input id="heart4" name="rating" type="radio" value="4" class="heartRadio"/>
          <input id="heart3" name="rating" type="radio" value="3" class="heartRadio"/>
          <input id="heart2" name="rating" type="radio" value="2" class="heartRadio"/>
          <input id="heart1" name="rating" type="radio" value="1" class="heartRadio"/>
      </div>
    </div>
    <input type="text" name="desc" class="bookmark-description-entry" placeholder="description">
    <br>
      <button class="create" type="submit">Create</button>
      <button class="cancel" type="reset">Cancel</button>
    </form>
    `;

    $('.new-bookmark-form').html(newForm);
  } else {
    $('.new-bookmark-form').empty();
  }
  render();
};

const bindEventListeners = () => {
  handleNewItemSubmit();
  handleItemExpandClicked();
  handleDeleteItemClicked();
  handleEditBookmarkItemSubmit();
  handleCloseError();
  $('main-view').on('change', '#ratings', handleFilterClick);
  handleNewSubmit();
  handleNewCancel();
  handleCloseClicked();
};

//this object containes the only exposed methods from this module
export default {
  render,
  bindEventListeners
};