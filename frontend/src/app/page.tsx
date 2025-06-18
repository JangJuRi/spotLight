"use client"

import React, {useRef, useState} from "react"
import axiosInstance from "@/config/axiosInstance";
import Loading from "@/components/common/Loading";
import MapContainer from "@/components/main/MapContainer";
import RouteSearchModal from "@/components/main/RouteSearchModal";
import {PlaceListInfoProps, PlaceProps, RouteListInfoProps} from "@/types/types";
import SlidePanel from "@/components/common/SlidePanel";
import {useRecommendRoute} from "@/hooks/useRecommendRoute";

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'place' | 'route'>('place');
    const [prompt, setPrompt] = useState("")
    const [placeList, setPlaceList] = useState<PlaceProps[]>([]);

    const initialPlaceListInfo: PlaceListInfoProps[] = [{
        placeList: [],
        keyword: ""
    }];

    const initialRouteListInfo: RouteListInfoProps = {
        routeList: [],
        description: ""
    };

    const [placeListInfo, setPlaceListInfo] = useState<PlaceListInfoProps[]>(initialPlaceListInfo);
    const [routeListInfo, setRouteListInfo] = useState<RouteListInfoProps>(initialRouteListInfo);
    const [selectedPlace, setSelectedPlace] = useState<PlaceProps | null>(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [searchPanelOpen, setSearchPanelOpen] = useState(false);
    const [expandedIndexes, setExpandedIndexes] = React.useState(() =>
        placeListInfo.map(() => true) // 초기값: 모두 펼침 상태(true)
    );

    const [searchLocation, setSearchLocation] = useState('');
    const [searchCourseIdList, setSearchCourseIdList] = useState<string[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await axiosInstance.get('/api/main/place/load', {
            params: {
                prompt: prompt
            }
        })

        setLoading(false);

        const { data, message, success } = result.data;
        if (success) {
            setPlaceListInfo(data);
            console.log(data)
            console.log(placeListInfo)
            console.log(placeListInfo)
            setPlaceList(data.flatMap((item: PlaceListInfoProps) => item.placeList));
            setSearchPanelOpen(true);
        } else {
            alert(message);
        }
    }

    const routeListInfoSetting = (routeListInfo: RouteListInfoProps) => {
        setRouteListInfo(routeListInfo);
    }

    const toggleExpand = (index: number) => {
        setExpandedIndexes(prev => {
            const newExpanded = [...prev];
            newExpanded[index] = !newExpanded[index];
            return newExpanded;
        });
    };

    const reloadRecommend = async () => {
        setLoading(true);

        const placeNameList: string[] = routeListInfo.routeList.map(route => route.place_name);
        const result = await useRecommendRoute(searchLocation, searchCourseIdList, placeNameList);
        routeListInfoSetting(result);

        setLoading(false);
    }

    return (
        <div className="home-container">
            {loading && <Loading />}

            {/* 버튼 영역 */}
            <div className="text-center mb-4">
                <div className="btn-group custom-toggle-group" role="group">
                    <button
                        className={`custom-toggle-btn ${mode === 'place' ? 'active' : ''}`}
                        onClick={() => {
                            setMode('place');
                            setRouteListInfo(initialRouteListInfo);

                        }}
                    >
                        장소 찾기
                    </button>
                    <button
                        className={`custom-toggle-btn ${mode === 'route' ? 'active' : ''}`}
                        onClick={() => {
                            setMode('route');
                            setPlaceListInfo(initialPlaceListInfo);
                        }}
                    >
                        루트 추천
                    </button>
                </div>
            </div>

            {/* form 영역 (장소 찾기일 때만) */}
            <div>
                {mode === 'place' && (
                    <form className="search-form" onSubmit={handleSubmit}>
                        <div className="input-group input-group-lg justify-content-center">
                            <input
                                type="text"
                                className="form-control search-input"
                                placeholder="예: 강남 초밥, 홍대 파스타..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                required={true}
                                style={{ maxWidth: '500px' }}
                            />
                            <button className="btn btn-search" type="submit">
                                검색
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* 지도 및 설명 영역 */}
            {mode === 'route' ? (
                <div
                    className="d-flex justify-content-center gap-4 mt-4"
                    style={{ maxWidth: '90%', margin: '0 auto' }}
                >
                    <div
                        className="map-wrapper"
                        style={{
                            width: '60%',
                            minHeight: '400px',
                            transition: 'width 0.4s ease',
                        }}
                    >
                        <MapContainer routeList={routeListInfo.routeList} placeList={placeList} mode={mode}/>
                    </div>
                    <div
                        className="route-description p-3 border rounded"
                        style={{
                            width: '40%',
                            height: '80vh',
                            backgroundColor: '#f8f9fa',
                            overflowY: "scroll",
                        }}
                    >

                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                            <button
                                className="btn btn-primary fw-bold"
                                style={{ borderRadius: 6 }}
                                onClick={() => setModalOpen(true)}
                            >
                                루트 추천받기
                            </button>
                            <button
                                className="btn btn-outline-primary fw-bold ms-2"
                                style={{borderRadius: 6}}
                                onClick={() => reloadRecommend()}
                            >
                                <i className="bi bi-arrow-clockwise"></i>
                            </button>
                        </div>

                        <h5>📍 경로 설명</h5>
                        <span style={{ whiteSpace: 'pre-line' }}>
                            {routeListInfo.description}
                        </span>
                    </div>
                </div>
            ) : (
                <div
                    className="map-wrapper mx-auto mt-3"
                    style={{
                        width: '100%',
                        transition: 'width 0.4s ease',
                    }}
                >
                    <MapContainer placeList={placeList}
                                  routeList={routeListInfo.routeList}
                                  mode={mode}
                                  selectedPlace={selectedPlace}/>
                </div>
            )}

            {modalOpen && <RouteSearchModal
                onClose={(location:string, courseIdList: string[]) => {
                    setModalOpen(false);
                    setSearchLocation(location);
                    setSearchCourseIdList(courseIdList);
                }}
                routeListInfoSetting={routeListInfoSetting}/>}

            {mode === 'place' &&
                <SlidePanel
                    isOpen={searchPanelOpen}
                    onClose={() => setSearchPanelOpen(false)}
                    onOpen={() => setSearchPanelOpen(true)}
                >
                    {placeListInfo[0].keyword ? (
                        <div className="d-flex flex-column gap-3">
                            {placeListInfo.map((placeInfo, placeInfoIndex) => (
                                <div key={placeInfoIndex} className="card">
                                    <div
                                        className="d-flex justify-content-between align-items-center p-3"
                                        style={{cursor: 'pointer'}}
                                        onClick={() => toggleExpand(placeInfoIndex)}
                                    >
                                        <span className="fw-bold fs-5 text-primary">{placeInfo.keyword}</span>
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={e => {
                                                e.stopPropagation(); // 부모 onClick과 겹치지 않게
                                                toggleExpand(placeInfoIndex);
                                            }}
                                            aria-label={expandedIndexes[placeInfoIndex] ? '접기' : '펼치기'}
                                        >
                                            {expandedIndexes[placeInfoIndex] ? '▼' : '▶'}
                                        </button>
                                    </div>

                                    {expandedIndexes[placeInfoIndex] && placeInfo.placeList.map((place, placeIndex) => (
                                        <div className="card-body" key={placeIndex}>
                                            <h6 className="card-title fw-bold text-primary">
                                                {place.place_name}
                                            </h6>

                                            <p className="card-text mb-1">
                                                <strong>주소:</strong>{' '}
                                                {place.road_address_name || place.address_name}
                                            </p>

                                            {place.phone && (
                                                <p className="card-text mb-1">
                                                    <strong>전화:</strong> {place.phone}
                                                </p>
                                            )}

                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setSelectedPlace(place);
                                                    setSearchPanelOpen(false);
                                                }}
                                                className="btn btn-sm btn-outline-primary mt-2"
                                            >
                                                지도에서 보기
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted">검색 결과가 없습니다.</p>
                    )}
                </SlidePanel>
            }
        </div>
    );
}
