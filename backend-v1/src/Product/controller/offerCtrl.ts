import {Controller} from "@tsed/common";
import {ProductService} from "../services/ProductService";


@Controller({
    path: "/offer",
})
export class OfferCtrl {
    constructor(private _productService: ProductService) {}
}
