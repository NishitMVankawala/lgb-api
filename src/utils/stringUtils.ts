export const trimAll = (arrayToTrim: string[]) => {
	return arrayToTrim.map(a => trimString(a))
}

export const trimString = (subject: string) => {
	return subject ? subject.replace(/^\s\s*/, '').replace(/\s\s*$/, '') : ''
}

export const capitalize = (subject) => {
	return subject.charAt(0).toUpperCase() + subject.slice(1)
}

export const slugify = (subject) => {
	return subject.toString()
		.toLowerCase()
		.replace(/\s+/g, '-')           // Replace spaces with -
		.replace(/[^\w\-]+/g, '')       // Remove all non-word chars
		.replace(/\-\-+/g, '-')         // Replace multiple - with single -
		.replace(/^-+/, '')             // Trim - from start of text
		.replace(/-+$/, '')             // Trim - from end of text
}

export const unslugify = (subject: string) => {
	subject = subject.replace(/_/g, '-')
	subject = subject.replace(/--/g, '-')

	const list = []

	subject.split('-').map(slug => {
		list.push(slug.substr(0, 1).toUpperCase() + slug.substr(1))
	})

	return list.join(' ')
}

export const filterObject = (subject, keys) => {
	const matchingKeys = Object.keys(subject).filter(k => keys.indexOf(k) !== -1)
	const matchingObject = {}
	matchingKeys.map(mk => matchingObject[mk] = subject[mk])

	return matchingObject
}

export const sanitizeQuery = (query: string) => {
	const map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#x27;',
		"/": '&#x2F;',
	}

	const reg = /[&<>"'/]/ig

	return query.trim().replace(reg, (match)=>(map[match]))
}