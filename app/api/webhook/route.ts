import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req:Request){
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;
    let event:Stripe.Event;

    try{
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    }
    catch(e){
        return new Response("Invalid signature", {status:400});
    }
}