export const validateProjectData = ({title, budget, address}) => {
	const errors = {};
	if (!title) {
		errors.title = 'Should not be empty!';
	}
	if (isNaN(budget)) {
		errors.budget = 'Should be a number!';
	}
	if (!address) {
		errors.address = 'Should not be empty!';
	}
	return errors;
}