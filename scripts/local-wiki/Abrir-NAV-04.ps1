$ErrorActionPreference = 'Stop'
$root = Join-Path $PSScriptRoot 'AstroXmind'
$files = @{}
Get-ChildItem -LiteralPath $root -File -Recurse | ForEach-Object {
    $path = '/AstroXmind' + $_.FullName.Substring($root.Length).Replace('\', '/')
    $files[$path] = $_.FullName
}
$types = @{
    '.html' = 'text/html; charset=utf-8'; '.css' = 'text/css'; '.js' = 'text/javascript'
    '.json' = 'application/json'; '.svg' = 'image/svg+xml'; '.wasm' = 'application/wasm'
    '.xml' = 'application/xml'; '.png' = 'image/png'; '.woff2' = 'font/woff2'
}
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 0)
$listener.Start()
try {
    $url = "http://127.0.0.1:$($listener.LocalEndpoint.Port)/AstroXmind/navegacion/"
    Write-Host "Abre $url. Deja esta ventana abierta mientras pruebas NAV-04."
    Start-Process $url
    while ($true) {
        $client = $listener.AcceptTcpClient()
        try {
            $client.ReceiveTimeout = 2000
            $client.SendTimeout = 2000
            $stream = $client.GetStream()
            $reader = [System.IO.StreamReader]::new($stream)
            $request = $reader.ReadLine()
            if ($request -notmatch '^(GET|HEAD) (/[^ ]*) HTTP/1\.[01]$') { continue }
            $method = $Matches[1]
            $path = [Uri]::UnescapeDataString(($Matches[2] -split '\?', 2)[0])
            do { $line = $reader.ReadLine() } while ($line)
            if ($path.EndsWith('/')) { $path += 'index.html' }
            $file = $files[$path]
            $status = '404 Not Found'
            $type = 'text/plain'
            $body = [Text.Encoding]::UTF8.GetBytes('Ruta no encontrada')
            if ($file) {
                $status = '200 OK'
                $type = $types[[IO.Path]::GetExtension($file)]
                if (-not $type) { $type = 'application/octet-stream' }
                $body = [IO.File]::ReadAllBytes($file)
            }
            $header = [Text.Encoding]::ASCII.GetBytes("HTTP/1.1 $status`r`nContent-Type: $type`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n")
            $stream.Write($header, 0, $header.Length)
            if ($method -eq 'GET') { $stream.Write($body, 0, $body.Length) }
        } catch [System.IO.IOException] {
            # A navigation can cancel a request while the response is being sent.
        } finally {
            $client.Dispose()
        }
    }
} finally {
    $listener.Stop()
}
