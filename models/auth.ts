import { firestore } from "lib/firestore";
import isAfter from "date-fns/isAfter";

const collection: FirebaseFirestore.CollectionReference = firestore.collection("auth");

export class Auth {
    ref: FirebaseFirestore.DocumentReference;
    id: string;
    data: any;

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
        this.setData(snap.data());
    };

    async pushData() {
        /* Modifica la data de la base de datos con la data de la instancia actual */
        await this.ref.update(this.data);
    };

    isCodeExpired() {
        /* Verifica si el código guardado en la data de la instancia está expirado */
        if (this.data.expires) {
            /* Usa la función "isAfter" que devuelve un boolean */
            return isAfter(new Date(), this.data.expires.toDate());
        } else {
            /* Si no tiene código guardado devuelve el error correspondiente */
            throw "No tiene fecha de expiración.";
        };
    };

    async invalidateCode() {
        /* Modifica la data de la instancia para que se invalide el código */
        this.setData({
            code: null,
            expires: new Date()
        });

        /* Envía la data modificada a la base de datos */
        this.pushData();
    };

    static async findByEmail(email: string) {
        try {
            /* Modifica el email recibido para poder usarlo correctamente */
            const cleanEmail = email.trim().toLowerCase();

            /* Obitene el email de la base de datos que coincida con el email pasado */
            const results = await collection.where("email", "==", cleanEmail).get();

            /* Verifica si el email existe en la base de datos */
            if (results.docs.length) {
                /* Si existe lo obtiene */
                const first = results.docs[0];

                /* Crea un nueva instancia de la clase Auth */
                const newAuth = new Auth(first.id);

                /* Modifica la data de la instancia con la data de la base de datos */
                newAuth.setData(first.data());

                /* Retorna la información del auth */
                return newAuth;
            } else {
                /* Si no existe retorna null para manejar el error correctamente */
                return null;
            };
        } catch (error) {
            throw error;
        };
    };

    static async createAuth(data) {
        /* Crea un nuevo documento en Firebase */
        const newAuthSnap = await collection.add(data);

        /* Crea una nueva instancia de la clase Auth con el id del documento creado */
        const newAuth = new Auth(newAuthSnap.id);

        /* Modifica la data de la instancia con la data recibida*/
        newAuth.setData(data);

        /* Retorna la información del auth creado */
        return newAuth;
    };

    static async findByEmailAndCode(email: string, code: string) {
        try {
            /* Modifica el email recibido para poder usarlo correctamente */
            const cleanEmail = email.trim().toLowerCase();

            /* Obtiene el documento de Firebase que coincida con el email y el código recibido */
            const results = await collection.where("email", "==", cleanEmail).where("code", "==", code).get();

            /* Verifica si el auth existe en la base de datos */
            if (results.empty) {
                /* Si no existe retorna null para manejar el error correctamente */
                return null;
            } else {
                /* Si existe lo obtiene */
                const doc = results.docs[0];

                /* Crea una nueva instancia de la clase Auth */
                const auth = new Auth(doc.id);

                /* Modifica la data de la instancia con la data de la base de datos */
                auth.setData(doc.data());

                /* Retorna la información del auth creado */
                return auth;
            };
        } catch (error) {
            throw error;
        };
    };
};