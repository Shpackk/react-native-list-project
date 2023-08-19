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
	return (
		<Link href={{
			pathname: '/projects/[id]',
			params: { id }
		}} asChild>
			<Pressable style={styles.item}>
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
	backgroundColor: '#4EB1A9',
	width: '100%',
  },
  item: {
    padding: 20,
    marginVertical: 2,
	width: '100%',
    borderRadius: 10,
	backgroundColor: '#292F36',
	borderColor: 'white',
  },
  title: {
    fontSize: 32,
	color: '#E3E3E3',
  },
});

export default ProjectsList;

