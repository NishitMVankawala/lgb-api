export interface PageRecord {
	slug: string
	title: string
	category: string
	featuredImageUrl?: string
    content: ContentModuleRecord[]
    sortOrder: any
}

export interface ContentModuleRecord {
	module: string
	fields: ContentModuleFieldRecord[]
}

export interface ContentModuleFieldRecord {
	key: string
	label: string
	input: string
	value: string | string[] | number
}

