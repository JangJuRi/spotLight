package com.jr.spotLight.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;

public class CommonUtil {
    public static String cleanJson(String rawResponse, String type) {
        if (rawResponse == null || rawResponse.isEmpty()) {
            throw new RuntimeException("응답 문자열이 비어있습니다.");
        }

        // 1. 마크다운 코드 블록 제거
        String cleaned = rawResponse
                .replace("```json", "")
                .replace("```", "")
                .trim();

        // 2. JSON 배열 대괄호 위치 찾기
        int start = cleaned.indexOf(type.equals("Map") ? '{' : '[');
        int end = cleaned.lastIndexOf(type.equals("Map") ? '}' : ']');

        if (start == -1 || end == -1 || end <= start) {
            throw new RuntimeException("JSON 형식이 아닙니다.");
        }

        // 3. 배열 부분만 자르기
        return cleaned.substring(start, end + 1);
    }

    public static String ObjectToJson(Object obj) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.writeValueAsString(obj);
    }

    public static Map<String, String> JsonToMap(String json) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(
                json, new TypeReference<Map<String, String>>() {}
        );
    }

    public static List<Map<String, String>> JsonToList(String json) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(
                json, new TypeReference<List<Map<String, String>>>() {}
        );
    }
}
