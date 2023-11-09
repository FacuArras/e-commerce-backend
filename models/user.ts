import { firestore } from "lib/firestore";

const collection: FirebaseFirestore.CollectionReference = firestore.collection("users");

export class User {
    ref: FirebaseFirestore.DocumentReference;
    data: {};
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

    static async createUser(data) {
        const newUserSnap = await collection.add(data);
        const newUser = new User(newUserSnap.id);
        newUser.data = data;
        return newUser;
    };

    static async getOneUser(userId) {
        const userData = await collection.doc(userId).get();

        if (userData.exists) {
            return userData;
        } else {
            return null;
        };
    };
};