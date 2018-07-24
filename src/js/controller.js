import {
  cardsData, saveData, updateCardData, deleteCardData, deleteCurrentCard,
} from './service';
import {
  createCard, createLiElement, currentTaskList,
} from './view';

function readElements() {
  let eachRowData = {};
  const cardData = {};
  const allRowData = [];
  cardData.title = $('#cardtitle').get(0).value;
  const itemsDilogDiv = $('#itemsDilog')[0];
  if (itemsDilogDiv.hasChildNodes) {
    const ulElements = itemsDilogDiv.childNodes;
    ulElements.forEach((ulElement) => {
      if (ulElement.hasChildNodes) {
        const liElements = ulElement.childNodes;
        liElements.forEach((liElement) => {
          if (liElement.hasChildNodes) {
            eachRowData = {};
            const dataItems = liElement.childNodes;
            eachRowData.taskStatus = dataItems[0].checked;
            eachRowData.taskName = dataItems[1].value;
            allRowData.push(eachRowData);
          }
        });
      }
    });
  }
  cardData.data = allRowData;
  const d = new Date();
  const n = d.toLocaleDateString();
  const time = d.toLocaleTimeString();
  cardData.lastDate = `Created On ${n} ${time}`;
  return cardData;
}

function readMainElements() {
  const primaryDivElements = document.querySelector('#primary');
  let cardData = {};
  let myjson = [];
  const lists = [];
  const idLists = [];
  if (primaryDivElements.hasChildNodes) {
    const cardElements = primaryDivElements.children;
    Array.prototype.forEach.call(cardElements, (cardElementsElement) => {
      cardData = {};
      if (cardElementsElement.hasChildNodes) {
        const cardBodyElements = cardElementsElement.children;
        const smallNode = cardBodyElements[1].childNodes;
        cardData.lastDate = smallNode[0].innerHTML;
        if (cardBodyElements[0].hasChildNodes) {
          const childCardBodyElements = cardBodyElements[0].children;
          cardData.title = childCardBodyElements[0].innerHTML;

          const ulElement = childCardBodyElements[1].children;
          idLists.push(childCardBodyElements[3].value);
          if (ulElement[0].hasChildNodes) {
            const liElements = ulElement[0].childNodes;
            liElements.forEach((liElement) => {
              if (liElement.hasChildNodes) {
                const jsonData = {};
                const dataItems = liElement.childNodes;
                jsonData.taskStatus = dataItems[0].checked;
                jsonData.taskName = dataItems[1].innerHTML;
                myjson.push(jsonData);
              }
            });
          }
          cardData.data = myjson;
          myjson = [];
        }
      }
      if (!($.isEmptyObject(cardData))) {
        lists.push(cardData);
      }
    });
  }
  deleteCardData(idLists).then(() => {
    lists.forEach((listsElement) => {
      saveData(listsElement).then(() => {
      }).catch(() => {
      });
    });
  }).catch(() => {
  });
}

function readCardData(current) {
  if (current.parent().parent().parent().get(0).hasChildNodes) {
    const cardDatalocal = {};
    const myjsonlocal = [];
    const childCardBodyParentElement = current.parent().parent().get(0).parentNode;
    const childCardBodyElement = childCardBodyParentElement.childNodes;
    const childsDiv = childCardBodyElement[0].childNodes;

    cardDatalocal.title = childsDiv[1].innerHTML;

    const ulElement = childsDiv[2].childNodes;
    if (ulElement[0].hasChildNodes) {
      const liElements = ulElement[0].childNodes;
      liElements.forEach((liElement) => {
        if (liElement.hasChildNodes) {
          const jsonDatalocal = {};
          const dataItems = liElement.childNodes;
          jsonDatalocal.taskStatus = dataItems[0].checked;
          jsonDatalocal.taskName = dataItems[1].innerHTML;
          myjsonlocal.push(jsonDatalocal);
        }
      });
    }
    cardDatalocal.data = myjsonlocal;
    const footerNode = current.parent()
      .parent()
      .get(0).nextSibling;
    const smallNode = footerNode.childNodes;
    cardDatalocal.lastDate = smallNode[0].innerHTML;
    updateCardData(childsDiv[4].value, cardDatalocal).then(() => {
    }).catch(() => {
    });
  }
}


