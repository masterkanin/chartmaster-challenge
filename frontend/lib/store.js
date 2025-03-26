import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

// Initial state for user slice
const initialUserState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null
};

// User reducer
const userReducer = (state = initialUserState, action) => {
  switch (action.type) {
    case 'USER_LOGIN_REQUEST':
      return { ...state, loading: true };
    case 'USER_LOGIN_SUCCESS':
      return { 
        ...state, 
        isAuthenticated: true, 
        user: action.payload, 
        loading: false,
        error: null
      };
    case 'USER_LOGIN_FAILURE':
      return { 
        ...state, 
        isAuthenticated: false, 
        loading: false, 
        error: action.payload 
      };
    case 'USER_LOGOUT':
      return initialUserState;
    default:
      return state;
  }
};

// Initial state for challenges slice
const initialChallengesState = {
  challenges: [],
  currentChallenge: null,
  loading: false,
  error: null
};

// Challenges reducer
const challengesReducer = (state = initialChallengesState, action) => {
  switch (action.type) {
    case 'FETCH_CHALLENGES_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_CHALLENGES_SUCCESS':
      return { 
        ...state, 
        challenges: action.payload, 
        loading: false,
        error: null
      };
    case 'FETCH_CHALLENGES_FAILURE':
      return { 
        ...state, 
        loading: false, 
        error: action.payload 
      };
    case 'SET_CURRENT_CHALLENGE':
      return {
        ...state,
        currentChallenge: action.payload
      };
    default:
      return state;
  }
};

// Initial state for progress slice
const initialProgressState = {
  userProgress: [],
  loading: false,
  error: null
};

// Progress reducer
const progressReducer = (state = initialProgressState, action) => {
  switch (action.type) {
    case 'FETCH_PROGRESS_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_PROGRESS_SUCCESS':
      return { 
        ...state, 
        userProgress: action.payload, 
        loading: false,
        error: null
      };
    case 'FETCH_PROGRESS_FAILURE':
      return { 
        ...state, 
        loading: false, 
        error: action.payload 
      };
    case 'ADD_PROGRESS_ENTRY':
      return {
        ...state,
        userProgress: [...state.userProgress, action.payload]
      };
    default:
      return state;
  }
};

// Combine all reducers
const rootReducer = combineReducers({
  user: userReducer,
  challenges: challengesReducer,
  progress: progressReducer
});

// Configure Redux store
export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});
