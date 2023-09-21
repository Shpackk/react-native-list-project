import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { storage } from '../../system/storage';
import { useMMKVObject } from 'react-native-mmkv';
import { ExpensesTable, ExpenseTextInput, IconsMenu, PaycheckTable, TopNavBar, TotalBar } from '../../ProjectView';
/*
	expenses: {
		key:
		type: 
		parameter:
		amount:
		price:
	}
 */

const ProjectItem = () => {
    const local = useLocalSearchParams();
    const [currentProject, _] = useMMKVObject(local.id);
    const [totalPrice, setTotalPrice] = useState(0);
    const budget = currentProject.budget.reduce((acc, paycheck) => acc + Number(paycheck.amount), 0);
    // togglers
    const [tableToggle, setTableToggle] = useState(false);
    const [inputVisible, setInputVisible] = useState(false);
    const [forEdit, setForEdit] = useState(false);
    const [pickedRow, setPickedRow] = useState(null);

	useEffect(() => {
        const newPrice = currentProject.expenses.reduce((prev, curr) => (prev += Number(curr.price * curr.amount)), 0);
        setTotalPrice(newPrice);
        storage.set(local.id, JSON.stringify(currentProject));
    }, [currentProject.expenses.length, currentProject.budget.length, forEdit]);

    return (
        <View style={{ ...styles.container }}>
            <TopNavBar projectName={currentProject.title} tableToggle={tableToggle} setTableToggle={setTableToggle} />
            {tableToggle ? (
                <PaycheckTable budget={currentProject.budget} setPickedRow={setPickedRow} pickedRow={pickedRow}/>
            ) : (
                <ExpensesTable expenses={currentProject.expenses} setPickedRow={setPickedRow} pickedRow={pickedRow} />
            )}
            <TotalBar totalPrice={totalPrice} budget={budget} />
            {inputVisible && (
                <ExpenseTextInput
                    forEdit={forEdit}
                    setForEdit={setForEdit}
                    expenses={currentProject.expenses}
                    budget={currentProject.budget}
                    setInputVisible={setInputVisible}
                    pickedRow={pickedRow}
                    setPickedRow={setPickedRow}
                    tableToggle={tableToggle}
                />
            )}
            {!inputVisible && (
                <IconsMenu
                    setInputVisible={setInputVisible}
                    inputVisible={inputVisible}
                    pickedRow={pickedRow}
                    currentProject={currentProject}
                    setPickedRow={setPickedRow}
                    setForEdit={setForEdit}
                    tableToggle={tableToggle}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
});

export default ProjectItem;
