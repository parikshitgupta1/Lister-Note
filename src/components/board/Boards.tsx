import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../store/store';
import { BoardState } from '../../store/board/types';
import Board from './Board';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { ListState, List } from '../../store/list/types';
import { CardState, Card } from '../../store/card/types';
import { setCards, changeList } from '../../store/card/actions';
import { changeOrder, changeBoard } from '../../store/list/actions';
import {
  reorderBoard,
  addBoard,
  draggingBoard
} from '../../store/board/actions';
import styled from 'styled-components';

interface Props {
  boardState: BoardState;
  listState: ListState;
  cardState: CardState;

  setCards: typeof setCards;
  changeList: typeof changeList;
  changeOrder: typeof changeOrder;
  reorderBoard: typeof reorderBoard;
  changeBoard: typeof changeBoard;
  addBoard: typeof addBoard;
  draggingBoard: typeof draggingBoard;
}

const Boards: React.FC<Props> = ({
  boardState,
  listState,
  cardState,
  setCards,
  changeList,
  changeOrder,
  reorderBoard,
  changeBoard,
  addBoard,
  draggingBoard
}) => {
  const { boards, showAll, currentBoard } = boardState;

  const onDragEnd = (result: any) => {
    draggingBoard(false);

    const { destination, source, draggableId, type } = result;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    switch (type) {
      case 'card':
        onDragCard(destination, source, draggableId);
        break;
      case 'list':
        onDragList(destination, source, draggableId);
        break;
      case 'board':
        onDragBoard(destination, source, draggableId);
    }
  };

  const onDragCard = (destination: any, source: any, draggableId: any) => {
    const { cards } = cardState;
    const draggedCard = cards.find(card => card.cardId === draggableId);
    const destinationId = destination.droppableId;

    if (draggedCard) {
      let orderedCards: Card[];

      if (destinationId === draggedCard.listId) {
        orderedCards = cards.filter(card => card.listId === destinationId);

        orderedCards.splice(source.index, 1);
        orderedCards.splice(destination.index, 0, draggedCard);

        orderedCards = [...orderedCards, ...cards].filter(
          (card, index, self) => self.indexOf(card) === index
        );
      } else {
        const fromCards: Card[] = cards.filter(
          card => card.listId === draggedCard.listId
        );

        const toCards: Card[] = cards.filter(
          card => card.listId === destinationId
        );

        fromCards.splice(source.index, 1);
        toCards.splice(destination.index, 0, draggedCard);

        orderedCards = [...fromCards, ...toCards, ...cards].filter(
          (card, index, self) => self.indexOf(card) === index
        );

        changeList(draggedCard.cardId, destinationId);
      }

      setCards(orderedCards);
    }
  };

  const onDragList = (destination: any, source: any, draggableId: any) => {
    const { lists } = listState;
    const draggedList = listState.lists.find(
      list => list.listId === draggableId
    );

    if (draggedList) {
      if (destination.droppableId === draggedList.boardId) {
        const newListOrder = [
          ...listState.lists.filter(
            list => list.boardId === draggedList.boardId
          )
        ];

        newListOrder.splice(source.index, 1);
        newListOrder.splice(destination.index, 0, draggedList);

        const theListOrder = [...newListOrder, ...listState.lists].filter(
          (list, index, self) => self.indexOf(list) === index
        );

        changeOrder(theListOrder);
      } else {
        const fromLists: List[] = lists.filter(
          list => list.boardId === draggedList.boardId
        );

        const toLists: List[] = lists.filter(
          list => list.boardId === destination.droppableId
        );

        fromLists.splice(source.index, 1);
        toLists.splice(destination.index, 0, draggedList);

        const newOrderedLists = [...fromLists, ...toLists, ...lists].filter(
          (list, index, self) => self.indexOf(list) === index
        );

        changeBoard(draggedList.listId, destination.droppableId);
        changeOrder(newOrderedLists);
      }
    }
  };

  const onDragBoard = (destination: any, source: any, draggableId: any) => {
    const draggedBoard = boardState.boards.find(
      board => board.boardId === draggableId
    );

    if (draggedBoard) {
      const newBoardOrder = [...boardState.boards];
      newBoardOrder.splice(source.index, 1);
      newBoardOrder.splice(destination.index, 0, draggedBoard);

      reorderBoard(newBoardOrder);
    }
  };

  const handleNewBoard = () => {
    addBoard('New Board');
  };

  const onDragStart = () => {
    draggingBoard(true);
  };

  return (
    <Container>
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <Droppable droppableId={'lister'} type="board">
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {showAll ? (
                <>
                  {boards.map((board, index) => (
                    <Board key={board.boardId} board={board} index={index} />
                  ))}
                  <div className="touch-me">
                    <div className="button-div" onClick={handleNewBoard}>
                      <button>+ Add a new board</button>
                    </div>
                  </div>
                </>
              ) : (
                <Board
                  key={currentBoard.boardId}
                  board={currentBoard}
                  index={0}
                />
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  );
};

const Container = styled.div`
  .touch-me {
    height: 60px;

    .button-div {
      display: none;
      background: rgba(255, 255, 255, 0.25);
      height: 30px;
      text-align: center;
      margin: var(--g-margin);
      border-radius: 3px;

      button {
        background: none;
        color: white;
        width: 300px;
        margin-top: 6px;
        border: none;
      }

      :hover {
        background: rgba(255, 255, 255, 0.45);
      }
    }

    :hover {
      .button-div {
        display: block;
      }
    }
  }
`;

const mapStateToProps = (state: AppState) => ({
  boardState: state.board,
  listState: state.list,
  cardState: state.card
});

export default connect(
  mapStateToProps,
  {
    changeList,
    changeOrder,
    setCards,
    reorderBoard,
    changeBoard,
    addBoard,
    draggingBoard
  }
)(Boards);
