const projects = Array.from({length: 6}, () => {
	return {
		id: Math.random().toString(36),
		title: 'Project'
	}
});

const projectFull = {}

projects.forEach(({id, title}) => {
	projectFull[id] = {
		title
	}
})

export {
	projects,
	projectFull,
}