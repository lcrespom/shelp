POPUP_HOST="localhost:5431"

PAGE_DOWN="^[[6~"

chpwd() {
    curl -s -o /dev/null "127.0.0.1:5431/chpwd?dir=$PWD"
}

function dir_history_popup() {
    new_dir=$(curl -s "$POPUP_HOST/dirHistory")
    if [[ -n "$new_dir" ]]; then
        cd $new_dir
        zle reset-prompt
    fi
}

# Register the function as a widget
zle -N dir_history_popup

# Bind the key to the widget
bindkey $PAGE_DOWN dir_history_popup