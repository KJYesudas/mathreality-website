require 'socket'

PORT = 8080
server = TCPServer.new('127.0.0.1', PORT)
puts "MATHREALITY Server active on http://localhost:#{PORT}"

MIME_TYPES = {
  '.html' => 'text/html; charset=utf-8',
  '.css'  => 'text/css; charset=utf-8',
  '.js'   => 'application/javascript; charset=utf-8',
  '.mjs'  => 'application/javascript; charset=utf-8',
  '.svg'  => 'image/svg+xml',
  '.png'  => 'image/png',
  '.jpg'  => 'image/jpeg',
  '.jpeg' => 'image/jpeg',
  '.json' => 'application/json',
  '.ico'  => 'image/x-icon'
}

loop do
  Thread.new(server.accept) do |client|
    begin
      request_line = client.gets
      if request_line
        method, full_path, _ = request_line.split
        clean_path = full_path.to_s.split('?').first
        clean_path = '/index.html' if clean_path == '/' || clean_path.empty?

        # Prevent directory traversal
        target_path = File.expand_path(File.join(Dir.pwd, clean_path))
        
        if target_path.start_with?(Dir.pwd) && File.file?(target_path)
          ext = File.extname(target_path).downcase
          content_type = MIME_TYPES[ext] || 'application/octet-stream'
          content = File.binread(target_path)

          client.print "HTTP/1.1 200 OK\r\n"
          client.print "Content-Type: #{content_type}\r\n"
          client.print "Content-Length: #{content.bytesize}\r\n"
          client.print "Access-Control-Allow-Origin: *\r\n"
          client.print "Cache-Control: no-cache\r\n"
          client.print "Connection: close\r\n\r\n"
          client.write content
        else
          not_found = "404 Not Found"
          client.print "HTTP/1.1 404 Not Found\r\n"
          client.print "Content-Type: text/plain\r\n"
          client.print "Content-Length: #{not_found.bytesize}\r\n"
          client.print "Connection: close\r\n\r\n"
          client.print not_found
        end
      end
    rescue => e
      # Log error and ensure socket closes
    ensure
      client.close rescue nil
    end
  end
end
