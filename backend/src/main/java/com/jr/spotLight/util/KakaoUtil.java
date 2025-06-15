package com.jr.spotLight.util;

import com.jr.spotLight.util.dto.HttpResponseDto;
import okhttp3.Headers;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class KakaoUtil {
    @Value("${kakao.api.key}")
    private String kakaoApiKey;

    private final HttpUtil httpUtil = new HttpUtil();

    public Map<String, Object> convertAddressToCoords(String address) throws Exception {
        String endPoint = "https://dapi.kakao.com/v2/local/search/address.json" +
                "?query=" + address +
                "&analyze_type=similar";

        HttpResponseDto result = httpUtil.get(endPoint, getHeaders());
        List<Map<String, Object>> addressInfo = (List<Map<String, Object>>) result.getData().get("documents");

        return !addressInfo.isEmpty() ? addressInfo.get(0) : null;
    }

    public List<Map<String, String>> searchPlaceByKeyword(String keyword, String courseId) throws Exception {
        String endPoint = "https://dapi.kakao.com/v2/local/search/keyword.json" +
                "?query=" + keyword;

        HttpResponseDto result = httpUtil.get(endPoint, getHeaders());
        List<Map<String, String>> placeList = (List<Map<String, String>>) result.getData().get("documents");

        // 각 Map에 keyword 키 추가
        for (Map<String, String> place : placeList) {
            place.put("courseId", courseId);
        }

        return placeList;
    }

    public Headers getHeaders() {
        return new Headers.Builder()
                .add("Accept", "application/json")
                .add("Authorization", "KakaoAK " + kakaoApiKey)
                .build();
    }
}
