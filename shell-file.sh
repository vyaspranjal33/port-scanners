#define variables
host="${1}"
firstport="${2}"
lastport="${3}"

#ping a host to see if it is up
function pingup(){
  ping="$(ping -c 1 -w 10 "${host}" | grep bytes | wc -l)"
  if [ "${ping}" -gt "1" ]; then
    echo "${host} is up, now scanning for open ports";
    return 0
  else
    echo "${host} is down, program will close";
    return 1
  fi  
}

#test a port to see if it is open
function portscan(){
  for ((port=${firstport}; port<=${lastport}; port++)); do
    ( echo > "/dev/tcp/${host}/${port}" ) > /dev/null 2>&1 && echo "${port} is open"
  done
}

#run functions
pingup && portscan