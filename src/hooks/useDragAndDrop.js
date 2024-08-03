import { useCallback } from 'react';

// 짝수 아이템 확인
const isEven = (content) => {
  const itemNumber = parseInt(content.split(' ')[1], 10);
  return itemNumber % 2 === 0;
};

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
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

const moveMultiple = (
  source,
  destination,
  droppableSource,
  destinationInfo,
  selectedItems
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);

  // 멀티 드래그 시 마지막 아이템 기준 짝수 확인
  const lastSelectedItem = selectedItems[selectedItems.length - 1];
  const lastItemContent = sourceClone[lastSelectedItem.index].content;
  const isLastItemEven = isEven(lastItemContent);

  const originalSourceClone = Array.from(source);
  const originalDestClone = Array.from(destination);

  for (let i = 0; i < selectedItems.length; i++) {
    const selectedItem = selectedItems[i];
    const [removed] = sourceClone.splice(selectedItem.index - i, 1);
    if (isLastItemEven && destinationInfo.index < destClone.length) {
      const destinationItem = destClone[destinationInfo.index];
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
  const onDragStart = useCallback(() => {
    setDraggingItem(null);
  }, []);

  const onDragEnd = useCallback(
    (result) => {
      const { source, destination } = result;
      setDraggingItem(null);

      if (!destination) {
        return;
      }

      if (
        source.droppableId === 'droppable1' &&
        destination.droppableId === 'droppable3'
      ) {
        return alert('첫번째 열에서 세번째 열로는 이동할 수 없습니다.');
      }

      const sourceItems =
        source.droppableId === 'droppable1'
          ? firstItems
          : source.droppableId === 'droppable2'
          ? secondItems
          : source.droppableId === 'droppable3'
          ? thirdItems
          : fourthItems;

      const destinationItems =
        destination.droppableId === 'droppable1'
          ? firstItems
          : destination.droppableId === 'droppable2'
          ? secondItems
          : destination.droppableId === 'droppable3'
          ? thirdItems
          : fourthItems;

      if (source.droppableId === destination.droppableId) {
        const setItems =
          source.droppableId === 'droppable1'
            ? setFirstItems
            : source.droppableId === 'droppable2'
            ? setSecondItems
            : source.droppableId === 'droppable3'
            ? setThirdItems
            : setFourthItems;
        const items =
          source.droppableId === 'droppable1'
            ? firstItems
            : source.droppableId === 'droppable2'
            ? secondItems
            : source.droppableId === 'droppable3'
            ? thirdItems
            : fourthItems;
        const newItems = reorder(items, source.index, destination.index);
        setItems(newItems);
      } else {
        const setSourceItems =
          source.droppableId === 'droppable1'
            ? setFirstItems
            : source.droppableId === 'droppable2'
            ? setSecondItems
            : source.droppableId === 'droppable3'
            ? setThirdItems
            : setFourthItems;
        const setDestItems =
          destination.droppableId === 'droppable1'
            ? setFirstItems
            : destination.droppableId === 'droppable2'
            ? setSecondItems
            : destination.droppableId === 'droppable3'
            ? setThirdItems
            : setFourthItems;

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
    [
      firstItems,
      secondItems,
      thirdItems,
      fourthItems,
      setDraggingItem,
      setSelectedItems,
      selectedItems,
    ]
  );

  const onDragUpdate = useCallback(
    (update) => {
      const { destination, source, draggableId } = update;
      if (
        destination &&
        destination.droppableId === 'droppable3' &&
        source.droppableId === 'droppable1'
      ) {
        setDraggingItem(draggableId);
      } else {
        setDraggingItem(null);
      }
    },
    [setDraggingItem]
  );

  return { onDragStart, onDragEnd, onDragUpdate };
}
