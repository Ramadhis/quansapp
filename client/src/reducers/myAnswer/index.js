import { GET_LIST_MYANSWER, DEL_MYANSWER, ADD_MYANSWER, UPDATE_MYANSWER } from "../../actions/myAnswerAction";

const initialState = {
  getListMyAnswerResult: false,
  getListMyAnswerLoading: false,
  getListMyAnswerError: false,
  statusResponse: false,
};

const myAnswer = (state = initialState, action) => {
  switch (action.type) {
    case GET_LIST_MYANSWER:
      return {
        ...state,
        getListMyAnswerResult: action.payload.data,
        getListMyAnswerLoading: action.payload.loading,
        getListMyAnswerError: action.payload.errorMessage,
      };
    case DEL_MYANSWER:
      return {
        ...state,
        getListMyAnswerLoading: action.payload.loading,
        statusResponse: action.payload.statusResponse,
      };
    case ADD_MYANSWER:
      return {
        ...state,
        getListMyAnswerLoading: action.payload.loading,
        statusResponse: action.payload.statusResponse,
      };
    case UPDATE_MYANSWER:
      return {
        ...state,
        getListMyAnswerLoading: action.payload.loading,
        statusResponse: action.payload.statusResponse,
      };
    default:
      return state;
  }
};

export default myAnswer;
