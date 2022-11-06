module.exports = function generate(ast) {
	let result = ''
	ast.forEach(node => {
		let value = node.value
		if(Array.isArray(value)) {
			value = generate(node.value)
		} 
		switch (node.type) {
			case 'p':
			result += `<p>${value}</p>`
			break;
		case 'h1':
			result += `<h1>${value}</h1>`
			break;
		case 'h2':
			result += `<h2>${value}</h2>`
			break;
		case 'strong':
			result += `<strong>${value}</strong>`
			break;
		default:
			result += value
			break;
		}
	});
	return result
}
