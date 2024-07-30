import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './components/Column';
import useDragAndDrop from './hooks/useDragAndDrop';
import './index.css';

const GRID = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: GRID * 2,
  margin: `0 0 ${GRID}px 0`,
  background: isDragging ? 'lightgreen' : 'grey',
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: GRID,
  width: 250,
});

const getItems = (count, col) => {
  return Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `${col}-${k}`,
    content: `item ${k}`,
  }));
};

const App = () => {
  const [firstItems, setFirstItems] = useState(getItems(10, 'first'));
  const [secondItems, setSecondItems] = useState(getItems(10, 'second'));
  const [thirdItems, setThirdItems] = useState(getItems(10, 'third'));
  const [fourthItems, setFourthItems] = useState(getItems(10, 'fourth'));

  const { onDragEnd } = useDragAndDrop(
    firstItems,
    setFirstItems,
    secondItems,
    setSecondItems,
    thirdItems,
    setThirdItems,
    fourthItems,
    setFourthItems
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex">
        <Column
          droppableId="droppable1"
          items={firstItems}
          setItems={setFirstItems}
          getListStyle={getListStyle}
          getItemStyle={getItemStyle}
        />
        <Column
          droppableId="droppable2"
          items={secondItems}
          setItems={setSecondItems}
          getListStyle={getListStyle}
          getItemStyle={getItemStyle}
        />
        <Column
          droppableId="droppable3"
          items={thirdItems}
          setItems={setThirdItems}
          getListStyle={getListStyle}
          getItemStyle={getItemStyle}
        />
        <Column
          droppableId="droppable4"
          items={fourthItems}
          setItems={setFourthItems}
          getListStyle={getListStyle}
          getItemStyle={getItemStyle}
        />
      </div>
    </DragDropContext>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
