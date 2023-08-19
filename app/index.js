import React from 'react';
import { StyleSheet, View } from 'react-native';
import ProjectsList from '../components/ProjectsList';
import ProjectNameInput from '../smallerComponents/ProjectNameInput';
import { projects } from '../FAKEDB/projectsList';

const ProjectsMenu = () => {

	return (
		<View style={styles.container}>
			<ProjectsList data={projects}/>
			<ProjectNameInput
				projects={projects}
			/>
		</View>
	);
}


const styles = StyleSheet.create({ 
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		backgroundColor: '#4EB1A9'
	},
 }); 

export default ProjectsMenu;