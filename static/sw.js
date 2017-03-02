let self = this

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open("static").then(function(cache){
      return cache.addAll(["/global.css", "/global.js", "/header", "/footer", "/about?nolayout"])
    })
  )
})

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || stream(event.request) || fetch(event.request)
    })
  )
})

// Stolen/lightly adapted from: https://jakearchibald.com/2016/streams-ftw/
function stream(request) {
  if(!('ReadableStream' in self)) {
    return Promise.resolve(null)
  }

  var responseStream = new ReadableStream({
    start: function(controller) {
      function pushStream(stream) {
        var reader = stream.getReader();

        return reader.read().then(function process(result) {
          if (result.done) return;
          controller.enqueue(result.value);
          return reader.read().then(process);
        });
      }

      let header = caches.match(new Request("/header"))
      let footer = caches.match(new Request("/footer"))
      let content = fetch(request.url+"?nolayout")

      let pushResponse = function(response){ return pushStream(response.body) }

      header.then(pushResponse)
        .then(function(){ return content })
        .then(pushResponse)
        .then(function(){ return footer })
        .then(pushResponse)
        .then(function(){ controller.close() })
    }
  })
  return Promise.resolve(new Response(responseStream))
}
