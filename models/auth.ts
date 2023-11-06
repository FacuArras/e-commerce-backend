import { firestore } from "lib/firestore";
import isAfter from "date-fns/isAfter";

const collection: FirebaseFirestore.CollectionReference = firestore.collection("auth");

export class Auth {
    ref: FirebaseFirestore.DocumentReference;
    data: any;
    id: string;

    constructor(id: string) {
        this.id = id;
        this.ref = collection.doc(id);
    };

    setData(data) {
        this.data = data;
    };

    async getData() {
        const snap = await this.ref.get();
        this.data = snap.data();
    };

    async pushData() {
        await this.ref.update(this.data);
    };

    isCodeExpired() {
        if (this.data.expires) {
            return isAfter(new Date(), this.data.expires.toDate());
        } else {
            throw "No tiene fecha de expiración.";
        };
    };

    async invalidateCode() {
        this.setData({
            code: null,
            expires: new Date()
        });

        this.pushData();
    };

    static async findByEmail(email: string) {
        const cleanEmail = email.trim().toLowerCase();
        const results = await collection.where("email", "==", cleanEmail).get();

        if (results.docs.length) {
            const first = results.docs[0];
            const newAuth = new Auth(first.id);
            newAuth.data = first.data();
            return newAuth;
        } else {
            return null;
        };
    };

    static async createAuth(data) {
        const newAuthSnap = await collection.add(data);
        const newAuth = new Auth(newAuthSnap.id);
        newAuth.data = data;
        return newAuth;
    };

    static async findByEmailAndCode(email: string, code: string) {
        const cleanEmail = email.trim().toLowerCase();
        const results = await collection.where("email", "==", cleanEmail).where("code", "==", code).get();

        if (results.empty) {
            return null;
        } else {
            const doc = results.docs[0];
            const auth = new Auth(doc.id);

            auth.setData(doc.data());

            return auth;
        };
    };
};