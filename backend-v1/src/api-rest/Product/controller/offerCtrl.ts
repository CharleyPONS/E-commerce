import {Controller} from "@tsed/common";
import {ProductRepository} from "../services/product.repository";


@Controller({
    path: "/offer",
})
export class OfferCtrl {
    constructor(private _productService: ProductRepository) {}
}
