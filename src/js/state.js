import { createStore } from 'redux';

const states = [];
let counter = 1;

function makeList(state = { tasksList: [], cardTaskList: [] }, action) {
  if (typeof state === 'undefined') {
    return 'undefined';
  }

  switch (action.type) {
    case 'ADD-TASK':
    {
      const eachLineData = Object.assign({}, action.eachLineData);
      eachLineData.id = counter;
      counter += 1;
      const s = { tasksList: [...state.tasksList, eachLineData], cardTaskList: state.cardTaskList };
      states.push(s);
      return s;
    }
    case 'REMOVE-TASK':
    {
      const l = {
        tasksList: state.tasksList.filter(element => element.id !== action.selectedId),
        cardTaskList: state.cardTaskList,
      };
      states.push(l);
      return l;
    }

    case 'CLEAR-LIST':
    {
      const l = {
        tasksList: [], cardTaskList: state.cardTaskList,
      };
      states.push(l);
      return l;
    }

    case 'SAVE-LIST':
    {
      const cardData = {};
      cardData.title = action.title;
      cardData.data = state.tasksList;
      const d = new Date();
      const n = d.toLocaleDateString();
      const time = d.toLocaleTimeString();
      cardData.lastDate = `Created On ${n} ${time}`;
      const s = { tasksList: [], cardTaskList: [...state.cardTaskList, cardData] };
      states.push(s);
      return s;
    }

    case 'LOAD-LIST':
    {
      const s = { tasksList: [], cardTaskList: action.cardTaskList };
      states.push(s);
      return s;
    }

    default: { return state; }
  }
}

const store = createStore(makeList, { tasksList: [], cardTaskList: [] });

export default store;
