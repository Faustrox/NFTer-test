declare namespace App.Data {
    export type NftData = {
        userId: string;
        token: string;
        title: string;
        imageUrl: string;
        thumbnailUrl: string;
        collectionName: string;
        collectionImage: string | null;
        externalUrl: string | null;
    };
    export type UserData = {
        email: string;
        name: string;
        email_verified_at: string | null;
    };
}
