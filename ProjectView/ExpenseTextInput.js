import { useState } from 'react';
import { TextInput } from 'react-native-paper';

export const ExpenseTextInput = ({
    expenses,
    budget,
    setInputVisible,
    forEdit,
    setForEdit,
    pickedRow,
    setPickedRow,
    tableToggle,
}) => {
    const [input, setInput] = useState(() => {
        if (forEdit) {
            const { type, parameters, amount, price } = pickedRow;
            return `${type},${parameters},${amount},${price}`;
        }
        return '';
    });

    const onChangeText = (something) => {
        setInput(something);
    };

    const onSubmitEditing = ({ nativeEvent: { text } }) => {
        const items = text.split(',');
        if (tableToggle) {
            if (!text) return setInputVisible(false);

            budget.push({
                amount: text,
                date: new Date(Date.now()).toLocaleDateString(),
            });
            setInput('');
            setInputVisible(false);
            return;
        }
        if (!forEdit) {
            if (!text) return setInputVisible(false);

            expenses.push({
                key: expenses.at(-1)?.key + 1 || 1,
                type: items[0],
                parameters: items[1],
                amount: items[2],
                price: items[3],
            });
            setInput('');
            setInputVisible(false);
        } else {
            expenses[pickedRow.index] = {
                key: expenses[pickedRow.index].key,
                type: items[0],
                parameters: items[1],
                amount: items[2],
                price: items[3],
            };

            setInput('');
            setForEdit(false);
            setInputVisible(false);
            setPickedRow(null);
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
    );
};
