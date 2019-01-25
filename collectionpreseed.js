#!/usr/bin/env node
//global.window = {}; // Target for things like window.onpopstate in Nav.js
// noinspection JSUnresolvedVariable

// NOTE THERE WAS A VERSION OF THIS USING ParralelStream WHICH WAS OBSOLETED EARLY JAN 2018.

// Enable a LOT of debugging as want to watch to diagnose failures.
// noinspection JSUnresolvedVariable
process.env.DEBUG="dweb-transports dweb-transports:* dweb-mirror:* parallel-streams:* dweb-objects dweb-objects:* dweb-mirror:HashStore";  // Get highest level debugging of these two libraries, must be before require(dweb-transports)
// TODO-MIRROR check using GUN for metadata

// noinspection JSUnusedLocalSymbols
const debug = require('debug')("dweb-mirror:test");
// Other IA repos
global.DwebTransports = require('@internetarchive/dweb-transports');
global.DwebObjects = require('@internetarchive/dweb-objects'); //Includes initializing support for names

//This Repo
// Load the patches to each of the classes so they cache - MirrorCache should do this, but just in case ...
// noinspection JSUnusedLocalSymbols
const ArchiveItem = require('./ArchiveItemPatched');
// noinspection JSUnusedLocalSymbols
const ArchiveFile = require('./ArchiveFilePatched');
// noinspection JSUnusedLocalSymbols
const ArchiveMember = require('./ArchiveMember');
// noinspection JSUnusedLocalSymbols
const ArchiveMemberSearch = require('./ArchiveMemberSearch');
//Not used currently const config = require('./config');

const CrawlManager = require('./CrawlManager');

const crawlPreseed = [ //skipFetchFile, skipcache, mediatype: collection
    // Get the tiles for the top 60 items on the top 100 collections of each supported media type
    { identifier: ["image","movies","texts","audio"], level: "details",
        crawl: { rows: 100, level: "details", sort: "-downloads",
            crawl: { rows: 100, level: "tile", sort: "-downloads" } } },
    // Get the tiles for the top 100 items on the top 300 collections
    { query: "mediatype:collection AND NOT _exists_:access-restricted",
        crawl: { rows: 300, level: "details", sort: "-downloads",
            crawl: { rows: 100, level: "tile", sort: "-downloads" }}}
];


DwebTransports.connect({
    //transports: ["HTTP", "WEBTORRENT", "IPFS"],
    transports: ["HTTP"],
    //webtorrent: {tracker: { wrtc }},
}, (err, unused) => {
    //TODO-MIRROR this is working around default that HTTP doesnt officially support streams, till sure can use same interface with http & WT
    DwebTransports.http().supportFunctions.push("createReadStream");
    //CrawlManager.startCrawl(testCrawl, {skipFetchFile: true});
    CrawlManager.startCrawl(crawlPreseed, {skipFetchFile: true, skipCache: true});
});

