import { useState, useEffect } from "react"
import { 
	Appbar,
	Button,
	PaperProvider,
	DataTable,
	TextInput,
	Text,
	IconButton,
	MD3Colors
} from "react-native-paper"
import { useLocalSearchParams, router } from 'expo-router'
import { StyleSheet, View } from "react-native"
import { projectFull } from "../../FAKEDB/projectsList"

const ProjectItem = () => {
	const local = useLocalSearchParams();
	const [expenses, setExpenses] = useState([]);
	const [expenseInputVisible, setExpenseInputVisible] = useState(false);
	const [totalPrice, setTotalPrice] = useState(0);
	const [pickedRow, setPickedRow] = useState(null);

	useEffect(() => {
		const newPrice = expenses.reduce((prev, curr) =>  prev += Number(curr.price * curr.amount) ,0)
		setTotalPrice(newPrice)
	}, [expenses.length])


	return (
		<View style={{...styles.container }}> 
			<TopNavBar projectId={local.id} />
			<Table expenses={expenses} setPickedRow={setPickedRow} pickedRow={pickedRow}/>
			<TotalBar totalPrice={totalPrice} />
			{	
				expenseInputVisible && 
					<ExpenseTextInput
						expenses={expenses} 
						setExpenseInputVisible={setExpenseInputVisible}
					/>
			}{
				!expenseInputVisible && 
					<IconsMenu 
						setExpenseInputVisible={setExpenseInputVisible} 
						expenseInputVisible={expenseInputVisible}	
						pickedRow={pickedRow}
						setExpenses={setExpenses}
						setPickedRow={setPickedRow}
					/>
			}
		</View>
	)
}

const Table = ({expenses, setPickedRow, pickedRow}) => {
	console.log(pickedRow)
	const onPress = (event, pressedExpenseData) => {
		pickedRow ? setPickedRow(null) : setPickedRow(pressedExpenseData)
	}

	return (
		<PaperProvider>
			<DataTable style={styles.dataTable}>
				<DataTable.Header>
					<DataTable.Title>Material</DataTable.Title>
					<DataTable.Title numeric>Parameters</DataTable.Title>
					<DataTable.Title numeric>Amount</DataTable.Title>
					<DataTable.Title numeric>Price</DataTable.Title>
				</DataTable.Header>		

			{expenses.map((expense) => (
				<DataTable.Row style={{backgroundColor: pickedRow?.key === expense.key ? 'gray' : 'black'}} onPress={(event) => onPress(event ,expense)} key={expense.key}>
					<DataTable.Cell>{expense.type}</DataTable.Cell>
					<DataTable.Cell numeric>{expense.parameters}</DataTable.Cell>
					<DataTable.Cell numeric>{expense.amount}</DataTable.Cell>
					<DataTable.Cell numeric>{expense.price}</DataTable.Cell>
				</DataTable.Row>
			))}
			</DataTable>
		</PaperProvider>
	  );
}


const IconsMenu = ({setExpenseInputVisible, pickedRow, setExpenses, setPickedRow}) => {
	const pickedStyles = {
		justifyContent: pickedRow ? 'space-between' : 'center',
	}
	const onAddPress = () => {
		setExpenseInputVisible((prevState) => !prevState)
	}

	const onDeletePress = () => {
		const keyToDelete = pickedRow.key
		setExpenses((oldExpenses) => {
			return oldExpenses.filter((expense) => expense.key !== keyToDelete)
		})
		setPickedRow(null)
	}

	return (
		<View style={{...styles.buttonsMenu, ...pickedStyles}}>
			{pickedRow &&
				<>
				<IconButton
					icon="pencil"
					iconColor={MD3Colors.neutral100}
					size={30}
					onPress={() => console.log('Pressed')}
				/>
				<IconButton
					icon="minus"
					iconColor={MD3Colors.neutral100}
					size={30}
					onPress={onDeletePress}
				/>
				</>
			}
			{!pickedRow &&
				<IconButton
					icon="plus"
					iconColor={MD3Colors.neutral100}
					size={30}
					onPress={onAddPress}
				/>
			}
		</View>
	)
}

const TotalBar = ({totalPrice}) => {
	return (
		<Text 
			variant="headlineMedium"
			style={{
				backgroundColor: 'black',
				color: 'white',
				paddingBottom: 5,
				paddingLeft: 5,
			}}
		>{`Total expenses: ${totalPrice}`}</Text>
	)
}

const ExpenseTextInput = ({expenses, setExpenseInputVisible}) => {
	const [_, setInput] = useState('');

	const onSubmitEditing = ({nativeEvent: {text}}) => {
		if (!text) return setExpenseInputVisible(false);

		const items = text.split(',')
		expenses.push({
			key: expenses.at(-1)?.key + 1 || 1,
			type: items[0],
			parameters: items[1],
			amount: items[2],
			price: items[3]
		})
		setInput('')
		setExpenseInputVisible(false)
	};

	return (
		<TextInput
			autoFocus
			onSubmitEditing={onSubmitEditing}
			blurOnSubmit={true}
	  	/>
	)
}

const TopNavBar = ({projectId}) => {
	const projectName = projectFull[projectId]?.title

	const onPress = () => {
		router.back();
	}

	return (
		<Appbar.Header 
			style={{
				backgroundColor: 'black'
			}}
			mode={'center-aligned'}
		>
			<Appbar.BackAction color='white' onPress={onPress}/>
			<Appbar.Content color='white' title={projectName}/>
	  	</Appbar.Header>
	)
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
		backgroundColor: 'black'
	},
})


export default ProjectItem;