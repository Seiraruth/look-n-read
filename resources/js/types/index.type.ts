export interface ComicsType {
    id: number;
    title: string;
    slug: string;
    author: string;
    status: string;
    type: string;
    synopsis: string;
    cover_image: string;
    image_url: string;
    created_at: Date | string;
    updated_at: Date | string;
    deleted_at: Date | string | null;
}
