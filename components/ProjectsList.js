import React from 'react';
import {
	SafeAreaView,
	FlatList,
	StyleSheet,
	Text,
	Pressable,
	View,
} from 'react-native';
import { Link } from 'expo-router'

const PressableItem = ({item}) => {
	return (
		<Link href={{
			pathname: '/projects/[id]',
			params: { id: item.id }
		}} asChild key={`keyForLink${item.id}`}>
			<Pressable style={styles.item}>
				<Text style={styles.title}>{item.title}</Text>
				<AdditionalProjectInfo key={`additionalInfo${item.id}`} item={item}/>
			</Pressable>
		</Link>
	)
}

const AdditionalProjectInfo = ({item: {address, status, budget}}) => {
	const statusColor = status === 'inProgress' ? 'yellow' : '#2ECC71'
	return (
		<View style={styles.additionalProjectInfo}>
			<Text style={styles.additionalProjectInfo.text}>{address}</Text>
			<Delimiter/>
			<Text style={styles.additionalProjectInfo.text}>{budget}</Text>
			<Delimiter/>
			<Text style={{color: statusColor}}>{status}</Text>
		</View>
	)
}

const Delimiter = () => <Text style={styles.additionalProjectInfo.delimiter}> | </Text>;

const ProjectsList = ({projects}) => {
  return (
    <SafeAreaView style={styles.container}>
		<FlatList
			data={projects}
			renderItem={({item}) => <PressableItem item={item} key={`fucking${item.id}`}/>}
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
	marginBottom: 10,
    fontSize: 32,
	color: '#E3E3E3',
  },
  additionalProjectInfo: {
	flex: 1,
	flexDirection: 'row',
	text: {
		color: 'white',
	},
	delimiter: {
		color: 'white',
		marginLeft: 10,
		marginRight: 10,
	}
  }
});

export default ProjectsList;

