package com.jr.spotLight.util;

public class CommonUtil {
    public static String cleanJsonArray(String rawResponse) {
        if (rawResponse == null || rawResponse.isEmpty()) {
            throw new RuntimeException("응답 문자열이 비어있습니다.");
        }

        // 1. 마크다운 코드 블록 제거
        String cleaned = rawResponse
                .replace("```json", "")
                .replace("```", "")
                .trim();

        // 2. JSON 배열 대괄호 위치 찾기
        int start = cleaned.indexOf('[');
        int end = cleaned.lastIndexOf(']');

        if (start == -1 || end == -1 || end <= start) {
            throw new RuntimeException("JSON 배열 형식이 아닙니다.");
        }

        // 3. 배열 부분만 자르기
        return cleaned.substring(start, end + 1);
    }
}
