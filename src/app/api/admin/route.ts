import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(req : NextRequest , res : NextResponse){
    try{
        const {email , password} = await req.json();

        if(!email || !password){
            return NextResponse.json({message:'email or password is require'});
        }

        if(email == process.env.ADMIN){
            if(password == process.env.PASSWORD){
                return NextResponse.json({ code : "458-965-778-669-887" })
            }
        }

        return NextResponse.json({message: ''})

    }
    catch(err){
        console.log(err);
    }
}