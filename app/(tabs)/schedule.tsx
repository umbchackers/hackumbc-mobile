import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { createApi } from '../../lib/api';

interface Activity {
  time: string;
  activity: string;
}

interface DaySchedule {
  day: string;
  activities: Activity[];
}

export default function ScheduleScreen() {
  const { accessToken } = useAuth();
  const api = createApi(accessToken);
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSchedule() {
      try {
        const response = await api.get<{ body: string }>('/schedule', true);

        const parsed = JSON.parse(response.body);
        setSchedule(parsed.schedule || []);
      } catch (err) {
        console.error('Failed to fetch schedule:', err);
        setError('Failed to load schedule');
      }
    }

    fetchSchedule();
  }, []);

  const currentDay = schedule[selectedDayIndex];

  return (
    <View style={{ flex: 1, paddingTop: 20 }}>
      <ScrollView horizontal style={{ flexDirection: 'row', marginBottom: 20 }}>
        {schedule.map((dayItem, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedDayIndex(index)}
            style={{
              padding: 10,
              marginHorizontal: 5,
              borderBottomWidth: selectedDayIndex === index ? 2 : 0,
              borderBottomColor: selectedDayIndex === index ? 'blue' : 'transparent',
            }}
          >
            <Text style={{ fontSize: 18 }}>
              {dayItem.day}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {error && (
        <Text style={{ color: 'red', textAlign: 'center' }}>
          {error}
        </Text>
      )}

      {currentDay ? (
        <ScrollView style={{ paddingHorizontal: 20 }}>
          {currentDay.activities.map((activityItem, idx) => (
            <View key={idx} style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{activityItem.time}</Text>
              <Text style={{ fontSize: 14, color: '#666' }}>{activityItem.activity}</Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        !error && <Text style={{ textAlign: 'center' }}>No schedule available for this day.</Text>
      )}
    </View>
  );
}
