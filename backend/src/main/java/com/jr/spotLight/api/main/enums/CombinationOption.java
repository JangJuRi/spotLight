package com.jr.spotLight.api.main.enums;

import lombok.Getter;

@Getter
public enum CombinationOption {
    SHORTEST("shortest", "주변"),
    CHEAPEST("cheapest", "낮은 가격"),
    POPULAR("popular", "인기 많은 곳");

    private final String id;
    private final String content;

    CombinationOption(String id, String content) {
        this.id = id;
        this.content = content;
    }

    public static String  fromId(String id) {
        for (CombinationOption option : values()) {
            if (option.id.equals(id)) {
                return option.content;
            }
        }
        throw new IllegalArgumentException("Invalid CourseOption id: " + id);
    }
}