function loadAllCards() {
  cardsData().then((allCardsData) => {
    allCardsData.forEach((cardsDataElement) => {
      const dynamicCardElement = createCard(cardsDataElement);
      const mainPrimaryDiv = document.querySelector('#primary');
      mainPrimaryDiv.appendChild(dynamicCardElement);
      $('.selectormain').sortable({
        items: '> li',
        update() {
          readCardData($(this));
        },
      }).disableSelection();
      $('.selectormain').sortable('option', 'items');
      $('.selectormain').sortable('option', 'items', '> li');
      $('#primary').sortable({
        items: '> div',
        stop() {
        },
        update() {
          readMainElements();
        },

      }).disableSelection();
      $('#primary').sortable('option', 'items');
      $('#primary').sortable('option', 'items', '> div');
    });
  }).catch(() => { });
}

function addItemsToCard() {
  const currentCardTitle = $('#cardtitle')[0].value;
  if (currentCardTitle === '') {
    $('#cardtitlemsg').removeClass();
    $('#cardtitlemsg')[0].className += ' d-block alert alert-danger';
    $('#cardtitlemsg')[0].innerHTML = 'Please enter Tasks Title';
    return;
  }
  if (currentTaskList.length === 0) {
    $('#taskDetailmsg').removeClass();
    $('#taskDetailmsg')[0].className += ' d-block alert alert-danger';
    $('#taskDetailmsg')[0].innerHTML = 'Please enter at least sinle Task';
    return;
  }
  const cardData = readElements();

  const dynamicCardElement = createCard(cardData);
  const mainPrimaryDiv = document.querySelector('#primary');
  mainPrimaryDiv.appendChild(dynamicCardElement);
  saveData(cardData).then(() => {
    $('#primary').children().remove();
    loadAllCards();
  }).catch(() => {
  });
  $('#tasklist').modal('hide');
}

$(() => {
  loadAllCards();

  $('#addtask').button().on('click', () => {
    document.querySelector('#dilogULItems').appendChild(createLiElement());
    $('.selector').sortable({
      items: '> li',
      update() {
      },
    }).disableSelection();
    $('.selector').sortable('option', 'items');
    $('.selector').sortable('option', 'items', '> li');
  });

  $('#taskDetail').keypress((event) => {
    const keycode = (event.keyCode ? event.keyCode : event.which);
    $('#taskDetailmsg').removeClass();
    $('#taskDetailmsg')[0].className += ' d-none ';
    if (keycode === 13) {
      const inputValue = $('#taskDetail').get(0).value;
      if (inputValue === '') {
        $('#taskDetailmsg').removeClass();
        $('#taskDetailmsg')[0].className += ' d-block alert alert-danger ';
        $('#taskDetailmsg')[0].innerHTML = 'Please enter Task name';
        return;
      }
      $('#dilogULItems')[0].appendChild(createLiElement());
    }
  });

  $('#cardtitle').keypress(() => {
    $('#cardtitlemsg').removeClass();
    $('#cardtitlemsg')[0].className += ' d-none';
  });

  $(document).on('click', 'button#savechanges', () => {
    addItemsToCard();
    $('.selector').empty();
    $('#taskDetail')[0].value = '';
    $('#cardtitle')[0].value = '';
  });

  $(document).on('click', 'button#modalclose', () => {
    $('.selector').empty();
    $('#taskDetail')[0].value = '';
    $('#cardtitle')[0].value = '';
  });

  $(document).on('click', 'button.remove', function () {
    const childCardBodyParentElement = $(this).parent().get(0).parentNode;
    const childCardBodyElement = childCardBodyParentElement.childNodes;
    const childsDiv = childCardBodyElement[0].childNodes;
    deleteCurrentCard(childsDiv[4].value).then(() => {
    }).catch(() => { });
    $(this).parent().parent().remove();
  });

  $(document).on('click', 'input.change', function () {
    const footerNode = $(this).parent().parent().parent()
      .parent()
      .get(0).nextSibling;
    const smallNode = footerNode.childNodes;
    const d = new Date();
    const n = d.toLocaleDateString();
    const time = d.toLocaleTimeString();
    smallNode[0].innerHTML = `Updated On ${n} ${time}`;
    readCardData($(this).parent().parent());
  });
});
