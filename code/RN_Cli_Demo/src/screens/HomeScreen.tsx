import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const destinations = [
  {
    city: 'Tokyo',
    country: 'Japan',
    price: '$320',
  },
  {
    city: 'Singapore',
    country: 'Singapore',
    price: '$180',
  },
  {
    city: 'Bangkok',
    country: 'Thailand',
    price: '$150',
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={true}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>✈ SkyAir</Text>
            <Text style={styles.subtitle}>Your Journey, Our Priority</Text>
          </View>

          <Text style={styles.avatar}>👤</Text>
        </View>

        {/* Welcome */}
        <View style={styles.welcome}>
          <Text style={styles.welcomeTitle}>Where would you like to go?</Text>
          <Text style={styles.welcomeDesc}>
            Discover your next destination.
          </Text>
        </View>

        {/* Flight Search Card */}
        <View style={styles.searchCard}>
          <Text style={styles.cardTitle}>Book Your Flight</Text>

          <View style={styles.locationBox}>
            <Text style={styles.label}>FROM</Text>
            <Text style={styles.location}>Hong Kong (HKG)</Text>
          </View>

          <View style={styles.locationBox}>
            <Text style={styles.label}>TO</Text>
            <Text style={styles.location}>Tokyo (NRT)</Text>
          </View>

          <View style={styles.detailsRow}>
            <View>
              <Text style={styles.label}>DEPARTURE</Text>
              <Text style={styles.detail}>20 Nov 2026</Text>
            </View>

            <View>
              <Text style={styles.label}>PASSENGERS</Text>
              <Text style={styles.detail}>1 Adult</Text>
            </View>
          </View>

          <Pressable style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Search Flights</Text>
          </Pressable>
        </View>

        {/* Popular Destinations */}
        <View style={styles.popularSection}>
          <Text style={styles.sectionTitle}>Popular Destinations</Text>

          {destinations.map(item => (
            <View key={item.city} style={styles.destinationCard}>
              <View>
                <Text style={styles.city}>{item.city}</Text>
                <Text style={styles.country}>{item.country}</Text>
              </View>

              <Text style={styles.price}>From {item.price}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },

  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#123B70',
  },

  subtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },

  avatar: {
    fontSize: 28,
  },

  welcome: {
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 20,
  },

  welcomeTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#172B4D',
  },

  welcomeDesc: {
    color: '#777',
    marginTop: 8,
  },

  searchCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 4,
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#123B70',
    marginBottom: 18,
  },

  locationBox: {
    backgroundColor: '#F4F6FA',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },

  label: {
    fontSize: 11,
    color: '#888',
    marginBottom: 6,
  },

  location: {
    fontSize: 16,
    fontWeight: '600',
    color: '#172B4D',
  },

  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },

  detail: {
    fontSize: 14,
    fontWeight: '600',
    color: '#172B4D',
  },

  searchButton: {
    backgroundColor: '#123B70',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  popularSection: {
    padding: 20,
    marginTop: 10,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#172B4D',
    marginBottom: 15,
  },

  destinationCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  city: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#172B4D',
  },

  country: {
    color: '#888',
    marginTop: 4,
  },

  price: {
    color: '#E58A25',
    fontWeight: 'bold',
  },
});
