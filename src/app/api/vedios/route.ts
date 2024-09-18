import { db } from "@/lib/db";
import { NextResponse , NextRequest } from "next/server";

export async function GET(req : NextRequest , res : NextResponse){
    try{
        const vedios = await db.vedio.findMany({});

        return NextResponse.json(vedios)

    }
    catch(err){
        console.log(err);
    }
    finally{
        await db.$disconnect();
    }
}