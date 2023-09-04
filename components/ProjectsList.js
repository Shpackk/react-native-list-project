import React, { useEffect, useState } from 'react';
import {
	SafeAreaView,
	FlatList,
	StyleSheet,
	Text,
	Pressable,
	View,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import { Link } from 'expo-router'
import { storage } from '../system/storage';

const PressableItem = ({item, deleteProject}) => {
	const [itemControlsVisible, toggleItemControls] = useState(false);
	const onLongPress = () => toggleItemControls((prev) => !prev);

	return (
		<Link href={{
			pathname: '/projects/[id]',
			params: { id: item.id }
		}} asChild key={`keyForLink${item.id}`}>
			<Pressable style={styles.item} onLongPress={onLongPress}>
				<View style={styles.titleAndControlsContrainer}>
					<Text style={styles.title}>{item.title}</Text>
					{ itemControlsVisible && <ProjectItemControls itemId={item.id} toggleItemControls={toggleItemControls} deleteProject={deleteProject}/>}
				</View>
				<AdditionalProjectInfo key={`additionalInfo${item.id}`} item={item}/>
			</Pressable>
		</Link>
	)
}

const ProjectItemControls = ({itemId, toggleItemControls, deleteProject}) => {
	const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
	const onDelete = () => {
		setConfirmDeleteVisible((prev) => !prev)
	};
	const editProject = () => {

	};
	const confirmDeletion = () => {
		toggleItemControls(false);
		deleteProject(itemId);
		storage.delete(itemId);
	}

	return (
		<View style={styles.itemControls}>
			{confirmDeleteVisible && <IconButton style={styles.confirmDeleteBtn} icon={'check'} iconColor='red' onPress={confirmDeletion}/>}
			{!confirmDeleteVisible && <IconButton style={styles.deleteProjectBtn} icon={'delete'} iconColor='white' onPress={onDelete}/>}
			<IconButton style={styles.editProjectBtn} icon={'pencil'} iconColor='white' onPress={editProject}/>
		</View>
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

const ProjectsList = ({projects, setProjects}) => {
	const deleteProject = (projectId) => setProjects((prev) => prev.filter((project) => project.id !== projectId));
	return (
		<SafeAreaView style={styles.container}>
			<FlatList
				data={projects}
				keyExtractor={item => item.id}
				showsVerticalScrollIndicator={false}
				renderItem={({item}) => <PressableItem item={item} key={`fucking${item.id}`} deleteProject={deleteProject}/>}
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
	titleAndControlsContrainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	title: {
		width: '50%',
		marginBottom: 10,
		fontSize: 32,
		color: '#E3E3E3',
	},
	itemControls: {
		flex: 1, 
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	deleteProjectBtn: {
		borderWidth: 1,
		borderColor: 'red'
	},
	confirmDeleteBtn: {
		borderWidth: 2,
		borderColor: 'red',
	},
	editProjectBtn: {
		borderWidth: 1,
		borderColor: 'green',
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

