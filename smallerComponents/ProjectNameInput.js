import { TextInput } from 'react-native-paper'
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { projectFull } from '../FAKEDB/projectsList';


const ProjectNameInput = ({projects}) => {
	const [text, setText] = useState('')

	const onChangeText = (text) => {
		setText(text)
	}

	const onSubmitEditing = ({nativeEvent: {text}}) => {
		if (!text) return;
		const projectName = text.trim()

		const newProject = {
			id: Math.random().toString(36),
			title: projectName
		}
		
		projects.unshift(newProject)

		projectFull[newProject.id] = {
			title: newProject.title
		}
		setText('')
	}

	return (
		<TextInput
			style={styles.input}
			value={text}
			placeholder='Project'
			onChangeText={onChangeText}
			onSubmitEditing={onSubmitEditing}
			blurOnSubmit={true}
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