import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ProjectsList from '../components/ProjectsList';
import { storage } from '../system/storage';
import { IconButton } from 'react-native-paper';
import { NewProjectModal } from '../components/NewProjectModal';

const getInitialProjectState = () => {
    const list = storage.getAllKeys();
    const map = list.map((projectKey) => {
        return JSON.parse(storage.getString(projectKey));
    });
    return map;
};

const ProjectsMenu = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [projects, setProjects] = useState(() => getInitialProjectState());

    return (
        <View style={styles.container}>
            <ProjectsList projects={projects} setProjects={setProjects} />
            {modalVisible && (
                <NewProjectModal
                    setModalVisible={setModalVisible}
                    modalVisible={modalVisible}
                    setProjects={setProjects}
                />
            )}
            <IconButton onPress={() => setModalVisible(true)} style={styles.addProjButton} icon="plus" size={35} />
        </View>
    );
};

const styles = StyleSheet.create({
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
        backgroundColor: 'white',
    },
});

export default ProjectsMenu;
