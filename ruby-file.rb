require 'celluloid'
require 'socket'

class ScanPort
  include Celluloid

  def initialize(port, host)
    @port = port
    @host = host
  end

  def run
    begin
      sock = Socket.new(:INET, :STREAM)
      raw = Socket.sockaddr_in(@port, @host)

    puts "#{@port} open." if sock.connect(raw)

    rescue
      if sock != nil
        sock.close
      end
    end

  end
end

def main
  host = ARGV[0]
  start_port = ARGV[1].to_i
  end_port = ARGV[2].to_i

  until start_port == end_port do
    sp = ScanPort.new start_port, host
    sp.async.run

    start_port += 1
  end
end

main