package com.jr.spotLight.api.main.service;

import com.google.genai.types.GenerateContentResponse;
import com.jr.spotLight.api.main.dto.RecommendRouteRequest;
import com.jr.spotLight.api.main.enums.CourseOption;
import com.jr.spotLight.builder.PromptBuilder;
import com.jr.spotLight.util.ApiResponse;
import com.jr.spotLight.util.CommonUtil;
import com.jr.spotLight.util.GeminiUtil;
import com.jr.spotLight.util.KakaoUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class MainService {
    private final GeminiUtil geminiUtil;
    private final KakaoUtil kakaoUtil;
    private final PromptBuilder promptBuilder;

    public ApiResponse loadPlace(String prompt) throws Exception {
        List<Map<String, Object>> results = new ArrayList<>();

        // gemini api로 사용자 요청 분석 후 키워드 추출
        String filterPrompt = promptBuilder.recommendPlaceFilterPrompt();
        GenerateContentResponse response = geminiUtil.generateResponse(CommonUtil.ObjectToJson(prompt) + filterPrompt);

        String text = "";
        try {
            text = CommonUtil.cleanJson(response.text(), "Map");
            log.info(text);
        } catch (Exception e) {
            log.error("======= json 변환 에러 =======");
            log.error(response.text());
            log.error("============================");
        }

        Map<String, String> recommendPlaceKeyword = CommonUtil.JsonToMap(text);
        String[] keywords = recommendPlaceKeyword.get("keywords").split(",");

        // kakao api로 키워드 별 장소 추출
        for (String keyword : keywords) {
            Map<String, Object> placeMap = new HashMap<>();

            List<Map<String, String>> placeList = kakaoUtil.searchPlaceByKeyword(keyword, 1, 10);
            placeMap.put("keyword", keyword);
            placeMap.put("placeList", placeList);

            results.add(placeMap);
        }

        return ApiResponse.ok(results);
    }

    public ApiResponse loadRecommendRoute(RecommendRouteRequest recommendRouteRequest) throws Exception {
        Map<String, Object> result = new HashMap<>();
        List<List<Map<String, String>>> wrapList = new ArrayList<>(); // 코스별 데이터 하나로 합친 배열
        List<Map<String, String>> recommendPlaceList = new ArrayList<>(); // 추천 코드 결과 배열

        // kakao api로 키워드로 장소 검색
        for (String courseId : recommendRouteRequest.getCourseIdList()) {
            String keyword = recommendRouteRequest.getLocation() + " " + CourseOption.fromId(courseId);
            List<Map<String, String>> placeList = kakaoUtil.searchCoursePlace(keyword, courseId);

            wrapList.add(placeList);
        }

        // 1차 프롬프트: 필터링
        String filterPrompt = promptBuilder.recommendRouteFilterPrompt(
                recommendRouteRequest.getPlaceNameList().isEmpty() ? "" : CommonUtil.ObjectToJson(recommendRouteRequest.getPlaceNameList())
        );

        GenerateContentResponse response = geminiUtil.generateResponse(CommonUtil.ObjectToJson(wrapList) + filterPrompt);

        String text = "";
        try {
            text = CommonUtil.cleanJson(response.text(), "List");
            log.info(text);
        } catch (Exception e) {
            log.error("======= json 변환 에러 =======");
            log.error(response.text());
            log.error("============================");
        }

        recommendPlaceList = CommonUtil.JsonToList(text);
        result.put("routeList", recommendPlaceList);

        // 2차 프롬프트: 설명 추출
        String descriptionPrompt = promptBuilder.recommendRouteDescriptionPrompt();
        response = geminiUtil.generateResponse(text + descriptionPrompt);
        result.put("description", response.text());

        return ApiResponse.ok(result);
    }
}
