import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ProjectsList from '../components/ProjectsList';
import { storage } from '../system/storage';
import { IconButton, TextInput } from 'react-native-paper';

const getInitialProjectState = () => {
	const list = storage.getAllKeys();
	const map = list.map((projectKey) => {
		return JSON.parse(storage.getString(projectKey));
	})
	return map;
}

const ProjectsMenu = () => {
	const [modalVisible, setModalVisible] = useState(false);
	const [projects, setProjects] = useState(() => getInitialProjectState())

	const onPress = () => {
		setModalVisible(prev => !prev)
	}

	const newProjectView = modalVisible ? <NewProjectModal setProjects={setProjects} setModalVisible={setModalVisible}/> : <IconButton icon="plus" size={40} onPress={onPress}/>

	return (
		<View style={styles.container}>
			<ProjectsList projects={projects} />
			{newProjectView}
		</View>
	);
}

const NewProjectModal = ({setProjects, setModalVisible}) => {
	const setInitialState = () => ({
		title: '',
		budget: 0,
		address: '',
	})
	const [newProjectData, setNewProjectData] = useState(() => setInitialState());

	const onProjectName = (text) => {
		const title = text ? text.trim() : 'Untitled'
		setNewProjectData((prev) => ({
			...prev,
			title,
		}))
	}
	const onAddressChange = (text) => {
		setNewProjectData((prev) => ({
			...prev,
			address: text.trim()
		}))
	}
	const onBudgetChange = (text) => {
		setNewProjectData((prev) => ({
			...prev,
			budget: text.trim()
		}))
	}

	const onAdd = () => {
		const newProject = {
			id: Math.random().toString(36),
			expenses: [],
			status: 'inProgress',
			...newProjectData
		};
		setProjects((prev) => [newProject, ...prev]);
		storage.set(newProject.id, JSON.stringify(newProject))
		setModalVisible((prev) => !prev)
	}

	const onClose = () => setModalVisible((prev) => !prev);

	return (
		<View style={styles.modal}>
			<TextInput 
				style={styles.modal.textInput}
				underlineColor='transparent'
				placeholder='Project Name'
				onChangeText={onProjectName}
			/>
			<TextInput 
				style={styles.modal.textInput}
				underlineColor='transparent'
				placeholder='Address'
				onChangeText={onAddressChange}
			/>
			<TextInput 
				style={styles.modal.textInput}
				underlineColor='transparent'
				placeholder='Budget'
				onChangeText={onBudgetChange}
			/>
			<View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
				<IconButton icon="plus" iconColor='white' size={40} onPress={onAdd}/>
				<IconButton icon="close" iconColor='white' size={40} onPress={onClose}/>
			</View>
		</View>
	)
};

const styles = StyleSheet.create({ 
	modal: {
		backgroundColor: 'black',
		width: '100%',
		height: '80%',
		textInput: {
			alignSelf: 'stretch',
			height: 40,
			margin: 12,
			borderColor: '#4EB1A9',
			padding: 10,
			borderTopRightRadius: 20,
			borderBottomLeftRadius: 20,
		}
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		backgroundColor: '#4EB1A9'
	},
 }); 

export default ProjectsMenu;