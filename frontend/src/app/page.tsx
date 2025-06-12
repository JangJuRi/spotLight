"use client"

import Map from "@/components/Map"
import { useState } from "react"

export default function Home() {
    const [query, setQuery] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
    }

    return (
        <div className="home-container">
            <h3 className="home-title">🍽️ 맛집 찾기</h3>

            <form className="search-form" onSubmit={handleSubmit}>
                <div className="input-group input-group-lg">
                    <input
                        type="text"
                        className="form-control search-input"
                        placeholder="예: 강남 초밥, 홍대 파스타..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
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
