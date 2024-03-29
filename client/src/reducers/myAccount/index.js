import { GET_USER, UPDATE_USER } from "../../actions/myAccountAction";
const initialState = {
  getUserResult: false,
  getUserLoading: false,
  getUserError: false,
};

const users = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        getUserResult: action.payload.data,
        getUserLoading: action.payload.loading,
        getUserError: action.payload.errorMessage,
      };
    case UPDATE_USER:
      // let localUserData = JSON.parse(localStorage.getItem("us_da_prv"));
      // let updateUserData = {...localUserData, }
      return {
        ...state,
        getUserResult: action.payload.data,
        getUserLoading: action.payload.loading,
        getUserError: action.payload.errorMessage,
      };

    default:
      return state;
  }
};

export default users;
