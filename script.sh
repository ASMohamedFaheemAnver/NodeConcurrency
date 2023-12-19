# Run me with : ./script.sh
# Permission error then run : chmod +x script.sh

printf "Create a document for concurrent update"
printf "\n####################################################################\n"
curl -X POST http://localhost:3000/create?name=concurrency

printf "Create a document for noobi update"
printf "\n####################################################################\n"
curl -X POST http://localhost:3000/create?name=noob

printf "Testing concurrency safe endpoint"
printf "\n####################################################################\n"
ab -n 10000 -c 100  http://localhost:3000/concurrency?name=concurrency

printf "Testing noob endpoint"
printf "\n####################################################################\n"
ab -n 10000 -c 100  http://localhost:3000/noob?name=noob

printf "Document after safe update"
printf "\n####################################################################\n"
curl http://localhost:3000/get?name=concurrency

printf "Document after noobi update"
printf "\n####################################################################\n"
curl http://localhost:3000/get?name=noob
printf "\n"
