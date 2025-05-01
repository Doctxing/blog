#!/bin/bash

OUT_DIR="./public"

while [[ "$#" -gt 0 ]]; do
    case "$1" in
        -o|--output)
            OUT_DIR="$2"
            shift 2
            ;;
        *)
            echo "Unknown parameter: $1"
            exit 1
            ;;
    esac
done

npx pug ./index.pug -o "$OUT_DIR"

npx terser ./js/*.js -o "$OUT_DIR/js/main.js" -c -m

npx tailwindcss -i ./css/styles.css -o "$OUT_DIR/css/styles.css" --minify

npx uglifycss ./css/fontawesome.css ./css/solid.css ./css/brands.css --output "$OUT_DIR/css/icons.css"
npx uglifycss ./css/markdown.css ./css/code.css --output "$OUT_DIR/css/display.css"

cp -r ./image/ "$OUT_DIR/image"
cp -r ./blogs/ "$OUT_DIR/blogs"
cp ./*.md "$OUT_DIR/"
