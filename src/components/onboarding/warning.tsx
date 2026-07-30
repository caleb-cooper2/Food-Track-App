import Feather from '@expo/vector-icons/Feather';
import {StyleSheet, Text, View} from 'react-native';

export function Warning({ children }: { children: string }) {
  return (
      <View style={styles.container}>
        <Feather name="alert-triangle" size={16} color={'#8A5A1F'} style={styles.icon} />
        <Text style={styles.text}>{children}</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FBE3C7',
    borderRadius: 14,
    padding: 14
  },
  icon: {
    marginTop: 2
  },
  text: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: '#6B4419'
  }
});
