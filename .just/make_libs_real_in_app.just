[script('bash')]
make_libs_real_in_app app:
    set -e
    find "{{ app }}" -type l | while read link; do
        src=$(readlink "$link")
        rm "$link"
        cp -r "$src" "$link"
        echo "Replaced symlink $link with copy from $src"
    done
