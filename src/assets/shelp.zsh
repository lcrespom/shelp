# ------------------------- Configuration -------------------------
# HTTP port used by Shelp to listen to commands
SHELP_PORT=5431
# Full Shelp command server address
SHELP_HOST="localhost:$SHELP_PORT"

# Set to true if you want the Shelp popup always on top when visible
SHELP_ALWAYS_ON_TOP=true

# By default, Shelp applies the system theme. You can manually force "light" or "dark" theme.
# SHELP_THEME="dark"

# Shelp window size, in width x height.
SHELP_WINDOW_SIZE="800x600"
# Shelp window position. Positive numbers refer to the top left corner, negative numbers to the bottom right.
SHELP_WINDOW_POS="100 100"

# Maximun number of history lines to get from zsh. Duplicates are removed, so the history popup will probably
# have fewer entries.
SHELP_MAX_HISTORY_LINES=500
# ------------------------- Configuration end -------------------------

# URL-encode any text
function url_encode() {
    python3 -c "import urllib.parse; print(urllib.parse.quote('$1'))"
}

# Record every time the user changes directory
function chpwd() {
    local enc_dir=$(url_encode $PWD)
    curl -s -o /dev/null "$SHELP_HOST/chpwd?dir=$enc_dir"
}

# Open shelp popup in the dir history page
function dir_history_popup() {
    local new_dir=$(curl -s "$SHELP_HOST/dirHistory?pwd=$PWD&home=$HOME")
    if [[ -n "$new_dir" ]]; then
        echo
        cd $new_dir
        zle reset-prompt
    fi
}

# Open shelp popup in the history page
function history_popup() {
    local enc_buffer=$(url_encode $BUFFER)
    local history_command=$(history -n -$SHELP_MAX_HISTORY_LINES | \
        curl -s -X POST --data-binary @- "$SHELP_HOST/history?filter=$enc_buffer")
    [[ -n "$history_command" ]] && LBUFFER="$history_command" && RBUFFER=""
}

# Open shelp popup in the file search page
function file_search_popup() {
    local enc_query="filter=$(url_encode $LBUFFER)&pwd=$(url_encode $PWD)"
    local search_out=$(curl -s "$SHELP_HOST/filesearch?$enc_query")
    [[ -n "$search_out" ]] && LBUFFER=$search_out
}

# Just move one directory up
function cd_to_parent_dir() {
    echo
    cd ..
    zle reset-prompt
}

# Clear the whole line
function clear_line() {
    LBUFFER=""
    RBUFFER=""
}

# Register the functions as widgets
zle -N dir_history_popup
zle -N history_popup
zle -N file_search_popup
zle -N cd_to_parent_dir
zle -N clear_line

# Key codes
KB_PAGE_UP="^[[5~"
KB_PAGE_DOWN="^[[6~"
KB_HOME="^[[H"
KB_SHIFT_UP="^[[1;2A"
KB_SHIFT_RIGHT="^[[1;2C"
KB_END="^[[F"
KB_TAB="^I"
KB_ESC="\e"
KB_OPTION_LEFT="^[^[[D"
KB_OPTION_RIGHT="^[^[[C"

# Bind the activation keys to the widgets
bindkey $KB_PAGE_DOWN dir_history_popup
bindkey $KB_PAGE_UP history_popup
bindkey $KB_SHIFT_RIGHT file_search_popup
bindkey $KB_SHIFT_UP cd_to_parent_dir
bindkey $KB_ESC clear_line

# Bind home, end, opt+left and opt+right keys for convenience
bindkey $KB_HOME beginning-of-line
bindkey $KB_END end-of-line
bindkey $KB_OPTION_LEFT backward-word
bindkey $KB_OPTION_RIGHT forward-word

# Disable default tab completion
# unsetopt complete_in_word

# Reduce key sequence timeout to only 100ms to make ESC key react faster
KEYTIMEOUT=10