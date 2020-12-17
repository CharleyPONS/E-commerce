import * as firebaseAdmin from 'firebase-admin';
import {WinstonLogger} from "./winston-logger";
import { join } from 'path';

export default class Firebase {
    private static database: any;

    /**
     * Initialize firebase connection. Initialized only once
     */
    // static connect(
    //     credentials: any = process.env.FIREBASE_CREDENTIALS,
    //     url: any = process.env.FIREBASE_URL || ''
    // ) {
    //     if (!firebaseAdmin.apps.length) {
    //         new WinstonLogger().logger().info(`Establishing Firebase connexion Credential: ${credentials} Database URL: ${url}`);
    //         this.database = firebaseAdmin.initializeApp({
    //             credential: firebaseAdmin.credential.cert(join(process.cwd(), credentials)),
    //             databaseURL: url
    //         });
    //     }
    //     // @ts-ignore
    //     new WinstonLogger().logger().info(`Connected to Firebase ${firebaseAdmin.apps[0].name}`);
    //     return firebaseAdmin.apps[0];
    // }
    //
    // /**
    //  * Close the firebase connection
    //  */
    // static closeConnection() {
    //     if (firebaseAdmin.database()) {
    //         firebaseAdmin.database().goOffline();
    //     }
    // }
}
