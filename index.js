'use strict';
/* eslint-env jquery */

const STORE = {
  items:[
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}
  ],
  showChecked:true
};


function generateItemElement(item, itemIndex, template) {
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
    items = shoppingList.map((item, index) => generateItemElement(item, index));
  }
  else {
    items = shoppingList.filter((item) => !item.checked).map((item, index) => generateItemElement(item, index));
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
  STORE.items.push({name: itemName, checked: false});
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
  $('#js-shopping-list-form').on('click', '.showChecked', event => {
    console.log('`handleShowChecked` ran');
    STORE.showChecked = !STORE.showChecked;
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
  handleItemEdit();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);