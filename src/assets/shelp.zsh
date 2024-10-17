# Key codes
PAGE_UP="^[[5~"
PAGE_DOWN="^[[6~"

# shelp command server address
POPUP_HOST="localhost:5431"

# Name of the terminal application
TERMAPP=$(osascript -e 'tell application "System Events" to get the name of the first application process whose frontmost is true')

# Record every time the user changes directory
chpwd() {
    curl -s -o /dev/null "127.0.0.1:5431/chpwd?dir=$PWD"
}

# Open shelp popup in the dir history page
function dir_history_popup() {
    new_dir=$(curl -s "$POPUP_HOST/dirHistory")
    if [[ -n "$new_dir" ]]; then
        cd $new_dir
        zle reset-prompt
    fi
    osascript -e "tell application \"$TERMAPP\" to activate"
}

# Register the dirhistory function as a widget
zle -N dir_history_popup

# Bind the key to the widget
bindkey $PAGE_DOWN dir_history_popup