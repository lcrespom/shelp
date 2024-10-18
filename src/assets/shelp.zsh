# Key codes
KB_PAGE_UP="^[[5~"
KB_PAGE_DOWN="^[[6~"
KB_HOME="^[[H"
KB_END="^[[F"

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

# Open shelp popup in the history page
function history_popup() {
    #TODO
    #history -5 | curl -X POST --data-binary @- "localhost:5431/history"
}

# Register the dirhistory function as a widget
zle -N dir_history_popup

# Bind the key to the widget
bindkey $KB_PAGE_DOWN dir_history_popup

# Bind home and end keys for convenience
bindkey $KB_HOME beginning-of-line
bindkey $KB_END end-of-line