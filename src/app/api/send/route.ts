import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


export async function POST(req : NextRequest , res :NextResponse){
    try{
     const {code , day , url , title} = await req.json();


     if(!code){
        return NextResponse.json({message:'unthrezed'})
     }

     if(code){
        if(code == process.env.CODE){
            await db.vedio.create({
                data : {
                    url :url,
                    search : title,
            }
        })
        return NextResponse.json({message:'code is error'})

        } else {
            return NextResponse.json({message:'code is error'})
        }
     }

     return NextResponse.json({message:'code is error'})

    }
    catch(err){
        console.log(err);
    }
    finally{
        await db.$disconnect();
    }
}
