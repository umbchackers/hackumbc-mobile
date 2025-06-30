import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '../../context/AuthContext';
import { createApi } from '../../lib/api';

const { width } = Dimensions.get('window');

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
  const [selected, setSelected] = useState(0);
  const [error, setError] = useState<string | null>(null);
  {/* i commented this out because i want to test with mock data, but that never loads with this
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<{ body: string }>('/schedule', true);
        const parsed = JSON.parse(res.body);
        setSchedule(parsed.schedule || []);
      } catch (e) {
        console.error(e);
        setError('Failed to load schedule');
      }
    })();
  }, []);
  */}
  console.log(schedule);
  // For testing: add a bunch of mock events if schedule is empty
  useEffect(() => {
    if (schedule.length === 0) {
      setSchedule([
        {
          day: 'Day 1',
          activities: [
            { time: '09:00 AM', activity: 'OPENING CEREMONY' },
            { time: '10:00 AM', activity: 'WORKSHOP 1' },
            { time: '11:00 AM', activity: 'WORKSHOP 2' },
            { time: '12:00 PM', activity: 'LUNCH' },
            { time: '01:00 PM', activity: 'TALK 1' },
            { time: '02:00 PM', activity: 'TALK 2' },
            { time: '03:00 PM', activity: 'WORKSHOP 3' },
            { time: '04:00 PM', activity: 'TALK 3' },
            { time: '05:00 PM', activity: 'DINNER' },
            { time: '06:00 PM', activity: 'RELAXATION' },
            { time: '07:00 PM', activity: 'CLOSING CEREMONY' },
          ],
        },
        {
          day: 'Day 2',
          activities: [
            { time: '09:00 AM', activity: 'DAY 2 EVENT 1' },
            { time: '10:00 AM', activity: 'DAY 2 EVENT 2' },
            { time: '11:00 AM', activity: 'DAY 2 EVENT 3' },
            { time: '12:00 PM', activity: 'DAY 2 EVENT 4' },
            { time: '01:00 PM', activity: 'DAY 2 EVENT 5' },
            { time: '02:00 PM', activity: 'DAY 2 EVENT 6' },
            { time: '03:00 PM', activity: 'DAY 2 EVENT 7' },
            { time: '04:00 PM', activity: 'DAY 2 EVENT 8' },
            { time: '05:00 PM', activity: 'DAY 2 EVENT 9' },
            { time: '06:00 PM', activity: 'DAY 2 EVENT 10' },
            { time: '07:00 PM', activity: 'DAY 2 EVENT 11' },
          ],
        },
      ]);
    }
  }, [schedule.length]);

  const day = schedule[selected];

  return (
    <LinearGradient
      colors={['#c7efe6', '#f18e21']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.bg}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* title shi */}
        <View style={styles.titleRow}>
          <Text style={styles.star}>✱</Text>
          <Text style={styles.title}>SCHEDULE</Text>
          <Text style={[styles.star, { color: '#f18e21' }]}>✱</Text>
        </View>

        {/* day toggle khang when u read this heres a funny message: so gm? ts lmfao */}
        <View style={styles.daySwitch}>
          {schedule.map((d, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.dayPill,
                idx === selected && styles.dayPillActive,
              ]}
              onPress={() => setSelected(idx)}
            >
              <Text
                style={[
                  styles.dayText,
                  idx === selected && styles.dayTextActive,
                ]}
              >
                {d.day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* timeline card*/}
        <View style={styles.cardWrap}>
          <LinearGradient
            colors={['#e8f9e5', '#f6f8e0', '#fef7e1']} // needs to be adjusted a bit, but for now this good
            style={styles.card}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {error && <Text style={styles.error}>{error}</Text>}
            {!day && !error && (
              <Text style={styles.noData}>No schedule for this day</Text>
            )}
            {day && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 32, paddingTop: 8, paddingHorizontal: 8 }}
              >
                {day.activities.map((item, i) => (
                  <View key={i} style={styles.row}>
                    {i !== 0 && <View style={styles.separator} />}
                    <Text
                      style={styles.activity}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {item.activity}
                    </Text>
                    <Text
                      style={styles.time}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.time.match(/am|pm|AM|PM/) ? item.time : `${item.time} AM`}
                    </Text>
                    <TouchableOpacity style={styles.infoPill}>
                      <Text style={styles.infoText}>INFO</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </LinearGradient>
        </View>
      </SafeAreaView>
      {/* footer nav */}
      <View style={styles.footerWrap} pointerEvents="box-none">
        <BottomNav currentPage="schedule" />
      </View>
    </LinearGradient>
  );
}

// styling really needs to be improved but for now this is good enough
const styles = StyleSheet.create({
  bg: { flex: 1, width: '100%', height: '100%' },
  safeArea: { flex: 1, width: '100%' },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
    justifyContent: 'center',
  },
  star: { fontSize: 22, color: '#e95d2e', marginHorizontal: 2 },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0c4b46',
    letterSpacing: 1.5,
  },
  daySwitch: { flexDirection: 'row', marginBottom: 16, justifyContent: 'center' },
  dayPill: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 14,
    marginHorizontal: 6,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dayPillActive: { backgroundColor: '#fff' },
  dayText: { fontWeight: 'bold', color: '#0c4b46', fontSize: 16 },
  dayTextActive: { color: '#e95d2e' },
  cardWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
  },
  card: {
    width: '90%',
    maxWidth: 380,
    borderRadius: 32,
    paddingTop: 32,
    paddingHorizontal: 20,
    paddingBottom: 32,
    marginBottom: 110, // so it doesnt overlap with bottom nav
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    minHeight: 36,
    width: '100%',
    justifyContent: 'space-between',
  },
  separator: {
    position: 'absolute',
    top: -8,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.13)',
  },
  activity: {
    flex: 1.5,
    fontWeight: 'bold',
    color: '#e95d2e',
    fontSize: 15,
    textTransform: 'uppercase',
    marginRight: 12,
    textAlign: 'left',
    lineHeight: 18,
    maxWidth: 120,
    minWidth: 80,
  },
  time: {
    flex: 1,
    minWidth: 80,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#0c4b46',
    fontSize: 17,
    marginRight: 16,
    alignSelf: 'center',
  },
  infoPill: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    alignSelf: 'flex-end',
  },
  infoText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#0c4b46',
  },
  error: { color: 'red', alignSelf: 'center', marginVertical: 20 },
  noData: { fontSize: 16, alignSelf: 'center', marginTop: 60 },
  footerWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingBottom: Platform.OS === 'android' ? 16 : 0,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
});
