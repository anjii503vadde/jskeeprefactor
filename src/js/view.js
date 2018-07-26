import store from './state';
import { saveData } from './service';

const currentTask = {};
const currentTaskList = [];

function createHTMLElement(html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template.content.firstElementChild;
}
function createCheckBox() {
  const dynamicCheckBox = '<input type="checkbox" style="width:10%"></input>';
  return createHTMLElement(dynamicCheckBox);
}

function createCheckBoxForModal(taskStatus) {
  const dynamicCheckBox = '<input type="checkbox" style="width:10%"></input>';
  const dynamicCheckBoxElement = createHTMLElement(dynamicCheckBox);
  dynamicCheckBoxElement.checked = taskStatus;
  return dynamicCheckBoxElement;
}

// function createInputText() {
//   const dynamicInputText = '<input type="text" style="width:65%"></input>';
//   const inputElement = createHTMLElement(dynamicInputText);
//   inputElement.value = $('#taskDetail').get(0).value;
//   currentTask.taskName = $('#taskDetail').get(0).value;
//   currentTaskList.push(currentTask);
//   $('#taskDetail').get(0).value = '';
//   return inputElement;
// }
function createInputTextForModa(taskName) {
  const dynamicInputText = '<input type="text" style="width:65%"></input>';
  const inputElement = createHTMLElement(dynamicInputText);
  inputElement.value = taskName;
  currentTask.taskName = taskName;
  currentTaskList.push(currentTask);

  return inputElement;
}

function removeTaskFromList() {
  let selectedId;
  const itemsDilogDiv = $('#itemsDilog')[0];
  if (itemsDilogDiv.hasChildNodes) {
    const ulElements = itemsDilogDiv.childNodes;
    ulElements.forEach((ulElement) => {
      if (ulElement.hasChildNodes) {
        const liElements = ulElement.childNodes;
        liElements.forEach((liElement) => {
          if (liElement.hasChildNodes) {
            const dataItems = liElement.childNodes;
            selectedId = Number(dataItems[3].value);
          }
        });
      }
    });
  }
  store.dispatch({
    type: 'REMOVE-TASK', selectedId,
  });
  $(this).parent().remove();
}


function createDeleteButton() {
  const dynamicButton = '<a calss="btn delete" style="width:25%"><i class="fa fa-trash float-right" aria-hidden="true"></i></a>';
  const buttonElement = createHTMLElement(dynamicButton);
  buttonElement.addEventListener('click', removeTaskFromList);
  return buttonElement;
}

function createDeleteButtonForCard() {
  const buttonElement = createHTMLElement('<button type="button" class="btn btn-danger remove">Delete</button>');

  return buttonElement;
}

function createOutputText(txtValue) {
  const dynamicOutputText = '<output style="width:65%"></output>';
  const outputElement = createHTMLElement(dynamicOutputText);
  outputElement.value = txtValue;
  return outputElement;
}
const dynamicLiElement = '<li class="list-group-item d-flex justify-content-between align-items-center" style="padding:display"></li>';

function createInputTextHiddenForModal(id) {
  const dynamicInputText = '<input type="hidden" id="hiddenId" name="hiddenId" style="width:65%"></input>';
  const inputElement = createHTMLElement(dynamicInputText);
  inputElement.value = id;
  return inputElement;
}

function createLiElement(liElementData) {
  const liElement = createHTMLElement(dynamicLiElement);
  liElement.appendChild(createCheckBoxForModal(liElementData.taskStatus));
  liElement.appendChild(createInputTextForModa(liElementData.taskName));
  liElement.appendChild(createDeleteButton());
  liElement.appendChild(createInputTextHiddenForModal(liElementData.id));
  return liElement;
}


