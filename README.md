# Neat JS Implementation
This project is my personal implementation of the Neat AI algorithm in JavaScript. It has a source directory written in TypeScript and utilizes the glMatrix library.

This implementation follows [Neat AI](https://www.youtube.com/@neatai6702)'s [walkthrough](https://www.youtube.com/watch?v=3nbvrrdymF0&list=PLnICFpQDyZRFqjdtcTjshOb1IJqns6h6w) of Kenneth Stanley's Neat algorithm. I previously utilized [Pezzza](https://www.youtube.com/@PezzzasWork)'s [implementation](https://www.youtube.com/watch?v=EvV5Qtp_fYg&t=106s) of the layer calculation for each node since I quite liked it, but in favor of optimization that code has been redone.

This project is available for anyone to look at, use, and modify however they choose. It will undergo numerous changes so be sure to check back every once in a while if it seems like I'm still here. :)

There are demo pages available through the navigation site which feature some usage of the Neat algorithm as well as some other pieces that will be incorporated later.

## Installing
There's 2 scripts included in the package.json, `generateDocs` and `build`. You will need to run `npm run-script build` in order to generate all the JavaScript used in the project. You should also run `npm run-script generateDocs` if you plan on looking at the documentation through the navigator site, rather than the source code.

## Contributing
This project uses TypeDoc for documentation. If you want to contribute documentation, make sure to run `npm install` in the root diretory.