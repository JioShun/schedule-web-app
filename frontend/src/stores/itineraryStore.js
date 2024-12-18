import { defineStore } from 'pinia';
const BASE_URL = process.env.VUE_APP_LOCAL_URL;

export const useItineraryStore = defineStore('itinerary', {
    state: () => ({
        itineraries: []
    }),
    actions: {
        // 全てのしおりデータを取得するメソッド
        async fetchItineraries() {
            try {
                const response = await fetch(`${BASE_URL}/api/itineraries`);
                if (response.ok) this.itineraries = await response.json();
                else console.error('Error fetching itineraries:', response);
            } catch (error) {
                console.error('Error fetching itineraries:', error);
            }
        },

        // ユーザに合ったしおりを取得するメソッド
        async fetchItinerariesByUser(userEmail) {
            try {
                const response = await fetch(`${BASE_URL}/api/itineraries/byUser?userEmail=${userEmail}`);
                if (response.ok) this.itineraries = await response.json();
                else console.error('Error fetching itineraries:', response);
            } catch (error) {
                console.error('Error fetching itineraries:', error);
            }
        },

        // しおりを追加するメソッド
        async addItinerary(itinerary) {
            try {
                const response = await fetch(`${BASE_URL}/api/itineraries`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(itinerary)
                });
                if (response.ok) {
                    const result = await response.json();
                    this.itineraries.push({ itineraryId: result.itinerary_id, ...itinerary });
                } else console.error('Error adding itinerary:', response);
            } catch (error) {
                console.error('Error adding itinerary:', error);
            }
        },

        // しおりを削除するメソッド
        async removeItinerary(itineraryId) {
            try {
                const response = await fetch(`${BASE_URL}/api/itineraries/${itineraryId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    this.itineraries = this.itineraries.filter(itinerary => itinerary.itineraryId !== itineraryId);
                } else console.error('Error deleting itinerary:', response);
            } catch (error) {
                console.error('Error deleting itinerary:', error);
            }
        },

        // idを指定して，日付のリストを返すメソッド
        generateDateList(itineraryId) {
            // 指定されたitineraryIdに一致するしおりを取得
            const itinerary = this.itineraries.find(it => it.itineraryId === parseInt(itineraryId));
            if (!itinerary) {
                console.error(`Itinerary with id ${itineraryId} not found`);
                return [];
            }

            const start = new Date(itinerary.startDate);
            const end = new Date(itinerary.endDate);
            const dateList = [];
            let dayCounter = 1;

            // 日付のフォーマット関数
            function formatDate1(date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1);
                const day = String(date.getDate());
                return `${year}/${month}/${day}`;
            }

            function formatDate2(date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }

            // 曜日を取得する関数
            function getDayOfWeek(date) {
                const daysOfWeek = ["日", "月", "火", "水", "木", "金", "土"];
                return daysOfWeek[date.getDay()];
            }

            // startDateからendDateまでの日付を生成
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                const formattedDate1 = formatDate1(d);
                const formattedDate2 = formatDate2(d);
                const displayDate = `${d.getMonth() + 1}/${d.getDate()} ${getDayOfWeek(d)}`;

                dateList.push({
                    name: `Day${dayCounter}`,
                    date1: formattedDate1,         // "2024/9/5" のような形式
                    date2: formattedDate2,        // "2024-09-05" のような形式
                    displayDate: displayDate      // "9/5 木" のような形式
                });

                dayCounter++;
            }

            return dateList;
        },

        // idを指定して，タイトルを取得するメソッド
        getTitle(itineraryId) {
            const itinerary = this.itineraries.find(it => it.itineraryId === parseInt(itineraryId));
            if (!itinerary) {
                console.error(`Itinerary with id ${itineraryId} not found`);
                return '';
            }
            return itinerary.title;
        }
    }
});