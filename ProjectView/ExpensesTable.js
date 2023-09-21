import { useState, useEffect } from 'react';
import { PaperProvider, DataTable } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export const ExpensesTable = ({ expenses, setPickedRow, pickedRow }) => {
    const onPress = (pressedExpenseData) => {
        pickedRow ? setPickedRow(null) : setPickedRow(pressedExpenseData);
    };

    const [page, setPage] = useState(0);
    const [numberOfItemsPerPageList] = useState([7]);
    const [itemsPerPage, _] = useState(numberOfItemsPerPageList[0]);

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, expenses.length);

    useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    return (
        <PaperProvider>
            <DataTable style={styles.dataTable}>
                <DataTable.Header>
                    <DataTable.Title>Material</DataTable.Title>
                    <DataTable.Title numeric>Parameters</DataTable.Title>
                    <DataTable.Title numeric>Amount</DataTable.Title>
                    <DataTable.Title numeric>Price</DataTable.Title>
                </DataTable.Header>

                {expenses.slice(from, to).map((expense, index) => (
                    <DataTable.Row
                        style={{ backgroundColor: pickedRow?.key === expense.key ? 'gray' : 'black' }}
                        onPress={() => onPress({ ...expense, index })}
                        key={expense.key}
                    >
                        <DataTable.Cell>{expense.type}</DataTable.Cell>
                        <DataTable.Cell numeric>{expense.parameters}</DataTable.Cell>
                        <DataTable.Cell numeric>{expense.amount}</DataTable.Cell>
                        <DataTable.Cell numeric>{expense.price + '₴'}</DataTable.Cell>
                    </DataTable.Row>
                ))}

                <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.ceil(expenses.length / itemsPerPage)}
                    onPageChange={(page) => setPage(page)}
                    label={`${from + 1}-${to} of ${expenses.length}`}
                    numberOfItemsPerPageList={numberOfItemsPerPageList}
                    numberOfItemsPerPage={itemsPerPage}
                />
            </DataTable>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    dataTable: {
        flex: 1,
        backgroundColor: 'black',
    },
});
