import axiosInstance from "@/config/axiosInstance";

export const useRecommendRoute = async (location: string, courseIdList: string[], placeNameList: string[] = []) => {
    const result = await axiosInstance.post('/api/main/recommend-route/load', {
        location: location,
        courseIdList: courseIdList,
        placeNameList: placeNameList,
    });

    const { data, message, success } = result.data;

    return data;
};