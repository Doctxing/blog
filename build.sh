#!/bin/bash
set -euo pipefail

# 默认输出目录
OUT_DIR="./public"
BLOG_DIR="./blogs"
BLOG_OUT="$OUT_DIR/blogs"
BLOG_INDEX="$BLOG_OUT/README.md"

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case "$1" in
        -o|--output)
            OUT_DIR="$2"
            BLOG_OUT="$OUT_DIR/blogs"
            BLOG_INDEX="$BLOG_OUT/README.md"
            shift 2
            ;;
        *)
            echo "❌ Unknown parameter: $1"
            exit 1
            ;;
    esac
done

echo "🚧 编译 Pug 模板..."
npx pug ./index.pug -o "$OUT_DIR"

echo "🚧 压缩 JavaScript..."
npx terser ./js/*.js -o "$OUT_DIR/js/main.js" -c -m

echo "🚧 构建 TailwindCSS..."
npx tailwindcss -i ./css/styles.css -o "$OUT_DIR/css/styles.css" --minify

echo "🚧 压缩附加 CSS..."
npx uglifycss ./css/fontawesome.css ./css/solid.css ./css/brands.css --output "$OUT_DIR/css/icons.css"
npx uglifycss ./css/markdown.css ./css/code.css --output "$OUT_DIR/css/display.css"

echo "🚧 复制静态资源..."
cp -r ./image/ "$OUT_DIR/image"
cp -r ./blogs/. "$BLOG_OUT/"
find "$BLOG_OUT" -type f -name info -delete
cp ./*.md "$OUT_DIR/"

echo "🚧 生成索引 README.md..."
printf "# Blog 归档\n\n" > "$BLOG_INDEX"
declare -a entries

for dir in "$BLOG_DIR"/*/; do
    info_file="${dir}info"
    [[ -f "$info_file" ]] || continue

    title=$(grep '^title:' "$info_file" | sed 's/^title:[[:space:]]*//')
    date=$(grep '^date:' "$info_file" | sed 's/^date:[[:space:]]*//')
    cover=$(grep '^cover:' "$info_file" | sed 's/^cover:[[:space:]]*//' || true)
    slug=$(basename "$dir")
    entries+=("$date|$title|$slug|$cover")
done

for line in $(printf "%s\n" "${entries[@]}" | sort -r); do
    IFS='|' read -r date title slug cover <<< "$line"
    if [[ -n "$cover" ]]; then
        cover_path="./blogs/$slug/$cover"
    else
        cover_path="./image/fractal-mka.jpeg"
    fi
    printf -- "- title: %s\n  date: %s\n  link: #/blogs/%s/\n  cover: %s\n\n" "$title" "$date" "$slug" "$cover_path" >> "$BLOG_INDEX"
done

echo "✅ 构建完成，输出目录：$OUT_DIR"