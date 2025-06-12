package com.jr.spotLight.util;

import lombok.Getter;

@Getter
public class ApiResponse {
    private final boolean success; // 응답 성공 여부
    private final String message;  // 응답 메시지
    private final Object data;     // 실제 데이터 (성공 시 반환된 데이터 또는 실패 시 추가 메시지 등)

    // 빌더 패턴을 사용한 생성자
    private ApiResponse(Builder builder) {
        this.success = builder.success;
        this.message = builder.message;
        this.data = builder.data;
    }

    // 성공적인 응답을 반환하는 정적 메서드 (ok)
    public static ApiResponse ok(Object data) {
        return new Builder()
                .success(true)
                .message("success")
                .data(data)
                .build();
    }

    // 실패 응답을 반환하는 정적 메서드 (fail)
    public static ApiResponse fail(String message, Object data) {
        return new Builder()
                .success(false)
                .message(message)
                .data(data)
                .build();
    }

    // Builder 패턴을 위한 내부 클래스
    public static class Builder {
        private boolean success;
        private String message;
        private Object data;

        public Builder success (boolean success) {
            this.success = success;
            return this;
        }

        public Builder message (String message) {
            this.message = message;
            return this;
        }

        public Builder data (Object data) {
            this.data = data;
            return this;
        }

        public ApiResponse build () {
            return new ApiResponse(this);
        }
    }

}
