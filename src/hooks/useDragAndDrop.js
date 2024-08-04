import { useCallback, useState } from 'react';

// 짝수 아이템 확인
const isEven = (content) => {
  const itemNumber = parseInt(content.split(' ')[1], 10);
  return itemNumber % 2 === 0 && itemNumber !== 0;
};

const getItems = (droppableId, items) => {
  return items[droppableId] || [];
};

const getSetItems = (droppableId, setItems) => {
  return setItems[droppableId] || (() => {});
};

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  // 같은 컬럼 짝수 아이템 위로 이동 불가
  if (isEven(removed.content)) {
    const destinationItem = result[endIndex];
    if (isEven(destinationItem.content)) {
      alert('짝수 아이템은 다른 짝수 아이템 위로 이동할 수 없습니다.');
      return list;
    }
  }
  result.splice(endIndex, 0, removed);
  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);
  // 다른 컬럼 짝수 아이템 위로 이동 불가
  if (isEven(removed.content)) {
    if (droppableDestination.index < destClone.length) {
      const destinationItem = destClone[droppableDestination.index];
      if (isEven(destinationItem.content)) {
        alert('짝수 아이템은 다른 짝수 아이템 위로 이동할 수 없습니다.');
        return {
          [droppableSource.droppableId]: source,
          [droppableDestination.droppableId]: destination,
        };
      }
    }
  }
  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;
  return result;
};

// 멀티 드래그 앤 드롭
const moveMultiple = (
  source,
  destination,
  droppableSource,
  destinationInfo,
  selectedItems
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);

  const originalSourceClone = Array.from(source);
  const originalDestClone = Array.from(destination);

  // 멀티 드래그 아이템 중 마지막 아이템이 짝수인지 확인
  const isLastItemEven = isEven(
    sourceClone[selectedItems[selectedItems.length - 1].index].content
  );

  for (let i = 0; i < selectedItems.length; i++) {
    const selectedItem = selectedItems[i];
    const [removed] = sourceClone.splice(selectedItem.index - i, 1);
    // 마지막 아이템이 짝수고 이동 시 짝수 아이템 위로 이동 불가
    if (isLastItemEven && destinationInfo.index + i < destClone.length) {
      const destinationItem = destClone[destinationInfo.index + i];
      if (isEven(destinationItem.content)) {
        alert('짝수 아이템은 다른 짝수 아이템 위로 이동할 수 없습니다.');
        return {
          [droppableSource.droppableId]: originalSourceClone,
          [destinationInfo.droppableId]: originalDestClone,
        };
      }
    }
    destClone.splice(destinationInfo.index + i, 0, removed);
  }

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[destinationInfo.droppableId] = destClone;
  return result;
};

export default function useDragAndDrop(
  firstItems,
  setFirstItems,
  secondItems,
  setSecondItems,
  thirdItems,
  setThirdItems,
  fourthItems,
  setFourthItems,
  setDraggingItem,
  setSelectedItems,
  selectedItems
) {
  const [isEvenOverEven, setIsEvenOverEven] = useState(false);
  const [draggedItemEven, setDraggedItemEven] = useState(false);

  const items = {
    droppable1: firstItems,
    droppable2: secondItems,
    droppable3: thirdItems,
    droppable4: fourthItems,
  };

  const setItems = {
    droppable1: setFirstItems,
    droppable2: setSecondItems,
    droppable3: setThirdItems,
    droppable4: setFourthItems,
  };

  const onDragStart = useCallback(
    (start) => {
      const { source, draggableId } = start;
      const sourceItems = getItems(source.droppableId, items);

      const draggedItem = sourceItems[source.index];
      setDraggedItemEven(isEven(draggedItem.content));
      setIsEvenOverEven(false);
      setDraggingItem(draggableId);
    },
    [items, setDraggingItem]
  );

  const onDragEnd = useCallback(
    (result) => {
      const { source, destination } = result;
      setDraggingItem(null);
      setIsEvenOverEven(false);
      setDraggedItemEven(false);

      if (!destination) {
        return;
      }

      if (
        source.droppableId === 'droppable1' &&
        destination.droppableId === 'droppable3'
      ) {
        return alert('첫번째 열에서 세번째 열로는 이동할 수 없습니다.');
      }

      const sourceItems = getItems(source.droppableId, items);
      const destinationItems = getItems(destination.droppableId, items);

      if (source.droppableId === destination.droppableId) {
        const setItemsFn = getSetItems(source.droppableId, setItems);
        const newItems = reorder(sourceItems, source.index, destination.index);
        setItemsFn(newItems);
      } else {
        const setSourceItems = getSetItems(source.droppableId, setItems);
        const setDestItems = getSetItems(destination.droppableId, setItems);

        if (selectedItems.length > 1) {
          const result = moveMultiple(
            sourceItems,
            destinationItems,
            source,
            destination,
            selectedItems
          );
          setSourceItems(result[source.droppableId]);
          setDestItems(result[destination.droppableId]);
        } else {
          const result = move(
            sourceItems,
            destinationItems,
            source,
            destination
          );
          setSourceItems(result[source.droppableId]);
          setDestItems(result[destination.droppableId]);
        }
      }

      setSelectedItems([]);
    },
    [items, setItems, setDraggingItem, setSelectedItems, selectedItems]
  );

  const onDragUpdate = useCallback(
    (update) => {
      const { destination, source, draggableId } = update;
      if (!destination) {
        setIsEvenOverEven(false);
        setDraggingItem(null);
        return;
      }
      //첫번째 열에서 세번째 열로 드래그 시 draggableId 저장
      if (
        destination.droppableId === 'droppable3' &&
        source.droppableId === 'droppable1'
      ) {
        setDraggingItem(draggableId);
      } else {
        setDraggingItem(null);
      }
      //드래그 짝수 아이템 확인
      const destinationItems = getItems(destination.droppableId, items);
      const destinationItem = destinationItems[destination.index];
      if (isEven(destinationItem.content) && draggedItemEven) {
        setIsEvenOverEven(true);
      } else {
        setIsEvenOverEven(false);
      }
    },
    [items, draggedItemEven, setDraggingItem]
  );

  return { onDragStart, onDragEnd, onDragUpdate, isEvenOverEven };
}
