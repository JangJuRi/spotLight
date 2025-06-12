"use client"

import Map from "@/components/main/Map"
import React, { useState } from "react"
import axiosInstance from "@/config/axiosInstance";
import Loading from "@/components/common/Loading";

export default function Home() {
    const [prompt, setPrompt] = useState("")
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await axiosInstance.get('/api/main/gemini/generate', {
            params: {
                prompt: prompt
            }
        })

        setLoading(false);

        const { data, message, success } = result.data;
        if (success) {
            console.log(data)
        } else {
            alert(message);
        }
    }

    return (
        <div className="home-container">
            {loading && <Loading />}
            <h3 className="home-title">🏢 장소 찾기</h3>

            <form className="search-form" onSubmit={handleSubmit}>
                <div className="input-group input-group-lg">
                    <input
                        type="text"
                        className="form-control search-input"
                        placeholder="예: 강남 초밥, 홍대 파스타..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                    <button className="btn btn-search" type="submit">
                        검색
                    </button>
                </div>
            </form>

            <div className="map-wrapper">
                <Map />
            </div>
        </div>
    )
}
