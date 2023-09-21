import { useState, useEffect } from 'react';
import { PaperProvider, DataTable } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export const PaycheckTable = ({ budget, setPickedRow, pickedRow }) => {
    const onPress = (pressedPaycheck) => {
        pickedRow ? setPickedRow(null) : setPickedRow(pressedPaycheck);
    };
    const [page, setPage] = useState(0);
    const [numberOfItemsPerPageList] = useState([7]);
    const [itemsPerPage, _] = useState(numberOfItemsPerPageList[0]);

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, budget.length);

    useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    return (
        <PaperProvider>
            <DataTable style={styles.dataTable}>
                <DataTable.Header>
                    <MakeCentric Component={DataTable.Title} data={'Amount'} />
                    <MakeCentric Component={DataTable.Title} data={'Date'} />
                </DataTable.Header>

                {budget.slice(from, to).map((paycheck, index) => (
                    <DataTable.Row  style={{backgroundColor: pickedRow?.key === paycheck.key ? 'gray' : 'black'}} onPress={() => onPress({...paycheck, index})} key={'paycheck' + index}>
                        <MakeCentric Component={DataTable.Cell} data={paycheck.amount + '₴'} />
                        <MakeCentric Component={DataTable.Cell} data={paycheck.date} />
                    </DataTable.Row>
                ))}

                <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.ceil(budget.length / itemsPerPage)}
                    onPageChange={(page) => setPage(page)}
                    label={`${from + 1}-${to} of ${budget.length}`}
                    numberOfItemsPerPageList={numberOfItemsPerPageList}
                    numberOfItemsPerPage={itemsPerPage}
                />
            </DataTable>
        </PaperProvider>
    );
};

const MakeCentric = ({ Component, data }) => {
    return <Component style={{ justifyContent: 'center' }}>{data}</Component>;
};

const styles = StyleSheet.create({
    dataTable: {
        flex: 1,
        backgroundColor: 'black',
    },
});
