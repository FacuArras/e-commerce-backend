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
        /* Modifica la data de la instancia actual con la data recibida */
        this.data = data;
    };

    async getData() {
        /* Obtiene la data de la base de datos */
        const snap = await this.ref.get();

        /* Modifica la data de la instancia con la data de la base de datos */
        this.data = snap.data();
    };

    async pushData() {
        /* Modifica la data de la base de datos con la data de la instancia actual */
        await this.ref.update(this.data);
    };

    static async createNewOrder(data) {
        /* Crea un documento en Firebase con la data recibida */
        const newOrderSnap = await collection.add(data);

        /* Crea una nueva instancia de la clase Order con el id del documento creado */
        const newOrder = new Order(newOrderSnap.id);

        /* Modifica la data de la instancia con la data recibida */
        newOrder.setData(data);

        /* Retorna la información de la órden creada */
        return newOrder;
    };

    static async getOrdersFromUser(userId) {
        /* Obtengo las órdendes de Firebase de el usuario que coincida con el id recibido */
        const orders = await collection.where("userId", "==", userId).get();

        /* Verifico si el usuario tiene órdenes creadas */
        if (orders.docs.length) {
            /* Si tiene las retorno */
            return orders;
        } else {
            /* Si no tiene, retorno null para manejar el error correctamente */
            return null;
        };
    };

    static async getOneOrder(orderId) {
        /* Obtengo una sola órden de la base de datos que coincida con el id recibido */
        const orders = await collection.doc(orderId).get();

        /* Verifico si la órden con ese id existe */
        if (orders.exists) {
            /* Si existe la retorno */
            return orders;
        } else {
            /* Si no existe, retorno null para manejar el error correctamente */
            return null;
        };
    };
};