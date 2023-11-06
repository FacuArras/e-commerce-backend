import { firestore } from "lib/firestore";

const collection: FirebaseFirestore.CollectionReference = firestore.collection("orders");

export class Order {
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

    static async createNewOrder(data) {
        const newOrderSnap = await collection.add(data);
        const newOrder = new Order(newOrderSnap.id);
        newOrder.data = data;
        return newOrder;
    };

    static async getOrdersFromUser(userId) {
        const orders = await collection.where("userId", "==", userId).get();

        if (orders.docs.length) {
            return orders;
        } else {
            return null;
        };
    };

    static async getOneOrder(orderId) {
        const orders = await collection.doc(orderId).get();

        if (orders.exists) {
            return orders;
        } else {
            return null;
        };
    };
};