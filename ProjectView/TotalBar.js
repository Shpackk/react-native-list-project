import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

export const TotalBar = ({ totalPrice, budget }) => {
    return (
        <View style={styles.totalBar}>
            <ReturnTopicValuePair value={budget} valueColor={'green'} />
            <ReturnTopicValuePair topic={'-'} value={totalPrice} valueColor={'yellow'} />
            <ReturnTopicValuePair topic={'='} value={budget - totalPrice} valueColor={'cyan'} />
        </View>
    );
};

const ReturnTopicValuePair = ({ topic, value, valueColor }) => {
    return (
        <>
            <Text
                variant="headlineSmall"
                style={{
                    color: 'white',
                    paddingLeft: 20,
                    paddingRight: 20,
                }}
            >
                {topic}
            </Text>
            <Text
                variant="headlineSmall"
                style={{
                    paddingLeft: 20,
                    paddingRight: 20,
                    color: valueColor,
                }}
            >
                {value}
            </Text>
        </>
    );
};

const styles = StyleSheet.create({
    totalBar: {
        flexDirection: 'row',
        backgroundColor: 'black',
        justifyContent: 'center',
    },
});
