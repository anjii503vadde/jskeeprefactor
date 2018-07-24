function callAjax(callType, callURL, callContentType, callData) {
  return new Promise(((resolve, reject) => {
    $.ajax({
      type: callType,
      url: callURL,
      contentType: callContentType,
      data: callData,
    }).done((data) => {
      resolve(data);
    }).fail((msg) => {
      reject(msg);
    });
  }));
}

function cardsData() {
  return callAjax('GET', 'http://localhost:3000/lists', 'application/json');
}

function saveData(cardData) {
  return callAjax('POST', 'http://localhost:3000/lists', 'application/json', JSON.stringify(cardData));
}

function deleteCurrentCard(id) {
  return callAjax('DELETE', `http://localhost:3000/lists/${id}`, 'application/json');
}

function deleteCardData(list) {
  const resolvedPromisesArray = [];
  list.forEach((element) => {
    resolvedPromisesArray.push(deleteCurrentCard(element));
  });
  return Promise.all(resolvedPromisesArray);
}

function updateCardData(id, cardData) {
  return callAjax('PUT', `http://localhost:3000/lists/${id}`, 'application/json', JSON.stringify(cardData));
}

export {
  cardsData, saveData, deleteCardData, deleteCurrentCard, updateCardData,
};
