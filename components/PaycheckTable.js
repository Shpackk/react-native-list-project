import { useState, useEffect } from "react"
import { 
	PaperProvider,
	DataTable,
} from "react-native-paper"
import { StyleSheet } from "react-native"

export const PaycheckTable = ({budget, setPickedRow, pickedRow}) => {
	const onPress = (pressedPaycheck) => {
		pickedRow ? setPickedRow(null) : setPickedRow(pressedPaycheck)
	}
	const [page, setPage] = useState(0);
	const [numberOfItemsPerPageList] = useState([7]);
	const [itemsPerPage, _] = useState(
	  numberOfItemsPerPageList[0]
	);

	const from = page * itemsPerPage;
	const to = Math.min((page + 1) * itemsPerPage, budget.length);
  
	useEffect(() => {
	  setPage(0);
	}, [itemsPerPage]);
	console.log(budget)
				{/* style={{backgroundColor: pickedRow?.key === paycheck.key ? 'gray' : 'black'}} onPress={() => onPress({...paycheck, index})} key={paycheck.key} */}

	return (
		<PaperProvider>
			<DataTable style={styles.dataTable}>
				<DataTable.Header>
					<DataTable.Title numeric>Date</DataTable.Title>
					<DataTable.Title numeric>Amount</DataTable.Title>
				</DataTable.Header>

			{budget.slice(from, to).map((paycheck, index) => (
				<DataTable.Row>
					<DataTable.Cell numeric>{paycheck.date}</DataTable.Cell>
					<DataTable.Cell numeric>{paycheck.amount}</DataTable.Cell>
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
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
	},
	topNavBar: {
		backgroundColor: 'black',
	},
	dataTable: {
		flex: 1,
		backgroundColor: 'black',
	},
	buttonsMenu: {
		flexDirection: 'row',
		backgroundColor: 'black',
		justifyContent: 'space-between'
	},
	totalBar: {
		flexDirection: 'row',
		backgroundColor: 'black',
		justifyContent: 'center',
	},
})