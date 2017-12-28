use std::net;
use std::thread;
use std::env;

struct Args {
  from: u16,
  to: u16,
  host: String
}

fn main() {

  let mut args=env::args();

  let from_port : u16 = str_to_int(
    args
      .next()
      .unwrap_or("1".to_owned())
  ) as u16;
  let to_port : u16 = str_to_int(
    args
      .next()
      .unwrap_or("1000".to_owned())
  ) as u16;
  let host = args
    .next()
    .unwrap_or("127.0.0.1".to_string());
  let hostSlice = &host;

  println!("Scanning {} to {} on {}...", from_port, to_port, host);
  let result = (from_port..to_port)
    .map(|port| {
      thread::spawn(move || {
        (port, scan_port(hostSlice, port))
      })
    })
    .map(|handle| {
      handle.join().unwrap()
    })
    .collect::<Vec<_>>()
    .into_iter()
    .filter(|scan| scan.1);

  println!("Open tcp ports on {}:", host);
  for scan in result {
    println!("{}", scan.0);
  }
}

fn scan_port(host: &str, port: u16) -> bool {
  let connection = net::TcpStream::connect((host, port));
  connection.is_ok()
}

fn str_to_int(string: String) -> u64 {
  let mut dec = 0;
  string
    .chars()
    .fold(0, |n, c| {
      n + char_to_int(c) * dec
    })
}

fn char_to_int(c: char) -> u64 {
  match c {
    '0' => 0,
    '1' => 1,
    '2' => 2,
    '3' => 3,
    '4' => 4,
    '5' => 5,
    '6' => 6,
    '7' => 7,
    '8' => 8,
    '9' => 9,
    _ => 0
  }
}