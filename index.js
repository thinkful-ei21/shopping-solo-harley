'use strict';
/* eslint-env jquery */

const STORE = {
  items:[
    {name: 'apples', checked: false, searched: true},
    {name: 'oranges', checked: false, searched: true},
    {name: 'milk', checked: true, searched: true},
    {name: 'bread', checked: false, searched: true}
  ],
  showChecked:true
};


function generateItemElement(item, itemIndex) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span contenteditable="true" class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');
  let items = [];
  if (STORE.showChecked){
    for (let i = 0; i < shoppingList.length; i++){
      if (shoppingList[i].searched) items.push(generateItemElement(shoppingList[i], i));
    }
  }
  else {
    for (let i = 0; i < shoppingList.length; i++){
      if (shoppingList[i].searched && !shoppingList[i].checked) items.push(generateItemElement(shoppingList[i], i));
    }  
  }
  
  return items.join('');
}


function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  const shoppingListItemsString = generateShoppingItemsString(STORE.items);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false, searched: true});
}

function searchList(searchFilter) {
  console.log(`Searching shopping list items for ${searchFilter}`);
  if (searchFilter) {
    STORE.items.map(item => item.name.indexOf(searchFilter) >= 0 ? item.searched = true : item.searched = false);
  } else {
    STORE.items.map(item => item.searched = true);
  }
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

function changeItemName(itemIndex, newName) {
  console.log('Changing name for item at index ' + itemIndex);
  STORE.items[itemIndex].name = newName;
}

function removeListItem(itemIndex) {
  console.log('Removing item at index ' + itemIndex);
  STORE.items.splice(itemIndex, 1);
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function handleItemEdit() {
  $('.js-shopping-list').on('blur', '.js-shopping-item', event => {
    console.log('`handleItemEdit` ran');
    const newName = $(event.currentTarget).text();
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    changeItemName(itemIndex, newName);
    renderShoppingList();
  });
}

function handleDeleteItemClicked() {
  // this function will be responsible for when users want to delete a shopping list
  // item
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    console.log('`handleDeleteItemClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    removeListItem(itemIndex);
    renderShoppingList();
  });
}

function handleShowChecked() {
  $('#js-search-check-form').on('click', '.showChecked', event => {
    console.log('`handleShowChecked` ran');
    STORE.showChecked = !STORE.showChecked;
    renderShoppingList();
  });
}

function handleSearch() {
  $('#js-search-check-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleSearch` ran');
    const searchFilter = $('.searchBox').val();
    console.log(searchFilter);
    searchList(searchFilter);
    renderShoppingList();
  });
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleShowChecked();
  handleSearch();
  handleItemEdit();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);