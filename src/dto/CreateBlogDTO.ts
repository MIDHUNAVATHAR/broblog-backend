export interface CreateBlogDTO {
    title: string;
    content: string;
    image?: string;
    imagePublicId?: string;
    readingTime?: string;
    authorId: string;
}
