import {Service} from "@tsed/di";
import {Stripe} from "stripe";
@Service()
export class StripePaymentService{
    constructor(){}
    async main(){
        const stripe = new Stripe()
    }
}
