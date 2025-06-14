"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/globals.css";
import {ReactNode} from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_API_KEY

    return (
        <html lang="en">
        <head>
            <script
                type="text/javascript"
                src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false&libraries=services`}
                defer
            ></script>
            <title>spotLight</title>
        </head>
        <body>
          <main>{children}</main>
        </body>
        </html>
  );
};

export default RootLayout;
