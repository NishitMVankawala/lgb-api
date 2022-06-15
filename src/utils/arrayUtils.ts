const excludeKeys = ['avatarUrl', 'fullName', 'displayName', '_id', 'preferredLanguage']

export const getStringArrayList = (object: any, prefix: string) => {
	const stringArrayList = []
	if (!object) return stringArrayList

	let keys = Object.keys(object)
	keys = keys.filter(k => typeof object[k] === 'object' && excludeKeys.indexOf(k) === -1)
	keys.map(k => isStringArray(object[k]) ? stringArrayList.push({key: prefix + k, value: object[k]}) :
		[...stringArrayList, ...getStringArrayList(object[k], prefix + k + '_')])
	
	return stringArrayList
}

export const isStringArray = (object: any) => {
	let isIt: boolean
	
	isIt = object && Array.isArray(object) && object.length > 0 && typeof object[0] === 'string' && object[0] !== ''
	
	return isIt
}