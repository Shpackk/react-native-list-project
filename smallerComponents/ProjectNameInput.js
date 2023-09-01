import { TextInput } from 'react-native-paper'
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { storage } from '../system/storage';

const ProjectNameInput = ({setProjects}) => {
	const [text, setText] = useState('')

	const onChangeText = (text) => {
		setText(text)
	}

	const onSubmitEditing = async ({nativeEvent: {text}}) => {		
		if (!text) return;
		const projectName = text.trim()
		const status = 'inProgress';
		const address = 'Malinovskogo 45';
		const budget = 10000;
	
		const newProject = {
			id: Math.random().toString(36),
			title: projectName,
			budget,
			status,
			address,
			expenses: [],
		}

		setProjects((prev) => [newProject, ...prev])
		storage.set(projectName, JSON.stringify(newProject));

		setText('')
	}

	return (
		<TextInput
			style={styles.input}
			value={text}
			placeholder='Project'
			onChangeText={onChangeText}
			onSubmitEditing={onSubmitEditing}
			underlineColor='transparent'
      	/>
	)
}

const styles = StyleSheet.create({ 
	input: {
		alignSelf: 'stretch',
		height: 40,
		margin: 12,
		borderColor: '#4EB1A9',
		padding: 10,
		borderTopRightRadius: 20,
		borderBottomLeftRadius: 20,
	  },
 }); 

export default ProjectNameInput;