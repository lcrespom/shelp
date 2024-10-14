chpwd() {
    curl -s -o /dev/null "127.0.0.1:5431/chpwd?dir=$PWD"
}
