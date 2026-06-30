#!/bin/bash

###############################################
# WebP Smart Compressor
# Ubuntu 25
###############################################

# Folder to scan
# SOURCE="/media/mohindarkumar-v/My-Disk-Projects/VClick/static_site/public/uploads/images/gallery"
SOURCE="/media/mohindarkumar-v/My-Disk-Projects/VClick/images"

# Maximum target size (KB)
MAX_SIZE_KB=600

# Compression settings
START_QUALITY=90
MIN_QUALITY=60
STEP=5

export MAX_SIZE_KB
export START_QUALITY
export MIN_QUALITY
export STEP

compress_file() {

    local file="$1"

    local original_size
    original_size=$(stat -c%s "$file")
    original_kb=$(( (original_size + 1023) / 1024 ))

    echo "------------------------------------------------------------"
    echo "Processing : $file"
    echo "Original   : ${original_kb} KB"

    local temp="${file}.tmp.webp"
    local quality=$START_QUALITY

    while [ "$quality" -ge "$MIN_QUALITY" ]; do

        cwebp \
            -quiet \
            -q "$quality" \
            "$file" \
            -o "$temp"

        new_size=$(stat -c%s "$temp")
        new_kb=$(( (new_size + 1023) / 1024 ))

        echo "Quality ${quality} -> ${new_kb} KB"

        if [ "$new_kb" -lt "$MAX_SIZE_KB" ]; then
            mv -f "$temp" "$file"
            echo "✔ Compressed Successfully (${new_kb} KB)"
            return
        fi

        quality=$((quality - STEP))
    done

    # Couldn't reach target size
    if [ -f "$temp" ]; then
        mv -f "$temp" "$file"
        final_kb=$(( ($(stat -c%s "$file") + 1023) / 1024 ))
        echo "⚠ Minimum quality reached (${MIN_QUALITY})"
        echo "Final Size : ${final_kb} KB"
    fi
}

export -f compress_file

echo "Scanning for WebP images larger than ${MAX_SIZE_KB} KB..."
echo

# Only process files >= MAX_SIZE_KB
find "$SOURCE" -type f -iname "*.webp" -print0 |
while IFS= read -r -d '' file; do

    size=$(stat -c%s "$file")
    size_kb=$(( (size + 1023) / 1024 ))

    if [ "$size_kb" -ge "$MAX_SIZE_KB" ]; then
        printf '%s\0' "$file"
    else
        echo "Skipped (< ${MAX_SIZE_KB} KB): ${size_kb} KB - $file"
    fi

done | parallel -0 -j "$(nproc)" compress_file {}

echo
echo "=================================================="
echo "Compression Completed."
echo "=================================================="