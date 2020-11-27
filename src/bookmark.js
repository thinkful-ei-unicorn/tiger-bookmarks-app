import store from './store'
import api from './api'

/********** TEMPLATE GENERATION FUNCTIONS **********/

//These functions return HTML templates

function generateStartPage() {
  //this function will generate the start page to the DOM
  console.log('Generating Start Page...');

  return `
    <div class="container">
      <h1>My Bookmarks</h1>
      <form id="js-main-controls">
      <button type="submit">New Bookmark</button>
      <select class="js-filter">
        <option value="0">Filter:</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
      </form>
      <ul class="js-boomark-list">
      </ul>
    </div>
  `;
}

function generateAddBookmarkPage() {
  console.log('Generating Add Bookmark Page...');

  return `
  <div class="container">
  <h1>My Bookmarks</h1>
  <form class="js-bookmark-entry">
    <label for="url">Add URL:</label>
    <input type="url" name="url" class="js-bookmark-entry" placeholder="https://github.com">
    <label for="title">Add Name:</label>
    <input type="text" name="title" class="js-bookmark-entry" placeholder="GitHub">
    <select name="rating" class="js-bookmark-entry">
      <option value="0">Rating:</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
    </select>
    <label for="desc">Description:</label>
    <textarea id="bookmarkDescription" class="js-bookmark-entry" name="desc" placeholder="Describe your bookmark..." cols="30" rows="5"></textarea>
    <div id="js-cancel-button">
      <button class="js-bookmark-entry" type="button">Cancel</button>
    </div>
    <div id="js-submit-button">
      <button class="js-bookmark-entry" type="button">Create</button>
    </div>
  </form>
  <ul class="js-boomark-list">
  </ul>
  </div>
  `
}





/********** EVENT HANDLER FUNCTIONS **********/

// These functions handle events (submit, click, etc)

function handleAddItemClicked() {
  //this function will be responsible for when a user wants to add a new bookmark item
$('main').on('submit', '#js-main-controls', function(event) {
  event.preventDefault();
  store.adding = true;
  render();
})
}

function handleCancelClicked() {
  $('main').on('click', '#js-cancel-button', function(event) {
    console.log('Handling cancel...')
    //store.adding = false;
  })
}



function handleCreateClicked() {
  $('main').on('click', '#js-submit-button', function(event) {
    console.log('Handling submit...')
    api.createBookmark($(event.target));
  })
}

const bindEventListeners = () => {
  handleAddItemClicked();
  handleCancelClicked();
  handleCreateClicked();
};

/********** RENDER FUNCTION(S) **********/

//This function conditionally replaces the contents of the <main> tag based on the contents of the store

function render() {
  let html = '';
  if (store.adding === false) {
    html = generateStartPage();
  } else if (store.adding === true) {
    html = generateAddBookmarkPage;
  }
  
  $('main').html(html);
}

export default {
  render,
  bindEventListeners
}