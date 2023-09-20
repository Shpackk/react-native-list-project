import { Appbar, Switch } from 'react-native-paper';
import { router } from 'expo-router';

export const TopNavBar = ({ projectName, tableToggle, setTableToggle }) => {
    const onPress = () => {
        router.back();
    };

    return (
        <Appbar.Header
            style={{
                backgroundColor: 'black',
            }}
            mode={'center-aligned'}
        >
            <Appbar.BackAction color="white" onPress={onPress} />
            <Appbar.Content color="white" title={projectName} />
            <Switch value={tableToggle} onValueChange={setTableToggle} />
        </Appbar.Header>
    );
};
