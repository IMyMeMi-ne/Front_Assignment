import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

export default function Column({
  droppableId,
  items,
  getListStyle,
  getItemStyle,
  draggingItem,
  selectedItems,
  onToggleSelectItem,
  isEvenOverEven,
}) {
  return (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={getListStyle(snapshot.isDraggingOver, droppableId)}
        >
          {items.map((item, index) => (
            <Draggable key={item.id} draggableId={item.id} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={getItemStyle(
                    snapshot.isDragging,
                    provided.draggableProps.style,
                    draggingItem === item.id,
                    selectedItems.some((selected) => selected.id === item.id),
                    isEvenOverEven
                  )}
                  onClick={(e) => onToggleSelectItem(e, item.id, index)}
                >
                  {item.content}
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
