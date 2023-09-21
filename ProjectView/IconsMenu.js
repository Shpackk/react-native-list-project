import { Button, IconButton } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

export const IconsMenu = ({ setInputVisible, pickedRow, currentProject, setPickedRow, setForEdit, tableToggle }) => {
    const pickedStyles = {
        justifyContent: pickedRow ? 'space-between' : 'center',
    };
    const onAddPress = () => {
        setInputVisible((prevState) => !prevState);
    };

    const onDeletePress = () => {
		const entityToDelete = tableToggle ? 'budget' : 'expenses';
        currentProject[entityToDelete] = currentProject[entityToDelete].filter((entity) => entity.key !== pickedRow.key);
        setPickedRow(null);
    };

    const onEditPress = () => {
        setForEdit((prev) => !prev);
        setInputVisible((prev) => !prev);
    };

    return (
        <View style={{ ...styles.buttonsMenu, ...pickedStyles }}>
            {pickedRow && (
                <>
                    <Button icon="pencil" onPress={onEditPress} labelStyle={{ fontSize: 15, color: 'white' }}>
                        Edit
                    </Button>
                    <Button icon="minus" onPress={onDeletePress} labelStyle={{ fontSize: 15, color: 'white' }}>
                        Delete
                    </Button>
                </>
            )}
            {!pickedRow && (
                <>
                    <IconButton icon="plus" onPress={onAddPress} iconColor="white" size={30} />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    buttonsMenu: {
        flexDirection: 'row',
        backgroundColor: 'black',
        justifyContent: 'space-between',
    },
});
