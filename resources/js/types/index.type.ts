import React from "react";

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

export interface IChildren {
    children: React.ReactNode;
}

export interface IComic {
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

export interface IChapter {
    id: number;
    comic_id?: number;
    title: string;
    slug: string;
    number: string;
    created_at: Date | string | undefined;
    updated_at: Date | string | undefined;
    published_at?: Date | string | null;
}

export interface IGenre {
    id: number;
    name: string;
}
