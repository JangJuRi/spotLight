package com.jr.spotLight.api.main.enums;

import lombok.Getter;

@Getter
public enum TargetOption {
    ALL("all", "전체"),
    COUPLE("couple", "연인"),
    FRIENDS("friends", "친구"),
    FAMILY("family", "가족"),
    OFFICE("office", "동료");

    private final String id;
    private final String content;

    TargetOption(String id, String content) {
        this.id = id;
        this.content = content;
    }

    public static String fromId(String id) {
        for (TargetOption option : values()) {
            if (option.id.equals(id)) {
                return option.content;
            }
        }
        throw new IllegalArgumentException("Invalid CourseOption id: " + id);
    }
}
