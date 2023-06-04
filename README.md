# Log watching
* implemented a log watching solution (similar to the tail -f command in UNIX)
* A server side program to monitor the given log file and capable of streaming updates that happen in it. This will run on the same machine as the log file.
* A web based client (accessible via URL) that prints the updates in the file as and when they happen and NOT upon page refresh. The page should be loaded once and it should keep getting updated in real-time. The user sees the last 10 lines in the file when he lands on the page.