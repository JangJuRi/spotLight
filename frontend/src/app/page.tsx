"use client"

import React, { useState } from "react"
import axiosInstance from "@/config/axiosInstance";
import Loading from "@/components/common/Loading";
import MapContainer from "@/components/main/MapContainer";
import RouteSearchModal from "@/components/main/RouteSearchModal";
import {placeProps, RouteListInfoProps} from "@/types/types";

export default function Home() {
    const [mode, setMode] = useState<'place' | 'route'>('place');
    const [prompt, setPrompt] = useState("")
    const [loading, setLoading] = useState(false);
    const [placeList, setPlaceList] = useState<placeProps[]>([]);
    const [routeListInfo, setRouteListInfo] = useState<RouteListInfoProps>({
        routeList: [],          // 빈 배열로 초기화
        description: ""         // 빈 문자열로 초기화
    });
    const [modalOpen, setModalOpen] = useState(false);

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
            setPlaceList(data);
        } else {
            alert(message);
        }
    }

    const routeListInfoSetting = (routeListInfo: RouteListInfoProps) => {
        console.log(routeListInfo)
        setRouteListInfo(routeListInfo);
    }

    return (
        <div className="home-container">
            {loading && <Loading />}

            {/* 버튼 영역 */}
            <div className="text-center mb-3">
                <div className="btn-group mt-2" role="group">
                    <button
                        className={`btn ${mode === 'place' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setMode('place')}
                    >
                        장소 찾기
                    </button>
                    <button
                        className={`btn ${mode === 'route' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setMode('route')}
                    >
                        루트 찾기
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
                                추천 루트 검색
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
                    <MapContainer placeList={placeList} routeList={routeListInfo.routeList} mode={mode}/>
                </div>
            )}

            {modalOpen && <RouteSearchModal
                onClose={() => setModalOpen(false)}
                routeListInfoSetting={routeListInfoSetting}/>}
        </div>
    );
}
