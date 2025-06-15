import {useSortable} from "@dnd-kit/sortable";
import React from "react";
import {CSS} from "@dnd-kit/utilities";

export default function DraggableItem({ id, content, onDelete }: { id: string; content: string; onDelete: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: 'grab',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        marginBottom: '6px',
        backgroundColor: 'white',
    };

    const className = `draggable-item${isDragging ? ' dragging' : ''}`;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={className}
        >
            <span>{content}</span>
            <button
                type="button"
                className="btn-close"
                aria-label="삭제"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}
                onPointerDown={(e) => {
                    e.stopPropagation();
                }}
            />
        </div>
    );
}