import { NextResponse } from "next/server";
import Cookies from "js-cookie";

export default function middleware(req){
    let url = req.url;
    if (url.includes('http://localhost:3000/login/reset/ChangePass')) {   
        if (url.includes('http://localhost:3000/login/reset/ChangePass?token=')) {
        const resetToken = Cookies.get("resetToken")
        if (resetToken == null && resetToken == "") {    
            return NextResponse.redirect("http://localhost:3000/login");
        }
    }else{
            return NextResponse.redirect("http://localhost:3000/login");
    }
    }

    let verify = req.cookies.get("loggedin");
    
    if(!verify && url.includes('/addPost')){
        return NextResponse.redirect("http://localhost:3000/login");
    }

   /* if (url.includes('/login/reset')) {
        if (resetToken) {
            return NextResponse.redirect(`http://localhost:3000/login/reset/ChangePass?token=`+String(resetToken));
        }
    }*/
}