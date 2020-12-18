import {Controller, Get, PathParams} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";
import {Returns, Status, Summary} from "@tsed/schema";
import {ProductCRUD} from "../services/ProductCRUD";
import {Product} from "../models/product";
import {OfferCtrl} from "./offerCtrl";


@Controller({
    path: "/product",
    children: [OfferCtrl]
})
export class ProductCtrl {
    constructor(private _productService: ProductCRUD) {}

    @Get("/")
    @Summary("Return all Product")
    @(Returns(200, Array).Of(Product))
    async getAllProduct(): Promise<Product[]> {
        return this._productService.findAll();
    }

    @Get("/:id")
    @Summary("Return a Product from his ID")
    @(Status(200, Product).Description("Success"))
    async get(@PathParams("id") id: string): Promise<Product> {
        const product = await this._productService.findById(id);

        if (product) {
            return product;
        }

        throw new NotFound("Product not found");
    }
}
