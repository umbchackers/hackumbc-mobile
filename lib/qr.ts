import { createApi } from "./api";
import { QrPayload } from "@/types";

const decrypt = (payload: QrPayload) => {
    const email = payload.email_enc;
    // TODO implement Lambda for decryption ...
    return email;
};

export { decrypt };