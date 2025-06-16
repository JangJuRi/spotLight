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
        String detailPrompt = "\n 위 텍스트에서 다음 정보를 추출해줘. " +
                "지역명 - location, " +
                "장소의 카테고리(음식점/카페 등) - category," +
                "기타 설명(분위기 좋은/인기 많은/음식 종류 등) - etc로 해서 json 형태로 내려주라. " +
                "만약 항목이 명확하지 않으면 null로 입력해줘." +
                "데이터가 없거나 추출하기 어려운 경우 빈 배열 형태로 보내줘";

        // gemini api로 조건에 맞는 장소의 주소 조회
        GenerateContentResponse response = geminiUtil.generateResponse(prompt + detailPrompt);
        String text = CommonUtil.cleanJson(response.text(), "Map");

        Map<String, String> searchPlaceInfo = CommonUtil.JsonToMap(text);

        // kakao api로 키워드로 장소 검색
        String location = searchPlaceInfo.get("location");
        String category = searchPlaceInfo.get("category");
        String etc = searchPlaceInfo.get("etc");

        String keyword = location + (category != null ? category : "");

        List<Map<String, String>> placeList = kakaoUtil.searchPlaceByKeyword(keyword, "");

        // gemini api로 부가 설명에 적합한 데이터만 추출
        if (etc != null) {
            detailPrompt = "\n 위 데이터에서 '" + etc + "'에 적합하는 데이터만 남겨줘." +
                    "데이터가 없거나 추출하기 어려운 경우 [{}] 형태로 보내줘. ";

            response = geminiUtil.generateResponse(CommonUtil.ObjectToJson(placeList) + detailPrompt);

            try {
                text = CommonUtil.cleanJson(response.text(), "List");
                log.info(text);
            } catch (Exception e) {
                log.error("======= json 변환 에러 =======");
                log.error(response.text());
                log.error("============================");
            }

            placeList = CommonUtil.JsonToList(text);
        }


        return ApiResponse.ok(placeList);
    }

    public ApiResponse loadRecommendRoute(RecommendRouteRequest recommendRouteRequest) throws Exception {
        Map<String, Object> result = new HashMap<>();
        List<List<Map<String, String>>> wrapList = new ArrayList<>(); // 코스별 데이터 하나로 합친 배열
        List<Map<String, String>> recommendPlaceList = new ArrayList<>(); // 추천 코드 결과 배열

        // kakao api로 키워드로 장소 검색
        for (String courseId : recommendRouteRequest.getCourseIdList()) {
            String keyword = recommendRouteRequest.getLocation() + " " + CourseOption.fromId(courseId);
            List<Map<String, String>> placeList = kakaoUtil.searchPlaceByKeyword(keyword, courseId);

            wrapList.add(placeList);
        }

        // 1차 프롬프트: 필터링
        String filterPrompt = promptBuilder.routeSelectFilterPrompt(
                recommendRouteRequest.getLocation()
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
        String descriptionPrompt = promptBuilder.buildDescriptionPrompt();
        response = geminiUtil.generateResponse(text + descriptionPrompt);
        result.put("description", response.text());

        return ApiResponse.ok(result);
    }
}
