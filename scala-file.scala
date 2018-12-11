// Parallel port scanner using parallel collections (just for the side-effect)
// @author = @loverdos

(1 to 65536).par.map { case port ⇒
  try {
    val socket = new java.net.Socket("127.0.0.1", port)
    socket.close()
    println(port)
    port
  } catch {
    case _: Throwable ⇒ -1
  }
}.toSet
