import {Controller} from "@tsed/common";
import {ProductCRUDService} from "../services/productCRUD.service";


@Controller({
    path: "/offer",
})
export class OfferCtrl {
    constructor(private _productService: ProductCRUDService) {}
}
