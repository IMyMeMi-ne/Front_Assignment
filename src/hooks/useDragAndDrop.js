import { useCallback } from 'react';

//짝수 아이템 확인
const isEven = (content) => {
  const itemNumber = parseInt(content.split(' ')[1], 10);
  return itemNumber % 2 === 0;
};

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  //같은 컬럼 내에서 짝수 아이템 위로 이동 금지
  if (isEven(removed.content)) {
    const destinationItem = result[endIndex];
    if (isEven(destinationItem.content)) {
      alert('짝수 아이템은 다른 짝수 아이템 위로 이동할 수 없습니다.');
      return list;
    }
  }
  result.splice(endIndex, 0, removed);
  console.log('result:', result);
  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);
  //다른 컬럼으로 이동할 때 짝수 아이템 위로 이동 금지
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
  console.log('move:', result);
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
  setDraggingItemName
) {
  const onDragStart = useCallback(
    (start) => {
      const { source } = start;
      const items =
        source.droppableId === 'droppable1'
          ? firstItems
          : source.droppableId === 'droppable2'
          ? secondItems
          : source.droppableId === 'droppable3'
          ? thirdItems
          : fourthItems;
      const item = items[source.index];
      setDraggingItemName(item.content);
      console.log('item content:', item.content);
    },
    [firstItems, secondItems, thirdItems, fourthItems, setDraggingItemName]
  );

  const onDragEnd = useCallback(
    (result) => {
      const { source, destination } = result;
      console.log('source:', source, 'destination:', destination);
      setDraggingItem(null);
      setDraggingItemName(null);

      if (!destination) {
        return;
      }

      // 첫 번째 컬럼에서 세 번째 컬럼으로 이동 금지
      if (
        source.droppableId === 'droppable1' &&
        destination.droppableId === 'droppable3'
      ) {
        return alert('첫번째 열에서 세번째 열로는 이동할 수 없습니다.');
      }

      // 드래그 중인 아이템의 번호 확인
      const sourceItems =
        source.droppableId === 'droppable1'
          ? firstItems
          : source.droppableId === 'droppable2'
          ? secondItems
          : source.droppableId === 'droppable3'
          ? thirdItems
          : fourthItems;

      // 목적지 아이템 컬럼 확인
      const destinationItems =
        destination.droppableId === 'droppable1'
          ? firstItems
          : destination.droppableId === 'droppable2'
          ? secondItems
          : destination.droppableId === 'droppable3'
          ? thirdItems
          : fourthItems;

      // 같은 컬럼 이동
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
        //다른 컬럼 이동
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

        const result = move(sourceItems, destinationItems, source, destination);
        setSourceItems(result[source.droppableId]);
        setDestItems(result[destination.droppableId]);
      }
    },
    [
      firstItems,
      secondItems,
      thirdItems,
      fourthItems,
      setDraggingItem,
      setDraggingItemName,
    ]
  );

  const onDragUpdate = useCallback(
    (update) => {
      const { destination, draggableId } = update;
      if (destination && destination.droppableId === 'droppable3') {
        setDraggingItem(draggableId);
      } else {
        setDraggingItem(null);
      }
    },
    [setDraggingItem]
  );

  return { onDragStart, onDragEnd, onDragUpdate };
}
