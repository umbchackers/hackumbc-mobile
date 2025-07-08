export interface User {
    email: string;
    full_name?: string;
    age?: number;
}

export interface QrPayload {
    email_enc: string;
    iv: string;
    tag: string;
    issued_at: string;
    sig: string;
}