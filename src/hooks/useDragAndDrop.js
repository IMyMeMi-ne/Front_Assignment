import { useCallback } from 'react';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);
  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

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
  setFourthItems
) {
  const onDragEnd = useCallback(
    (result) => {
      const { source, destination } = result;

      if (!destination) {
        return;
      }

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
        const sourceItems =
          source.droppableId === 'droppable1'
            ? firstItems
            : source.droppableId === 'droppable2'
            ? secondItems
            : source.droppableId === 'droppable3'
            ? thirdItems
            : fourthItems;
        const destItems =
          destination.droppableId === 'droppable1'
            ? firstItems
            : destination.droppableId === 'droppable2'
            ? secondItems
            : destination.droppableId === 'droppable3'
            ? thirdItems
            : fourthItems;

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

        const result = move(sourceItems, destItems, source, destination);
        setSourceItems(result[source.droppableId]);
        setDestItems(result[destination.droppableId]);
      }
    },
    [firstItems, secondItems, thirdItems, fourthItems]
  );

  return { onDragEnd };
}
