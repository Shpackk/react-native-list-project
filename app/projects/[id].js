import { useState, useEffect } from "react"
import { 
	Appbar,
	PaperProvider,
	DataTable,
	TextInput,
	Text,
	Button,
	Switch,
} from "react-native-paper"
import { useLocalSearchParams, router } from 'expo-router'
import { StyleSheet, View } from "react-native"
import { storage } from "../../system/storage"
import { useMMKVObject } from "react-native-mmkv"
import { PaycheckTable } from "../../components/PaycheckTable"

const ProjectItem = () => {
	const local = useLocalSearchParams();
	const [currentProject, _] = useMMKVObject(local.id);
	const [tableToggle, setTableToggle] = useState(false);
	const budget = currentProject.budget.reduce((acc, paycheck) => acc + Number(paycheck.amount), 0)
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
	const [inputVisible, setInputVisible] = useState(false);
	const [forEdit, setForEdit] = useState(false);
	const [pickedRow, setPickedRow] = useState(null);

	useEffect(() => {
		const newPrice = currentProject.expenses.reduce((prev, curr) =>  prev += Number(curr.price * curr.amount) ,0)
		setTotalPrice(newPrice)
		console.log(currentProject)
		storage.set(local.id, JSON.stringify(currentProject));
	}, [currentProject.expenses.length, currentProject.budget.length, forEdit])

	return (
		<View style={{...styles.container }}> 
			<TopNavBar projectName={currentProject.title} tableToggle={tableToggle} setTableToggle={setTableToggle}/>
			{
				tableToggle ? <PaycheckTable budget={currentProject.budget} />
				: <Table expenses={currentProject.expenses} setPickedRow={setPickedRow} pickedRow={pickedRow}/>
			}
			<TotalBar totalPrice={totalPrice} budget={budget}/>
			{	
				inputVisible && 
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
			}{
				!inputVisible && 
					<IconsMenu 
						setInputVisible={setInputVisible} 
						inputVisible={inputVisible}	
						pickedRow={pickedRow}
						currentProject={currentProject}
						setPickedRow={setPickedRow}
						setForEdit={setForEdit}
						tableToggle={tableToggle}
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


const IconsMenu = ({setInputVisible, pickedRow, currentProject, setPickedRow, setForEdit, tableToggle}) => {
	const pickedStyles = {
		justifyContent: pickedRow ? 'space-between' : 'center',
	}
	const onAddPress = () => {
		setInputVisible((prevState) => !prevState)
	}

	const onDeletePress = () => {
		const keyToDelete = pickedRow.key
		currentProject.expenses = currentProject.expenses.filter((expense) => expense.key !== keyToDelete);
		setPickedRow(null)
	}

	const onEditPress = () => {
		setForEdit((prev) => !prev)
		setInputVisible((prev) => !prev)
	}

	return (
		<View style={{...styles.buttonsMenu, ...pickedStyles}}>
			{pickedRow &&
				<>
				<Button
					icon="pencil"
					onPress={onEditPress}
					labelStyle={{fontSize: 15, color: 'white'}}
				>Edit</Button>
				<Button
					icon="minus"
					onPress={onDeletePress}
					labelStyle={{fontSize: 15, color: 'white'}}
				>Delete</Button>
				</>
			}
			{!pickedRow &&
				<>
					{
						tableToggle ?
							<Button
								icon="plus"
								onPress={onAddPress}
								labelStyle={{fontSize: 15, color: 'white'}}
							>Add Paycheck</Button>
							:
							<Button
								icon="minus"
								onPress={onAddPress}
								labelStyle={{fontSize: 15, color: 'white'}}
							>Add expense</Button>
					}
				</>
			}
		</View>
	)
}

const TotalBar = ({totalPrice, budget}) => {
	return (
		<View style={styles.totalBar}>
			<ReturnTopicValuePair value={budget} valueColor={'green'}/>
			<ReturnTopicValuePair topic={'-'} value={totalPrice} valueColor={'yellow'}/>
			<ReturnTopicValuePair topic={'='} value={budget - totalPrice} valueColor={'cyan'}/>
		</View>
	)
}

const ReturnTopicValuePair = ({topic, value, valueColor}) => {
  return (
	<>
		<Text 
			variant="headlineSmall"
			style={{
				color: 'white',
				paddingLeft: 20,
				paddingRight: 20,
			}}
		>{topic}</Text>
		<Text 
			variant="headlineSmall"
			style={{
				paddingLeft: 20,
				paddingRight: 20,
				color: valueColor,
			}}
		>{value}</Text>
	</>
  )
}

const ExpenseTextInput = ({expenses, budget, setInputVisible, forEdit, setForEdit, pickedRow, setPickedRow, tableToggle}) => {
	const [input, setInput] = useState(() => {
			if (forEdit) {
				const {type, parameters, amount, price} = pickedRow;
				return `${type},${parameters},${amount},${price}`;
			}
			return ''
	});

	const onChangeText = (something) => {
		setInput(something)
	};

	const onSubmitEditing = ({nativeEvent: {text}}) => {
		const items = text.split(',')
		if (tableToggle) {
			if (!text) return setInputVisible(false);

			budget.push({
				amount: text,
				date: new Date(Date.now()).toLocaleDateString(),
			})
			setInput('')
			setInputVisible(false)
			return;
		};
		if (!forEdit) {
			if (!text) return setInputVisible(false);

			expenses.push({
				key: expenses.at(-1)?.key + 1 || 1,
				type: items[0],
				parameters: items[1],
				amount: items[2],
				price: items[3]
			})
			setInput('')
			setInputVisible(false)
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
			setInputVisible(false)
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

const TopNavBar = ({projectName, tableToggle, setTableToggle}) => {
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
			<Switch value={tableToggle} onValueChange={setTableToggle}/>
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
		backgroundColor: 'black',
		justifyContent: 'space-between'
	},
	totalBar: {
		flexDirection: 'row',
		backgroundColor: 'black',
		justifyContent: 'center',
	},
})


export default ProjectItem;