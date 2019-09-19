package main

import (
    "log"
    "net/http"
)

func main() {

    http.Handle("/", http.FileServer(http.Dir("./public")))

    log.Println("Starting Server...")
    log.Fatal(http.ListenAndServe(":80", nil))
}