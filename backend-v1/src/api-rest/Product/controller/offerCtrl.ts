import {Controller} from "@tsed/common";
import {ProductCRUDService} from "../services/ProductCRUD.service";


@Controller({
    path: "/offer",
})
export class OfferCtrl {
    constructor(private _productService: ProductCRUDService) {}
}
