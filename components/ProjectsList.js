import React, { useState } from 'react';
import { SafeAreaView, FlatList, StyleSheet, Text, Pressable, View } from 'react-native';
import { IconButton, Button, Menu, PaperProvider } from 'react-native-paper';
import { Link } from 'expo-router';
import { storage } from '../system/storage';

const ProjectsList = ({ projects, setProjects }) => {
    const deleteProject = (projectId) => setProjects((prev) => prev.filter((project) => project.id !== projectId));
    const updateStatus = (projectId) => setProjects((prev) => {
		return prev.map((project) => {
			if (project.id === projectId) {
				project.status = project.status === 'inProgress' ? 'Done' : 'inProgress';
				storage.set(projectId, JSON.stringify(project));
			};
			return project;
		})
	});
	return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={projects}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <PressableItem item={item} key={`projectItem${item.id}`} deleteProject={deleteProject} updateStatus={updateStatus}/>
                )}
            />
        </SafeAreaView>
    );
};

const PressableItem = ({ item, deleteProject, updateStatus }) => {
    return (
        <View>
            <Link
                href={{
                    pathname: '/projects/[id]',
                    params: { id: item.id },
                }}
                asChild
                key={`keyForLink${item.id}`}
            >
                <Pressable style={styles.item}>
                    <TitleAndBudget title={item.title} budget={item.budget} />
                    <Status status={item.status} itemId={item.id} updateStatus={updateStatus}/>
                    <AddressAndControlls address={item.address} deleteProject={deleteProject} itemId={item.id} />
                </Pressable>
            </Link>
        </View>
    );
};

const AddressAndControlls = ({ address, deleteProject, itemId }) => {
    const [visible, setVisible] = useState(false);
    const onPress = () => setVisible((prev) => !prev);

    const deleteOnPress = () => {
        setVisible(false);
        deleteProject(itemId);
        storage.delete(itemId);
    };

    return (
        <PaperProvider>
            <View style={styles.addressAndControls}>
                <Text style={styles.address}>{address}</Text>
                <Menu
                    style={{ top: -100 }}
                    visible={visible}
                    onDismiss={onPress}
                    anchorPosition="top"
                    anchor={<IconButton icon={'dots-horizontal'} iconColor="white" size={24} onPress={onPress} />}
                >
                    <Menu.Item onPress={deleteOnPress} title="Delete" />
                    <Menu.Item onPress={() => setVisible(false)} title="Close" />
                </Menu>
            </View>
        </PaperProvider>
    );
};

const TitleAndBudget = ({ title, budget }) => {
    const total = budget.reduce((acc, paycheck) => acc + Number(paycheck.amount), 0);
    return (
        <View style={styles.titleAndControlsContrainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.budget}>₴{total}</Text>
        </View>
    );
};

const Status = ({ status, itemId, updateStatus }) => {
    const statusColor = status === 'inProgress' ? '#F2BB2C' : '#58B8B2';
    const statusName = status === 'inProgress' ? 'In Progress' : 'Done';
    const statusIcon = status === 'inProgress' ? 'hammer' : 'home';

	const changeStatus = () => updateStatus(itemId);

    return (
        <Button icon={statusIcon} textColor={statusColor} style={styles.status} onPress={changeStatus}>
            {statusName}
        </Button>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25262B',
        width: '100%',
    },
    item: {
        padding: 20,
        marginVertical: 5,
        width: '93%',
        borderRadius: 16,
        backgroundColor: '#35373E',
        borderWidth: 1,
        borderColor: '#555555',
        left: 15,
    },
    titleAndControlsContrainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        marginBottom: 8,
        fontSize: 32,
        color: '#E3E3E3',
        fontWeight: '700',
    },
    budget: {
        color: 'white',
        backgroundColor: '#47763B',
        alignSelf: 'center',
        fontSize: 20,
        paddingLeft: 8,
        paddingTop: 4,
        paddingRight: 8,
        paddingBottom: 4,
        borderRadius: 8,
        fontWeight: '500',
    },
    status: {
        alignSelf: 'flex-start',
        borderWidth: 1,
        marginLeft: -11,
        marginTop: -6,
    },
    addressAndControls: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 35,
    },
    address: {
        color: '#A5A5A5',
        lineHeight: 30,
        fontWeight: '400',
        fontSize: 12,
    },
});

export default ProjectsList;
