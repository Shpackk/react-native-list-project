import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, Modal, Checkbox, HelperText } from 'react-native-paper';
import { storage } from '../system/storage';
import { validateProjectData } from '../app/helpers/validators';

export const NewProjectModal  = ({setProjects, setModalVisible, modalVisible}) => {
	const setInitialState = () => ({title: '', budget: 0, address: '', status: 'inProgress'});
	const [newProject, setNewProject] = useState(() => setInitialState());
	const [errors, setErrors] = useState(null);
	
	const submitForm = () => {
		setErrors(null)

		const errors = validateProjectData(newProject);
		if (Object.values(errors).length > 0) return setErrors(errors);

		const project = {
			id: Math.random().toString(36),
			expenses: [],
			...newProject,
		};

		setModalVisible(false);
		setProjects((prev) => [project, ...prev]);
		storage.set(project.id, JSON.stringify(project));
	};

	return (
		<Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContentStyle}>
			<View style={{
				flex: 1
			}}>
				<ModalInputField 
					placeholder={'Title'}
					dataKey={'title'}
					updateProjectData={setNewProject}
					submitForm={submitForm}
					errors={errors}
					/>
				<ModalInputField 
					placeholder={'Address'}
					dataKey={'address'}
					updateProjectData={setNewProject}
					submitForm={submitForm}
					errors={errors}
					/>
				<ModalInputField 
					placeholder={'Budget'}
					dataKey={'budget'}
					updateProjectData={setNewProject}
					submitForm={submitForm}
					errors={errors}
					/>
				<ProjectStatusPicker 
					updateProjectData={setNewProject}
					/>
			</View>
		</Modal>
	);
};

const ModalInputField = ({errors, placeholder, updateProjectData, dataKey, submitForm}) => {
	const onChange = (text) => {
		updateProjectData((prev) => ({
			...prev,
			[dataKey]: text.trim(),
		}))
	}
	
	return (
		<>
			<TextInput 
				style={styles.textInput}
				underlineColor='transparent'
				placeholder={placeholder}
				onChangeText={onChange}
				onSubmitEditing={submitForm}
			/>
			{ errors?.[dataKey] && <HelperText type='error'>{errors[dataKey]}</HelperText> }
		</>
	)
}

const ProjectStatusPicker = ({updateProjectData}) => {
	const [checked, setChecked] = useState(false)
	const color = checked ? '#58B8B2' : '#F2BB2C';
	const status = checked ? 'checked' : 'unchecked';
	const label = checked ? 'Project is Finished' : 'Project is in Progress';

	const onPress = () => {
		updateProjectData((prev) => ({
			...prev,
			status: !checked ? 'Done' : 'inProgress'
		}));
		setChecked((prev) => !prev);
	}

	return (
		<Checkbox.Item
			color='#58B8B2'
			uncheckedColor='#F2BB2C'
			status={status}
			onPress={onPress}
			labelStyle={{color}}
			label={label}
		/>
	);
};

const styles = StyleSheet.create({ 
	modalContentStyle: {
		backgroundColor: 'black',
		padding: 20,
		width: '90%',
		height: '65%',
		alignSelf: 'center',
	},
	textInput: {
		height: 30,
		margin: 12,
		borderColor: '#4EB1A9',
		padding: 10,
		borderRadius: 10,
		borderTopStartRadius: 10,
		borderTopRightRadius: 10,
	},
 }); 