package com.jr.spotLight.util;

import com.jr.spotLight.util.dto.HttpResponseDto;
import okhttp3.Headers;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

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

    public List<Map<String, String>> searchPlaceByKeyword(String keyword, int currentPage, int size) throws Exception {
        String endPoint = "https://dapi.kakao.com/v2/local/search/keyword.json" +
                "?query=" + keyword +
                "&page=" + currentPage +
                "&size=15";

        HttpResponseDto result = httpUtil.get(endPoint, getHeaders());
        Map<String, Object> data = result.getData();

        return (List<Map<String, String>>) data.get("documents");
    }

    public List<Map<String, String>> searchCoursePlace(String keyword, String courseId) throws Exception {
        ExecutorService executor = Executors.newFixedThreadPool(3); // 병렬 요청을 위한 스레드 풀

        List<CompletableFuture<List<Map<String, String>>>> futures = new ArrayList<>();

        // 카카오 API는 요청 한번 당 최대 데이터 15개여서 3번 반복
        for (int page = 1; page <= 3; page++) {
            final int currentPage = page;

            CompletableFuture<List<Map<String, String>>> future = CompletableFuture.supplyAsync(() -> {
                try {
                    List<Map<String, String>> placeList = searchPlaceByKeyword(keyword, currentPage, 15);

                    // courseId 추가
                    for (Map<String, String> place : placeList) {
                        place.put("courseId", courseId);
                    }

                    return placeList;

                } catch (Exception e) {
                    e.printStackTrace();
                    return Collections.emptyList(); // 예외 발생 시 빈 리스트 반환
                }
            }, executor);

            futures.add(future);
        }

        // 모든 작업이 끝날 때까지 기다리고 결과 합치기
        List<Map<String, String>> allResults = futures.stream()
                .map(CompletableFuture::join)
                .flatMap(List::stream)
                .collect(Collectors.toList());

        executor.shutdown(); // 스레드풀 종료

        return allResults;
    }

    public Headers getHeaders() {
        return new Headers.Builder()
                .add("Accept", "application/json")
                .add("Authorization", "KakaoAK " + kakaoApiKey)
                .build();
    }
}
