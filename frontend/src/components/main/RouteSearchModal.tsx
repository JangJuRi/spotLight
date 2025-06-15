import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axiosInstance from "@/config/axiosInstance";
import {placeProps, RouteListInfoProps} from "@/types/types";
import Loading from "@/components/common/Loading";

interface Item {
    id: string;
    content: string;
}

function DraggableItem({ id, content, onDelete }: { id: string; content: string; onDelete: () => void }) {
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

export default function RouteSearchModal({ onClose , routeListInfoSetting}: { onClose: () => void, routeListInfoSetting: (routeListInfo: RouteListInfoProps) => void }) {
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState('');
    const [courseList, setCourseList] = useState<Item[]>([]);
    const [selectedTarget, setSelectedTarget] = useState<Item | null>(null);
    const [selectedCombination, setSelectedCombination] = useState<Item | null>(null);

    const courseOptions: Item[] = [
        { id: 'brunch', content: '브런치' },
        { id: 'restaurant', content: '맛집' },
        { id: 'bar', content: '술집' },
        { id: 'walk', content: '산책' },
        { id: 'exhibition', content: '전시회' },
        { id: 'cafe', content: '카페' },
    ];

    const categoryTargets: Item[] = [
        { id: 'all', content: '전체' },
        { id: 'couple', content: '연인' },
        { id: 'friends', content: '친구' },
        { id: 'family', content: '가족' },
        { id: 'office', content: '동료' },
    ];

    const categoryCombinations: Item[] = [
        { id: 'all', content: '전체' },
        { id: 'shortest', content: '최단거리' },
        { id: 'cheapest', content: '낮은가격' },
        { id: 'popular', content: '인기순' },
    ];

    const handleSearch = async () => {
        setLoading(true);

        const result = await axiosInstance.post('/api/main/recommend-route/load', {
            location: location,
            courseIdList: courseList.map(item => item.id),
            selectedTargetId: selectedTarget?.id === 'all' ? '' : selectedTarget?.id,
            selectedCombinationId: selectedCombination?.id === 'all' ? '' : selectedCombination?.id,
        });

        setLoading(false);

        const { data, message, success } = result.data;

        routeListInfoSetting(data);
        onClose();
    };


    const addCourseItem = (item: Item) => {
        if (!courseList.find((i) => i.id === item.id)) {
            setCourseList([...courseList, item]);
        }
    };

    const removeCourseItem = (id: string) => {
        setCourseList(courseList.filter((item) => item.id !== id));
    };

    const toggleTarget = (item: Item) => {
        setSelectedTarget((prev) => (prev?.id === item.id ? null : item));
    };

    const toggleCombination = (item: Item) => {
        setSelectedCombination((prev) => (prev?.id === item.id ? null : item));
    };

    return (
        <div className="modal-background">
            {loading && <Loading />}

            <div className="modal-container" style={{ width: '60vw' }}>
                <div className="modal-header">
                    <h3 className="modal-title">추천 루트 검색</h3>
                    <button className="close-button" onClick={onClose}>
                        &times;
                    </button>
                </div>

                <div className="section">
                    <label className="section-title" htmlFor="location-input">
                        지역 검색
                    </label>
                    <input
                        id="location-input"
                        className="input-search"
                        type="text"
                        placeholder="지역을 입력하세요"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>

                <div className="section">
                    <div className="section-title">코스 조합</div>
                    <div className="drag-list-container" style={{ display: 'flex', gap: '16px' }}>
                        <div className="list-box" style={{ flex: 1 }}>
                            <div className="list-title">선택 가능한 코스</div>
                            {courseOptions.map((item) => (
                                <div
                                    key={item.id}
                                    className="draggable-item"
                                    style={{
                                        cursor: 'pointer',
                                        padding: '8px 12px',
                                        border: '1px solid #ccc',
                                        borderRadius: '6px',
                                        marginBottom: '6px',
                                        backgroundColor: 'white'
                                    }}
                                    onClick={() => addCourseItem(item)}
                                >
                                    {item.content}
                                </div>
                            ))}
                        </div>

                        <DndContext
                            sensors={useSensors(useSensor(PointerSensor))}
                            collisionDetection={closestCenter}
                            onDragEnd={(event) => {
                                const { active, over } = event;
                                if (over && active.id !== over.id) {
                                    setCourseList((items) => {
                                        const oldIndex = items.findIndex((item) => item.id === active.id);
                                        const newIndex = items.findIndex((item) => item.id === over.id);
                                        return arrayMove(items, oldIndex, newIndex);
                                    });
                                }
                            }}
                        >
                            <SortableContext items={courseList.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                                <div className="droppable-area" style={{ flex: 1 }}>
                                    {courseList.map(({ id, content }) => (
                                        <DraggableItem
                                            key={id}
                                            id={id}
                                            content={content}
                                            onDelete={() => removeCourseItem(id)}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>
                </div>

                <div className="section">
                    <div className="section-title">카테고리 조합</div>

                    <div style={{ marginBottom: '12px' }}>
                        <div className="list-title">대상</div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {categoryTargets.map((item) => (
                                <button
                                    key={item.id}
                                    className={`circle-button${selectedTarget?.id === item.id ? ' selected' : ''}`}
                                    onClick={() => toggleTarget(item)}
                                    type="button"
                                >
                                    {item.content}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="list-title">조합</div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {categoryCombinations.map((item) => (
                                <button
                                    key={item.id}
                                    className={`circle-button${selectedCombination?.id === item.id ? ' selected' : ''}`}
                                    onClick={() => toggleCombination(item)}
                                    type="button"
                                >
                                    {item.content}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="search-button-container" style={{ marginTop: '20px', textAlign: 'center' }}>
                    <button className="search-button" onClick={handleSearch}>
                        루트 검색
                    </button>
                </div>
            </div>
        </div>
    );
}
