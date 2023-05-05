import { StyleSheet } from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';
import useIndexState from '../../store';
import useDemands from '../../store/demand';
import useUser from '../../store/user';

export default function TabOneScreen() {
  const demand = useIndexState(state => state.demand);
  const alldemands = useDemands(state => state.alldemands);
  const { user } = useUser();
  return (
    <View style={styles.container}>
      <Text style={styles.title} className='text-red-400 mb-2'>origin: {process.env.APP_ORIGIN_URL}</Text>
      {
        alldemands.filter((_demand)=> _demand.userId !== user.id).map((demand, index)=> (
        // alldemands.map((demand, index)=> (
          <View key={index}>
            <Text style={styles.title}>{demand.Chinese}</Text>
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
