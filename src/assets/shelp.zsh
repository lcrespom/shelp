POPUP_HOST="localhost:5431"

PAGE_DOWN="^[[6~"

chpwd() {
    curl -s -o /dev/null "127.0.0.1:5431/chpwd?dir=$PWD"
}

function dir_history_popup() {
    TERMAPP=$(osascript -e 'tell application "System Events" to get the name of the first application process whose frontmost is true')
    new_dir=$(curl -s "$POPUP_HOST/dirHistory")
    if [[ -n "$new_dir" ]]; then
        cd $new_dir
        zle reset-prompt
    fi
    osascript -e "tell application \"$TERMAPP\" to activate"
}

# Register the function as a widget
zle -N dir_history_popup

# Bind the key to the widget
bindkey $PAGE_DOWN dir_history_popup