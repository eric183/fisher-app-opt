import { StyleSheet } from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';
import useIndexState from '../../store';
import useDemands from '../../store/demand';

export default function TabOneScreen() {
  const demand  = useIndexState(state => state.demand);
  const alldemands = useDemands(state => state.alldemands);
  return (
    <View style={styles.container}>
      {
        alldemands.map((demand, index)=> (
          <View key={index}>
            <Text style={styles.title}>{demand.English}</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
          </View>
        ))
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
