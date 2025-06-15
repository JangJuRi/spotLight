package com.jr.spotLight.api.main.enums;

import lombok.Getter;

@Getter
public enum CourseOption {
    BRUNCH("brunch", "브런치카페"),
    LUNCH("restaurant", "맛집"),
    DINNER("bar", "술집"),
    WALK("walk", "공원"),
    EXHIBITION("exhibition", "전시회"),
    CAFE("cafe", "카페");

    private final String id;
    private final String content;

    CourseOption(String id, String content) {
        this.id = id;
        this.content = content;
    }

    public static String  fromId(String id) {
        for (CourseOption option : values()) {
            if (option.id.equals(id)) {
                return option.content;
            }
        }
        throw new IllegalArgumentException("Invalid CourseOption id: " + id);
    }
}
