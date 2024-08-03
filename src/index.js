import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './components/Column';
import useDragAndDrop from './hooks/useDragAndDrop';
import './index.css';
import useReset from './hooks/useReset';

const GRID = 8;

const getItemStyle = (
  isDragging,
  draggableStyle,
  isDraggingOverThird,
  isSelected
) => ({
  userSelect: 'none',
  padding: GRID * 2,
  margin: `0 0 ${GRID}px 0`,
  backgroundColor: isSelected
    ? 'purple'
    : isDraggingOverThird
    ? 'red'
    : isDragging
    ? 'black'
    : 'grey',
  ...draggableStyle,
  color: 'white',
});

const getListStyle = (isDraggingOver) => ({
  backgroundColor: isDraggingOver ? '#3d3d3d' : 'white',
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
  const [draggingItems, setDraggingItems] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  const initialFirstItems = getItems(10, 'first');
  const initialSecondItems = getItems(10, 'second');
  const initialThirdItems = getItems(10, 'third');
  const initialFourthItems = getItems(10, 'fourth');
  const reset = useReset(
    initialFirstItems,
    initialSecondItems,
    initialThirdItems,
    initialFourthItems,
    setFirstItems,
    setSecondItems,
    setThirdItems,
    setFourthItems,
    setSelectedItems,
    setDraggingItems
  );

  const onToggleSelectItem = (e, itemId, index) => {
    if (e.shiftKey) {
      if (selectedItems.some((item) => item.id === itemId)) {
        setSelectedItems(selectedItems.filter((item) => item.id !== itemId));
      } else {
        setSelectedItems([...selectedItems, { id: itemId, index }]);
      }
    }
  };

  const { onDragStart, onDragEnd, onDragUpdate } = useDragAndDrop(
    firstItems,
    setFirstItems,
    secondItems,
    setSecondItems,
    thirdItems,
    setThirdItems,
    fourthItems,
    setFourthItems,
    setDraggingItems,
    setSelectedItems,
    selectedItems
  );

  return (
    <div className="flex flex-col lg:flex-row">
      <DragDropContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragUpdate={onDragUpdate}
      >
        <div className="flex">
          <Column
            droppableId="droppable1"
            items={firstItems}
            setItems={setFirstItems}
            getListStyle={getListStyle}
            getItemStyle={getItemStyle}
            draggingItem={draggingItems}
            selectedItems={selectedItems}
            onToggleSelectItem={onToggleSelectItem}
          />
          <Column
            droppableId="droppable2"
            items={secondItems}
            setItems={setSecondItems}
            getListStyle={getListStyle}
            getItemStyle={getItemStyle}
            draggingItem={draggingItems}
            selectedItems={selectedItems}
            onToggleSelectItem={onToggleSelectItem}
          />
          <Column
            droppableId="droppable3"
            items={thirdItems}
            setItems={setThirdItems}
            getListStyle={getListStyle}
            getItemStyle={getItemStyle}
            draggingItem={draggingItems}
            selectedItems={selectedItems}
            onToggleSelectItem={onToggleSelectItem}
          />
          <Column
            droppableId="droppable4"
            items={fourthItems}
            setItems={setFourthItems}
            getListStyle={getListStyle}
            getItemStyle={getItemStyle}
            draggingItem={draggingItems}
            selectedItems={selectedItems}
            onToggleSelectItem={onToggleSelectItem}
          />
        </div>
      </DragDropContext>
      <div className="flex flex-col ml-7 mr-7 w-full border-2 border-zinc-800 bg-[#3d3d3d] p-4 text-white">
        <div className="flex justify-center text-4xl font-bold bg-[#3d3d3d]">
          드래그 앤 드롭
        </div>
        <hr className="w-full my-4  border-gray-400" />

        <div className="flex justify-center text-2xl font-semibold bg-[#3d3d3d]">
          4개의 컬럼에서 자유롭게 아이템을 드래그 앤 드롭 해보세요!
        </div>
        <div className="font-semibold text-xl mt-10 ">
          <div className="bg-[#3d3d3d]">
            초기화 버튼을 누르면 모든 아이템이 원상복귀 됩니다.
          </div>
          <div className="bg-[#3d3d3d]">
            Shift를 누른채 클릭하면 여러개를 선택할 수 있습니다.
          </div>
        </div>
        <div className="mt-4 font-semibold bg-[#3d3d3d]">제약 조건</div>
        <span className="bg-[#3d3d3d]">
          1. 1번째 컬럼에서 3번째 컬럼으로는 이동이 불가능합니다.
        </span>
        <span className="bg-[#3d3d3d]">
          2. 짝수 아이템의 위로 짝수 아이템을 놓을 수 없습니다.
        </span>
        <div className="mt-auto bg-[#3d3d3d]">
          <button
            className="w-24 h-16 bg-gray-200 relative p-2 text-[#3d3d3d] text-2xl rounded-xl"
            onClick={reset}
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
