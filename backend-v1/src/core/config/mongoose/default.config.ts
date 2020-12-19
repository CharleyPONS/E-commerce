import {IdDb} from "../../models/enum/id-db.enum";

export default {
  id: IdDb.SHOP_DATABASE,
  url: process.env.CLUSTER_URL || '',
  connectionOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
};
