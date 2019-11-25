export interface Card {
  listId: string;
  cardId: string;
  text: string;
  cross: boolean;
  init: boolean;
}

export interface CardState {
  cards: Card[];
}

export const SET_CARDS = 'SET_CARD';
export const ADD_CARD = 'ADD_CARD';
export const EDIT_CARD = 'EDIT_CARD';
export const DELETE_CARD = 'DELETE_CARD';
export const CROSS_CARD = 'CROSS_CARD';
export const INIT_CARD = 'INIT_CARD';
export const CHANGE_LIST = 'CHANGE_LIST';

interface SetCardAction {
  type: typeof SET_CARDS;
  payload: { cards: Card[] };
}

interface AddCardAction {
  type: typeof ADD_CARD;
  payload: { listId: string };
}

interface EditCardAction {
  type: typeof EDIT_CARD;
  payload: { id: string; text: string };
}

interface RemoveCardAction {
  type: typeof DELETE_CARD;
  payload: { id: string };
}

interface CrossCardAction {
  type: typeof CROSS_CARD;
  payload: { id: string };
}

interface InitCardAction {
  type: typeof INIT_CARD;
  payload: { id: string; init: boolean };
}

interface ChangeListAction {
  type: typeof CHANGE_LIST;
  payload: { id: string; listId: string };
}

export type CardActionTypes =
  | SetCardAction
  | AddCardAction
  | EditCardAction
  | RemoveCardAction
  | CrossCardAction
  | InitCardAction
  | ChangeListAction;
