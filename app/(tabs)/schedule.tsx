import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Platform, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { createApi } from '../../lib/api';
import { useFonts } from 'expo-font';

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

  const day = schedule[selected];

  return (
    <View style={styles.container}>
        {/* title shi */}
        <View style={styles.titleRow}>
          <Image source={require('../../assets/images/flower-asset-3.png')} style={styles.flowerImgLeft} />
          <Text style={styles.title}>SCHEDULE</Text>
          <Image source={require('../../assets/images/flower-asset-5.png')} style={styles.flowerImgRight} />
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
            colors={['#e8f9e599', '#f6f8e599', '#fef7e599']} // needs to be adjusted a bit, but for now this good
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
              <ScrollView // before you fucking fry i need scrollview so ts can scroll
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
      </View>
  );
}

// styling really needs to be improved but for now this is good enough
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    width: '100%', 
    backgroundColor: 'transparent' 
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 16,
    justifyContent: 'flex-start',
    marginStart: 16,
  },
  flowerImgLeft: {
    width: 15,
    height: 15,
    marginRight: -3,
    marginTop: -16,
  },
  flowerImgRight: {
    width: 29,
    height: 29,
    marginLeft: -10,
    marginTop: -30,
  },
  title: {
    fontFamily: 'LilitaOne',
    fontSize: 36,
    /*Removed bold for the font to work*/
    color: '#00695c',
    letterSpacing: 1,
    textShadowColor: '#fff',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  daySwitch: { flexDirection: 'row', marginBottom: 16, justifyContent: 'center' },
  dayPill: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 14,
    marginHorizontal: 6,
    backgroundColor: 'rgba(255,255,255,0.35)',
    shadowColor: '#ad2115',
    shadowOffset: { width: 15, height: 9 },
    shadowOpacity: 0.6,
    shadowRadius: 21,
  },
  dayPillActive: { backgroundColor: '#fff' },
  dayText: { fontWeight: 'bold', color: '#ed9c21', fontSize: 16, fontFamily: 'Lemon', textShadowColor: '#fff', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 2},
  dayTextActive: { color: '#ad2115' },
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
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
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
    minHeight: 96,
    width: '100%',
    justifyContent: 'space-between',
  },
  separator: {
    position: 'absolute',
    top: -8,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#E37302',
  },
  activity: {
    flex: 1.5,
    fontFamily: 'Lemon',
    /*Removed the bolding*/
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
    height: 36,
    width: 58,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    /* pill should be center */
    alignSelf: 'center',
    textAlignVertical: 'center'
  },
  infoText: {
    fontSize: 12,
    color: '#0c4b46',
    textAlign: 'center',
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