function createMainLiElement(inputElement) {
  const liElement = createHTMLElement(dynamicLiElement);
  const dynamicCheckBox = createCheckBox();
  dynamicCheckBox.value = inputElement.taskStatus;
  dynamicCheckBox.checked = inputElement.taskStatus;
  dynamicCheckBox.className += ' change';
  liElement.appendChild(dynamicCheckBox);
  liElement.appendChild(createOutputText(inputElement.taskName));
  return liElement;
}

function createUl(inputList) {
  const dynamicUl = '<ul class="selectormain list-group pl-0 pt-2" ></ul>';
  const dynamicUlelement = createHTMLElement(dynamicUl);
  inputList.forEach((inputElement) => {
    dynamicUlelement.appendChild(createMainLiElement(inputElement));
  });

  return dynamicUlelement;
}

function createInputTextHidden(id) {
  const dynamicInputText = '<input type="hidden" id="hiddenId" name="hiddenId" style="width:65%"></input>';
  const inputElement = createHTMLElement(dynamicInputText);
  inputElement.value = id;
  return inputElement;
}


function createCard(inputList) {
  const dynamicCard = '<div class="card dragzones col-md-3" style="margin: 5px 5px 5px 5px"></div>';
  const dynamicCardElement = createHTMLElement(dynamicCard);
  const dynamicCardBody = '<div class="card-body text-center" style="padding:0.5rem"> </div>';

  const dynamicCardBodyElement = createHTMLElement(dynamicCardBody);

  const dynamicCardTitle = `<h5 class="card-title bg-info text-white text-center">${inputList.title}</h5>`;
  const dynamicCardTitleElement = createHTMLElement(dynamicCardTitle);
  dynamicCardBodyElement.appendChild(dynamicCardTitleElement);
  const dynamicCardText = '<p class="card-text"></p>';
  const dynamicCardTextElement = createHTMLElement(dynamicCardText);
  dynamicCardTextElement.appendChild(createUl(inputList.data));
  const dynamicCardFooter = `<div class="card-footer"><small class="text-muted">${inputList.lastDate}</small></div>`;
  dynamicCardBodyElement.appendChild(dynamicCardTitleElement);
  dynamicCardBodyElement.appendChild(dynamicCardTextElement);
  dynamicCardBodyElement.appendChild(createDeleteButtonForCard());
  dynamicCardBodyElement.appendChild(createInputTextHidden(inputList.id));
  dynamicCardElement.appendChild(dynamicCardBodyElement);
  const dynamicCardFooterElement = createHTMLElement(dynamicCardFooter);
  dynamicCardElement.appendChild(dynamicCardFooterElement);
  return dynamicCardElement;
}

function render() {
  $('#dilogULItems').empty();
  store.getState().tasksList.forEach((liElement) => {
    document.querySelector('#dilogULItems').appendChild(createLiElement(liElement));
    $('.selector').sortable({
      items: '> li',
      update() {
      },
    }).disableSelection();
    $('.selector').sortable('option', 'items');
    $('.selector').sortable('option', 'items', '> li');
  });
  $('#primary').empty();
  store.getState().cardTaskList.forEach((cardData) => {
    // const cardData = readElements();

    const dynamicCardElement = createCard(cardData);
    const mainPrimaryDiv = document.querySelector('#primary');
    mainPrimaryDiv.appendChild(dynamicCardElement);
    $('.selectormain').sortable({
      items: '> li',
      update() {
        // readCardData($(this));
      },
    }).disableSelection();
    $('.selectormain').sortable('option', 'items');
    $('.selectormain').sortable('option', 'items', '> li');
    $('#primary').sortable({
      items: '> div',
      stop() {
      },
      update() {
        // readMainElements();
      },

    }).disableSelection();
    $('#primary').sortable('option', 'items');
    $('#primary').sortable('option', 'items', '> div');
    saveData(cardData).then(() => {
      // $('#primary').children().remove();
      // loadAllCards();
    }).catch(() => {
    });
  });
}
// render();
store.subscribe(render);

export {
  createCard, createLiElement, currentTaskList,
};
