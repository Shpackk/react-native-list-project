import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ProjectsList from '../components/ProjectsList';
import ProjectNameInput from '../smallerComponents/ProjectNameInput';
import { storage } from '../system/storage';

const ProjectsMenu = () => {
	const [projects, setProjects] = useState(() => {
		const list = storage.getAllKeys();
		return list;
	})

	useEffect(() => {}, [projects])

	return (
		<View style={styles.container}>
			<ProjectsList data={projects} />
			<ProjectNameInput
				setProjects={setProjects}
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