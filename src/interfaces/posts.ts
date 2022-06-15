export interface PostRecord {
	user: string
    shortId: string
    body: string
    tags: string[]
    gallery: GalleryRecord[]
    likes: string[]
    comments: CommentRecord[]
    likeCount: number
}
export interface CommentRecord {
	user: string
	body: string
}
export interface GalleryRecord {
	previewUrl: string,
	caption: string,
	fileType: string,
	mimeType: string
}