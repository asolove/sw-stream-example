# Service Worker Stream Example

## What is this?

A very simple site built so I can work through using the new [Streams API](http://streams.spec.whatwg.org)
with a [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) to cache a static site.

## How does it work?

This very simple site has a layout with a header, then per-page content, and then a footer. The server responds
to normal requests (to / and /about) with a fully-rendered page. But it will also respond to /header, /footer with
their partial contents, and to page paths with the `nolayout` query parameter added with just the page content
without header or footer.

On first request, the browser gets a full page and the service worker is registered. It caches the header and footer
partials as well as global static assets. On subsequent navigations, the service worker interrupts the request and
begins streaming a response, with the header immediately, the body content as soon as the server responds, and then
the footer.

## Ok, I can think of a bunch of problems with that

Me too! That's what this small example is for, to work through them.

- [X] We won't know the title until we get the body content. (Fixed: add inline js to the body content to set the title.)
- [ ] What about per-page CSS and JS? (Working on this. Presumably you just add them to the inline js in the partial page layout.)
- [ ] What about http2 server push? (Thinking about this. You can't push all global assets all the time, because many browsers that don't support SW & Streams will get pushed things they already have cached. I think the answer is to not push for full page requests, but to push page-specific assets on requests for a page partial.)

Really optimizing the offline experience is going to be even harder. The app shell pattern makes it reasonably easy to
figure out what to pre-cache and what to show when offline. How does that work for a content site?
Imagine we were building an offline experience for the Wikipedia site. How would that work? My first thoughts:

- Cache top-level navigation pages so top-level menus work.
- Cache the last N pages visited by the user.
- When showing content offline, style links differently depending on whether they are available for offline reading.
- Possibly give the user control over cacheing? Like "save every page linked to from the current one" for offline research preparation?
- Intercept requests to site search and try to fulfill them by searching locally-cached content
- When serving an unavailable page when offline, provide the local search and a list of cached articles

