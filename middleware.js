import { NextResponse } from "next/server";

export default function middleware(req){
    let verify = req.cookies.get("loggedin");
    let url = req.url
    
    if(!verify && url.includes('/addPost')){
        return NextResponse.redirect("http://localhost:3000/login");
    }

}