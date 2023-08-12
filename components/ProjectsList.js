import React from 'react';
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  Pressable,
} from 'react-native';
import { Link } from 'expo-router'


const PressableItem = ({item: {title, id}}) => {
	const onPress = ({nativeEvent}) => {
		console.log(id)
	}

	return (
		<Link href={{
			pathname: '/projects/[id]',
			params: { id }
		}} asChild>
			<Pressable style={styles.item} onPress={onPress}>
				<Text style={styles.title}>{title}</Text>
			</Pressable>
		</Link>
	)
}

const ProjectsList = (props) => {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={props.data}
        renderItem={({item}) => <PressableItem item={item}/>}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
	backgroundColor: '#2c3e50',
	width: '100%',
    // marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 20,
    marginVertical: 2,
	width: '100%',
    borderRadius: 20,
	backgroundColor: '#34495e'
  },
  title: {
    fontSize: 32,
	// color: '#fff'
  },
});

export default ProjectsList;

