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

    static async createUser(data) {
        /* Crea un documento en Firebase con la data recibida */
        const newUserSnap = await collection.add(data);

        /* Crea una nueva instancia de la clase Order con el id del documento creado */
        const newUser = new User(newUserSnap.id);

        /* Modifica la data de la instancia con la data recibida */
        newUser.data = data;

        /* Retorna la información de la órden creada */
        return newUser;
    };

    static async getOneUser(userId) {
        /* Obtengo un solo usuario de la base de datos que coincida con el id recibido */
        const userData = await collection.doc(userId).get();

        /* Verifico que el usuario con ese id existe */
        if (userData.exists) {
            /* Si existe lo retorno */
            return userData;
        } else {
            /* Si no existe, retorno null para manejar el error correctamente */
            return null;
        };
    };
};