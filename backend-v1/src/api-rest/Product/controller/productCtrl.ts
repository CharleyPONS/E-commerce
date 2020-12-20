import {Controller, Get, PathParams} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";
import {Returns, Summary} from "@tsed/schema";
import {ProductRepository} from "../services/product.repository";
import {ProductModel} from "../models/product.model";
import {OfferCtrl} from "./offerCtrl";


@Controller({
    path: "/product",
    children: [OfferCtrl]
})
export class ProductCtrl {
    constructor(private _productRepository: ProductRepository) {}

    @Get("/")
    @Summary("Return all Product")
    @(Returns(200, Array).Of(ProductModel))
    async getAllProduct(): Promise<ProductModel[]> {
        return this._productRepository.findAll();
    }

    @Get("/:id")
    @Summary("Return a Product from his ID")
    @(Returns(200).Description("Success"))
    async getProduct(@PathParams("id") id: string): Promise<ProductModel> {
        const product = await this._productRepository.findById(id);
        if (product) {
            return product;
        }

        throw new NotFound("Product not found");
    }
}
