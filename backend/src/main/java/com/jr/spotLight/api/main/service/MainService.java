package com.jr.spotLight.api.main.service;

import com.google.genai.types.GenerateContentResponse;
import com.jr.spotLight.api.main.dto.RecommendRouteRequest;
import com.jr.spotLight.api.main.enums.CombinationOption;
import com.jr.spotLight.api.main.enums.CourseOption;
import com.jr.spotLight.api.main.enums.TargetOption;
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
                    "데이터가 없거나 추출하기 어려운 경우 빈 Map 형태로 보내줘. ";

            response = geminiUtil.generateResponse(CommonUtil.ObjectToJson(placeList) + detailPrompt);
            text = CommonUtil.cleanJson(response.text(), "List");

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

        // gemini api로 부가 설명에 적합한 데이터만 추출
        String detailPrompt = "";
        GenerateContentResponse response = null;
        String text = "";

        detailPrompt = "\n 위 데이터에서 아래 조건을 만족하는 데이터만 필터링해줘. ";

        if (recommendRouteRequest.getSelectedCombinationId() != null) {
            if ("shortest".equals(recommendRouteRequest.getSelectedCombinationId())) {
                detailPrompt += recommendRouteRequest.getLocation() + " ";
            }

            detailPrompt += "\n" + CombinationOption.fromId(recommendRouteRequest.getSelectedCombinationId()) + " 으로 한정해. ";
        }

        if (recommendRouteRequest.getSelectedTargetId() != null) {
            detailPrompt += "\n" + TargetOption.fromId(recommendRouteRequest.getSelectedTargetId()) + "이랑 같이 가면 좋은 곳 위주로 한정해. ";
        }

        detailPrompt += "그런 다음, 각 그룹마다 데이터 순서대로 임의로 번호를 부여하고 그 중 하나를 무작위로 골라서 남겨줘. " +
                "예시: 45개의 데이터면 각각의 데이터에 1~45의 번호흫 부여한 다음, 랜덤으로 번호 하나를 고르고 그 번호에 해당하는 데이터를 남겨줘. " +
                "단, 데이터에 실제로 번호는 넣으면 안되고 데이터 남길 때 Map에 임의로 Key값을 추가하지 말고 원본을 유지해. " +
                "데이터가 없거나 추출하기 어려운 경우 각 영역 당 빈 Map 형태로 보내줘. 영역 배열 형태는 유지해야해. " +
                "중요: 무작위로 선택할 때 항상 같은 항목이 나오면 안돼. 실제 무작위성(chosen completely at random)을 적용해줘. ";

        response = geminiUtil.generateResponse(CommonUtil.ObjectToJson(wrapList) + detailPrompt);

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

        // gemini api로 경로 설명 추출
        detailPrompt = "\n 위 데이터 순서대로 경로랑 장소에 대한 간단한 설명좀 아래 폼에 맞춰서 해줘. " +
                "산책, 전시회라면 메뉴는 쓰지 말고 말투는 고객에게 설명하듯이 해줘. " +
                "전화번호, 영업시간, 판매 음식은 찾아서 써주고 확실하지 않으면 정보 없음으로 보여줘. " +
                "마크다운 형식같이 뭐 추가하지 말고 그냥 일반 텍스트로 뿌려줘. " +
                "[OO음식점 > OO카페 > OO산책] (장소가 한 군데라면 [카페이름] 처럼 '>' 기호 없이 표기해줘)\n" +
                "1. OO음식점\n" +
                "영업시간: 10:00 ~ 19:00\n 판매하는 메뉴들 몇개 적어줘(없으면 적지마). \n" +
                "(여기에 장소에 대해 간단한 설명 해줘)\n\n" +
                "2. OO카페 (OO음식점으로부터 도보 몇분, 차로 몇분 소요)\n" +
                "...";
        response = geminiUtil.generateResponse(text + detailPrompt);
        result.put("description", response.text());

        return ApiResponse.ok(result);
    }
}
