import { useState, useEffect } from "react"
import { 
	Appbar,
	PaperProvider,
	DataTable,
	TextInput,
	Text,
	IconButton,
	MD3Colors
} from "react-native-paper"
import { useLocalSearchParams, router } from 'expo-router'
import { StyleSheet, View } from "react-native"
import { storage } from "../../system/storage"
import { useMMKVObject } from "react-native-mmkv"

const ProjectItem = () => {
	const local = useLocalSearchParams();
	const [currentProject, _] = useMMKVObject(local.id);
	/*
		expenses: {
			key:
			type: 
			parameter:
			amount:
			price:
		}
	 */
	const [totalPrice, setTotalPrice] = useState(0);

	// togglers
	const [expenseInputVisible, setExpenseInputVisible] = useState(false);
	const [forEdit, setForEdit] = useState(false);
	const [pickedRow, setPickedRow] = useState(null);

	useEffect(() => {
		const newPrice = currentProject.expenses.reduce((prev, curr) =>  prev += Number(curr.price * curr.amount) ,0)
		setTotalPrice(newPrice)
		storage.set(local.id, JSON.stringify(currentProject));
	}, [currentProject.expenses.length, forEdit])


	return (
		<View style={{...styles.container }}> 
			<TopNavBar projectName={currentProject.title} />
			<Table expenses={currentProject.expenses} setPickedRow={setPickedRow} pickedRow={pickedRow}/>
			<TotalBar totalPrice={totalPrice} budget={currentProject.budget}/>
			{	
				expenseInputVisible && 
					<ExpenseTextInput
						forEdit={forEdit}
						setForEdit={setForEdit}
						expenses={currentProject.expenses} 
						setExpenseInputVisible={setExpenseInputVisible}
						pickedRow={pickedRow}
						setPickedRow={setPickedRow}
					/>
			}{
				!expenseInputVisible && 
					<IconsMenu 
						setExpenseInputVisible={setExpenseInputVisible} 
						expenseInputVisible={expenseInputVisible}	
						pickedRow={pickedRow}
						currentProject={currentProject}
						setPickedRow={setPickedRow}
						setForEdit={setForEdit}
					/>
			}
		</View>
	)
}

const Table = ({expenses, setPickedRow, pickedRow}) => {
	const onPress = (pressedExpenseData) => {
		pickedRow ? setPickedRow(null) : setPickedRow(pressedExpenseData)
	}

	const [page, setPage] = useState(0);
	const [numberOfItemsPerPageList] = useState([7]);
	const [itemsPerPage, _] = useState(
	  numberOfItemsPerPageList[0]
	);

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
				<DataTable.Row style={{backgroundColor: pickedRow?.key === expense.key ? 'gray' : 'black'}} onPress={() => onPress({...expense, index})} key={expense.key}>
					<DataTable.Cell>{expense.type}</DataTable.Cell>
					<DataTable.Cell numeric>{expense.parameters}</DataTable.Cell>
					<DataTable.Cell numeric>{expense.amount}</DataTable.Cell>
					<DataTable.Cell numeric>{expense.price}</DataTable.Cell>
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
}


const IconsMenu = ({setExpenseInputVisible, pickedRow, currentProject, setPickedRow, setForEdit}) => {
	const pickedStyles = {
		justifyContent: pickedRow ? 'space-between' : 'center',
	}
	const onAddPress = () => {
		setExpenseInputVisible((prevState) => !prevState)
	}

	const onDeletePress = () => {
		const keyToDelete = pickedRow.key
		currentProject.expenses = currentProject.expenses.filter((expense) => expense.key !== keyToDelete);
		setPickedRow(null)
	}

	const onEditPress = () => {
		setForEdit((prev) => !prev)
		setExpenseInputVisible((prev) => !prev)
	}

	return (
		<View style={{...styles.buttonsMenu, ...pickedStyles}}>
			{pickedRow &&
				<>
				<IconButton
					icon="pencil"
					iconColor={MD3Colors.neutral100}
					size={30}
					onPress={onEditPress}
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

const TotalBar = ({totalPrice, budget}) => {
	return (
		<View style={{flexDirection: 'column'}}>
			<ReturnTopicValuePair topic={'Expenses'} value={totalPrice} valueColor={'yellow'}/>
			<ReturnTopicValuePair topic={'Budget'} value={budget} valueColor={'green'}/>
			<ReturnTopicValuePair topic={'Result'} value={budget - totalPrice} valueColor={'cyan'}/>
		</View>
	)
}

const ReturnTopicValuePair = ({topic, value, valueColor}) => {
  return (
	<>
		<Text 
			variant="headlineSmall"
			style={{
				backgroundColor: 'black',
				color: 'white',
				paddingBottom: 5,
				paddingLeft: 5,
			}}
		>{topic}:</Text>
		<Text 
			variant="headlineSmall"
			style={{
				backgroundColor: 'black',
				color: valueColor,
				paddingBottom: 5,
				paddingLeft: 5,
			}}
		>{value}</Text>
	</>
  )
}

const ExpenseTextInput = ({expenses, setExpenseInputVisible, forEdit, setForEdit, pickedRow, setPickedRow}) => {
	const [input, setInput] = useState(() => {
		if (forEdit) {
			const {type, parameters, amount, price} = pickedRow;
			return `${type},${parameters},${amount},${price}`;
		}
		return ''
	});

	const onChangeText = (something) => {
		setInput(something)
	}

	const onSubmitEditing = ({nativeEvent: {text}}) => {
		const items = text.split(',')
		if (!forEdit) {
			if (!text) return setExpenseInputVisible(false);

			expenses.push({
				key: expenses.at(-1)?.key + 1 || 1,
				type: items[0],
				parameters: items[1],
				amount: items[2],
				price: items[3]
			})
			setInput('')
			setExpenseInputVisible(false)
		} else {
			expenses[pickedRow.index] = {
				key: expenses[pickedRow.index].key,
				type: items[0],
				parameters: items[1],
				amount: items[2],
				price: items[3]
			}
			
			setInput('')
			setForEdit(false)
			setExpenseInputVisible(false)
			setPickedRow(null)
		}
	};

	return (
		<TextInput
			autoFocus
			onSubmitEditing={onSubmitEditing}
			onChangeText={onChangeText}
			blurOnSubmit={true}
			value={input}
	  	/>
	)
}

const TopNavBar = ({projectName}) => {
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