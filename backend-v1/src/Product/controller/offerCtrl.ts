import {Controller} from "@tsed/common";
import {ProductCRUD} from "../services/ProductCRUD";


@Controller({
    path: "/offer",
})
export class OfferCtrl {
    constructor(private _productService: ProductCRUD) {}
}
