// import { Inter, Lusitana } from 'next/font/google';
import localFont from 'next/font/local'

export const inter = localFont({
    src:'./Inter/Inter-VariableFont_opsz,wght.ttf'
});

export const lusitana = localFont({
    src:[
        {
            path:'./Lusitana/Lusitana-Regular.ttf',
            weight:'400',
            style:'normal'
        },
        {
            path:'./Lusitana/Lusitana-Bold.ttf',
            weight:'700',
            style:'normal'
        }
    ]
});

// export const inter = Inter({
//     subsets: ['latin'],
//     variable: "--font-inter",
//     display: 'swap',
//     adjustFontFallback: false,
//     preload: false,
// });

// export const lusitana = Lusitana({
//     weight: ['400', '700'],
//     variable: "--font-lusitan",
//     subsets: ['latin'],
//     display: 'swap',
//     adjustFontFallback: false,
//     preload: false,
// });