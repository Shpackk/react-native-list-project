import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import ProjectsList from '../components/ProjectsList';
import { storage } from '../system/storage';
import { IconButton, TextInput, HelperText } from 'react-native-paper';

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

	const onPress = () => setModalVisible(prev => !prev);

	return (
		<View style={styles.container}>
			<ProjectsList projects={projects} setProjects={setProjects}/>
			{ modalVisible
				? <NewProjectModal setProjects={setProjects} setModalVisible={setModalVisible}/>
				: <IconButton style={styles.addProjButton} icon="plus" size={35} onPress={onPress}/>
			}
		</View>
	);
}

const NewProjectModal = ({setProjects, setModalVisible}) => {
	const setInitialState = () => ({title: '', budget: 0, address: ''});
	const [newProjectData, setNewProjectData] = useState(() => setInitialState());
	const [errors, setErrors] = useState(() => ({budget: '', title: '', creationBlocked: ''}));

	const onProjectName = (text) => {
		const title = text ? text.trim() : ''
		if (!title) return setErrors((prev) => ({...prev, title: 'Project name is required'}));

		setErrors((prev) => ({...prev, title: ''}));
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
		if (isNaN(text)) return setErrors((prev) => ({...prev, budget: 'Should be a number'}));
		setErrors((prev) => ({...prev, budget: ''}));

		setNewProjectData((prev) => ({
			...prev,
			budget: text.trim()
		}))
	}

	const onAdd = () => {
		if (errors.budget || errors.title || !newProjectData.title || !newProjectData.budget) {
			return setErrors((prev) => ({...prev, creationBlocked: 'Fill all required fields to create a Project'}));
		};
		setErrors((prev) => ({...prev, creationBlocked: ''}));

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
			{ errors.title && <ErrorHelperText errorMsg={errors.title}/>}
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
			{ errors.budget && <ErrorHelperText errorMsg={errors.budget}/>}
			{ errors.creationBlocked && <ErrorHelperText errorMsg={errors.creationBlocked}/>}
			<View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
				<IconButton icon="plus" iconColor='white' size={40} onPress={onAdd}/>
				<IconButton icon="close" iconColor='white' size={40} onPress={onClose}/>
			</View>
		</View>
	)
};

const ErrorHelperText = ({errorMsg}) => {
	return (
		<HelperText type="error"> {errorMsg} </HelperText>
	)
}

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
	addProjButton: {
		margin: 0,
		height: 40,
		width: '100%',
		borderWidth: 1,
		borderColor: '#292F36',
		borderRadius: 0,
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